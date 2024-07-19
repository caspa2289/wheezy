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

export interface IMaterial {
    name?: string
    pbr?: MaterialPBR
    //FIXME: type this
    normalTexture?: {
        scale: 2
        index: 3
        texCoord: 1
    }
    occlusionTexture?: []
    emissiveTexture?: []
    emissiveFactor?: Vec3
}

export interface GLTFBufferView {
    byteLength: number
    byteStride: number
    view: Uint8Array
    buffer: GPUBuffer
    usage: GPUBufferUsageFlags
}

export interface GLTFAccessor {
    byteStride: number
    count: number
    componentType: number
    type: string
    bufferView: GLTFBufferView
    byteOffset: number
    elementType: GPUVertexFormat
    min?: number[]
    max?: number[]
}

export interface IMesh extends IComponent<EntityTypes.mesh> {
    // attributes: {
    //     NORMAL: 23
    //     POSITION: 22
    //     TANGENT: 24
    //     TEXCOORD_0: 25
    // }
    //https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-mesh-primitive
    normal?: GLTFAccessor
    tangent?: GLTFAccessor
    //FIXME: why could there be multiple?
    textureCoordinates?: GLTFAccessor[]
    indices?: GLTFAccessor
    //FIXME: implement default material according to defaults https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-material
    //FIXME: implement materials
    // material: IMaterial //if not present in the file, a default material should be used
    positions: GLTFAccessor
    mode: number //gpu topology - default is 4
    /**
        0 POINTS
        1 LINES
        2 LINE_LOOP
        3 LINE_STRIP
        4 TRIANGLES
        5 TRIANGLE_STRIP
        6 TRIANGLE_FAN
     */
}
