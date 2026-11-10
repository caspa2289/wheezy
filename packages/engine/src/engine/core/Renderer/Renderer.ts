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
    type TAntiAliasing,
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
    HDR_TARGET_FORMAT,
    IBL_BRDF_LUT_SIZE,
    IBL_IRRADIANCE_SIZE,
    IBL_PREFILTER_MIP_LEVELS,
    IBL_PREFILTER_SIZE,
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
    SPOT_MAX_CONE_HALF_ANGLE,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'
import { type IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import shaderCode from '../../shaders/testShader.wgsl'
import lightingShaderCode from '../../shaders/lighting.wgsl'
import lightCullingShaderCode from '../../shaders/lightCulling.wgsl'
import shadowShaderCode from '../../shaders/vertexShadow.wgsl'
import skyboxShaderCode from '../../shaders/skybox.wgsl'
import postShaderCode from '../../shaders/post.wgsl'
import fxaaShaderCode from '../../shaders/fxaa.wgsl'
import iblShaderCode from '../../shaders/ibl.wgsl'
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
import { LightGizmo } from '../lights/LightGizmo'
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
    #adapter!: GPUAdapter
    #device!: GPUDevice
    #context!: GPUCanvasContext
    #canvas: HTMLCanvasElement
    #gBuffer!: GBuffer

    #shadowDepthTexture!: GPUTexture
    #shadowDepthTextureView!: GPUTextureView
    #shadowDepthTextureSize = SHADOW_ATLAS_SIZE
    #shadowDepthSampler!: GPUSampler
    #shadowShaderModule!: GPUShaderModule

    // persistent shadow-data storage buffer (header + MAX_SHADOW_CASTERS entries,
    // see constants.ts) — contents rewritten per frame via queue.writeBuffer so
    // the bind groups referencing it stay static
    #shadowDataBuffer!: GPUBuffer
    #shadowDataUpload = new ArrayBuffer(SHADOW_DATA_BUFFER_SIZE)
    // dynamic-offset uniform buffer: slot i holds the u32 value i; the shadow
    // pass binds slot = caster entry index so vertexShadow.wgsl knows which
    // tile's light VP to use
    #shadowIndexBuffer!: GPUBuffer
    // group 0 of the shadow pipelines (dynamic-offset caster index + data storage)
    #shadowDataBGLayout!: GPUBindGroupLayout
    #shadowDataBindGroup!: GPUBindGroup
    // group 3 of the lighting pipeline (atlas + comparison sampler + data +
    // cluster counts/indices — merged because maxBindGroups defaults to 4)
    #shadowBindGroupLayout!: GPUBindGroupLayout
    #shadowBindGroup!: GPUBindGroup
    // per-frame atlas tiles to render: pixel rect + caster entry index
    #frameTiles: {
        x: number
        y: number
        size: number
        casterIndex: number
    }[] = []
    // hysteresis: lights that held a tile last frame get budget priority
    #prevShadowedLights = new Set<ILightSourceV2>()
    // shadow pipelines keyed by position vertex format (`elementType:byteStride`)
    #shadowPipelineCache = new Map<string, GPURenderPipeline>()

    // clustered (froxel) light culling — Phase 3
    #cullingShaderModule!: GPUShaderModule
    #cullResetPipeline!: GPUComputePipeline
    #cullPipeline!: GPUComputePipeline
    #computePassDescriptor!: GPUComputePassDescriptor
    #clusterCountsBuffer!: GPUBuffer
    #clusterIndicesBuffer!: GPUBuffer
    #clusterCount = 0
    #clusterTilesX = 0
    #clusterTilesY = 0
    #cullLightsBuffer!: GPUBuffer
    #cullLightsUpload = new ArrayBuffer(CULL_LIGHTS_BUFFER_SIZE)
    #cullLightsBGLayout!: GPUBindGroupLayout
    #cullLightsBindGroup!: GPUBindGroup
    #clusterComputeBGLayout!: GPUBindGroupLayout
    #clusterComputeBindGroup!: GPUBindGroup

    #skyBoxVerticesBuffer!: GPUBuffer
    #skyBoxPipeline!: GPURenderPipeline
    #skyBoxUniformBuffer!: GPUBuffer
    #skyBoxUniformBufferSize = 16 * 4 * 3 + 4 * 4
    #skyBoxRenderPassDescriptor!: GPURenderPassDescriptor
    #skyBoxUniformBindGroup!: GPUBindGroup
    #skyBoxModelMatrix: Mat4 = mat4.scaling(vec3.fromValues(100, 100, 100))
    #skyboxTexture!: GPUTexture
    #skyboxSampler!: GPUSampler

    #lightsBindGroupLayout!: GPUBindGroupLayout
    #gBufferBindGroupLayout!: GPUBindGroupLayout
    #gBufferBindGroup!: GPUBindGroup

    #uniformsBGLayout!: GPUBindGroupLayout
    #nodeParamsBGLayout!: GPUBindGroupLayout

    #viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE

    #geometryPassDescriptor!: GPURenderPassDescriptor
    #lightingPassDescriptor!: GPURenderPassDescriptor
    #postPassDescriptor!: GPURenderPassDescriptor
    #shadowPassDescriptor!: GPURenderPassDescriptor

    #viewParamsBuffer!: GPUBuffer
    #viewParamsBindGroup!: GPUBindGroup

    #debugParamsBuffer!: GPUBuffer

    #shaderModule!: GPUShaderModule
    #lightingShaderModule!: GPUShaderModule
    #postShaderModule!: GPUShaderModule

    #postBindGroupLayout!: GPUBindGroupLayout
    #postBindGroup!: GPUBindGroup

    #fxaaShaderModule!: GPUShaderModule
    #fxaaBindGroupLayout!: GPUBindGroupLayout
    #fxaaBindGroup!: GPUBindGroup
    #fxaaSampler!: GPUSampler
    #fxaaPassDescriptor!: GPURenderPassDescriptor

    // image-based lighting: prefiltered from the skybox, persistent so the
    // lighting bind group (group 3) stays static across skybox changes
    #iblShaderModule!: GPUShaderModule
    #iblIrradianceTexture!: GPUTexture
    #iblPrefilteredTexture!: GPUTexture
    #iblBrdfLutTexture!: GPUTexture
    #iblIrradianceView!: GPUTextureView
    #iblPrefilteredView!: GPUTextureView
    #iblBrdfLutView!: GPUTextureView
    #iblSampler!: GPUSampler
    #iblEnvBGLayout!: GPUBindGroupLayout
    #iblCubeOutBGLayout!: GPUBindGroupLayout
    #iblLutOutBGLayout!: GPUBindGroupLayout
    #iblEnvBG!: GPUBindGroup
    #iblIrradianceOutBG!: GPUBindGroup
    #iblPrefilterOutBGs: GPUBindGroup[] = []
    #iblLutOutBG!: GPUBindGroup
    #iblIrradiancePipeline!: GPUComputePipeline
    #iblPrefilterPipeline!: GPUComputePipeline
    #iblBrdfLutPipeline!: GPUComputePipeline

    #gpuTimingSupported = false
    #timestampQuerySet?: GPUQuerySet
    #timestampResolveBuffer?: GPUBuffer
    #timestampReadbackBuffer?: GPUBuffer
    #timestampReadbackPending = false

    // environment tint and strength for the image-based lighting term — white
    // at full strength means "the skybox lights the scene as authored"
    public ambientLightColor = vec3.create(1, 1, 1)
    public ambientLightIntensity: number = 1
    // applied to the HDR lighting result before tonemapping (1 = unchanged)
    public exposure: number = 1
    // 'fxaa' inserts the final LDR pass; 'none' tonemaps straight to the swapchain
    public antiAliasing: TAntiAliasing = 'fxaa'

    public outputSource = RENDER_OUTPUT_SOURCES.DEFAULT

    #geometryPipeline!: GPURenderPipeline
    #lightingPipeline!: GPURenderPipeline
    #postPipeline!: GPURenderPipeline
    #fxaaPipeline!: GPURenderPipeline
    #materialBindGroupLayout!: GPUBindGroupLayout

    constructor({ canvas }: IRendererProps) {
        this.#canvas = canvas
    }

    public async init() {
        await this.#initializeContext(this.#canvas)

        this.#context.configure({
            device: this.#device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format: DEFAULT_SWAP_CHAIN_FORMAT,
        })

        this.#gBuffer = new GBuffer(
            this.#device,
            this.#context,
            this.swapChainFormat,
            this.depthTextureFormat
        )

        this.#shadowDepthTexture = this.#device.createTexture({
            label: 'shadowDepthTexture',
            size: [
                this.#shadowDepthTextureSize,
                this.#shadowDepthTextureSize,
                1,
            ],
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.TEXTURE_BINDING,
            format: DEFAULT_SHADOW_DEPTH_FORMAT,
        })

        this.#shadowDepthSampler = this.device.createSampler({
            compare: 'less',
            label: 'shadow depth sampler',
        })

        this.#shadowDepthTextureView = this.#shadowDepthTexture.createView()

        this.#shadowShaderModule = this.device.createShaderModule({
            label: 'shadow shader module',
            code: shadowShaderCode,
        })

        this.#shadowDataBuffer = this.device.createBuffer({
            label: 'shadow data buffer',
            size: SHADOW_DATA_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        // slot i of the index buffer holds the u32 value i; bound with a dynamic
        // offset (i × 256) per atlas tile draw
        this.#shadowIndexBuffer = this.device.createBuffer({
            label: 'shadow caster index buffer',
            size: MAX_SHADOW_CASTERS * SHADOW_INDEX_SLOT_SIZE,
            usage: GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })
        {
            const slots = new Uint32Array(
                this.#shadowIndexBuffer.getMappedRange()
            )
            for (let i = 0; i < MAX_SHADOW_CASTERS; i++) {
                slots[(i * SHADOW_INDEX_SLOT_SIZE) / 4] = i
            }
            this.#shadowIndexBuffer.unmap()
        }

        this.#shadowDataBGLayout = this.device.createBindGroupLayout({
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

        this.#shadowDataBindGroup = this.device.createBindGroup({
            label: 'shadow data bind group',
            layout: this.#shadowDataBGLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#shadowIndexBuffer,
                        offset: 0,
                        size: 4,
                    },
                },
                { binding: 1, resource: { buffer: this.#shadowDataBuffer } },
            ],
        })

        this.#shaderModule = this.device.createShaderModule({
            label: 'geometry shader',
            code: shaderCode,
        })

        this.#lightingShaderModule = this.device.createShaderModule({
            label: 'lighting shader',
            code: lightingShaderCode,
        })

        this.#postShaderModule = this.device.createShaderModule({
            label: 'post shader',
            code: postShaderCode,
        })

        this.#fxaaShaderModule = this.device.createShaderModule({
            label: 'fxaa shader',
            code: fxaaShaderCode,
        })

        this.#initializeBindGroupLayouts()

        // before the clustered-culling bind group below: lighting group 3
        // samples the IBL textures, so they must exist first
        this.#initializeIBL()

        this.#initializeClusteredCulling()

        // created after the cluster buffers exist: the lighting-side shadow
        // group also carries the culling results — the default maxBindGroups
        // is 4, so the lighting pipeline cannot have a separate 5th group
        this.#shadowBindGroupLayout = this.device.createBindGroupLayout({
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
                // image-based lighting: irradiance cube, roughness-prefiltered
                // cube, split-sum BRDF LUT and their shared trilinear sampler
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float', viewDimension: 'cube' },
                },
                {
                    binding: 6,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float', viewDimension: 'cube' },
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float', viewDimension: '2d' },
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'filtering' },
                },
            ],
        })

        this.#shadowBindGroup = this.device.createBindGroup({
            label: 'shadow bind group',
            layout: this.#shadowBindGroupLayout,
            entries: [
                { binding: 0, resource: this.#shadowDepthTextureView },
                { binding: 1, resource: this.#shadowDepthSampler },
                { binding: 2, resource: { buffer: this.#shadowDataBuffer } },
                { binding: 3, resource: { buffer: this.#clusterCountsBuffer } },
                {
                    binding: 4,
                    resource: { buffer: this.#clusterIndicesBuffer },
                },
                { binding: 5, resource: this.#iblIrradianceView },
                { binding: 6, resource: this.#iblPrefilteredView },
                { binding: 7, resource: this.#iblBrdfLutView },
                { binding: 8, resource: this.#iblSampler },
            ],
        })

        this.#initializeViewParams()

        // attachment order must match GBufferOutput @location order in testShader.wgsl.
        // 4 targets: WebGPU's default maxColorAttachmentBytesPerSample is 32 and counts
        // each attachment 8-byte-aligned — occlusion is packed into metallicRoughness .r
        this.#geometryPassDescriptor = {
            label: 'geometry pass descriptor',
            colorAttachments: [
                {
                    view: this.#gBuffer.albedo,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
                {
                    view: this.#gBuffer.normal,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
                {
                    view: this.#gBuffer.metallicRoughness,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
                {
                    view: this.#gBuffer.emission,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
            depthStencilAttachment: {
                view: this.#gBuffer.depth,
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
            },
        }

        // the lighting pass renders into the HDR target and the post pass
        // tonemaps that into the swapchain, so this view is static
        this.#lightingPassDescriptor = {
            label: 'lighting pass descriptor',
            colorAttachments: [
                {
                    view: this.#gBuffer.litColor,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 1.0],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
        }

        // the tonemap target is assigned per frame: postColor when FXAA runs,
        // the swapchain when it doesn't
        this.#postPassDescriptor = {
            label: 'post pass descriptor',
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 1.0],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
        }

        this.#fxaaPassDescriptor = {
            label: 'fxaa pass descriptor',
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView, // swap chain, assigned per frame
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 1.0],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
        }

        this.#shadowPassDescriptor = {
            colorAttachments: [],
            depthStencilAttachment: {
                view: this.#shadowDepthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        }

        this.#skyBoxVerticesBuffer = this.#device.createBuffer({
            size: cubeVertexArray.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        })
        new Float32Array(this.#skyBoxVerticesBuffer.getMappedRange()).set(
            cubeVertexArray
        )
        this.#skyBoxVerticesBuffer.unmap()

        this.#skyBoxPipeline = this.#device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: this.#device.createShaderModule({
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
                module: this.#device.createShaderModule({
                    code: skyboxShaderCode,
                }),
                targets: [
                    {
                        // the sky is composited into the HDR target so the post
                        // chain (tonemap + FXAA) sees the geometry/sky silhouette
                        format: HDR_TARGET_FORMAT,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'front',
            },
            depthStencil: {
                // skybox fragments are forced to depth 1.0 in skybox.wgsl, so
                // 'less-equal' against the G-buffer depth passes only where the
                // depth is still the 1.0 clear value (no geometry)
                depthWriteEnabled: false,
                depthCompare: 'less-equal',
                format: this.depthTextureFormat,
            },
        })

        this.#skyboxSampler = this.#device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        })

        this.#skyBoxUniformBuffer = this.#device.createBuffer({
            size: skyBoxUniformBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.#skyBoxRenderPassDescriptor = {
            label: 'skybox render pass',
            colorAttachments: [
                {
                    // static: the sky composites into the HDR target, which the
                    // tonemap pass then reads
                    view: this.#gBuffer.litColor,
                    loadOp: 'load', // lighting result is already on the target
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this.#gBuffer.depth,
                depthLoadOp: 'load' as GPULoadOp,
                depthStoreOp: 'store' as GPUStoreOp,
            },
        }

        if (this.#gpuTimingSupported) {
            const querySet = this.#timestampQuerySet!
            this.#geometryPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 0,
                endOfPassWriteIndex: 1,
            }
            this.#shadowPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 2,
                endOfPassWriteIndex: 3,
            }
            this.#computePassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 4,
                endOfPassWriteIndex: 5,
            }
            this.#lightingPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 6,
                endOfPassWriteIndex: 7,
            }
            this.#skyBoxRenderPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 8,
                endOfPassWriteIndex: 9,
            }
            this.#postPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 10,
                endOfPassWriteIndex: 11,
            }
            this.#fxaaPassDescriptor.timestampWrites = {
                querySet,
                beginningOfPassWriteIndex: 12,
                endOfPassWriteIndex: 13,
            }
        }

        const sampleType = 'float'

        this.#materialBindGroupLayout = this.device.createBindGroupLayout({
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

        this.#lightsBindGroupLayout = this.device.createBindGroupLayout({
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

        this.#gBufferBindGroupLayout = this.device.createBindGroupLayout({
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
        this.#gBufferBindGroup = this.device.createBindGroup({
            label: 'gBuffer bindgroup',
            layout: this.#gBufferBindGroupLayout,
            entries: [
                { binding: 0, resource: this.#gBuffer.albedo },
                { binding: 1, resource: this.#gBuffer.normal },
                { binding: 2, resource: this.#gBuffer.metallicRoughness },
                { binding: 3, resource: this.#gBuffer.emission },
                { binding: 4, resource: this.#gBuffer.depth },
            ],
        })

        this.#geometryPipeline = this.device.createRenderPipeline({
            label: 'geometry render pipeline',
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.#uniformsBGLayout,
                    this.#nodeParamsBGLayout,
                    this.#materialBindGroupLayout,
                ],
            }),
            vertex: {
                module: this.#shaderModule,
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
                module: this.#shaderModule,
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

        this.#lightingPipeline = this.device.createRenderPipeline({
            label: 'lighting render pipeline',
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.#uniformsBGLayout,
                    this.#gBufferBindGroupLayout,
                    this.#lightsBindGroupLayout,
                    this.#shadowBindGroupLayout,
                ],
            }),
            vertex: {
                module: this.#lightingShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: this.#lightingShaderModule,
                entryPoint: 'fragment_main',
                // linear HDR — the post pass tonemaps this into the swapchain
                targets: [{ format: HDR_TARGET_FORMAT }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        })

        // group 0 is shared with the geometry/lighting passes (view + debug
        // params); group 1 carries only the HDR texture
        this.#postBindGroupLayout = this.device.createBindGroupLayout({
            label: 'post bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float' },
                },
            ],
        })

        this.#postBindGroup = this.device.createBindGroup({
            label: 'post bind group',
            layout: this.#postBindGroupLayout,
            entries: [{ binding: 0, resource: this.#gBuffer.litColor }],
        })

        this.#postPipeline = this.device.createRenderPipeline({
            label: 'post render pipeline',
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.#uniformsBGLayout,
                    this.#postBindGroupLayout,
                ],
            }),
            vertex: {
                module: this.#postShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: this.#postShaderModule,
                entryPoint: 'fragment_main',
                targets: [{ format: this.swapChainFormat }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        })

        // FXAA reads the tonemapped LDR target; a filtering sampler is required
        // because its taps land between pixels
        this.#fxaaSampler = this.device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        })

        this.#fxaaBindGroupLayout = this.device.createBindGroupLayout({
            label: 'fxaa bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'filtering' },
                },
            ],
        })

        this.#fxaaBindGroup = this.device.createBindGroup({
            label: 'fxaa bind group',
            layout: this.#fxaaBindGroupLayout,
            entries: [
                { binding: 0, resource: this.#gBuffer.postColor },
                { binding: 1, resource: this.#fxaaSampler },
            ],
        })

        this.#fxaaPipeline = this.device.createRenderPipeline({
            label: 'fxaa render pipeline',
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this.#uniformsBGLayout,
                    this.#fxaaBindGroupLayout,
                ],
            }),
            vertex: {
                module: this.#fxaaShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: this.#fxaaShaderModule,
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
        this.#skyboxTexture = this.#device.createTexture({
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
            this.#device.queue.copyExternalImageToTexture(
                { source: imageBitmap },
                { texture: this.#skyboxTexture, origin: [0, 0, i] },
                [imageBitmap.width, imageBitmap.height]
            )
        }

        this.#skyBoxUniformBindGroup = this.#device.createBindGroup({
            label: 'skybox uniform bindgroup',
            layout: this.#skyBoxPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#skyBoxUniformBuffer,
                        offset: 0,
                        size: skyBoxUniformBufferSize,
                    },
                },
                {
                    binding: 1,
                    resource: this.#skyboxSampler,
                },
                {
                    binding: 2,
                    resource: this.#skyboxTexture.createView({
                        dimension: 'cube',
                    }),
                },
            ],
        })

        // indirect light comes from this skybox, so it has to be re-convolved
        this.#prefilterEnvironment()
    }

    get device() {
        return this.#device
    }

    get adapter() {
        return this.#adapter
    }

    get context() {
        return this.#context
    }

    get swapChainFormat() {
        return DEFAULT_SWAP_CHAIN_FORMAT
    }

    get depthTextureFormat() {
        return DEFAULT_DEPTH_FORMAT
    }

    get lightsBindGroupLayout() {
        return this.#lightsBindGroupLayout
    }

    #initializeViewParams() {
        this.#viewParamsBuffer = this.device.createBuffer({
            size: this.#viewParamsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.#debugParamsBuffer = this.device.createBuffer({
            size: 4 + 4,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.#viewParamsBindGroup = this.device.createBindGroup({
            layout: this.#uniformsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this.#viewParamsBuffer } },
                { binding: 1, resource: { buffer: this.#debugParamsBuffer } },
            ],
        })
    }

    #initializeBindGroupLayouts() {
        // COMPUTE visibility included: the light-culling pass reads the view params
        this.#uniformsBGLayout = this.device.createBindGroupLayout({
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

        this.#nodeParamsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' },
                },
            ],
        })
    }

    #initializeClusteredCulling() {
        // grid sized from the canvas (fixed at init — no resize support, same
        // as the G-buffer)
        this.#clusterTilesX = Math.ceil(this.#canvas.width / CLUSTER_TILE_SIZE)
        this.#clusterTilesY = Math.ceil(this.#canvas.height / CLUSTER_TILE_SIZE)
        this.#clusterCount =
            this.#clusterTilesX * this.#clusterTilesY * CLUSTER_DEPTH_SLICES

        this.#clusterCountsBuffer = this.#device.createBuffer({
            label: 'cluster light counts',
            size: this.#clusterCount * 4,
            usage: GPUBufferUsage.STORAGE,
        })

        this.#clusterIndicesBuffer = this.#device.createBuffer({
            label: 'cluster light indices',
            size: this.#clusterCount * CLUSTER_MAX_LIGHTS * 4,
            usage: GPUBufferUsage.STORAGE,
        })

        this.#cullLightsBuffer = this.#device.createBuffer({
            label: 'cull lights buffer',
            size: CULL_LIGHTS_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        this.#cullLightsBGLayout = this.#device.createBindGroupLayout({
            label: 'cull lights bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        this.#cullLightsBindGroup = this.#device.createBindGroup({
            label: 'cull lights bind group',
            layout: this.#cullLightsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this.#cullLightsBuffer } },
            ],
        })

        this.#clusterComputeBGLayout = this.#device.createBindGroupLayout({
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

        this.#clusterComputeBindGroup = this.#device.createBindGroup({
            label: 'cluster compute bind group',
            layout: this.#clusterComputeBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this.#clusterCountsBuffer } },
                {
                    binding: 1,
                    resource: { buffer: this.#clusterIndicesBuffer },
                },
            ],
        })

        this.#cullingShaderModule = this.#device.createShaderModule({
            label: 'light culling shader',
            code: lightCullingShaderCode,
        })

        const cullingPipelineLayout = this.#device.createPipelineLayout({
            label: 'light culling pipeline layout',
            bindGroupLayouts: [
                this.#uniformsBGLayout,
                this.#cullLightsBGLayout,
                this.#clusterComputeBGLayout,
            ],
        })

        this.#cullResetPipeline = this.#device.createComputePipeline({
            label: 'cluster reset pipeline',
            layout: cullingPipelineLayout,
            compute: {
                module: this.#cullingShaderModule,
                entryPoint: 'reset_main',
            },
        })

        this.#cullPipeline = this.#device.createComputePipeline({
            label: 'light culling pipeline',
            layout: cullingPipelineLayout,
            compute: {
                module: this.#cullingShaderModule,
                entryPoint: 'cull_main',
            },
        })

        this.#computePassDescriptor = {
            label: 'light culling compute pass',
        }
    }

    async #initializeContext(canvas: HTMLCanvasElement) {
        const adapter = await navigator.gpu.requestAdapter()

        if (!adapter) {
            throw new Error('GPU Adapter Unavailable')
        }

        this.#gpuTimingSupported =
            Profiler.enabled && adapter.features.has('timestamp-query')

        const device = await adapter.requestDevice({
            requiredFeatures: this.#gpuTimingSupported
                ? ['timestamp-query']
                : [],
        })

        this.#device = device
        this.#adapter = adapter

        if (this.#gpuTimingSupported) {
            this.#initializeGpuTiming()
        }

        canvas.width = document.body.clientWidth * window.devicePixelRatio
        canvas.height = document.body.clientHeight * window.devicePixelRatio

        this.#context = canvas.getContext('webgpu') as GPUCanvasContext

        if (!this.#context) {
            throw new Error('Failed to acquire GpuCanvasContext')
        }
    }

    #initializeGpuTiming() {
        // 7 passes (geometry, shadow, culling compute, lighting, skybox,
        // tonemap, fxaa) x begin/end
        this.#timestampQuerySet = this.#device.createQuerySet({
            label: 'profiler timestamp query set',
            type: 'timestamp',
            count: 14,
        })

        this.#timestampResolveBuffer = this.#device.createBuffer({
            label: 'profiler timestamp resolve buffer',
            size: 14 * 8,
            usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
        })

        this.#timestampReadbackBuffer = this.#device.createBuffer({
            label: 'profiler timestamp readback buffer',
            size: 14 * 8,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        })
    }

    /**
     * Allocates the IBL targets, views, layouts and compute pipelines.
     *
     * Called before `_initializeClusteredCulling()` because the lighting bind
     * group (group 3) samples these textures and must stay static: only their
     * contents are rewritten, in `_prefilterEnvironment()`.
     */
    #initializeIBL() {
        this.#iblShaderModule = this.#device.createShaderModule({
            label: 'ibl shader',
            code: iblShaderCode,
        })

        this.#iblIrradianceTexture = this.#device.createTexture({
            label: 'ibl irradiance',
            dimension: '2d',
            size: [IBL_IRRADIANCE_SIZE, IBL_IRRADIANCE_SIZE, 6],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING,
        })

        this.#iblPrefilteredTexture = this.#device.createTexture({
            label: 'ibl prefiltered',
            dimension: '2d',
            size: [IBL_PREFILTER_SIZE, IBL_PREFILTER_SIZE, 6],
            format: 'rgba8unorm',
            mipLevelCount: IBL_PREFILTER_MIP_LEVELS,
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING,
        })

        this.#iblBrdfLutTexture = this.#device.createTexture({
            label: 'ibl brdf lut',
            dimension: '2d',
            size: [IBL_BRDF_LUT_SIZE, IBL_BRDF_LUT_SIZE],
            // rgba16float, not rg16float: rg16float is not storage-capable in
            // WebGPU (createTexture rejects STORAGE_BINDING for it), and the
            // extra precision helps the envBRDF scale/bias terms
            format: 'rgba16float',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING,
        })

        // cube views for the lighting pass; the compute writes go through
        // 2d-array views because textureStore cannot target a cube view
        this.#iblIrradianceView = this.#iblIrradianceTexture.createView({
            dimension: 'cube',
        })
        this.#iblPrefilteredView = this.#iblPrefilteredTexture.createView({
            dimension: 'cube',
        })
        this.#iblBrdfLutView = this.#iblBrdfLutTexture.createView()

        // trilinear, so roughness picks between the prefilter mip levels
        this.#iblSampler = this.#device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
        })

        this.#iblEnvBGLayout = this.#device.createBindGroupLayout({
            label: 'ibl env source layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: { sampleType: 'float', viewDimension: 'cube' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    sampler: { type: 'filtering' },
                },
            ],
        })

        this.#iblCubeOutBGLayout = this.#device.createBindGroupLayout({
            label: 'ibl cube output layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format: 'rgba8unorm',
                        viewDimension: '2d-array',
                    },
                },
            ],
        })

        this.#iblLutOutBGLayout = this.#device.createBindGroupLayout({
            label: 'ibl brdf lut output layout',
            entries: [
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format: 'rgba16float',
                        viewDimension: '2d',
                    },
                },
            ],
        })

        this.#iblIrradianceOutBG = this.#device.createBindGroup({
            label: 'ibl irradiance output',
            layout: this.#iblCubeOutBGLayout,
            entries: [
                {
                    binding: 0,
                    resource: this.#iblIrradianceTexture.createView({
                        dimension: '2d-array',
                    }),
                },
            ],
        })

        // one output bind group per prefilter mip: WGSL's textureStore has no
        // mip argument, so each level is written through its own single-mip view
        this.#iblPrefilterOutBGs = []
        for (let mip = 0; mip < IBL_PREFILTER_MIP_LEVELS; mip++) {
            this.#iblPrefilterOutBGs.push(
                this.#device.createBindGroup({
                    label: `ibl prefilter output mip ${mip}`,
                    layout: this.#iblCubeOutBGLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: this.#iblPrefilteredTexture.createView({
                                dimension: '2d-array',
                                baseMipLevel: mip,
                                mipLevelCount: 1,
                            }),
                        },
                    ],
                })
            )
        }

        this.#iblLutOutBG = this.#device.createBindGroup({
            label: 'ibl brdf lut output',
            layout: this.#iblLutOutBGLayout,
            entries: [{ binding: 1, resource: this.#iblBrdfLutView }],
        })

        const cubePipeline = (label: string, entryPoint: string) =>
            this.#device.createComputePipeline({
                label,
                layout: this.#device.createPipelineLayout({
                    bindGroupLayouts: [
                        this.#iblEnvBGLayout,
                        this.#iblCubeOutBGLayout,
                    ],
                }),
                compute: { module: this.#iblShaderModule, entryPoint },
            })

        this.#iblIrradiancePipeline = cubePipeline(
            'ibl irradiance pipeline',
            'irradiance_main'
        )
        this.#iblPrefilterPipeline = cubePipeline(
            'ibl prefilter pipeline',
            'prefilter_main'
        )
        // the LUT needs no environment input, but group 0 is part of its layout
        // and must still be bound at dispatch time
        this.#iblBrdfLutPipeline = this.#device.createComputePipeline({
            label: 'ibl brdf lut pipeline',
            layout: this.#device.createPipelineLayout({
                bindGroupLayouts: [
                    this.#iblEnvBGLayout,
                    this.#iblLutOutBGLayout,
                ],
            }),
            compute: {
                module: this.#iblShaderModule,
                entryPoint: 'brdf_lut_main',
            },
        })
    }

    /**
     * Convolves the current skybox into the irradiance map, the roughness-indexed
     * prefiltered specular map and the BRDF integration LUT. Runs once per
     * skybox assignment, not per frame.
     */
    #prefilterEnvironment() {
        // the skybox texture is recreated on every assignment, so this group
        // cannot be built once at init
        this.#iblEnvBG = this.#device.createBindGroup({
            label: 'ibl env source',
            layout: this.#iblEnvBGLayout,
            entries: [
                {
                    binding: 0,
                    resource: this.#skyboxTexture.createView({
                        dimension: 'cube',
                    }),
                },
                { binding: 1, resource: this.#iblSampler },
            ],
        })

        const encoder = this.#device.createCommandEncoder({
            label: 'ibl prefilter encoder',
        })
        const pass = encoder.beginComputePass({
            label: 'ibl prefilter pass',
        })

        pass.setBindGroup(0, this.#iblEnvBG)

        pass.setPipeline(this.#iblIrradiancePipeline)
        pass.setBindGroup(1, this.#iblIrradianceOutBG)
        pass.dispatchWorkgroups(
            IBL_IRRADIANCE_SIZE / 8,
            IBL_IRRADIANCE_SIZE / 8,
            6
        )

        pass.setPipeline(this.#iblPrefilterPipeline)
        for (let mip = 0; mip < IBL_PREFILTER_MIP_LEVELS; mip++) {
            const size = IBL_PREFILTER_SIZE >> mip
            pass.setBindGroup(1, this.#iblPrefilterOutBGs[mip]!)
            pass.dispatchWorkgroups(
                Math.max(1, size / 8),
                Math.max(1, size / 8),
                6
            )
        }

        pass.setPipeline(this.#iblBrdfLutPipeline)
        pass.setBindGroup(1, this.#iblLutOutBG)
        pass.dispatchWorkgroups(IBL_BRDF_LUT_SIZE / 8, IBL_BRDF_LUT_SIZE / 8, 1)

        pass.end()
        this.#device.queue.submit([encoder.finish()])
    }

    #createMeshBuffer(accessor: GLTFAccessor, scene: IScene) {
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
            layout: this.#materialBindGroupLayout,
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
                    resource: this.#skyboxTexture.createView({
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
                    resource: this.#skyboxSampler,
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
        let shadowPipeline = this.#shadowPipelineCache.get(shadowPipelineKey)
        if (!shadowPipeline) {
            shadowPipeline = this.device.createRenderPipeline({
                label: 'shadow render pipeline',
                layout: this.device.createPipelineLayout({
                    label: 'shadow render pipeline layout',
                    bindGroupLayouts: [
                        this.#shadowDataBGLayout,
                        this.#nodeParamsBGLayout,
                    ],
                }),
                vertex: {
                    module: this.#shadowShaderModule,
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
            this.#shadowPipelineCache.set(shadowPipelineKey, shadowPipeline)
        }
        meshDataEntry.shadowRenderPipeline = shadowPipeline

        meshDataEntry.positionsBuffer = this.#createMeshBuffer(
            mesh.positions,
            scene
        )

        meshDataEntry.textureCoordinatesBuffer = this.#createMeshBuffer(
            mesh.textureCoordinates,
            scene
        )

        meshDataEntry.normalsBuffer = this.#createMeshBuffer(
            mesh.normals,
            scene
        )

        meshDataEntry.tangentsBuffer = this.#createMeshBuffer(
            mesh.tangents,
            scene
        )

        meshDataEntry.indicesBuffer = this.#createMeshBuffer(
            mesh.indices,
            scene
        )

        scene.meshRenderDataStorage.data.set(mesh.id, meshDataEntry)
        mesh.isPipelineBuilt = true
    }

    #renderMesh(
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

    #createLightsBuffer = (
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
    #cameraShadowSphere(
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
    #deriveLightRange(
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

    #directionalShadowVP(
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

    #spotShadowVP(light: ISpotLight): Mat4 {
        const direction = vec3.normalize(light.direction)
        const up =
            Math.abs(direction[1]!) > 0.99
                ? vec3.fromValues(0, 0, 1)
                : vec3.fromValues(0, 1, 0)
        const target = vec3.addScaled(light.position, direction, 1)
        const lightView = mat4.lookAt(light.position, target, up)

        // cutoff is stored pre-cosined (see SpotLight.cutoff setter); the min()
        // is the same clamp applied defensively in case `_cutoff` was written
        // directly, and keeps the projection away from π where it degenerates
        const halfAngle = Math.acos(Math.min(1, Math.max(-1, light.cutoff)))
        const fov = Math.min(2 * halfAngle, 2 * SPOT_MAX_CONE_HALF_ANGLE)
        const range = this.#deriveLightRange(
            light.intensity,
            light.attenuationConstant,
            light.attenuationLinear,
            light.attenuationExponential
        )
        const far = Math.min(Math.max(range, 1), SHADOW_LOCAL_FAR)
        const lightProjection = mat4.perspective(fov, 1, 0.1, far)
        return mat4.mul(lightProjection, lightView)
    }

    #pointFaceShadowVP(lightPosition: Vec3, face: number, far: number): Mat4 {
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
    #pointFaceVisible(
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
    #allocateShadowCasters(
        scene: IScene,
        cameraPosition: Vec3,
        inverseViewProjection: Mat4
    ): Map<ILightSourceV2, number> {
        const casterBases = new Map<ILightSourceV2, number>()
        const floats = new Float32Array(this.#shadowDataUpload)
        const ints = new Uint32Array(this.#shadowDataUpload)
        floats.fill(0)
        this.#frameTiles = []

        const sphere = this.#cameraShadowSphere(
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
                    this.#directionalShadowVP(
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
                vps: [this.#spotShadowVP(light)],
            })
        }
        for (const light of scene.pointLights) {
            const range = this.#deriveLightRange(
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
                    this.#pointFaceVisible(face, light.position, sphere)
                        ? this.#pointFaceShadowVP(light.position, face, far)
                        : null
                ),
            })
        }

        // hysteresis: lights that held tiles last frame first, then relevance
        candidates.sort((a, b) => {
            const prevA = this.#prevShadowedLights.has(a.light) ? 0 : 1
            const prevB = this.#prevShadowedLights.has(b.light) ? 0 : 1
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
            if (shelfX + size > this.#shadowDepthTextureSize) {
                shelfX = 0
                shelfY += shelfHeight
                shelfHeight = 0
            }
            if (shelfY + size > this.#shadowDepthTextureSize) {
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
            const atlasSize = this.#shadowDepthTextureSize
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
                this.#frameTiles.push({
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
        this.#prevShadowedLights = assigned
        this.device.queue.writeBuffer(
            this.#shadowDataBuffer,
            0,
            this.#shadowDataUpload
        )
        return casterBases
    }

    /**
     * Fills the compact culling buffer for the clustered light-culling compute
     * pass: all point (type 0) and spot (type 1) lights with derived ranges.
     */
    #updateCullLights(scene: IScene) {
        const floats = new Float32Array(this.#cullLightsUpload)
        const ints = new Uint32Array(this.#cullLightsUpload)
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
                this.#deriveLightRange(
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
                this.#deriveLightRange(
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
            this.#cullLightsBuffer,
            0,
            this.#cullLightsUpload
        )
    }

    #renderMeshShadows(
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

        // attach/detach/re-pin the debug light gizmos before the traversal so
        // a profiler-HUD toggle takes effect this frame (dev-only: the
        // Profiler is disabled in production builds)
        LightGizmo.sync(scene, Profiler.enabled && Profiler.gizmosEnabled)

        const meshesToRender: IMesh[] = []

        const debugInfoArray = new ArrayBuffer(4 + 4)
        const debugInfoView = new DataView(
            debugInfoArray,
            0,
            debugInfoArray.byteLength
        )

        debugInfoView.setUint32(0, this.outputSource, true)

        const viewParamsUploadBuffer = this.device.createBuffer({
            size: this.#viewParamsBufferSize,
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
        viewInts[58] = this.#clusterTilesX
        viewInts[59] = this.#clusterTilesY
        viewInts[60] = this.#canvas.width
        viewInts[61] = this.#canvas.height
        // post-pass exposure (float 62 — see ViewParams in post.wgsl)
        viewMap[62] = this.exposure

        viewParamsUploadBuffer.unmap()

        const skyBoxViewParamsUploadBuffer = this.device.createBuffer({
            size: this.#skyBoxUniformBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const skyboxViewMap = new Float32Array(
            skyBoxViewParamsUploadBuffer.getMappedRange()
        )

        skyboxViewMap.set(this.#skyBoxModelMatrix)
        skyboxViewMap.set(scene.camera.projectionMatrix, 16)
        skyboxViewMap.set(scene.camera.view, 32)
        skyboxViewMap.set(scene.camera.position, 48)

        skyBoxViewParamsUploadBuffer.unmap()

        const debugParamsArray = new ArrayBuffer(this.#debugParamsBuffer.size)
        const debugParamsView = new DataView(
            debugParamsArray,
            0,
            debugParamsArray.byteLength
        )
        debugParamsView.setUint32(0, 0)
        debugParamsView.setUint32(4, 0)

        this.device.queue.writeBuffer(
            this.#debugParamsBuffer,
            0,
            debugInfoArray
        )

        // shadow atlas allocation must run before the lights buffers: their
        // `shadow_caster` pad slots are patched with the caster base indices
        const casterBases = this.#allocateShadowCasters(
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
                this.#deriveLightRange(
                    light.intensity,
                    light.attenuationConstant,
                    light.attenuationLinear,
                    light.attenuationExponential
                )
            )
        }

        const directionalLightsBuffer = this.#createLightsBuffer(
            DIRECTIONAL_LIGHT_BYTESTRIDE,
            DIRECTIONAL_LIGHT_ELEMENT_COUNT,
            scene.directionalLights,
            DIRECTIONAL_CASTER_SLOT,
            casterBases
        )
        const pointLightsBuffer = this.#createLightsBuffer(
            POINT_LIGHT_BYTESTRIDE,
            POINT_LIGHT_ELEMENT_COUNT,
            scene.pointLights,
            POINT_CASTER_SLOT,
            casterBases,
            { slot: POINT_RANGE_SLOT, ranges: lightRanges }
        )
        const spotLightsBuffer = this.#createLightsBuffer(
            SPOT_LIGHT_BYTESTRIDE,
            SPOT_LIGHT_ELEMENT_COUNT,
            scene.spotLights,
            SPOT_CASTER_SLOT,
            casterBases,
            { slot: SPOT_RANGE_SLOT, ranges: lightRanges }
        )

        this.#updateCullLights(scene)

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
                layout: this.#nodeParamsBGLayout,
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
            this.#viewParamsBuffer,
            0,
            this.#viewParamsBufferSize
        )

        commandEncoder.copyBufferToBuffer(
            skyBoxViewParamsUploadBuffer,
            0,
            this.#skyBoxUniformBuffer,
            0,
            this.#skyBoxUniformBufferSize
        )
        const currentTextureView = this.context.getCurrentTexture().createView()
        const fxaaEnabled = this.antiAliasing === 'fxaa'
        // tonemap writes the LDR target when FXAA follows it, otherwise straight
        // to the swapchain — so disabling AA skips a pass instead of running it
        ;(this.#postPassDescriptor as any).colorAttachments[0].view =
            fxaaEnabled ? this.#gBuffer.postColor : currentTextureView
        ;(this.#fxaaPassDescriptor as any).colorAttachments[0].view =
            currentTextureView

        const gpuTimingThisFrame =
            this.#gpuTimingSupported && !this.#timestampReadbackPending

        // pass order: geometry (G-buffer) → shadow (atlas tiles) → culling
        // (compute) → lighting (HDR) → skybox (into HDR) → tonemap (LDR) → fxaa

        const geometryPass = commandEncoder.beginRenderPass(
            this.#geometryPassDescriptor
        )

        geometryPass.setBindGroup(0, this.#viewParamsBindGroup)
        geometryPass.setPipeline(this.#geometryPipeline)

        meshesToRender.forEach((mesh) => {
            this.#renderMesh(mesh, scene, geometryPass)
        })

        geometryPass.end()

        // helper geometry (light gizmos) opts out of the atlas via castShadow
        const shadowCasters = meshesToRender.filter((mesh) => mesh.castShadow)

        // one pass over the whole atlas; each tile gets its viewport/scissor and
        // selects its caster entry via the dynamic bind-group offset
        const shadowPass = commandEncoder.beginRenderPass(
            this.#shadowPassDescriptor
        )

        for (const tile of this.#frameTiles) {
            shadowPass.setViewport(tile.x, tile.y, tile.size, tile.size, 0, 1)
            shadowPass.setScissorRect(tile.x, tile.y, tile.size, tile.size)
            shadowPass.setBindGroup(0, this.#shadowDataBindGroup, [
                tile.casterIndex * SHADOW_INDEX_SLOT_SIZE,
            ])

            shadowCasters.forEach((mesh) => {
                this.#renderMeshShadows(mesh, scene, shadowPass)
            })
        }

        shadowPass.end()

        const cullingPass = commandEncoder.beginComputePass(
            this.#computePassDescriptor
        )

        cullingPass.setBindGroup(0, this.#viewParamsBindGroup)
        cullingPass.setBindGroup(1, this.#cullLightsBindGroup)
        cullingPass.setBindGroup(2, this.#clusterComputeBindGroup)

        const cullingWorkgroups = Math.ceil(this.#clusterCount / 64)
        cullingPass.setPipeline(this.#cullResetPipeline)
        cullingPass.dispatchWorkgroups(cullingWorkgroups)
        // dispatches within a compute pass are ordered with memory barriers
        cullingPass.setPipeline(this.#cullPipeline)
        cullingPass.dispatchWorkgroups(cullingWorkgroups)

        cullingPass.end()

        const lightingPass = commandEncoder.beginRenderPass(
            this.#lightingPassDescriptor
        )

        lightingPass.setBindGroup(0, this.#viewParamsBindGroup)
        lightingPass.setBindGroup(1, this.#gBufferBindGroup)
        lightingPass.setBindGroup(2, lightsBindGroup)
        lightingPass.setBindGroup(3, this.#shadowBindGroup)
        lightingPass.setPipeline(this.#lightingPipeline)
        lightingPass.draw(3) // fullscreen triangle

        lightingPass.end()

        // composited into the HDR target so the post chain sees the sky and the
        // geometry/sky silhouette gets antialiased too
        const skyBoxPass = commandEncoder.beginRenderPass(
            this.#skyBoxRenderPassDescriptor
        )
        skyBoxPass.setPipeline(this.#skyBoxPipeline)
        skyBoxPass.setVertexBuffer(0, this.#skyBoxVerticesBuffer)
        skyBoxPass.setBindGroup(0, this.#skyBoxUniformBindGroup)
        skyBoxPass.draw(cubeVertexCount)
        skyBoxPass.end()

        // exposure → ACES tonemap → sRGB; the debug channel views pass through
        // this shader untouched
        const postPass = commandEncoder.beginRenderPass(
            this.#postPassDescriptor
        )

        postPass.setBindGroup(0, this.#viewParamsBindGroup)
        postPass.setBindGroup(1, this.#postBindGroup)
        postPass.setPipeline(this.#postPipeline)
        postPass.draw(3) // fullscreen triangle

        postPass.end()

        if (fxaaEnabled) {
            const fxaaPass = commandEncoder.beginRenderPass(
                this.#fxaaPassDescriptor
            )

            fxaaPass.setBindGroup(0, this.#viewParamsBindGroup)
            fxaaPass.setBindGroup(1, this.#fxaaBindGroup)
            fxaaPass.setPipeline(this.#fxaaPipeline)
            fxaaPass.draw(3) // fullscreen triangle

            fxaaPass.end()
        }

        // the fxaa pass is skipped when AA is off, so its two timestamps are
        // never written — resolve only what this frame actually produced
        const gpuQueryCount = fxaaEnabled ? 14 : 12

        if (gpuTimingThisFrame) {
            commandEncoder.resolveQuerySet(
                this.#timestampQuerySet!,
                0,
                gpuQueryCount,
                this.#timestampResolveBuffer!,
                0
            )
            commandEncoder.copyBufferToBuffer(
                this.#timestampResolveBuffer!,
                0,
                this.#timestampReadbackBuffer!,
                0,
                gpuQueryCount * 8
            )
            this.#timestampReadbackPending = true
        }

        const afterEncode = performance.now()
        Profiler.sample('encode', afterEncode - afterTraverse)

        this.device.queue.submit([commandEncoder.finish()])
        Profiler.sample('submit', performance.now() - afterEncode)

        if (gpuTimingThisFrame) {
            this.#readTimestamps(fxaaEnabled)
        }

        viewParamsUploadBuffer.destroy()
        skyBoxViewParamsUploadBuffer.destroy()
    }

    #readTimestamps(fxaaTimed: boolean) {
        const readbackBuffer = this.#timestampReadbackBuffer!

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
                Profiler.sample('gpu tonemap', durationMs(10, 11))
                // indices 12/13 are only written when the pass ran
                if (fxaaTimed) {
                    Profiler.sample('gpu fxaa', durationMs(12, 13))
                }

                readbackBuffer.unmap()
                this.#timestampReadbackPending = false
            })
            .catch(() => {
                this.#timestampReadbackPending = false
            })
    }
}
