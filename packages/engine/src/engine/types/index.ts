import { Mat4, Vec3, Vec4 } from 'wgpu-matrix'
import { GLTFAccessor } from './core/Mesh'

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

//FIXME: move this somewhere else
export interface IPreloadMesh {
    positions?: GLTFAccessor
    indices?: GLTFAccessor
    normals?: GLTFAccessor
    textureCoordinates?: GLTFAccessor
    materialId?: string
    mode: number
}

export interface IPreloadEntity {
    trsMatrix: Mat4
    meshes: IPreloadMesh[]
    name?: string
    children: IPreloadEntity[]
}

export interface IModelPreloadData {
    buffers: BufferMap
    images: ImageMap
    samplers: SamplerMap
    textures: TextureMap
    materials: MaterialMap
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
