import { Mat4, Vec3, Vec4 } from 'wgpu-matrix'
import { GLTFAccessor } from './core/Mesh'

export * from './core/Entity'
export * from './core/GameObject'
export * from './core/Component'
export * from './core/SceneTree'
export * from './core/ObjectManager'
export * from './core/Mesh'
export * from './core/Transform'

//FIXME: move this somewhere else
export interface IPreloadMesh {
    positions?: GLTFAccessor
    indices?: GLTFAccessor
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
    baseColorFactor?: Vec4 //[1, 1, 1, 1]
    emissiveFactor?: Vec3
    metallicFactor?: number // 1
    roughnessFactor?: number // 1
    baseColorTextureId?: string
    metallicRoughnessTextureId?: string
}

export interface ITexturePreloadData {
    samplerId: string
    imageId: string
    // usage: GPUTextureUsageFlags
}

export interface ISamplerPreloadData {
    magFilter?: GPUFilterMode
    minFilter?: GPUFilterMode
    wrapU?: GPUAddressMode
    wrapV?: GPUAddressMode
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
