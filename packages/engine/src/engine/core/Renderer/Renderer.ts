import { mat4, type Mat4, vec3, vec4, type Vec3 } from 'wgpu-matrix'
import {
    EntityTypes,
    type GLTFAccessor,
    type IMesh,
    type IRenderer,
    type IRendererProps,
    type IScene,
    RENDER_OUTPUT_SOURCES,
    type SceneNodeContent,
    type TSkyboxBitmaps,
} from '../../types'
import {
    CLUSTER_DEPTH_SLICES,
    CLUSTER_MAX_LIGHTS,
    CLUSTER_TILE_SIZE,
    CULL_LIGHTS_BUFFER_SIZE,
    CULL_LIGHTS_HEADER_SIZE,
    CULL_LIGHT_STRIDE,
    DEFAULT_DEPTH_FORMAT,
    DEFAULT_SHADOW_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    DIRECTIONAL_LIGHT_BYTESTRIDE,
    DIRECTIONAL_LIGHT_ELEMENT_COUNT,
    LIGHT_RANGE_THRESHOLD,
    MAX_CULL_LIGHTS,
    MAX_SHADOW_CASTERS,
    POINT_LIGHT_BYTESTRIDE,
    POINT_LIGHT_ELEMENT_COUNT,
    SHADOW_ATLAS_SIZE,
    SHADOW_CASTER_STRIDE,
    SHADOW_DATA_BUFFER_SIZE,
    SHADOW_DATA_HEADER_SIZE,
    SHADOW_DISTANCE,
    SHADOW_FRUSTUM_Z_EXTEND,
    SHADOW_INDEX_SLOT_SIZE,
    SHADOW_LOCAL_FAR,
    SHADOW_TEXEL_BUDGET,
    SHADOW_TILE_DIRECTIONAL,
    SHADOW_TILE_POINT_FACE,
    SHADOW_TILE_SPOT,
    SPOT_LIGHT_BYTESTRIDE,
    SPOT_LIGHT_ELEMENT_COUNT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'
import { type IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import shaderCode from '../../shaders/testShader.wgsl'
import lightingShaderCode from '../../shaders/lighting.wgsl'
import lightCullingShaderCode from '../../shaders/lightCulling.wgsl'
import shadowShaderCode from '../../shaders/vertexShadow.wgsl'
import skyboxShaderCode from '../../shaders/skybox.wgsl'
import {
    cubePositionOffset,
    cubeUVOffset,
    cubeVertexArray,
    cubeVertexCount,
    cubeVertexSize,
} from '../../primitives/cube'
import { GBuffer } from './GBuffer'
import { type ILightSourceV2 } from '../lights/LightSourceV2'
import { type IPointLight } from '../lights/PointLight'
import { type ISpotLight } from '../lights/SpotLight'
import { Profiler } from '../Profiler'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

const skyBoxUniformBufferSize = 4 * 16 + 4 * 16 + 4 * 16 + 4 * 4

// point-light cube shadow faces — order must match pointShadowFactor in
// lighting.wgsl: +X -X +Y -Y +Z -Z
const POINT_FACE_DIRECTIONS = [
    vec3.fromValues(1, 0, 0),
    vec3.fromValues(-1, 0, 0),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, -1, 0),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(0, 0, -1),
]
// ups that are never parallel to the face direction
const POINT_FACE_UPS = [
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, 0, -1),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, 1, 0),
]

// float slot of the `shadow_caster: i32` field inside each light type's GPU
// layout (occupies the pad slot — see the WGSL structs in lighting.wgsl)
const DIRECTIONAL_CASTER_SLOT = 7
const POINT_CASTER_SLOT = 10
const SPOT_CASTER_SLOT = 3
// float slot of the `range: f32` field inside the point/spot GPU layouts (the
// remaining pad slot) — the culling-derived radius the shader's fade window
// uses to smooth the contribution to zero before the cluster cutoff
const POINT_RANGE_SLOT = 11
const SPOT_RANGE_SLOT = 7

export class Renderer implements IRenderer {
    private _adapter!: GPUAdapter
    private _device!: GPUDevice
    private _context!: GPUCanvasContext
    private _canvas: HTMLCanvasElement
    private _gBuffer!: GBuffer

    private _shadowDepthTexture!: GPUTexture
    private _shadowDepthTextureView!: GPUTextureView
    private _shadowDepthTextureSize = SHADOW_ATLAS_SIZE
    private _shadowDepthSampler!: GPUSampler
    private _shadowShaderModule!: GPUShaderModule

    // persistent shadow-data storage buffer (header + MAX_SHADOW_CASTERS entries,
    // see constants.ts) — contents rewritten per frame via queue.writeBuffer so
    // the bind groups referencing it stay static
    private _shadowDataBuffer!: GPUBuffer
    private _shadowDataUpload = new ArrayBuffer(SHADOW_DATA_BUFFER_SIZE)
    // dynamic-offset uniform buffer: slot i holds the u32 value i; the shadow
    // pass binds slot = caster entry index so vertexShadow.wgsl knows which
    // tile's light VP to use
    private _shadowIndexBuffer!: GPUBuffer
    // group 0 of the shadow pipelines (dynamic-offset caster index + data storage)
    private _shadowDataBGLayout!: GPUBindGroupLayout
    private _shadowDataBindGroup!: GPUBindGroup
    // group 3 of the lighting pipeline (atlas + comparison sampler + data +
    // cluster counts/indices — merged because maxBindGroups defaults to 4)
    private _shadowBindGroupLayout!: GPUBindGroupLayout
    private _shadowBindGroup!: GPUBindGroup
    // per-frame atlas tiles to render: pixel rect + caster entry index
    private _frameTiles: {
        x: number
        y: number
        size: number
        casterIndex: number
    }[] = []
    // hysteresis: lights that held a tile last frame get budget priority
    private _prevShadowedLights = new Set<ILightSourceV2>()
    // shadow pipelines keyed by position vertex format (`elementType:byteStride`)
    private _shadowPipelineCache = new Map<string, GPURenderPipeline>()

    // clustered (froxel) light culling — Phase 3
    private _cullingShaderModule!: GPUShaderModule
    private _cullResetPipeline!: GPUComputePipeline
    private _cullPipeline!: GPUComputePipeline
    private _computePassDescriptor!: GPUComputePassDescriptor
    private _clusterCountsBuffer!: GPUBuffer
    private _clusterIndicesBuffer!: GPUBuffer
    private _clusterCount = 0
    private _clusterTilesX = 0
    private _clusterTilesY = 0
    private _cullLightsBuffer!: GPUBuffer
    private _cullLightsUpload = new ArrayBuffer(CULL_LIGHTS_BUFFER_SIZE)
    private _cullLightsBGLayout!: GPUBindGroupLayout
    private _cullLightsBindGroup!: GPUBindGroup
    private _clusterComputeBGLayout!: GPUBindGroupLayout
    private _clusterComputeBindGroup!: GPUBindGroup

    private _skyBoxVerticesBuffer!: GPUBuffer
    private _skyBoxPipeline!: GPURenderPipeline
    private _skyBoxUniformBuffer!: GPUBuffer
    private _skyBoxUniformBufferSize = 16 * 4 * 3 + 4 * 4
    private _skyBoxRenderPassDescriptor!: GPURenderPassDescriptor
    private _skyBoxUniformBindGroup!: GPUBindGroup
    private _skyBoxModelMatrix: Mat4 = mat4.scaling(
        vec3.fromValues(100, 100, 100)
    )
    private _skyboxTexture!: GPUTexture
    private _skyboxSampler!: GPUSampler

    private _lightsBindGroupLayout!: GPUBindGroupLayout
    private _gBufferBindGroupLayout!: GPUBindGroupLayout
    private _gBufferBindGroup!: GPUBindGroup

    private _uniformsBGLayout!: GPUBindGroupLayout
    private _nodeParamsBGLayout!: GPUBindGroupLayout

    private _viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE

    private _geometryPassDescriptor!: GPURenderPassDescriptor
    private _lightingPassDescriptor!: GPURenderPassDescriptor
    private _shadowPassDescriptor!: GPURenderPassDescriptor

    private _viewParamsBuffer!: GPUBuffer
    private _viewParamsBindGroup!: GPUBindGroup

    private _debugParamsBuffer!: GPUBuffer

    private _shaderModule!: GPUShaderModule
    private _lightingShaderModule!: GPUShaderModule

    private _gpuTimingSupported = false
    private _timestampQuerySet?: GPUQuerySet
    private _timestampResolveBuffer?: GPUBuffer
    private _timestampReadbackBuffer?: GPUBuffer
    private _timestampReadbackPending = false

    public ambientLightColor = vec3.create(0.01, 0.01, 0.01)
    public ambientLightIntensity: number = 1

    public outputSource = RENDER_OUTPUT_SOURCES.DEFAULT

    private geometryPipeline!: GPURenderPipeline
    private lightingPipeline!: GPURenderPipeline
    private materialBindGroupLayout!: GPUBindGroupLayout

    constructor({ canvas }: IRendererProps) {
        this._canvas = canvas
    }

    public async init() {
        await this._initializeContext(this._canvas)

        this._context.configure({
            device: this._device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format: DEFAULT_SWAP_CHAIN_FORMAT,
        })

        this._gBuffer = new GBuffer(
            this._device,
            this._context,
            this.swapChainFormat,
            this.depthTextureFormat
        )

        this._shadowDepthTexture = this._device.createTexture({
            label: 'shadowDepthTexture',
            size: [
                this._shadowDepthTextureSize,
                this._shadowDepthTextureSize,
                1,
            ],
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.TEXTURE_BINDING,
            format: DEFAULT_SHADOW_DEPTH_FORMAT,
        })

        this._shadowDepthSampler = this.device.createSampler({
            compare: 'less',
            label: 'shadow depth sampler',
        })

        this._shadowDepthTextureView = this._shadowDepthTexture.createView()

        this._shadowShaderModule = this.device.createShaderModule({
            label: 'shadow shader module',
            code: shadowShaderCode,
        })

        this._shadowDataBuffer = this.device.createBuffer({
            label: 'shadow data buffer',
            size: SHADOW_DATA_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        // slot i of the index buffer holds the u32 value i; bound with a dynamic
        // offset (i × 256) per atlas tile draw
        this._shadowIndexBuffer = this.device.createBuffer({
            label: 'shadow caster index buffer',
            size: MAX_SHADOW_CASTERS * SHADOW_INDEX_SLOT_SIZE,
            usage: GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })
        {
            const slots = new Uint32Array(
                this._shadowIndexBuffer.getMappedRange()
            )
            for (let i = 0; i < MAX_SHADOW_CASTERS; i++) {
                slots[(i * SHADOW_INDEX_SLOT_SIZE) / 4] = i
            }
            this._shadowIndexBuffer.unmap()
        }

        this._shadowDataBGLayout = this.device.createBindGroupLayout({
            label: 'shadow data bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                        hasDynamicOffset: true,
                        minBindingSize: 4,
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        this._shadowDataBindGroup = this.device.createBindGroup({
            label: 'shadow data bind group',
            layout: this._shadowDataBGLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this._shadowIndexBuffer,
                        offset: 0,
                        size: 4,
                    },
                },
                { binding: 1, resource: { buffer: this._shadowDataBuffer } },
            ],
        })

        this._shaderModule = this.device.createShaderModule({
            label: 'geometry shader',
            code: shaderCode,
        })

        this._lightingShaderModule = this.device.createShaderModule({
            label: 'lighting shader',
            code: lightingShaderCode,
        })

        this._initializeBindGroupLayouts()

        this._initializeClusteredCulling()

        // created after the cluster buffers exist: the lighting-side shadow
        // group also carries the culling results — the default maxBindGroups
        // is 4, so the lighting pipeline cannot have a separate 5th group
        this._shadowBindGroupLayout = this.device.createBindGroupLayout({
            label: 'shadow bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'depth' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'comparison' },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'read-only-storage' },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'read-only-storage' },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        this._shadowBindGroup = this.device.createBindGroup({
            label: 'shadow bind group',
            layout: this._shadowBindGroupLayout,
            entries: [
                { binding: 0, resource: this._shadowDepthTextureView },
                { binding: 1, resource: this._shadowDepthSampler },
                { binding: 2, resource: { buffer: this._shadowDataBuffer } },
                { binding: 3, resource: { buffer: this._clusterCountsBuffer } },
                {
                    binding: 4,
                    resource: { buffer: this._clusterIndicesBuffer },
                },
            ],
        })

        this._initializeViewParams()

        // attachment order must match GBufferOutput @location order in testShader.wgsl.
        // 4 targets: WebGPU's default maxColorAttachmentBytesPerSample is 32 and counts
        // each attachment 8-byte-aligned — occlusion is packed into metallicRoughness .r
        this._geometryPassDescriptor = {
            label: 'geometry pass descriptor',
            colorAttachments: [
                {
                    view: this._gBuffer.albedo,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
                {
                    view: this._gBuffer.normal,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
                {
                    view: this._gBuffer.metallicRoughness,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
                {
                    view: this._gBuffer.emission,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
            depthStencilAttachment: {
                view: this._gBuffer.depth,
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
            },
        }

        this._lightingPassDescriptor = {
            label: 'lighting pass descriptor',
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView, // swap chain, assigned per frame
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 1.0],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
        }

        this._shadowPassDescriptor = {
            colorAttachments: [],
            depthStencilAttachment: {
                view: this._shadowDepthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        }

        this._skyBoxVerticesBuffer = this._device.createBuffer({
            size: cubeVertexArray.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        })
        new Float32Array(this._skyBoxVerticesBuffer.getMappedRange()).set(
            cubeVertexArray
        )
        this._skyBoxVerticesBuffer.unmap()

        this._skyBoxPipeline = this._device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this._device.createShaderModule({
                    code: skyboxShaderCode,
                }),
                buffers: [
                    {
                        arrayStride: cubeVertexSize,
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: cubePositionOffset,
                                format: 'float32x4',
                            },
                            {
                                shaderLocation: 1,
                                offset: cubeUVOffset,
                                format: 'float32x2',
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: this._device.createShaderModule({
                    code: skyboxShaderCode,
                }),
                targets: [
                    {
                        format: this.swapChainFormat,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'front',
            },
            depthStencil: {
                // skybox renders last: its fragments are forced to depth 1.0 in
                // skybox.wgsl, so 'less-equal' against the G-buffer depth passes
                // only where the depth is still the 1.0 clear value (no geometry)
                depthWriteEnabled: false,
                depthCompare: 'less-equal',
                format: this.depthTextureFormat,
            },
        })

        this._skyboxSampler = this._device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        })

        this._skyBoxUniformBuffer = this._device.createBuffer({
            size: skyBoxUniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this._skyBoxRenderPassDescriptor = {
            label: 'skybox render pass',
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView, // swap chain, assigned per frame
                    loadOp: 'load', // lighting result is already on the target
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this._gBuffer.depth,
                depthLoadOp: 'load' as GPULoadOp,
                depthStoreOp: 'store' as GPUStoreOp,
            },
        }

        if (this._gpuTimingSupported) {
            const querySet = this._timestampQuerySet!
            this._geometryPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 0,
                endOfPassWriteIndex: 1,
            }
            this._shadowPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 2,
                endOfPassWriteIndex: 3,
            }
            this._computePassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 4,
                endOfPassWriteIndex: 5,
            }
            this._lightingPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 6,
                endOfPassWriteIndex: 7,
            }
            this._skyBoxRenderPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 8,
                endOfPassWriteIndex: 9,
            }
        }

        const sampleType = 'float'

        this.materialBindGroupLayout = this.device.createBindGroupLayout({
            label: 'materialBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform',
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 6,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                        viewDimension: 'cube',
                    },
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 9,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 10,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 11,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 13,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 14,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
            ],
        })

        this._lightsBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        minBindingSize: 0,
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        minBindingSize: 0,
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        minBindingSize: 0,
                    },
                },
            ],
        })

        this._gBufferBindGroupLayout = this.device.createBindGroupLayout({
            label: 'gBufferBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'depth' },
                },
            ],
        })

        // static — G-buffer views never change (no resize support)
        this._gBufferBindGroup = this.device.createBindGroup({
            label: 'gBuffer bindgroup',
            layout: this._gBufferBindGroupLayout,
            entries: [
                { binding: 0, resource: this._gBuffer.albedo },
                { binding: 1, resource: this._gBuffer.normal },
                { binding: 2, resource: this._gBuffer.metallicRoughness },
                { binding: 3, resource: this._gBuffer.emission },
                { binding: 4, resource: this._gBuffer.depth },
            ],
        })

        this.geometryPipeline = this.device.createRenderPipeline({
            label: 'geometry render pipeline',
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this._uniformsBGLayout,
                    this._nodeParamsBGLayout,
                    this.materialBindGroupLayout,
                ],
            }),
            vertex: {
                module: this._shaderModule,
                entryPoint: 'vertex_main',
                buffers: [
                    {
                        arrayStride: 12,
                        attributes: [
                            {
                                format: 'float32x3',
                                offset: 0,
                                shaderLocation: 0,
                            },
                        ],
                    },
                    {
                        arrayStride: 8,
                        attributes: [
                            {
                                format: 'float32x2',
                                offset: 0,
                                shaderLocation: 1,
                            },
                        ],
                    },
                    {
                        arrayStride: 12,
                        attributes: [
                            {
                                format: 'float32x3',
                                offset: 0,
                                shaderLocation: 2,
                            },
                        ],
                    },
                    {
                        arrayStride: 12,
                        attributes: [
                            {
                                format: 'float32x3',
                                offset: 0,
                                shaderLocation: 3,
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: this._shaderModule,
                entryPoint: 'fragment_main',
                // order must match the geometry pass descriptor attachments
                targets: [
                    { format: this.swapChainFormat }, // albedo
                    { format: 'rgba16float' }, // normal
                    { format: this.swapChainFormat }, // metallicRoughness (+ occlusion in .r)
                    { format: this.swapChainFormat }, // emission
                ],
            },
            primitive: {
                topology: 'triangle-list',
                stripIndexFormat: undefined,
                cullMode: 'back',
            },
            depthStencil: {
                format: this.depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        })

        this.lightingPipeline = this.device.createRenderPipeline({
            label: 'lighting render pipeline',
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this._uniformsBGLayout,
                    this._gBufferBindGroupLayout,
                    this._lightsBindGroupLayout,
                    this._shadowBindGroupLayout,
                ],
            }),
            vertex: {
                module: this._lightingShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: this._lightingShaderModule,
                entryPoint: 'fragment_main',
                targets: [{ format: this.swapChainFormat }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        })

        await this.setDefaultSkyBoxTexture()
    }

    public async setDefaultSkyBoxTexture() {
        const images = new Array(6).fill(
            new ImageData(new Uint8ClampedArray([75, 76, 76, 255]), 1, 1)
        )
        const promises = images.map(async (image) => {
            return createImageBitmap(image)
        })
        const imageBitmaps = (await Promise.all(promises)) as TSkyboxBitmaps

        this.setSkyBoxTexture(imageBitmaps)
    }

    public setSkyBoxTexture(bitmaps: TSkyboxBitmaps) {
        this._skyboxTexture = this._device.createTexture({
            dimension: '2d',
            size: [bitmaps[0].width, bitmaps[0].height, 6],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        })

        for (let i = 0; i < bitmaps.length; i++) {
            const imageBitmap = bitmaps[i]!
            this._device.queue.copyExternalImageToTexture(
                { source: imageBitmap },
                { texture: this._skyboxTexture, origin: [0, 0, i] },
                [imageBitmap.width, imageBitmap.height]
            )
        }

        this._skyBoxUniformBindGroup = this._device.createBindGroup({
            label: 'skybox uniform bindgroup',
            layout: this._skyBoxPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this._skyBoxUniformBuffer,
                        offset: 0,
                        size: skyBoxUniformBufferSize,
                    },
                },
                {
                    binding: 1,
                    resource: this._skyboxSampler,
                },
                {
                    binding: 2,
                    resource: this._skyboxTexture.createView({
                        dimension: 'cube',
                    }),
                },
            ],
        })
    }

    get device() {
        return this._device
    }

    get adapter() {
        return this._adapter
    }

    get context() {
        return this._context
    }

    get swapChainFormat() {
        return DEFAULT_SWAP_CHAIN_FORMAT
    }

    get depthTextureFormat() {
        return DEFAULT_DEPTH_FORMAT
    }

    get lightsBindGroupLayout() {
        return this._lightsBindGroupLayout
    }

    private _initializeViewParams() {
        this._viewParamsBuffer = this.device.createBuffer({
            size: this._viewParamsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this._debugParamsBuffer = this.device.createBuffer({
            size: 4 + 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this._viewParamsBindGroup = this.device.createBindGroup({
            layout: this._uniformsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this._viewParamsBuffer } },
                { binding: 1, resource: { buffer: this._debugParamsBuffer } },
            ],
        })
    }

    private _initializeBindGroupLayouts() {
        // COMPUTE visibility included: the light-culling pass reads the view params
        this._uniformsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility:
                        GPUShaderStage.VERTEX |
                        GPUShaderStage.FRAGMENT |
                        GPUShaderStage.COMPUTE,
                    buffer: { type: 'uniform' },
                },
                {
                    binding: 1,
                    visibility:
                        GPUShaderStage.VERTEX |
                        GPUShaderStage.FRAGMENT |
                        GPUShaderStage.COMPUTE,
                    buffer: { type: 'uniform' },
                },
            ],
        })

        this._nodeParamsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' },
                },
            ],
        })
    }

    private _initializeClusteredCulling() {
        // grid sized from the canvas (fixed at init — no resize support, same
        // as the G-buffer)
        this._clusterTilesX = Math.ceil(this._canvas.width / CLUSTER_TILE_SIZE)
        this._clusterTilesY = Math.ceil(this._canvas.height / CLUSTER_TILE_SIZE)
        this._clusterCount =
            this._clusterTilesX * this._clusterTilesY * CLUSTER_DEPTH_SLICES

        this._clusterCountsBuffer = this._device.createBuffer({
            label: 'cluster light counts',
            size: this._clusterCount * 4,
            usage: GPUBufferUsage.STORAGE,
        })

        this._clusterIndicesBuffer = this._device.createBuffer({
            label: 'cluster light indices',
            size: this._clusterCount * CLUSTER_MAX_LIGHTS * 4,
            usage: GPUBufferUsage.STORAGE,
        })

        this._cullLightsBuffer = this._device.createBuffer({
            label: 'cull lights buffer',
            size: CULL_LIGHTS_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        this._cullLightsBGLayout = this._device.createBindGroupLayout({
            label: 'cull lights bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        this._cullLightsBindGroup = this._device.createBindGroup({
            label: 'cull lights bind group',
            layout: this._cullLightsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this._cullLightsBuffer } },
            ],
        })

        this._clusterComputeBGLayout = this._device.createBindGroupLayout({
            label: 'cluster compute bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'storage' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'storage' },
                },
            ],
        })

        this._clusterComputeBindGroup = this._device.createBindGroup({
            label: 'cluster compute bind group',
            layout: this._clusterComputeBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this._clusterCountsBuffer } },
                {
                    binding: 1,
                    resource: { buffer: this._clusterIndicesBuffer },
                },
            ],
        })

        this._cullingShaderModule = this._device.createShaderModule({
            label: 'light culling shader',
            code: lightCullingShaderCode,
        })

        const cullingPipelineLayout = this._device.createPipelineLayout({
            label: 'light culling pipeline layout',
            bindGroupLayouts: [
                this._uniformsBGLayout,
                this._cullLightsBGLayout,
                this._clusterComputeBGLayout,
            ],
        })

        this._cullResetPipeline = this._device.createComputePipeline({
            label: 'cluster reset pipeline',
            layout: cullingPipelineLayout,
            compute: {
                module: this._cullingShaderModule,
                entryPoint: 'reset_main',
            },
        })

        this._cullPipeline = this._device.createComputePipeline({
            label: 'light culling pipeline',
            layout: cullingPipelineLayout,
            compute: {
                module: this._cullingShaderModule,
                entryPoint: 'cull_main',
            },
        })

        this._computePassDescriptor = {
            label: 'light culling compute pass',
        }
    }

    private async _initializeContext(canvas: HTMLCanvasElement) {
        const adapter = await navigator.gpu.requestAdapter()

        if (!adapter) {
            throw new Error('GPU Adapter Unavailable')
        }

        this._gpuTimingSupported =
            Profiler.enabled && adapter.features.has('timestamp-query')

        const device = await adapter.requestDevice({
            requiredFeatures: this._gpuTimingSupported
                ? ['timestamp-query']
                : [],
        })

        this._device = device
        this._adapter = adapter

        if (this._gpuTimingSupported) {
            this._initializeGpuTiming()
        }

        canvas.width = document.body.clientWidth * window.devicePixelRatio
        canvas.height = document.body.clientHeight * window.devicePixelRatio

        this._context = canvas.getContext('webgpu') as GPUCanvasContext

        if (!this._context) {
            throw new Error('Failed to acquire GpuCanvasContext')
        }
    }

    private _initializeGpuTiming() {
        // 5 passes (geometry, shadow, culling compute, lighting, skybox) x begin/end
        this._timestampQuerySet = this._device.createQuerySet({
            label: 'profiler timestamp query set',
            type: 'timestamp',
            count: 10,
        })

        this._timestampResolveBuffer = this._device.createBuffer({
            label: 'profiler timestamp resolve buffer',
            size: 10 * 8,
            usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
        })

        this._timestampReadbackBuffer = this._device.createBuffer({
            label: 'profiler timestamp readback buffer',
            size: 10 * 8,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        })
    }

    private _createMeshBuffer(accessor: GLTFAccessor, scene: IScene) {
        const view = new Uint8Array(
            scene.bufferStorage.buffers.get(accessor.bufferId) as ArrayBuffer,
            accessor.byteOffset,
            accessor.byteLength
        )

        const buffer = this.device.createBuffer({
            size: alignTo(accessor.byteLength, 4),
            usage: accessor.usage,
            mappedAtCreation: true,
        })

        new Uint8Array(buffer.getMappedRange()).set(view)
        buffer.unmap()

        return buffer
    }

    public buildRenderPipeline(mesh: IMesh, scene: IScene) {
        const meshDataEntry = {} as IMeshRenderData

        //FIXME: REFACTOR THIS SHIT
        meshDataEntry.materialParamsBuffer = this.device.createBuffer({
            size: 8 * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })

        const params = new Float32Array(
            meshDataEntry.materialParamsBuffer.getMappedRange()
        )
        params.set(mesh.material.baseColorFactor, 0)
        params.set(
            [mesh.material.metallicFactor, mesh.material.roughnessFactor],
            4
        )

        meshDataEntry.materialParamsBuffer.unmap()

        const primitive: GPUPrimitiveState = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
            cullMode: 'back',
        }

        meshDataEntry.materialBindGroup = this.device.createBindGroup({
            label: 'material and sampler bindgroup',
            layout: this.materialBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: meshDataEntry.materialParamsBuffer,
                        size: 8 * 4,
                    },
                },
                {
                    binding: 1,
                    resource: mesh.material.baseColorTexture.view,
                },
                {
                    binding: 2,
                    resource: mesh.material?.metallicRoughnessTexture.view,
                },
                {
                    binding: 3,
                    resource: mesh.material?.normalTexture.view,
                },
                {
                    binding: 4,
                    resource: mesh.material?.occlusionTexture.view,
                },
                {
                    binding: 6,
                    resource: this._skyboxTexture.createView({
                        dimension: 'cube',
                    }),
                },
                {
                    binding: 7,
                    resource: mesh.material?.emissiveTexture.view,
                },
                {
                    binding: 8,
                    resource: mesh.material.baseColorTexture.sampler,
                },
                {
                    binding: 9,
                    resource: mesh.material.metallicRoughnessTexture.sampler,
                },
                {
                    binding: 10,
                    resource: mesh.material.normalTexture.sampler,
                },
                {
                    binding: 11,
                    resource: mesh.material.occlusionTexture.sampler,
                },
                {
                    binding: 13,
                    resource: this._skyboxSampler,
                },
                {
                    binding: 14,
                    resource: mesh.material?.emissiveTexture.sampler,
                },
            ],
        })

        // shadow pipelines are cached per position vertex format — meshes almost
        // always share `float32x3` positions, so this is ~1 pipeline per scene
        const shadowPipelineKey = `${mesh.positions.elementType}:${mesh.positions.byteStride}`
        let shadowPipeline = this._shadowPipelineCache.get(shadowPipelineKey)
        if (!shadowPipeline) {
            shadowPipeline = this.device.createRenderPipeline({
                label: 'shadow render pipeline',
                layout: this.device.createPipelineLayout({
                    label: 'shadow render pipeline layout',
                    bindGroupLayouts: [
                        this._shadowDataBGLayout,
                        this._nodeParamsBGLayout,
                    ],
                }),
                vertex: {
                    module: this._shadowShaderModule,
                    buffers: [
                        {
                            arrayStride: mesh.positions.byteStride,
                            attributes: [
                                {
                                    format: mesh.positions.elementType,
                                    offset: 0,
                                    shaderLocation: 0,
                                },
                            ],
                        },
                    ],
                },
                depthStencil: {
                    depthWriteEnabled: true,
                    depthCompare: 'less',
                    format: 'depth32float',
                },
                primitive,
            })
            this._shadowPipelineCache.set(shadowPipelineKey, shadowPipeline)
        }
        meshDataEntry.shadowRenderPipeline = shadowPipeline

        meshDataEntry.positionsBuffer = this._createMeshBuffer(
            mesh.positions,
            scene
        )

        meshDataEntry.textureCoordinatesBuffer = this._createMeshBuffer(
            mesh.textureCoordinates,
            scene
        )

        meshDataEntry.normalsBuffer = this._createMeshBuffer(
            mesh.normals,
            scene
        )

        meshDataEntry.tangentsBuffer = this._createMeshBuffer(
            mesh.tangents,
            scene
        )

        meshDataEntry.indicesBuffer = this._createMeshBuffer(
            mesh.indices,
            scene
        )

        scene.meshRenderDataStorage.data.set(mesh.id, meshDataEntry)
        mesh.isPipelineBuilt = true
    }

    private renderMesh(
        mesh: IMesh,
        scene: IScene,
        renderPassEncoder: GPURenderPassEncoder
    ) {
        const {
            materialBindGroup,
            positionsBuffer,
            textureCoordinatesBuffer,
            tangentsBuffer,
            normalsBuffer,
            indicesBuffer,
            nodeParamsBindGroup,
        } = scene.meshRenderDataStorage.data.get(mesh.id) as IMeshRenderData

        renderPassEncoder.setBindGroup(1, nodeParamsBindGroup as GPUBindGroup)

        renderPassEncoder.setBindGroup(2, materialBindGroup)

        renderPassEncoder.setVertexBuffer(
            0,
            positionsBuffer as GPUBuffer,
            0,
            mesh.positions.byteLength
        )

        renderPassEncoder.setVertexBuffer(
            1,
            textureCoordinatesBuffer as GPUBuffer,
            0,
            mesh.textureCoordinates.byteLength
        )

        renderPassEncoder.setVertexBuffer(
            2,
            normalsBuffer as GPUBuffer,
            0,
            mesh.normals.byteLength
        )

        renderPassEncoder.setVertexBuffer(
            3,
            tangentsBuffer as GPUBuffer,
            0,
            mesh.tangents.byteLength
        )

        renderPassEncoder.setIndexBuffer(
            indicesBuffer as GPUBuffer,
            mesh.indices.elementType as GPUIndexFormat,
            0,
            mesh.indices.byteLength
        )
        renderPassEncoder.drawIndexed(mesh.indices.count)
    }

    private _createLightsBuffer = (
        byteStride: number,
        elementCount: number,
        lights: ILightSourceV2[],
        casterSlot: number,
        casterBases: Map<ILightSourceV2, number>,
        rangePatch?: { slot: number; ranges: Map<ILightSourceV2, number> }
    ) => {
        const lightsBuffer = this.device.createBuffer({
            size: byteStride * lights.length || byteStride,
            usage: GPUBufferUsage.STORAGE,
            mappedAtCreation: !!lights.length,
        })

        if (lights.length) {
            // single mapped range backs both views (WebGPU rejects overlaps)
            const mapped = lightsBuffer.getMappedRange()
            const lightData = new Float32Array(mapped)
            const casterData = new Int32Array(mapped)

            lights.forEach((light, index) => {
                const offset = elementCount * index

                lightData.set(light.getLightData(), offset)
                // patch the shadow caster base index into the layout's pad slot
                // (-1 = this light casts no shadow this frame)
                casterData[offset + casterSlot] = casterBases.get(light) ?? -1
                // patch the derived influence radius into the remaining pad
                // slot — the shader fades the light to zero at this distance
                if (rangePatch) {
                    lightData[offset + rangePatch.slot] =
                        rangePatch.ranges.get(light) ?? 0
                }
            })

            lightsBuffer.unmap()
        }

        return lightsBuffer
    }

    /**
     * Bounding sphere of the camera frustum, clamped to `maxDistance` — the
     * shared fit target for directional shadow frusta and the relevance volume
     * for point-light face culling.
     */
    private _cameraShadowSphere(
        cameraPosition: Vec3,
        inverseViewProjection: Mat4,
        maxDistance: number
    ): { center: Vec3; radius: number } {
        const corners: Vec3[] = []
        for (const x of [-1, 1]) {
            for (const y of [-1, 1]) {
                for (const z of [0, 1]) {
                    const corner = vec3.transformMat4(
                        vec3.fromValues(x, y, z),
                        inverseViewProjection
                    )
                    // clamp to maxDistance around the camera — the raw far-plane
                    // corners sit at zFar (1000) and would blow the fit up to
                    // world-scale texels
                    const toCorner = vec3.sub(corner, cameraPosition)
                    const distance = vec3.length(toCorner)
                    if (distance > maxDistance) {
                        vec3.addScaled(
                            cameraPosition,
                            toCorner,
                            maxDistance / distance,
                            corner
                        )
                    }
                    corners.push(corner)
                }
            }
        }
        const center = vec3.create()
        for (const corner of corners) {
            vec3.add(center, corner, center)
        }
        vec3.scale(center, 1 / corners.length, center)

        let radius = 0
        for (const corner of corners) {
            radius = Math.max(radius, vec3.distance(corner, center))
        }
        return { center, radius }
    }

    /**
     * Distance at which a light's contribution drops below
     * LIGHT_RANGE_THRESHOLD — attenuation is `c + l·d + e·d²`.
     */
    private _deriveLightRange(
        intensity: number,
        attenuationConstant: number,
        attenuationLinear: number,
        attenuationExponential: number
    ): number {
        const reach = intensity / LIGHT_RANGE_THRESHOLD
        if (reach <= attenuationConstant) {
            return 0
        }
        if (attenuationExponential > 1e-8) {
            const discriminant =
                attenuationLinear * attenuationLinear +
                4 * attenuationExponential * (reach - attenuationConstant)
            return (
                (-attenuationLinear + Math.sqrt(Math.max(0, discriminant))) /
                (2 * attenuationExponential)
            )
        }
        if (attenuationLinear > 1e-8) {
            return (reach - attenuationConstant) / attenuationLinear
        }
        return SHADOW_LOCAL_FAR
    }

    private _directionalShadowVP(
        lightDirection: Vec3,
        sphere: { center: Vec3; radius: number },
        tileSize: number
    ): Mat4 {
        // direction = the way the light travels (shaders use -direction as "to light")
        const direction = vec3.normalize(lightDirection)
        const up =
            Math.abs(direction[1]!) > 0.99
                ? vec3.fromValues(0, 0, 1)
                : vec3.fromValues(0, 1, 0)
        const eyeDistance = sphere.radius + SHADOW_FRUSTUM_Z_EXTEND
        const eye = vec3.addScaled(sphere.center, direction, -eyeDistance)
        const lightView = mat4.lookAt(eye, sphere.center, up)

        // snap the extent to tile-texel increments (prevents crawl on camera motion)
        const texel = (2 * sphere.radius) / tileSize
        const extent = Math.max(texel, Math.ceil(sphere.radius / texel) * texel)

        const lightProjection = mat4.ortho(
            -extent,
            extent,
            -extent,
            extent,
            // start just in front of the light eye: catches casters between the
            // light and the camera sphere
            0.05,
            eyeDistance + extent
        )
        return mat4.mul(lightProjection, lightView)
    }

    private _spotShadowVP(light: ISpotLight): Mat4 {
        const direction = vec3.normalize(light.direction)
        const up =
            Math.abs(direction[1]!) > 0.99
                ? vec3.fromValues(0, 0, 1)
                : vec3.fromValues(0, 1, 0)
        const target = vec3.addScaled(light.position, direction, 1)
        const lightView = mat4.lookAt(light.position, target, up)

        // cutoff is stored pre-cosined (see SpotLight.cutoff setter)
        const halfAngle = Math.acos(Math.min(1, Math.max(-1, light.cutoff)))
        // keep away from π — the projection degenerates
        const fov = Math.min(2 * halfAngle, 2.9)
        const range = this._deriveLightRange(
            light.intensity,
            light.attenuationConstant,
            light.attenuationLinear,
            light.attenuationExponential
        )
        const far = Math.min(Math.max(range, 1), SHADOW_LOCAL_FAR)
        const lightProjection = mat4.perspective(fov, 1, 0.1, far)
        return mat4.mul(lightProjection, lightView)
    }

    private _pointFaceShadowVP(
        lightPosition: Vec3,
        face: number,
        far: number
    ): Mat4 {
        const faceDirection = POINT_FACE_DIRECTIONS[face]!
        const target = vec3.add(lightPosition, faceDirection)
        const lightView = mat4.lookAt(
            lightPosition,
            target,
            POINT_FACE_UPS[face]!
        )
        const lightProjection = mat4.perspective(Math.PI / 2, 1, 0.1, far)
        return mat4.mul(lightProjection, lightView)
    }

    /**
     * Conservative cone/sphere test: does this cube face's 90° frustum see any
     * part of the camera bounding sphere?
     */
    private _pointFaceVisible(
        face: number,
        lightPosition: Vec3,
        sphere: { center: Vec3; radius: number }
    ): boolean {
        const toCenter = vec3.sub(sphere.center, lightPosition)
        const distance = vec3.length(toCenter)
        if (distance <= sphere.radius) {
            // light inside the camera sphere — every face is relevant
            return true
        }
        const cosAngle = vec3.dot(
            vec3.scale(toCenter, 1 / distance),
            POINT_FACE_DIRECTIONS[face]!
        )
        const radiusOverDistance = Math.min(1, sphere.radius / distance)
        // cos(45° + asin(r/d)) — the face cone widened by the sphere's angular radius
        const threshold =
            Math.SQRT1_2 *
                Math.sqrt(
                    Math.max(0, 1 - radiusOverDistance * radiusOverDistance)
                ) -
            Math.SQRT1_2 * radiusOverDistance
        return cosAngle >= threshold
    }

    /**
     * Phase 2 shadow atlas allocator. Ranks all lights (directional first, then
     * by camera distance, previously-shadowed lights keep priority as
     * hysteresis), assigns atlas tiles within the texel budget, builds each
     * light's VP matrices, fills the shadow-data buffer and returns the
     * light → caster-entry-base map used to patch the light storage buffers.
     * A point light occupies 6 consecutive entries (face order +X -X +Y -Y +Z -Z);
     * culled faces stay `enabled = 0` (the shader treats them as lit).
     */
    private _allocateShadowCasters(
        scene: IScene,
        cameraPosition: Vec3,
        inverseViewProjection: Mat4
    ): Map<ILightSourceV2, number> {
        const casterBases = new Map<ILightSourceV2, number>()
        const floats = new Float32Array(this._shadowDataUpload)
        const ints = new Uint32Array(this._shadowDataUpload)
        floats.fill(0)
        this._frameTiles = []

        const sphere = this._cameraShadowSphere(
            cameraPosition,
            inverseViewProjection,
            SHADOW_DISTANCE
        )

        interface Candidate {
            light: ILightSourceV2
            distance: number
            tileSize: number
            // one VP per caster entry; null = face culled (point lights only)
            vps: (Mat4 | null)[]
        }
        const candidates: Candidate[] = []

        for (const light of scene.directionalLights) {
            if (vec3.length(light.direction) <= 1e-6) {
                continue
            }
            candidates.push({
                light,
                distance: 0,
                tileSize: SHADOW_TILE_DIRECTIONAL,
                vps: [
                    this._directionalShadowVP(
                        light.direction,
                        sphere,
                        SHADOW_TILE_DIRECTIONAL
                    ),
                ],
            })
        }
        for (const light of scene.spotLights) {
            candidates.push({
                light,
                distance: vec3.distance(light.position, cameraPosition),
                tileSize: SHADOW_TILE_SPOT,
                vps: [this._spotShadowVP(light)],
            })
        }
        for (const light of scene.pointLights) {
            const range = this._deriveLightRange(
                light.intensity,
                light.attenuationConstant,
                light.attenuationLinear,
                light.attenuationExponential
            )
            const far = Math.min(Math.max(range, 1), SHADOW_LOCAL_FAR)
            candidates.push({
                light,
                distance: vec3.distance(light.position, cameraPosition),
                tileSize: SHADOW_TILE_POINT_FACE,
                vps: POINT_FACE_DIRECTIONS.map((_, face) =>
                    this._pointFaceVisible(face, light.position, sphere)
                        ? this._pointFaceShadowVP(light.position, face, far)
                        : null
                ),
            })
        }

        // hysteresis: lights that held tiles last frame first, then relevance
        candidates.sort((a, b) => {
            const prevA = this._prevShadowedLights.has(a.light) ? 0 : 1
            const prevB = this._prevShadowedLights.has(b.light) ? 0 : 1
            if (prevA !== prevB) {
                return prevA - prevB
            }
            return a.distance - b.distance
        })

        // shelf packer over the atlas
        let shelfX = 0
        let shelfY = 0
        let shelfHeight = 0
        const placeTile = (size: number): { x: number; y: number } | null => {
            if (shelfX + size > this._shadowDepthTextureSize) {
                shelfX = 0
                shelfY += shelfHeight
                shelfHeight = 0
            }
            if (shelfY + size > this._shadowDepthTextureSize) {
                return null
            }
            const position = { x: shelfX, y: shelfY }
            shelfX += size
            shelfHeight = Math.max(shelfHeight, size)
            return position
        }

        let casterCount = 0
        let texelsLeft = SHADOW_TEXEL_BUDGET
        const assigned = new Set<ILightSourceV2>()

        for (const candidate of candidates) {
            const entryCount = candidate.vps.length
            if (casterCount + entryCount > MAX_SHADOW_CASTERS) {
                continue
            }
            const wantedTiles = candidate.vps.filter((vp) => vp !== null).length
            const texels = wantedTiles * candidate.tileSize * candidate.tileSize
            if (texels > texelsLeft) {
                continue
            }

            // place all tiles first; a light whose tiles don't all fit stays unshadowed
            const rects: ({ x: number; y: number } | null)[] = []
            let fits = true
            for (const vp of candidate.vps) {
                if (vp === null) {
                    rects.push(null)
                    continue
                }
                const rect = placeTile(candidate.tileSize)
                if (rect === null) {
                    fits = false
                    break
                }
                rects.push(rect)
            }
            if (!fits) {
                continue
            }

            const base = casterCount
            const atlasSize = this._shadowDepthTextureSize
            for (let i = 0; i < entryCount; i++) {
                const vp = candidate.vps[i]!
                const rect = rects[i]!
                if (vp === null || rect === null) {
                    continue // culled face — entry stays disabled
                }
                const entry =
                    (SHADOW_DATA_HEADER_SIZE +
                        (base + i) * SHADOW_CASTER_STRIDE) /
                    4 // float offset
                floats.set(vp, entry)
                floats.set(
                    [
                        rect.x / atlasSize,
                        rect.y / atlasSize,
                        candidate.tileSize / atlasSize,
                        candidate.tileSize / atlasSize,
                    ],
                    entry + 16
                )
                ints[entry + 20] = 1 // enabled
                this._frameTiles.push({
                    x: rect.x,
                    y: rect.y,
                    size: candidate.tileSize,
                    casterIndex: base + i,
                })
            }
            casterCount += entryCount
            texelsLeft -= texels
            casterBases.set(candidate.light, base)
            assigned.add(candidate.light)
        }

        ints[0] = casterCount
        this._prevShadowedLights = assigned
        this.device.queue.writeBuffer(
            this._shadowDataBuffer,
            0,
            this._shadowDataUpload
        )
        return casterBases
    }

    /**
     * Fills the compact culling buffer for the clustered light-culling compute
     * pass: all point (type 0) and spot (type 1) lights with derived ranges.
     */
    private _updateCullLights(scene: IScene) {
        const floats = new Float32Array(this._cullLightsUpload)
        const ints = new Uint32Array(this._cullLightsUpload)
        floats.fill(0)

        let count = 0
        const addLight = (
            position: Vec3,
            range: number,
            direction: Vec3 | null,
            cosCutoff: number,
            type: number,
            index: number
        ) => {
            if (count >= MAX_CULL_LIGHTS) {
                return
            }
            const entry =
                (CULL_LIGHTS_HEADER_SIZE + count * CULL_LIGHT_STRIDE) / 4
            floats.set(position, entry)
            floats[entry + 3] = range
            if (direction) {
                floats.set(direction, entry + 4)
            }
            floats[entry + 7] = cosCutoff
            ints[entry + 8] = (type << 16) | index
            count++
        }

        scene.pointLights.forEach((light, index) => {
            addLight(
                light.position,
                this._deriveLightRange(
                    light.intensity,
                    light.attenuationConstant,
                    light.attenuationLinear,
                    light.attenuationExponential
                ),
                null,
                -2, // point marker — no cone test in the shader
                0,
                index
            )
        })
        scene.spotLights.forEach((light, index) => {
            addLight(
                light.position,
                this._deriveLightRange(
                    light.intensity,
                    light.attenuationConstant,
                    light.attenuationLinear,
                    light.attenuationExponential
                ),
                vec3.normalize(light.direction),
                light.cutoff,
                1,
                index
            )
        })

        ints[0] = count
        this.device.queue.writeBuffer(
            this._cullLightsBuffer,
            0,
            this._cullLightsUpload
        )
    }

    private renderMeshShadows(
        mesh: IMesh,
        scene: IScene,
        renderPassEncoder: GPURenderPassEncoder
    ) {
        const {
            shadowRenderPipeline,
            positionsBuffer,
            indicesBuffer,
            nodeParamsBindGroup,
        } = scene.meshRenderDataStorage.data.get(mesh.id) as IMeshRenderData

        renderPassEncoder.setBindGroup(1, nodeParamsBindGroup as GPUBindGroup)

        renderPassEncoder.setPipeline(shadowRenderPipeline as GPURenderPipeline)

        renderPassEncoder.setVertexBuffer(
            0,
            positionsBuffer as GPUBuffer,
            0,
            mesh.positions.byteLength
        )

        renderPassEncoder.setIndexBuffer(
            indicesBuffer as GPUBuffer,
            mesh.indices.elementType as GPUIndexFormat,
            0,
            mesh.indices.byteLength
        )
        renderPassEncoder.drawIndexed(mesh.indices.count)
    }

    public render(deltaTime: number, scene: IScene) {
        const frameStart = performance.now()
        scene.onRender(deltaTime)
        const afterSceneUpdate = performance.now()
        Profiler.sample('sceneUpdate', afterSceneUpdate - frameStart)

        const meshesToRender: IMesh[] = []

        const debugInfoArray = new ArrayBuffer(4 + 4)
        const debugInfoView = new DataView(
            debugInfoArray,
            0,
            debugInfoArray.byteLength
        )

        debugInfoView.setUint32(0, this.outputSource, true)

        const viewParamsUploadBuffer = this.device.createBuffer({
            size: this._viewParamsBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        // a single mapped range backs both the float and int views — WebGPU
        // rejects overlapping getMappedRange calls on the same buffer
        const viewParamsMapped = viewParamsUploadBuffer.getMappedRange()
        const viewMap = new Float32Array(viewParamsMapped)

        viewMap.set(scene.camera.projectionMatrix)
        viewMap.set(scene.camera.view, 16)
        viewMap.set(scene.camera.position, 32)
        viewMap.set(
            vec4.create(...this.ambientLightColor, this.ambientLightIntensity),
            36
        )
        // inverse view-projection for world-position reconstruction in the
        // deferred lighting pass (float offset 40 — see ViewParams in lighting.wgsl)
        const inverseViewProjection = mat4.inverse(
            mat4.mul(scene.camera.projectionMatrix, scene.camera.view)
        )
        viewMap.set(inverseViewProjection, 40)
        // camera range + cluster grid for the light-culling compute pass
        // (floats 56/57 as f32, 58–61 as u32 — see ViewParams in lightCulling.wgsl)
        viewMap.set([scene.camera.zNear, scene.camera.zFar], 56)
        const viewInts = new Uint32Array(viewParamsMapped)
        viewInts[58] = this._clusterTilesX
        viewInts[59] = this._clusterTilesY
        viewInts[60] = this._canvas.width
        viewInts[61] = this._canvas.height

        viewParamsUploadBuffer.unmap()

        const skyBoxViewParamsUploadBuffer = this.device.createBuffer({
            size: this._skyBoxUniformBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const skyboxViewMap = new Float32Array(
            skyBoxViewParamsUploadBuffer.getMappedRange()
        )

        skyboxViewMap.set(this._skyBoxModelMatrix)
        skyboxViewMap.set(scene.camera.projectionMatrix, 16)
        skyboxViewMap.set(scene.camera.view, 32)
        skyboxViewMap.set(scene.camera.position, 48)

        skyBoxViewParamsUploadBuffer.unmap()

        const debugParamsArray = new ArrayBuffer(this._debugParamsBuffer.size)
        const debugParamsView = new DataView(
            debugParamsArray,
            0,
            debugParamsArray.byteLength
        )
        debugParamsView.setUint32(0, 0)
        debugParamsView.setUint32(4, 0)

        this.device.queue.writeBuffer(
            this._debugParamsBuffer,
            0,
            debugInfoArray
        )

        // shadow atlas allocation must run before the lights buffers: their
        // `shadow_caster` pad slots are patched with the caster base indices
        const casterBases = this._allocateShadowCasters(
            scene,
            scene.camera.position,
            inverseViewProjection
        )

        // derived influence radius per point/spot light (same derivation the
        // culling upload uses) — the shader fades each light to zero at this
        // distance so the cluster-list cutoff causes no visible hard edge
        const lightRanges = new Map<ILightSourceV2, number>()
        for (const light of [...scene.pointLights, ...scene.spotLights]) {
            lightRanges.set(
                light,
                this._deriveLightRange(
                    light.intensity,
                    light.attenuationConstant,
                    light.attenuationLinear,
                    light.attenuationExponential
                )
            )
        }

        const directionalLightsBuffer = this._createLightsBuffer(
            DIRECTIONAL_LIGHT_BYTESTRIDE,
            DIRECTIONAL_LIGHT_ELEMENT_COUNT,
            scene.directionalLights,
            DIRECTIONAL_CASTER_SLOT,
            casterBases
        )
        const pointLightsBuffer = this._createLightsBuffer(
            POINT_LIGHT_BYTESTRIDE,
            POINT_LIGHT_ELEMENT_COUNT,
            scene.pointLights,
            POINT_CASTER_SLOT,
            casterBases,
            { slot: POINT_RANGE_SLOT, ranges: lightRanges }
        )
        const spotLightsBuffer = this._createLightsBuffer(
            SPOT_LIGHT_BYTESTRIDE,
            SPOT_LIGHT_ELEMENT_COUNT,
            scene.spotLights,
            SPOT_CASTER_SLOT,
            casterBases,
            { slot: SPOT_RANGE_SLOT, ranges: lightRanges }
        )

        this._updateCullLights(scene)

        const lightsBindGroup = this.device.createBindGroup({
            layout: this.lightsBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: directionalLightsBuffer,
                    },
                },
                {
                    binding: 1,
                    resource: {
                        buffer: pointLightsBuffer,
                    },
                },
                {
                    binding: 2,
                    resource: {
                        buffer: spotLightsBuffer,
                    },
                },
            ],
        })

        const afterUploads = performance.now()
        Profiler.sample('uploads', afterUploads - afterSceneUpdate)

        const iterateNode = (node: SceneNodeContent, worldMatrix: Mat4) => {
            const nodeTransform = node.gameObject.transform

            const meshMatrix = nodeTransform
                ? mat4.mul(worldMatrix, nodeTransform.matrix)
                : worldMatrix

            const nodeParamsUploadBuffer = this.device.createBuffer({
                size: 16 * 4,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            })
            const nodeParamsMap = new Float32Array(
                nodeParamsUploadBuffer.getMappedRange()
            )
            nodeParamsMap.set(meshMatrix)
            nodeParamsUploadBuffer.unmap()

            const nodeParamsBindGroup = this.device.createBindGroup({
                layout: this._nodeParamsBGLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: nodeParamsUploadBuffer,
                        },
                    },
                ],
            })

            node?.gameObject?.components?.forEach((component: any) => {
                if (component.type === EntityTypes.mesh) {
                    //FIXME: transform calculations are not performed for the light transform as of now
                    meshesToRender.push(component)

                    if (!(component as IMesh).isPipelineBuilt) {
                        this.buildRenderPipeline(component, scene)
                    }

                    scene.meshRenderDataStorage.data.get(
                        component.id
                    )!.nodeParamsBindGroup = nodeParamsBindGroup
                }
            })

            node?.children?.forEach((child: any) => {
                iterateNode(child, meshMatrix)
            })
        }

        scene.objectManager.sceneTree.nodes.forEach((node) => {
            iterateNode(node, mat4.identity())
        })

        const afterTraverse = performance.now()
        Profiler.sample('traverse', afterTraverse - afterUploads)

        const commandEncoder = this.device.createCommandEncoder()

        commandEncoder.copyBufferToBuffer(
            viewParamsUploadBuffer,
            0,
            this._viewParamsBuffer,
            0,
            this._viewParamsBufferSize
        )

        commandEncoder.copyBufferToBuffer(
            skyBoxViewParamsUploadBuffer,
            0,
            this._skyBoxUniformBuffer,
            0,
            this._skyBoxUniformBufferSize
        )
        const currentTextureView = this.context.getCurrentTexture().createView()
        ;(this._lightingPassDescriptor as any).colorAttachments[0].view =
            currentTextureView
        ;(this._skyBoxRenderPassDescriptor as any).colorAttachments[0].view =
            currentTextureView

        const gpuTimingThisFrame =
            this._gpuTimingSupported && !this._timestampReadbackPending

        // pass order: geometry (G-buffer) → shadow (atlas tiles) → culling
        // (compute) → lighting → skybox

        const geometryPass = commandEncoder.beginRenderPass(
            this._geometryPassDescriptor
        )

        geometryPass.setBindGroup(0, this._viewParamsBindGroup)
        geometryPass.setPipeline(this.geometryPipeline)

        meshesToRender.forEach((mesh) => {
            this.renderMesh(mesh, scene, geometryPass)
        })

        geometryPass.end()

        // one pass over the whole atlas; each tile gets its viewport/scissor and
        // selects its caster entry via the dynamic bind-group offset
        const shadowPass = commandEncoder.beginRenderPass(
            this._shadowPassDescriptor
        )

        for (const tile of this._frameTiles) {
            shadowPass.setViewport(tile.x, tile.y, tile.size, tile.size, 0, 1)
            shadowPass.setScissorRect(tile.x, tile.y, tile.size, tile.size)
            shadowPass.setBindGroup(0, this._shadowDataBindGroup, [
                tile.casterIndex * SHADOW_INDEX_SLOT_SIZE,
            ])

            meshesToRender.forEach((mesh) => {
                this.renderMeshShadows(mesh, scene, shadowPass)
            })
        }

        shadowPass.end()

        const cullingPass = commandEncoder.beginComputePass(
            this._computePassDescriptor
        )

        cullingPass.setBindGroup(0, this._viewParamsBindGroup)
        cullingPass.setBindGroup(1, this._cullLightsBindGroup)
        cullingPass.setBindGroup(2, this._clusterComputeBindGroup)

        const cullingWorkgroups = Math.ceil(this._clusterCount / 64)
        cullingPass.setPipeline(this._cullResetPipeline)
        cullingPass.dispatchWorkgroups(cullingWorkgroups)
        // dispatches within a compute pass are ordered with memory barriers
        cullingPass.setPipeline(this._cullPipeline)
        cullingPass.dispatchWorkgroups(cullingWorkgroups)

        cullingPass.end()

        const lightingPass = commandEncoder.beginRenderPass(
            this._lightingPassDescriptor
        )

        lightingPass.setBindGroup(0, this._viewParamsBindGroup)
        lightingPass.setBindGroup(1, this._gBufferBindGroup)
        lightingPass.setBindGroup(2, lightsBindGroup)
        lightingPass.setBindGroup(3, this._shadowBindGroup)
        lightingPass.setPipeline(this.lightingPipeline)
        lightingPass.draw(3) // fullscreen triangle

        lightingPass.end()

        const skyBoxPass = commandEncoder.beginRenderPass(
            this._skyBoxRenderPassDescriptor
        )
        skyBoxPass.setPipeline(this._skyBoxPipeline)
        skyBoxPass.setVertexBuffer(0, this._skyBoxVerticesBuffer)
        skyBoxPass.setBindGroup(0, this._skyBoxUniformBindGroup)
        skyBoxPass.draw(cubeVertexCount)
        skyBoxPass.end()

        if (gpuTimingThisFrame) {
            commandEncoder.resolveQuerySet(
                this._timestampQuerySet!,
                0,
                10,
                this._timestampResolveBuffer!,
                0
            )
            commandEncoder.copyBufferToBuffer(
                this._timestampResolveBuffer!,
                0,
                this._timestampReadbackBuffer!,
                0,
                10 * 8
            )
            this._timestampReadbackPending = true
        }

        const afterEncode = performance.now()
        Profiler.sample('encode', afterEncode - afterTraverse)

        this.device.queue.submit([commandEncoder.finish()])
        Profiler.sample('submit', performance.now() - afterEncode)

        if (gpuTimingThisFrame) {
            this._readTimestamps()
        }

        viewParamsUploadBuffer.destroy()
        skyBoxViewParamsUploadBuffer.destroy()
    }

    private _readTimestamps() {
        const readbackBuffer = this._timestampReadbackBuffer!

        readbackBuffer
            .mapAsync(GPUMapMode.READ)
            .then(() => {
                const timestamps = new BigUint64Array(
                    readbackBuffer.getMappedRange()
                )

                const durationMs = (begin: number, end: number) =>
                    Number(timestamps[end]! - timestamps[begin]!) / 1e6

                Profiler.sample('gpu geometry', durationMs(0, 1))
                Profiler.sample('gpu shadow', durationMs(2, 3))
                Profiler.sample('gpu culling', durationMs(4, 5))
                Profiler.sample('gpu lighting', durationMs(6, 7))
                Profiler.sample('gpu skybox', durationMs(8, 9))

                readbackBuffer.unmap()
                this._timestampReadbackPending = false
            })
            .catch(() => {
                this._timestampReadbackPending = false
            })
    }
}
