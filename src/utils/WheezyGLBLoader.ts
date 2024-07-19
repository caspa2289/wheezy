import { load } from '@loaders.gl/core'
import { GLBLoader } from '@loaders.gl/gltf'
import { GLTFAccessor, IGameObject, IObjectManager } from '../engine/types'
import { GameObject, Mesh, Transform } from '../engine/core'

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

        console.log(objectManager)
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
        const nodeTransfrom = new Transform(
            nodeGameObject,
            undefined,
            nodeJsonData.matrix
        )

        if (nodeJsonData.mesh !== undefined) {
            //FIXME: get mesh buffers accessors and set them here
            // const positionAccessor: GLTFAccessor = {}
            const meshJsonData = modelData.json.meshes[nodeJsonData.mesh]
            nodeGameObject.name = meshJsonData.name

            // {
            //     "attributes": {
            //         "NORMAL": 1,
            //         "POSITION": 2,
            //         "TEXCOORD_0": 3
            //     },
            //     "indices": 0,
            //     "mode": 4,
            //     "material": 0
            // }

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
                    //TODO!
                    //FIXME: Parse textures, materials, etc. here
                    const positionRawAccessor =
                        modelData.json.accessors[primitive.attributes.POSITION]

                    const positionRawBufferView =
                        modelData.json.bufferViews[
                            positionRawAccessor.bufferView
                        ]

                    // console.log(positionRawBufferView)

                    const positionBuffer =
                        modelData.binChunks[positionRawBufferView.buffer]

                    // console.log(positionBuffer)

                    const meshGameObject = new GameObject()
                    objectManager.addObject(meshGameObject, nodeGameObject)

                    const view = new Uint8Array(
                        positionBuffer.arrayBuffer
                    ).subarray(
                        positionRawBufferView.byteOffset,
                        positionRawBufferView.byteOffset +
                            positionRawBufferView.byteLength
                    )
                    const buf = device.createBuffer({
                        size: positionRawBufferView.byteLength,
                        usage: positionRawBufferView.target,
                        mappedAtCreation: true,
                    })
                    new Uint8Array(buf.getMappedRange()).set(view)
                    buf.unmap()

                    const positionAccessor: GLTFAccessor = {
                        byteStride: positionRawAccessor.byteStride ?? 0,
                        count: positionRawAccessor.count,
                        componentType: positionRawAccessor.componentType,
                        type: positionRawAccessor.type,
                        byteOffset: positionRawAccessor.byteOffset ?? 0,
                        elementType: getVertexType(
                            positionRawAccessor.componentType,
                            positionRawAccessor.type
                        ),
                        min: positionRawAccessor.min,
                        max: positionRawAccessor.max,
                        bufferView: {
                            byteLength: positionRawBufferView.byteLength,
                            byteStride: positionRawBufferView.byteStride,
                            view,
                            buffer: buf,
                            usage: positionRawBufferView.target,
                        },
                    }

                    const mesh = new Mesh(meshGameObject, positionAccessor)

                    // console.log(mesh)
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
