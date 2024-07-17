import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'

export type MaterialPBR = {
    //FIXME: type this
    baseColorFactor?: [0.5, 0.5, 0.5, 1.0] //vec4
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
    emissiveFactor?: [0.2, 0.1, 0.0]
}

export interface IMesh extends IComponent<EntityTypes.mesh> {
    // attributes: {
    //     NORMAL: 23
    //     POSITION: 22
    //     TANGENT: 24
    //     TEXCOORD_0: 25
    // }
    //https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-mesh-primitive
    normal?: [] //buffer slice
    position?: [] //buffer slice
    tangent?: [] //buffer slice
    //FIXME: why could there be multiple?
    textureCoordinates?: [] //buffer slice
    indices?: [] //buffer slice
    //FIXME: implement default material according to defaults https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-material
    //FIXME: implement materials
    // material: IMaterial //if not present in the file, a default material should be used
    //FIXME: type this
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
