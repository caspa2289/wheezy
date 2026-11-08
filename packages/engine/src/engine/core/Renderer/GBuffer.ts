export class GBuffer {
    readonly _normal: GPUTextureView
    readonly _albedo: GPUTextureView
    readonly _depth: GPUTextureView
    readonly _metallicRoughness: GPUTextureView
    readonly _emission: GPUTextureView

    constructor(
        device: GPUDevice,
        context: GPUCanvasContext,
        swapChainFormat: GPUTextureFormat,
        depthFormat: GPUTextureFormat
    ) {
        const createTextureView = (format?: GPUTextureFormat) =>
            device
                .createTexture({
                    size: [context.canvas.width, context.canvas.height],
                    usage:
                        GPUTextureUsage.RENDER_ATTACHMENT |
                        GPUTextureUsage.TEXTURE_BINDING,
                    format: format ?? swapChainFormat,
                })
                .createView()

        this._depth = createTextureView(depthFormat)
        this._normal = createTextureView('rgba16float')
        this._albedo = createTextureView()
        this._emission = createTextureView()
        this._metallicRoughness = createTextureView()
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

    get emission() {
        return this._emission
    }
}
