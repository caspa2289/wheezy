import { IRenderer, IRendererProps } from '../../types'
import {
    DEFAULT_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    MSAA_SAMPLE_COUNT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'

export class Renderer implements IRenderer {
    private _adapter!: GPUAdapter
    private _device!: GPUDevice
    private _context!: GPUCanvasContext
    private _canvas: HTMLCanvasElement

    private _swapChainFormat: GPUTextureFormat = DEFAULT_SWAP_CHAIN_FORMAT
    private _depthTextureFormat: GPUTextureFormat = DEFAULT_DEPTH_FORMAT
    private _depthTexture!: GPUTexture

    private _uniformsBGLayout!: GPUBindGroupLayout
    private _nodeParamsBGLayout!: GPUBindGroupLayout

    private _viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE
    private _msaaSampleCount: number = MSAA_SAMPLE_COUNT

    constructor({ canvas }: IRendererProps) {
        this._canvas = canvas
    }

    public async init() {
        await this._initializeContext(this._canvas)

        this._context.configure({
            device: this._device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format: this._swapChainFormat,
        })

        this._depthTexture = this._device.createTexture({
            label: 'depthTexture',
            size: {
                width: this._context.canvas.width,
                height: this._context.canvas.height,
            },
            sampleCount: this._msaaSampleCount,
            format: this._depthTextureFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })

        this._initializeBindGroupLayouts()
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
        return this._swapChainFormat
    }

    get depthTextureFormat() {
        return this._depthTextureFormat
    }

    get depthTexture() {
        return this._depthTexture
    }

    get uniformsBGLayout() {
        return this._uniformsBGLayout
    }

    get nodeParamsBGLayout() {
        return this._nodeParamsBGLayout
    }

    get viewParamsBufferSize() {
        return this._viewParamsBufferSize
    }

    get msaaSampleCount() {
        return this._msaaSampleCount
    }

    private _initializeBindGroupLayouts() {
        this._uniformsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'uniform' },
                },
            ],
        })

        this._nodeParamsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
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
}
