import { Vec3 } from 'wgpu-matrix'
import { IMesh } from '../Mesh'
import { IScene } from '../Scene'

export interface IRenderer {
    adapter: GPUAdapter
    device: GPUDevice
    context: GPUCanvasContext
    swapChainFormat: GPUTextureFormat
    depthTextureFormat: GPUTextureFormat
    ambientLightIntensity: number
    ambientLightColor: Vec3

    init: () => Promise<void>
    render: (dt: number, scene: IScene) => void
    buildRenderPipeline: (mesh: IMesh, scene: IScene) => void
}

export interface IRendererProps {
    canvas: HTMLCanvasElement
}
