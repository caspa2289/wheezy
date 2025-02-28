export enum GLTFComponentType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
    DOUBLE = 5130,
}

export const getTypeComponentsAmount = (type: string) => {
    switch (type) {
        case 'SCALAR':
            return 1
        case 'VEC2':
            return 2
        case 'VEC3':
            return 3
        case 'VEC4':
            return 4
        case 'MAT2':
            return 4
        case 'MAT3':
            return 9
        case 'MAT4':
            return 16
        default:
            throw Error(`Invalid gltf type ${type}`)
    }
}

export const getVertexType = (
    componentType: number,
    type: string
): GPUVertexFormat => {
    let typeStr: string | null = null
    switch (componentType) {
        case GLTFComponentType.BYTE:
            typeStr = 'sint8'
            break
        case GLTFComponentType.UNSIGNED_BYTE:
            typeStr = 'uint8'
            break
        case GLTFComponentType.SHORT:
            typeStr = 'sint16'
            break
        case GLTFComponentType.UNSIGNED_SHORT:
            typeStr = 'uint16'
            break
        case GLTFComponentType.INT:
            typeStr = 'int32'
            break
        case GLTFComponentType.UNSIGNED_INT:
            typeStr = 'uint32'
            break
        case GLTFComponentType.FLOAT:
            typeStr = 'float32'
            break
        default:
            throw Error(
                `Unrecognized or unsupported gltf type ${componentType}`
            )
    }

    switch (getTypeComponentsAmount(type)) {
        case 1:
            break
        case 2:
            typeStr += 'x2'
            break
        case 3:
            typeStr += 'x3'
            break
        case 4:
            typeStr += 'x4'
            break
        default:
            throw Error(`Invalid number of components for gltf type: ${type}`)
    }

    return typeStr as GPUVertexFormat
}

export const getTypeSize = (componentType: GLTFComponentType, type: string) => {
    let componentSize = 0
    switch (componentType) {
        case GLTFComponentType.BYTE:
            componentSize = 1
            break
        case GLTFComponentType.UNSIGNED_BYTE:
            componentSize = 1
            break
        case GLTFComponentType.SHORT:
            componentSize = 2
            break
        case GLTFComponentType.UNSIGNED_SHORT:
            componentSize = 2
            break
        case GLTFComponentType.INT:
            componentSize = 4
            break
        case GLTFComponentType.UNSIGNED_INT:
            componentSize = 4
            break
        case GLTFComponentType.FLOAT:
            componentSize = 4
            break
        case GLTFComponentType.DOUBLE:
            componentSize = 8
            break
        default:
            throw Error('Unrecognized GLTF Component Type?')
    }
    return getTypeComponentsAmount(type) * componentSize
}

export enum ImageUsage {
    BASE_COLOR,
    METALLIC_ROUGHNESS,
    NORMAL,
    OCCLUSION,
    EMISSION,
}
