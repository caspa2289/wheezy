import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'
import { Vec3, Vec4 } from 'wgpu-matrix'

export type MaterialPBR = {
    //FIXME: type this
    baseColorFactor?: Vec4 //vec4
    baseColorTexture?: {
        index: 1
        texCoord: 1
    }
    metallicFactor?: number //0 to 1
    roughnessFactor?: number //0 to 1
    metallicRoughnessTexture?: {
        index: 2
        texCoord: 1
    }
}

export interface GLTFBufferData {
    id: string
    buffer: GPUBuffer
}

export interface IMaterial {
    name?: string

    baseColorTexture?: { view: GPUTextureView; sampler: GPUSampler }
    metallicRoughnessTexture?: { view: GPUTextureView; sampler: GPUSampler }

    metallicFactor: number
    roughnessFactor: number

    emissiveFactor?: Vec3
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
    normal?: GLTFAccessor
    tangent?: GLTFAccessor
    indices?: GLTFAccessor
    //FIXME: implement default material according to defaults https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-material
    material?: IMaterial //if not present in the file, a default material should be used
    positions: GLTFAccessor
    mode: number //gpu topology - default is 4 (triangles)
}
