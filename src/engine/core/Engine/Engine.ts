import { IScene, IEngine, IEngineProps } from '../../types'
import {
    DEFAULT_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'

export class Engine implements IEngine {
    private _adapter!: GPUAdapter
    private _device!: GPUDevice
    private _context!: GPUCanvasContext

    private _swapChainFormat!: GPUTextureFormat
    private _depthTextureFormat!: GPUTextureFormat
    private _depthTexture!: GPUTexture

    private _uniformsBGLayout!: GPUBindGroupLayout
    private _nodeParamsBGLayout!: GPUBindGroupLayout

    private _viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE

    private _scene?: IScene

    constructor({ canvas, swapChainFormat, depthTextureFormat }: IEngineProps) {
        this._initializeContext(canvas, swapChainFormat, depthTextureFormat)

        //FIXME: types
        ;(window as any).WheezyEngine = this
    }

    get adapter() {
        return this._adapter
    }

    get device() {
        return this._device
    }

    get context() {
        return this._context
    }

    get swapChainFormat() {
        return this._swapChainFormat
    }

    set swapChainFormat(format: GPUTextureFormat) {
        this._swapChainFormat = format
        this._context.configure({
            device: this._device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format,
        })
    }

    get depthTextureFormat() {
        return this._depthTextureFormat
    }

    set depthTextureFormat(format: GPUTextureFormat) {
        this._depthTextureFormat = format
        this._depthTexture = this._device.createTexture({
            size: {
                width: this._context.canvas.width,
                height: this._context.canvas.height,
                depthOrArrayLayers: 1,
            },
            format,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })
    }

    get depthTexture() {
        return this._depthTexture
    }

    get scene() {
        return this._scene
    }

    set scene(scene: IScene | undefined) {
        this._scene = scene
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

    private _initializeContext(
        canvas: HTMLCanvasElement,
        swapChainFormat: GPUTextureFormat | undefined,
        depthTextureFormat?: GPUTextureFormat | undefined
    ) {
        navigator.gpu
            .requestAdapter()
            .then((adapter) => {
                if (!adapter) {
                    throw new Error('GPU Adapter Unavailable')
                }

                adapter.requestDevice().then((device) => {
                    this._device = device
                    this._adapter = adapter

                    canvas.width =
                        document.body.clientWidth * window.devicePixelRatio
                    canvas.height =
                        document.body.clientHeight * window.devicePixelRatio

                    this._context = canvas.getContext(
                        'webgpu'
                    ) as GPUCanvasContext

                    if (!this._context) {
                        throw new Error('Failed to acquire GpuCanvasContext')
                    }

                    this.swapChainFormat =
                        swapChainFormat ?? DEFAULT_SWAP_CHAIN_FORMAT
                    this.depthTextureFormat =
                        depthTextureFormat ?? DEFAULT_DEPTH_FORMAT
                    this._initializeBindGroupLayouts()
                })
            })
            .catch((err) => alert(err))
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
}
