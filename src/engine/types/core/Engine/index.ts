import { IScene } from '../Scene'

export interface IEngine {
    adapter: GPUAdapter
    device: GPUDevice
    context: GPUCanvasContext
    swapChainFormat: GPUTextureFormat
    depthTextureFormat: GPUTextureFormat
    depthTexture: GPUTexture
    scene?: IScene
    uniformsBGLayout: GPUBindGroupLayout
    nodeParamsBGLayout: GPUBindGroupLayout
    viewParamsBufferSize: number
}

export interface IEngineProps {
    canvas: HTMLCanvasElement
    swapChainFormat?: GPUTextureFormat
    depthTextureFormat?: GPUTextureFormat
}