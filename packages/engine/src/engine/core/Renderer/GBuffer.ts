export class GBuffer {
    readonly _normal: GPUTextureView
    readonly _albedo: GPUTextureView
    readonly _depth: GPUTextureView
    readonly _metallicRoughness: GPUTextureView
    readonly _occlusion: GPUTextureView
    readonly _emission: GPUTextureView
    readonly _multiSample: GPUTextureView | undefined
    // readonly _renderPipeline: GPURenderPipeline

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

        //     this._renderPipeline = device.createRenderPipeline({
        //         layout: 'auto',
        //         vertex: {
        //             module: device.createShaderModule({
        //                 code: vertexWriteGBuffers,
        //             }),
        //             buffers: vertexBuffersLayout,
        //         },
        //         fragment: {
        //             module: device.createShaderModule({
        //                 code: fragmentWriteGBuffers,
        //             }),
        //             targets: [
        //                 // normal
        //                 { format: 'rgba16float' },
        //                 // albedo
        //                 { format: 'bgra8unorm' },
        //             ],
        //         },
        //         depthStencil: {
        //             depthWriteEnabled: true,
        //             depthCompare: 'less',
        //             format: 'depth24plus',
        //         },
        //         primitive,
        //     })
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

    // get renderPipeline() {
    //     return this._renderPipeline
    // }
}
