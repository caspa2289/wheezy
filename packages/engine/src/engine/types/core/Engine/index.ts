import { type IRenderer } from '../Renderer'
import { type IScene } from '../Scene'

export interface IEngine {
    scene?: IScene
    renderer: IRenderer

    render: (time?: number) => void
}

export interface IEngineProps {
    canvas: HTMLCanvasElement
}
