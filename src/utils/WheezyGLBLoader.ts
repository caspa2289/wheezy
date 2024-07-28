import { load } from '@loaders.gl/core'
import { GLBLoader } from '@loaders.gl/gltf'
import { GLTFAccessor, IGameObject, IObjectManager } from '../engine/types'
import { GameObject, Mesh, Transform } from '../engine/core'
import { mat4 } from 'wgpu-matrix'

export class WheezyGLBLoader {
    public static async loadFromUrl(
        url: string,
        objectManager: IObjectManager,
        device: GPUDevice
    ) {
        //FIXME: create a mechanism to load models without registering them instantly
        //FIXME: buffers uploading to gpu on load
        const modelData = await load(url, GLBLoader)

        // console.log(modelData)

        const sceneObject = new GameObject()

        objectManager.addObject(sceneObject)

        modelData?.json?.scenes?.forEach((scene: { nodes?: number[] }) => {
            scene?.nodes?.forEach((nodeIndex) => {
                this.loadNode(
                    nodeIndex,
                    modelData,
                    device,
                    objectManager,
                    sceneObject
                )
            })
        })
    }

    private static parseAccessor = (
        modelData: Record<string, any>,
        accessorId: number,
        usage: GPUBufferUsageFlags,
        device: GPUDevice
    ): GLTFAccessor | undefined => {
        if (accessorId !== 0 && !accessorId) {
            return undefined
        }

        const rawAccessor = modelData.json.accessors[accessorId]
        const rawBufferView = modelData.json.bufferViews[rawAccessor.bufferView]
        const buffer = modelData.binChunks[rawBufferView.buffer]

        const view = new Uint8Array(
            buffer.arrayBuffer,
            rawBufferView.byteOffset + buffer.byteOffset,
            rawBufferView.byteLength
        )
        const buf = device.createBuffer({
            size: alignTo(rawBufferView.byteLength, 4),
            usage,
            mappedAtCreation: true,
        })

        new Uint8Array(buf.getMappedRange()).set(view)
        buf.unmap()

        const elementSize = getTypeSize(
            rawAccessor.componentType,
            rawAccessor.type
        )
        const byteStride = Math.max(elementSize, rawBufferView.byteStride ?? 0)

        return {
            byteStride: byteStride,
            byteLength: rawAccessor.count * (byteStride ?? 1),
            count: rawAccessor.count,
            componentType: rawAccessor.componentType,
            type: rawAccessor.type,
            byteOffset: rawAccessor.byteOffset ?? 0,
            elementType: getVertexType(
                rawAccessor.componentType,
                rawAccessor.type
            ),
            min: rawAccessor.min,
            max: rawAccessor.max,
            bufferView: {
                byteLength: rawBufferView.byteLength,
                byteStride: rawBufferView.byteStride ?? 0,
                //FIXME: buf and view are essentially identical
                view: view,
                buffer: buf,
                usage: usage,
            },
        }
    }

    private static loadNode(
        nodeIndex: number,
        modelData: Record<string, any>,
        device: GPUDevice,
        objectManager: IObjectManager,
        parentObject?: IGameObject
    ) {
        const nodeJsonData = modelData?.json?.nodes[nodeIndex]
        if (!nodeJsonData) {
            return
        }
        const nodeGameObject = new GameObject()
        objectManager.addObject(nodeGameObject, parentObject)

        //FIXME: figure out what format is used for trs values in the parser
        // console.log(nodeJsonData)
        //FIXME: transform trs values to trs matrix here, for now expect matrix to always be present
        //add transform to newly created gameobject
        const nodeTransform = new Transform(nodeGameObject, nodeJsonData.matrix)

        if (nodeJsonData.mesh !== undefined) {
            const meshJsonData = modelData.json.meshes[nodeJsonData.mesh]
            nodeGameObject.name = meshJsonData.name

            meshJsonData.primitives.forEach(
                (primitive: {
                    attributes: {
                        NORMAL: number
                        POSITION: number
                        TEXCOORD_0: number
                    }
                    indices: number
                    mode: number
                    material: number
                }) => {
                    const meshGameObject = new GameObject()
                    objectManager.addObject(meshGameObject, nodeGameObject)
                    //TODO!
                    //FIXME: Parse textures, materials, etc. here
                    const positionsAccessor = WheezyGLBLoader.parseAccessor(
                        modelData,
                        primitive.attributes.POSITION,
                        GPUBufferUsage.VERTEX,
                        device
                    ) as GLTFAccessor

                    const indicesAccessor = WheezyGLBLoader.parseAccessor(
                        modelData,
                        primitive.indices,
                        GPUBufferUsage.INDEX,
                        device
                    )

                    const mesh = new Mesh(
                        meshGameObject,
                        positionsAccessor,
                        indicesAccessor
                    )
                    mesh.mode = primitive.mode ?? 4
                }
            )
        }

        nodeJsonData?.children?.forEach((childIndex: number) => {
            this.loadNode(
                childIndex,
                modelData,
                device,
                objectManager,
                nodeGameObject
            )
        })
    }
}

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

const getTypeComponentsAmount = (type: string) => {
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

const getVertexType = (
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

const getTypeSize = (componentType: GLTFComponentType, type: string) => {
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

const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}
