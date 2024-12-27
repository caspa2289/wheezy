import { IScene, IEngine, IEngineProps, IRenderer } from '../../types'
import { Renderer } from '../Renderer'

export class Engine implements IEngine {
    private _renderer!: IRenderer

    private _prevFrameTime: number = 0

    private _scene?: IScene

    public async initRenderer(canvas: HTMLCanvasElement) {
        this._renderer = new Renderer({ canvas })
        await this._renderer.init()
    }

    public static async getOrInit({
        canvas,
    }: IEngineProps): Promise<Engine | undefined> {
        //FIXME: types
        try {
            if ((window as any).WheezyEngine) {
                console.warn('Engine has already been instanced')
                return (window as any).WheezyEngine as Engine
            }

            const engineInstance = new Engine()
            await engineInstance.initRenderer(canvas)
            ;(window as any).WheezyEngine = engineInstance

            return engineInstance
        } catch (err) {
            alert(err)
        }
    }

    get adapter() {
        return this._renderer.adapter
    }

    get device() {
        return this._renderer.device
    }

    get context() {
        return this._renderer.context
    }

    get swapChainFormat() {
        return this._renderer.swapChainFormat
    }

    get depthTextureFormat() {
        return this._renderer.depthTextureFormat
    }

    get depthTexture() {
        return this._renderer.depthTexture
    }

    get scene() {
        return this._scene
    }

    set scene(scene: IScene | undefined) {
        this._scene = scene
    }

    get uniformsBGLayout() {
        return this._renderer.uniformsBGLayout
    }

    get nodeParamsBGLayout() {
        return this._renderer.nodeParamsBGLayout
    }

    get viewParamsBufferSize() {
        return this._renderer.viewParamsBufferSize
    }

    get msaaSampleCount() {
        return this._renderer.msaaSampleCount
    }

    public render(time: number = 0) {
        if (!this.scene) return

        const dt = (time - this._prevFrameTime) / 100
        this._prevFrameTime = time

        this.scene.render(dt)
        requestAnimationFrame((time: number) => this.render(time))
    }
}
