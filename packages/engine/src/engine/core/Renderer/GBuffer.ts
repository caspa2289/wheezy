import { HDR_TARGET_FORMAT } from './constants'

export class GBuffer {
    readonly #normal: GPUTextureView
    readonly #albedo: GPUTextureView
    readonly #depth: GPUTextureView
    readonly #metallicRoughness: GPUTextureView
    readonly #emission: GPUTextureView
    readonly #litColor: GPUTextureView
    readonly #postColor: GPUTextureView

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

        this.#depth = createTextureView(depthFormat)
        this.#normal = createTextureView('rgba16float')
        this.#albedo = createTextureView()
        this.#emission = createTextureView()
        this.#metallicRoughness = createTextureView()
        // HDR target of the lighting pass, consumed by the tonemapping post pass.
        // Not part of the geometry MRT set, so it does not count against
        // maxColorAttachmentBytesPerSample; rgba16float keeps intensities above 1.
        this.#litColor = createTextureView(HDR_TARGET_FORMAT)
        // tonemapped LDR result: the FXAA pass reads this (luma in .a) and writes
        // the swapchain. Skipped when anti-aliasing is off — the tonemap pass then
        // targets the swapchain directly.
        this.#postColor = createTextureView()
    }

    get normal() {
        return this.#normal
    }

    get albedo() {
        return this.#albedo
    }

    get depth() {
        return this.#depth
    }

    get metallicRoughness() {
        return this.#metallicRoughness
    }

    get emission() {
        return this.#emission
    }

    get litColor() {
        return this.#litColor
    }

    get postColor() {
        return this.#postColor
    }
}
