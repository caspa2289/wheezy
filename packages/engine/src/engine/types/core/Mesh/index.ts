import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'
import { Vec3, Vec4 } from 'wgpu-matrix'

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

export interface IMesh extends IComponent<EntityTypes.mesh> {
    //https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-mesh-primitive
    normals: GLTFAccessor
    tangents: GLTFAccessor
    indices: GLTFAccessor
    textureCoordinates: GLTFAccessor
    //FIXME: implement default material according to defaults https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-material
    material: IMaterial //if not present in the file, a default material should be used
    positions: GLTFAccessor
    mode: number //gpu topology - default is 4 (triangles)
    isPipelineBuilt: boolean
}
