import {
    type IScene,
    type IEngine,
    type IEngineProps,
    type IRenderer,
} from '../../types'
import { Renderer } from '../Renderer'
import { Profiler } from '../Profiler'

export class Engine implements IEngine {
    private _renderer!: IRenderer

    private _prevFrameTime: number = 0

    private _scene?: IScene

    public async initRenderer(canvas: HTMLCanvasElement) {
        this._renderer = new Renderer({ canvas })
        await this._renderer.init()
        Profiler.start()
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

        const frameDelta = time - this._prevFrameTime
        const dt = frameDelta / 100
        if (this._prevFrameTime && frameDelta > 0) {
            Profiler.sample('frame', frameDelta)
            Profiler.sample('fps', 1000 / frameDelta)
        }
        this._prevFrameTime = time

        this._renderer.render(dt, this.scene)

        requestAnimationFrame((time: number) => this.render(time))
    }
}
