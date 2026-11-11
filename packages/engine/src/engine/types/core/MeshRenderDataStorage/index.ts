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
    /** geometry-pass pipeline variant of this mesh (skinning/morph overrides) */
    geometryPipeline: GPURenderPipeline
    /**
     * JOINTS_0 vertex buffer — the shared zero-filled dummy for unskinned
     * meshes (the attribute is statically used by every pipeline variant)
     */
    jointsBuffer: GPUBuffer
    /** WEIGHTS_0 vertex buffer — dummy for unskinned meshes, see jointsBuffer */
    weightsBuffer: GPUBuffer
    /**
     * skinParams group of this mesh (joint palette + morph weights + morph
     * deltas), bound with a dynamic offset into the anim-draw slot buffer;
     * the shared dummy group for unskinned/unmorphed meshes
     */
    skinParamsBindGroup: GPUBindGroup
    /** slot of this mesh in the anim-draw index buffer; 0 = the dummy slot */
    animSlotIndex: number
    /** block of this mesh in the shared morph-weights buffer; -1 without morph targets */
    morphBase: number
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
