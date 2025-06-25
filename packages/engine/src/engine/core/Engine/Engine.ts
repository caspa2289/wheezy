import {
    IScene,
    IEngine,
    IEngineProps,
    IRenderer,
    IAnimator,
} from '../../types'
import { Animator } from '../Animator'
import { Renderer } from '../Renderer'

export class Engine implements IEngine {
    private _renderer!: IRenderer

    private _prevFrameTime: number = 0

    private _scene?: IScene

    private _animator!: IAnimator

    protected async initRenderer(canvas: HTMLCanvasElement) {
        this._renderer = new Renderer({ canvas })
        await this._renderer.init()
    }

    protected initAnimator(device: GPUDevice) {
        this._animator = new Animator(device)
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

            engineInstance.initAnimator(engineInstance.renderer.device)
            ;(window as any).WheezyEngine = engineInstance

            return engineInstance
        } catch (err) {
            alert(err)
        }
    }

    get animator() {
        return this._animator
    }

    get renderer() {
        return this._renderer
    }

    get scene() {
        return this._scene
    }

    set scene(scene: IScene | undefined) {
        this._scene = scene
    }

    public render(time: number = 0) {
        if (!this.scene) return

        const dt = (time - this._prevFrameTime) / 100
        this._prevFrameTime = time

        this._renderer.render(dt, this.scene)

        requestAnimationFrame((time: number) => this.render(time))
    }
}
