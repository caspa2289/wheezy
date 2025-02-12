import writeGbufferCode from '../../shaders/writeGBuffer.wgsl'

export class GBuffer {
    readonly _normal: GPUTextureView
    readonly _albedo: GPUTextureView
    readonly _depth: GPUTextureView
    readonly _metallicRoughness: GPUTextureView
    readonly _occlusion: GPUTextureView
    readonly _emission: GPUTextureView
    readonly _multiSample: GPUTextureView | undefined

    readonly _renderPipeline: GPURenderPipeline
    readonly _renderPassDescriptor: GPURenderPassDescriptor

    readonly _texturesBindGroupLayout: GPUBindGroupLayout
    readonly _texturesBindGroup: GPUBindGroup

    constructor(
        device: GPUDevice,
        context: GPUCanvasContext,
        msaaSampleCount: number,
        swapChainFormat: GPUTextureFormat,
        depthFormat: GPUTextureFormat,
        materialBindGroupLayout: GPUBindGroupLayout,
        samplerBindGroupLayout: GPUBindGroupLayout,
        uniformsBindGroupLayout: GPUBindGroupLayout,
        nodeParamsBindGroupLayout: GPUBindGroupLayout
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

        const shader = device.createShaderModule({
            code: writeGbufferCode,
        })

        this._renderPipeline = device.createRenderPipeline({
            label: 'g buffer write pipeline',
            layout: device.createPipelineLayout({
                bindGroupLayouts: [
                    uniformsBindGroupLayout,
                    nodeParamsBindGroupLayout,
                    materialBindGroupLayout,
                    samplerBindGroupLayout,
                ],
            }),
            vertex: {
                entryPoint: 'vertex_main',
                module: shader,
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
                entryPoint: 'fragment_main',
                module: shader,
                targets: [
                    // normal
                    { format: 'rgba16float' },
                    // albedo
                    { format: swapChainFormat },
                    //emission
                    { format: swapChainFormat },
                    //metallicRoughness
                    { format: swapChainFormat },
                    //occlusion
                    { format: swapChainFormat },
                ],
            },
            primitive: {
                topology: 'triangle-list',
                stripIndexFormat: undefined,
                cullMode: 'back',
            },
            depthStencil: {
                format: depthFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {
                count: msaaSampleCount,
            },
        })

        this._renderPassDescriptor = {
            label: 'g buffer render pass descriptor',
            colorAttachments: [
                {
                    view: this._normal,

                    clearValue: [0.0, 0.0, 1.0, 1.0],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: this._albedo,

                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: this._emission,

                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: this._metallicRoughness,

                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
                {
                    view: this._occlusion,

                    clearValue: [0, 0, 0, 1],
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this._depth,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
        }

        this._texturesBindGroupLayout = device.createBindGroupLayout({
            label: 'g buffer textures bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                    },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                    },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                    },
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'depth',
                    },
                },
            ],
        })

        this._texturesBindGroup = device.createBindGroup({
            label: 'g buffer textures bind group',
            layout: this.texturesBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: this._normal,
                },
                {
                    binding: 1,
                    resource: this._albedo,
                },
                {
                    binding: 2,
                    resource: this._emission,
                },
                {
                    binding: 3,
                    resource: this._metallicRoughness,
                },
                {
                    binding: 4,
                    resource: this._occlusion,
                },
                {
                    binding: 5,
                    resource: this._depth,
                },
            ],
        })
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

    get renderPipeline() {
        return this._renderPipeline
    }

    get renderPassDescriptor() {
        return this._renderPassDescriptor
    }

    get texturesBindGroupLayout() {
        return this._texturesBindGroupLayout
    }

    get texturesBindgroup() {
        return this._texturesBindGroup
    }
}
