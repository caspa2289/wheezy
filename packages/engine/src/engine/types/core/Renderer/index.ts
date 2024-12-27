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

    init: () => Promise<void>
}

export interface IRendererProps {
    canvas: HTMLCanvasElement
}
