import { mat4, Mat4, vec3, vec4 } from 'wgpu-matrix'
import {
    EntityTypes,
    GLTFAccessor,
    IMesh,
    IRenderer,
    IRendererProps,
    IScene,
    RENDER_MODES,
    RENDER_OUTPUT_SOURCES,
    SceneNodeContent,
    TSkyboxBitmaps,
} from '../../types'
import {
    DEFAULT_DEPTH_FORMAT,
    DEFAULT_SHADOW_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    DEFULT_SHADOW_TEXTURE_SIZE,
    MSAA_SAMPLE_COUNT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'
import { IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import shaderCode from '../../shaders/testShader.wgsl'
import shadowShaderCode from '../../shaders/vertexShadow.wgsl'
import skyboxShaderCode from '../../shaders/skybox.wgsl'
import {
    cubePositionOffset,
    cubeUVOffset,
    cubeVertexArray,
    cubeVertexCount,
    cubeVertexSize,
} from '../../primitives/cube'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

const skyBoxUniformBufferSize = 4 * 16 + 4 * 16 + 4 * 16 + 4 * 4

class GBuffer {
    readonly _normal: GPUTextureView
    readonly _albedo: GPUTextureView
    readonly _depth: GPUTextureView
    readonly _metallicRoughness: GPUTextureView
    readonly _occlusion: GPUTextureView
    readonly _emission: GPUTextureView
    readonly _multiSample: GPUTextureView | undefined

    constructor(
        device: GPUDevice,
        context: GPUCanvasContext,
        msaaSampleCount: number,
        swapChainFormat: GPUTextureFormat,
        depthFormat: GPUTextureFormat
    ) {
        const createTextureView = (
            sampleCount?: number,
            format?: GPUTextureFormat
        ) =>
            device
                .createTexture({
                    size: [context.canvas.width, context.canvas.height],
                    sampleCount,
                    usage:
                        GPUTextureUsage.RENDER_ATTACHMENT |
                        GPUTextureUsage.TEXTURE_BINDING,
                    format: format ?? swapChainFormat,
                })
                .createView()

        this._multiSample =
            msaaSampleCount !== 1
                ? createTextureView(msaaSampleCount)
                : undefined
        this._depth = createTextureView(msaaSampleCount, depthFormat)
        this._normal = createTextureView(undefined, 'rgba16float')
        this._albedo = createTextureView()
        this._emission = createTextureView()
        this._metallicRoughness = createTextureView()
        this._occlusion = createTextureView()
    }

    get normal() {
        return this._normal
    }

    get albedo() {
        return this._albedo
    }

    get depth() {
        return this._depth
    }

    get metallicRoughness() {
        return this._metallicRoughness
    }

    get occlusion() {
        return this._occlusion
    }

    get emission() {
        return this._emission
    }

    get multiSample() {
        return this._multiSample
    }
}

export class Renderer implements IRenderer {
    private _adapter!: GPUAdapter
    private _device!: GPUDevice
    private _context!: GPUCanvasContext
    private _canvas: HTMLCanvasElement
    private _gBuffer!: GBuffer

    private _shadowDepthTexture!: GPUTexture
    private _shadowDepthTextureView!: GPUTextureView
    private _shadowDepthTextureSize = DEFULT_SHADOW_TEXTURE_SIZE
    private _shadowDepthSampler!: GPUSampler

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

    private _uniformsBGLayout!: GPUBindGroupLayout
    private _nodeParamsBGLayout!: GPUBindGroupLayout

    private _viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE
    private _msaaSampleCount: number = MSAA_SAMPLE_COUNT

    private _renderPassDescriptor!: GPURenderPassDescriptor
    private _shadowPassDescriptor!: GPURenderPassDescriptor

    private _viewParamsBuffer!: GPUBuffer
    private _viewParamsBindGroup!: GPUBindGroup

    private _debugParamsBuffer!: GPUBuffer

    private _shaderModule!: GPUShaderModule

    public ambientLightColor = vec3.create(1, 1, 1)
    public ambientLightIntensity: number = 0.03

    public outputSource = RENDER_OUTPUT_SOURCES.DEFAULT
    public renderingMode = RENDER_MODES.USE_F_NORMAL

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
            this._msaaSampleCount,
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

        this._shaderModule = this.device.createShaderModule({
            label: 'main shader',
            code: shaderCode,
        })

        this._initializeBindGroupLayouts()

        this._initializeViewParams()

        this._renderPassDescriptor = {
            label: 'main render pass descriptor',
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView,
                    resolveTarget: (this._msaaSampleCount === 1
                        ? undefined
                        : null) as unknown as GPUTextureView,
                    loadOp: 'load' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this._gBuffer.depth,
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
                stencilLoadOp: 'clear' as GPULoadOp,
                stencilClearValue: 0,
                stencilStoreOp: 'store' as GPUStoreOp,
            },
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
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: this.depthTextureFormat,
            },
            multisample: {
                count: this._msaaSampleCount,
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
                    view: null as unknown as GPUTextureView, // Assigned later
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this._gBuffer.depth,
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
                stencilLoadOp: 'clear' as GPULoadOp,
                stencilClearValue: 0,
                stencilStoreOp: 'store' as GPUStoreOp,
            },
        }

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
            const imageBitmap = bitmaps[i]
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
        this._uniformsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
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

    private async _initializeContext(canvas: HTMLCanvasElement) {
        const adapter = await navigator.gpu.requestAdapter()

        if (!adapter) {
            throw new Error('GPU Adapter Unavailable')
        }

        const device = await adapter.requestDevice()

        this._device = device
        this._adapter = adapter

        canvas.width = document.body.clientWidth * window.devicePixelRatio
        canvas.height = document.body.clientHeight * window.devicePixelRatio

        this._context = canvas.getContext('webgpu') as GPUCanvasContext

        if (!this._context) {
            throw new Error('Failed to acquire GpuCanvasContext')
        }
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

        const sampleType = 'float'

        const vertexState: GPUVertexState = {
            module: this._shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    //TODO: figure out a way to make bytestrides constant
                    arrayStride: mesh.positions.byteStride,
                    attributes: [
                        {
                            format: mesh.positions.elementType,
                            offset: 0,
                            shaderLocation: 0,
                        },
                    ],
                },
                {
                    arrayStride: mesh.textureCoordinates.byteStride,
                    attributes: [
                        {
                            format: mesh.textureCoordinates.elementType,
                            offset: 0,
                            shaderLocation: 1,
                        },
                    ],
                },
                {
                    arrayStride: mesh.normals.byteStride,
                    attributes: [
                        {
                            format: mesh.normals.elementType,
                            offset: 0,
                            shaderLocation: 2,
                        },
                    ],
                },
                {
                    arrayStride: mesh.tangents.byteStride,
                    attributes: [
                        {
                            format: mesh.tangents.elementType,
                            offset: 0,
                            shaderLocation: 3,
                        },
                    ],
                },
            ],
        }

        const fragmentState: GPUFragmentState = {
            module: this._shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format: this.swapChainFormat }],
        }

        const primitive: GPUPrimitiveState = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
            cullMode: 'back',
        }

        //REFACTOR: this is constant now
        const materialBindGroupLayout = this.device.createBindGroupLayout({
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
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'depth',
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
            ],
        })

        const samplerBindGroupLayout = this.device.createBindGroupLayout({
            label: 'samplerBindGroupLayout',
            entries: [
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {
                        type: 'comparison',
                    },
                },
                {
                    binding: 6,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
            ],
        })

        meshDataEntry.samplerBindGroup = this.device.createBindGroup({
            label: 'sampler bindgroup',
            layout: samplerBindGroupLayout,
            entries: [
                {
                    binding: 1,
                    resource: mesh.material.baseColorTexture.sampler,
                },
                {
                    binding: 2,
                    resource: mesh.material.metallicRoughnessTexture.sampler,
                },
                {
                    binding: 3,
                    resource: mesh.material.normalTexture.sampler,
                },
                {
                    binding: 4,
                    resource: mesh.material.occlusionTexture.sampler,
                },
                {
                    binding: 5,
                    resource: this._shadowDepthSampler,
                },
                {
                    binding: 6,
                    resource: this._skyboxSampler,
                },
                {
                    binding: 7,
                    resource: mesh.material?.emissiveTexture.sampler,
                },
            ],
        })

        meshDataEntry.materialBindGroup = this.device.createBindGroup({
            label: 'material bindgroup',
            layout: materialBindGroupLayout,
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
                    binding: 5,
                    resource: this._shadowDepthTextureView,
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
            ],
        })

        const layout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this._uniformsBGLayout,
                this._nodeParamsBGLayout,
                materialBindGroupLayout,
                samplerBindGroupLayout,
            ],
        })

        //FIXME: this should not be created per mesh when all stuff is stubbed
        meshDataEntry.shadowRenderPipeline = this.device.createRenderPipeline({
            label: 'shadow render pipeline',
            layout: this.device.createPipelineLayout({
                label: 'shadow render pipeline layout',
                bindGroupLayouts: [
                    this._uniformsBGLayout,
                    this._nodeParamsBGLayout,
                ],
            }),
            vertex: {
                module: this.device.createShaderModule({
                    label: 'shadow shader module',
                    code: shadowShaderCode,
                }),
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

        meshDataEntry.renderPipeline = this.device.createRenderPipeline({
            label: 'main render pipeline',
            layout: layout,
            vertex: vertexState,
            fragment: fragmentState,
            primitive: primitive,
            depthStencil: {
                format: this.depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {
                count: this._msaaSampleCount,
            },
        })

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
            renderPipeline,
            materialBindGroup,
            samplerBindGroup,
            positionsBuffer,
            textureCoordinatesBuffer,
            tangentsBuffer,
            normalsBuffer,
            indicesBuffer,
            nodeParamsBindGroup,
        } = scene.meshRenderDataStorage.data.get(mesh.id) as IMeshRenderData

        renderPassEncoder.setBindGroup(1, nodeParamsBindGroup as GPUBindGroup)

        renderPassEncoder.setPipeline(renderPipeline as GPURenderPipeline)

        renderPassEncoder.setBindGroup(2, materialBindGroup)

        renderPassEncoder.setBindGroup(3, samplerBindGroup)

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
        scene.onRender(deltaTime)

        const meshesToRender: IMesh[] = []

        const debugInfoArray = new ArrayBuffer(4 + 4)
        const debugInfoView = new DataView(
            debugInfoArray,
            0,
            debugInfoArray.byteLength
        )

        debugInfoView.setUint32(0, this.outputSource, true)
        debugInfoView.setUint32(4, this.renderingMode, true)

        const viewParamsUploadBuffer = this.device.createBuffer({
            size: this._viewParamsBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const viewMap = new Float32Array(
            viewParamsUploadBuffer.getMappedRange()
        )

        viewMap.set(scene.camera.projectionMatrix)
        viewMap.set(scene.camera.view, 16)
        viewMap.set(scene.camera.position, 32)
        //FIXME: this will be an array of lights in the scene
        viewMap.set(scene.light.projectionMatrix, 36)
        viewMap.set(scene.light.viewMatrix, 52)
        viewMap.set(scene.light.position, 68)
        viewMap.set(
            vec4.create(...this.ambientLightColor, this.ambientLightIntensity),
            72
        )

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
        ;(this._renderPassDescriptor as any).colorAttachments[0].view =
            this.context.getCurrentTexture().createView()
        if (this._msaaSampleCount !== 1) {
            ;(this._renderPassDescriptor as any).colorAttachments[0].view =
                this._gBuffer.multiSample
            ;(
                this._renderPassDescriptor as any
            ).colorAttachments[0].resolveTarget = this.context
                .getCurrentTexture()
                .createView()
        }

        ;(this._skyBoxRenderPassDescriptor as any).colorAttachments[0].view =
            this.context.getCurrentTexture().createView()
        if (this._msaaSampleCount !== 1) {
            ;(
                this._skyBoxRenderPassDescriptor as any
            ).colorAttachments[0].view = this._gBuffer.multiSample
            ;(
                this._renderPassDescriptor as any
            ).colorAttachments[0].resolveTarget = this.context
                .getCurrentTexture()
                .createView()
        }

        const skyBoxPass = commandEncoder.beginRenderPass(
            this._skyBoxRenderPassDescriptor
        )
        skyBoxPass.setPipeline(this._skyBoxPipeline)
        skyBoxPass.setVertexBuffer(0, this._skyBoxVerticesBuffer)
        skyBoxPass.setBindGroup(0, this._skyBoxUniformBindGroup)
        skyBoxPass.draw(cubeVertexCount)
        skyBoxPass.end()

        const shadowPass = commandEncoder.beginRenderPass(
            this._shadowPassDescriptor
        )

        shadowPass.setBindGroup(0, this._viewParamsBindGroup)

        meshesToRender.forEach((mesh) => {
            this.renderMeshShadows(mesh, scene, shadowPass)
        })

        shadowPass.end()

        const renderPass = commandEncoder.beginRenderPass(
            this._renderPassDescriptor
        )

        renderPass.setBindGroup(0, this._viewParamsBindGroup)

        //FIXME: move samplers and textures back to the same bindgroup
        meshesToRender.forEach((mesh) => {
            this.renderMesh(mesh, scene, renderPass)
        })

        renderPass.end()

        this.device.queue.submit([commandEncoder.finish()])
        viewParamsUploadBuffer.destroy()
        skyBoxViewParamsUploadBuffer.destroy()
    }
}
