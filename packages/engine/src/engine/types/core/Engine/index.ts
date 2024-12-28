import { IRenderer } from '../Renderer'
import { IScene } from '../Scene'

export interface IEngine {
    scene?: IScene
    renderer: IRenderer

    render: (time: number) => void
}

export interface IEngineProps {
    canvas: HTMLCanvasElement
}
