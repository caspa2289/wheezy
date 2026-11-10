import { Profiler } from '../Profiler'
import { DEFAULT_DEPTH_FORMAT, DEFAULT_SWAP_CHAIN_FORMAT } from './constants'

/**
 * GPU adapter/device and the canvas context: everything about *where*
 * rendering happens. The canvas is sized once at init — there is no resize
 * support, so the G-buffer, cluster grid and skybox all share this fixed
 * size for the renderer's lifetime.
 */
export class RendererContext {
    adapter!: GPUAdapter
    device!: GPUDevice
    context!: GPUCanvasContext
    /** timestamp queries are wired only when the profiler runs and the adapter supports them */
    gpuTimingSupported = false

    readonly #canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas
    }

    get canvas() {
        return this.#canvas
    }

    get swapChainFormat() {
        return DEFAULT_SWAP_CHAIN_FORMAT
    }

    get depthTextureFormat() {
        return DEFAULT_DEPTH_FORMAT
    }

    async init() {
        const adapter = await navigator.gpu.requestAdapter()

        if (!adapter) {
            throw new Error('GPU Adapter Unavailable')
        }

        this.gpuTimingSupported =
            Profiler.enabled && adapter.features.has('timestamp-query')

        const device = await adapter.requestDevice({
            requiredFeatures: this.gpuTimingSupported
                ? ['timestamp-query']
                : [],
        })

        this.adapter = adapter
        this.device = device

        const canvas = this.#canvas
        canvas.width = document.body.clientWidth * window.devicePixelRatio
        canvas.height = document.body.clientHeight * window.devicePixelRatio

        const context = canvas.getContext('webgpu') as GPUCanvasContext | null

        if (!context) {
            throw new Error('Failed to acquire GpuCanvasContext')
        }

        context.configure({
            device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format: DEFAULT_SWAP_CHAIN_FORMAT,
        })

        this.context = context
    }

    getCurrentTextureView() {
        return this.context.getCurrentTexture().createView()
    }
}
