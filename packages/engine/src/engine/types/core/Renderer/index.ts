import { IMesh } from '../Mesh'
import { IScene } from '../Scene'

export interface IRenderer {
    adapter: GPUAdapter
    device: GPUDevice
    context: GPUCanvasContext
    swapChainFormat: GPUTextureFormat
    depthTextureFormat: GPUTextureFormat
    depthTexture: GPUTexture
    uniformsBGLayout: GPUBindGroupLayout
    nodeParamsBGLayout: GPUBindGroupLayout
    viewParamsBufferSize: number
    msaaSampleCount: number
    renderPassDescriptor: GPURenderPassDescriptor
    viewParamsBuffer: GPUBuffer
    viewParamsBindGroup: GPUBindGroup
    multisampleTextureView?: GPUTextureView

    init: () => Promise<void>
    render: (dt: number, scene: IScene) => void
    buildRenderPipeline: (mesh: IMesh, scene: IScene) => void
}

export interface IRendererProps {
    canvas: HTMLCanvasElement
}
