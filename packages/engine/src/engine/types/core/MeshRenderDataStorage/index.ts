export interface IMeshRenderDataStorage {
    data: Map<string, IMeshRenderData>
}

export interface IMeshRenderData {
    positionsBuffer?: GPUBuffer
    indicesBuffer?: GPUBuffer
    textureCoordinatesBuffer?: GPUBuffer
    normalsBuffer?: GPUBuffer
    materialParamsBuffer?: GPUBuffer
    materialBindGroup?: GPUBindGroup
    samplerBindGroup?: GPUBindGroup
    renderPipeline: GPURenderPipeline
    nodeParamsBindGroup: GPUBindGroup
}
