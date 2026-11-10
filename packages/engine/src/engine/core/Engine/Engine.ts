import { type IScene, type IEngine, type IRenderer } from '../../types'
import { Renderer } from '../Renderer'
import { Profiler } from '../Profiler'
import { setSceneGlobal } from '../globals'

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

    get renderer() {
        return this.#renderer
    }

    get scene() {
        return this.#scene
    }

    set scene(scene: IScene | undefined) {
        this.#scene = scene
        setSceneGlobal(scene)
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
