export interface IMeshRenderDataStorage {
    data: Map<string, IMeshRenderData>
}

export interface IMeshRenderData {
    positionsBuffer: GPUBuffer
    indicesBuffer: GPUBuffer
    textureCoordinatesBuffer: GPUBuffer
    tangentsBuffer: GPUBuffer
    normalsBuffer: GPUBuffer
    materialParamsBuffer: GPUBuffer
    materialBindGroup: GPUBindGroup
    // shadowPointRenderPipeline: GPURenderPipeline
    nodeParamsBindGroup: GPUBindGroup
}
