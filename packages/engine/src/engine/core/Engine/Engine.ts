import {
    type IScene,
    type IEngine,
    type IEngineProps,
    type IRenderer,
} from '../../types'
import { Renderer } from '../Renderer'
import { Profiler } from '../Profiler'

export class Engine implements IEngine {
    #renderer!: IRenderer

    #prevFrameTime: number = 0

    #frameScheduled = false

    #scene?: IScene

    public async initRenderer(canvas: HTMLCanvasElement) {
        this.#renderer = new Renderer({ canvas })
        await this.#renderer.init()
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
        return this.#renderer
    }

    get scene() {
        return this.#scene
    }

    set scene(scene: IScene | undefined) {
        this.#scene = scene
    }

    public render(time: number = 0) {
        if (!this.scene) return

        // scheduled before the frame body, and at most one callback outstanding:
        // an exception in a scene's onRender or in the renderer must not kill the
        // loop (a dead chain looks like a frozen tab with one console error), and
        // an external render() call must not start a second chain
        if (!this.#frameScheduled) {
            this.#frameScheduled = true
            requestAnimationFrame((t: number) => {
                this.#frameScheduled = false
                this.render(t)
            })
        }

        const frameDelta = time - this.#prevFrameTime
        const dt = frameDelta / 100
        if (this.#prevFrameTime && frameDelta > 0) {
            Profiler.sample('frame', frameDelta)
            Profiler.sample('fps', 1000 / frameDelta)
        }
        this.#prevFrameTime = time

        this.#renderer.render(dt, this.scene)
    }
}
