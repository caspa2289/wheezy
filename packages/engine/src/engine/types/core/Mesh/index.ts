import { type IComponent } from '../Component'
import { EntityTypes, type EntityID } from '../Entity'
import { type IGameObject } from '../GameObject'
import { type Vec3, type Vec4 } from 'wgpu-matrix'

export interface GLTFBufferData {
    id: string
    buffer: GPUBuffer
}

export interface IMaterialTexture {
    view: GPUTextureView
    sampler: GPUSampler
}

export interface IMaterial {
    name?: string

    baseColorTexture: IMaterialTexture
    metallicRoughnessTexture: IMaterialTexture
    normalTexture: IMaterialTexture
    emissiveTexture: IMaterialTexture
    occlusionTexture: IMaterialTexture

    metallicFactor: number
    roughnessFactor: number

    emissiveFactor: Vec3
    baseColorFactor: Vec4
}

export interface GLTFAccessor {
    byteStride: number
    count: number
    componentType: number
    elementType: GPUVertexFormat //FIXME: could be GPUIndexFormat
    byteOffset: number
    byteLength: number
    bufferId: GLTFBufferData['id']
    min?: number[]
    max?: number[]
    usage: GPUBufferUsageFlags
}

/**
 * glTF skin: the joint nodes and their inverse bind matrices. Shared by every
 * primitive of one glTF mesh; `paletteOffset` is assigned lazily by the
 * renderer when the first mesh using the skin is built.
 */
export interface ISkin {
    name?: string
    /** joint nodes, in joint-index order */
    joints: IGameObject[]
    /** ids of the joint nodes — the scene traversal records node indices for these */
    jointIds: EntityID[]
    /** jointCount × 16 floats, column-major mat4 per joint */
    inverseBindMatrices: Float32Array
    jointCount: number
    /** first joint slot of this skin in the shared palette buffer; -1 until assigned */
    paletteOffset: number
}

/** morph target deltas of one mesh primitive (glTF `targets`) */
export interface IMorphTargets {
    /** one POSITION delta accessor per target */
    positions: GLTFAccessor[]
    /** one NORMAL delta accessor per target (undefined = zero deltas) */
    normals: (GLTFAccessor | undefined)[]
    targetCount: number
    vertexCount: number
}

export interface IMesh extends IComponent<EntityTypes.mesh> {
    //https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-mesh-primitive
    normals: GLTFAccessor
    tangents: GLTFAccessor
    indices: GLTFAccessor
    textureCoordinates: GLTFAccessor
    material: IMaterial //if not present in the file, a default material should be used
    positions: GLTFAccessor
    mode: number //gpu topology - default is 4 (triangles)
    isPipelineBuilt: boolean
    /** drawn into the shadow atlas tiles; false for helper geometry (gizmos) */
    castShadow: boolean
    /** JOINTS_0 accessor — skinned meshes only */
    joints?: GLTFAccessor
    /** WEIGHTS_0 accessor — skinned meshes only */
    weights?: GLTFAccessor
    /**
     * when set the mesh is skinned: its world transform comes from the joint
     * palette and its own node matrix is ignored (glTF spec)
     */
    skin?: ISkin
    morphTargets?: IMorphTargets
    /**
     * live morph target weights (MAX_MORPH_TARGETS floats, rest zero) —
     * written by the animation mixer, uploaded to the GPU every frame
     */
    morphWeights?: Float32Array
}
