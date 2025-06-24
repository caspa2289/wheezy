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

export interface IAnimationChannelTarget {
    node: number
    path: 'translation' | 'rotation' | 'scale' | 'weights' //FIXME: wtf is weights?
}

export interface IAnimationChannel {
    sampler: number
    target: IAnimationChannelTarget
}

export interface IAnimationSampler {
    input: number //input is array of timestamps
    output: number //output is array of values in corresponding timestamps
    interpolation: 'LINEAR' | 'STEP' | 'CUBICSPLINE' //FIXME: considered LINEAR for now
}

export interface IAnimation {
    name?: string
    channels?: IAnimationChannel[]
    samplers?: IAnimationSampler[]
}

export interface IMeshAnimationJoint {
    name?: string
    children?: number[] //child bones indices
    rotation: Vec3
    scale: Vec3
    translation: Vec3
}

export interface IMeshAnimationSkin {
    inverseBindMatrices: Float32Array //FIXME: this should be a buffer
    joints: IMeshAnimationJoint[]
    name?: string
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
}
