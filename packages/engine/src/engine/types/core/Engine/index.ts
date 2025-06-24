import { IAnimator } from '../Animator'
import { IRenderer } from '../Renderer'
import { IScene } from '../Scene'

export interface IEngine {
    scene?: IScene
    renderer: IRenderer
    animator: IAnimator

    render: (time?: number) => void
}

export interface IEngineProps {
    canvas: HTMLCanvasElement
}
