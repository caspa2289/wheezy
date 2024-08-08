import { Mat4 } from 'wgpu-matrix'
import { GLTFAccessor } from './core/Mesh'

export * from './core/Entity'
export * from './core/GameObject'
export * from './core/Component'
export * from './core/SceneTree'
export * from './core/ObjectManager'
export * from './core/Mesh'
export * from './core/Transform'

export interface IPreloadMesh {
    positions?: GLTFAccessor
    indices?: GLTFAccessor
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
    model: IPreloadEntity
}

export type BufferMap = Map<string, ArrayBuffer>
