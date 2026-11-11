import { type Mat4, type Vec3, type Vec4 } from 'wgpu-matrix'
import { type GLTFAccessor } from './core/Mesh'
import {
    type TAnimationInterpolation,
    type TAnimationTargetPath,
} from './core/animation'

export * from './core/Entity'
export * from './core/GameObject'
export * from './core/Component'
export * from './core/SceneTree'
export * from './core/ObjectManager'
export * from './core/Mesh'
export * from './core/Transform'
export * from './core/BufferStorage'
export * from './core/ImageStorage'
export * from './core/SamplerStorage'
export * from './core/TextureStorage'
export * from './core/Scene'
export * from './core/Engine'
export * from './core/Renderer'
export * from './core/animation'

//FIXME: move this somewhere else
export interface IPreloadMesh {
    positions: GLTFAccessor
    indices: GLTFAccessor
    normals: GLTFAccessor
    tangents: GLTFAccessor
    textureCoordinates: GLTFAccessor
    materialId: string
    mode: number
    /** JOINTS_0 — skinned primitives only */
    joints?: GLTFAccessor
    /** WEIGHTS_0 — skinned primitives only */
    weights?: GLTFAccessor
    /** key into IModelPreloadData.skins */
    skinId?: string
    /** glTF morph targets, in target order */
    morphTargets?: IPreloadMorphTarget[]
    /** default morph weights, one per target */
    morphWeights?: number[]
}

export interface IPreloadMorphTarget {
    positions: GLTFAccessor
    normals?: GLTFAccessor
}

export interface IPreloadEntity {
    /** stable id of this node — skins and animations reference nodes through it */
    nodeId: string
    trsMatrix: Mat4
    meshes: IPreloadMesh[]
    name?: string
    children: IPreloadEntity[]
}

export interface IPreloadSkin {
    name?: string
    /** preload node ids of the joints, in joint-index order */
    jointNodeIds: string[]
    /** jointCount × 16 floats, column-major mat4 per joint */
    inverseBindMatrices: Float32Array
}

export interface IPreloadAnimationTrack {
    /** preload node id of the channel target */
    targetNodeId: string
    path: TAnimationTargetPath
    interpolation: TAnimationInterpolation
    /** keyframe times in seconds, ascending */
    input: Float32Array
    /**
     * flat values: 3 floats per key (translation/scale), 4 (rotation
     * quaternion xyzw), morph-target count (weights); CUBICSPLINE stores
     * (in-tangent, value, out-tangent) triples per key
     */
    output: Float32Array
}

export interface IPreloadAnimation {
    name: string
    tracks: IPreloadAnimationTrack[]
}

export interface IModelPreloadData {
    buffers: BufferMap
    images: ImageMap
    samplers: SamplerMap
    textures: TextureMap
    materials: MaterialMap
    skins: SkinMap
    animations: IPreloadAnimation[]
    model: IPreloadEntity
}

export interface IMaterialPreloadData {
    name?: string
    baseColorFactor?: Vec4 //[1, 1, 1, 1]
    emissiveFactor?: Vec3
    metallicFactor?: number // 1
    roughnessFactor?: number // 1
    baseColorTextureId?: string
    metallicRoughnessTextureId?: string
    normalTextureId?: string
    occlusionTextureId?: string
    emissiveTextureId?: string
}

export interface ITexturePreloadData {
    samplerId: string
    imageId: string
    // usage: GPUTextureUsageFlags
}

export enum GLTFTextureFilter {
    NEAREST = 9728,
    LINEAR = 9729,
    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987,
}

export enum GLTFTextureWrap {
    REPEAT = 10497,
    CLAMP_TO_EDGE = 33071,
    MIRRORED_REPEAT = 33648,
}

export interface ISamplerPreloadData {
    magFilter?: GLTFTextureFilter
    minFilter?: GLTFTextureFilter
    wrapS?: GLTFTextureWrap
    wrapT?: GLTFTextureWrap
}

export interface IImagePreloadData {
    bufferView: {
        buffer: string
        byteLength: number
        byteOffset: number
        byteStride: number
        target: number
    }
    mimeType: string
}

export type BufferMap = Map<string, ArrayBuffer>
export type ImageMap = Map<string, IImagePreloadData>
export type SamplerMap = Map<string, ISamplerPreloadData>
export type TextureMap = Map<string, ITexturePreloadData>
export type MaterialMap = Map<string, IMaterialPreloadData>
export type SkinMap = Map<string, IPreloadSkin>
