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
    shadowRenderPipeline: GPURenderPipeline
    /**
     * slot of this mesh's node world matrix in the shared node-matrices
     * storage buffer — reassigned every frame by the scene traversal; draws
     * select it through the dynamic-offset node index uniform (group 1)
     */
    nodeIndex: number
    /** stable ids used to sort the draw lists for hoisted state changes */
    materialSortId: number
    shadowPipelineSortId: number
}
