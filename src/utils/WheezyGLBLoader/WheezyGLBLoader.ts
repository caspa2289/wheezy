import { load } from '@loaders.gl/core'
import { GLB, GLBLoader } from '@loaders.gl/gltf'
import {
    BufferMap,
    GLTFAccessor,
    ImageMap,
    IModelPreloadData,
    IPreloadEntity,
    MaterialMap,
    SamplerMap,
    TextureMap,
} from '../../engine/types'
import { getTypeSize, getVertexType } from './helpers'
import { mat4 } from 'wgpu-matrix'

type IndexMap = Map<number, string>

const generateId = () => {
    return String(Math.random())
}

export class WheezyGLBLoader {
    private static async loadImages(
        modelData: GLB,
        bufferIndexMap: IndexMap
    ): Promise<{
        imagesIndexMap: IndexMap
        imagesMap: ImageMap
    }> {
        const imagesIndexMap: IndexMap = new Map()
        const imagesMap: ImageMap = new Map()

        modelData.json?.images?.forEach(
            (
                {
                    bufferView,
                    mimeType,
                }: {
                    bufferView: number
                    mimeType: string
                },
                index: number
            ) => {
                const bufferViewData = modelData.json.bufferViews[bufferView]
                bufferViewData.buffer = bufferIndexMap.get(
                    bufferViewData.buffer
                )

                const id = generateId()
                imagesIndexMap.set(index, id)
                imagesMap.set(id, { bufferView: bufferViewData, mimeType })
            }
        )

        return { imagesIndexMap, imagesMap }
    }

    public static async loadFromUrl(url: string): Promise<IModelPreloadData> {
        const modelData = await load(url, GLBLoader)

        console.log(modelData)

        const bufferIndexMap: IndexMap = new Map()
        const bufferMap: BufferMap = new Map()

        modelData.binChunks.forEach((chunk, index) => {
            if (chunk.arrayBuffer) {
                const id = generateId()
                bufferIndexMap.set(index, id)
                bufferMap.set(id, chunk.arrayBuffer)
            }
        })

        const { imagesIndexMap, imagesMap } = await this.loadImages(
            modelData,
            bufferIndexMap
        )

        const samplersIndexMap: IndexMap = new Map()
        const samplers: SamplerMap = new Map()

        const texturesIndexMap: IndexMap = new Map()
        const textures: TextureMap = new Map()

        const materialsIndexMap: IndexMap = new Map()
        const materials: MaterialMap = new Map()

        const modelPreload: IPreloadEntity = {
            trsMatrix: mat4.identity(),
            meshes: [],
            children: [],
        }

        modelData?.json?.scenes?.forEach((scene: { nodes?: number[] }) => {
            scene?.nodes?.forEach((nodeIndex) => {
                modelPreload.children.push(
                    this.loadNode(nodeIndex, modelData, bufferIndexMap)
                )
            })
        })

        return { model: modelPreload, buffers: bufferMap }
    }

    private static parseAccessor = (
        modelData: Record<string, any>,
        accessorId: number,
        usage: GPUBufferUsageFlags,
        bufferIndexMap: BufferIndexMap
    ): GLTFAccessor | undefined => {
        if (accessorId !== 0 && !accessorId) {
            return undefined
        }

        const rawAccessor = modelData.json.accessors[accessorId]
        const rawBufferView = modelData.json.bufferViews[rawAccessor.bufferView]
        const buffer = modelData.binChunks[rawBufferView.buffer]

        const elementSize = getTypeSize(
            rawAccessor.componentType,
            rawAccessor.type
        )
        const byteStride = Math.max(elementSize, rawBufferView.byteStride ?? 0)

        return {
            bufferId: bufferIndexMap.get(rawBufferView.buffer) as string,
            byteStride: byteStride,
            byteLength: rawAccessor.count * (byteStride ?? 1),
            byteOffset:
                (rawAccessor.byteOffset ?? 0) +
                rawBufferView.byteOffset +
                (buffer?.byteOffset ?? 0),
            count: rawAccessor.count,
            componentType: rawAccessor.componentType,
            elementType: getVertexType(
                rawAccessor.componentType,
                rawAccessor.type
            ),
            min: rawAccessor.min,
            max: rawAccessor.max,
            usage: usage,
        }
    }

    private static loadNode(
        nodeIndex: number,
        modelData: Record<string, any>,
        bufferIndexMap: BufferIndexMap
    ) {
        const nodeJsonData = modelData?.json?.nodes[nodeIndex]
        const dataStructEntry: IPreloadEntity = {
            trsMatrix: nodeJsonData.matrix ?? mat4.identity(),
            meshes: [],
            children: [],
        }

        if (nodeJsonData.mesh !== undefined) {
            const meshJsonData = modelData.json.meshes[nodeJsonData.mesh]

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
                    //TODO! Parse textures, materials, etc. here
                    dataStructEntry.meshes.push({
                        positions: WheezyGLBLoader.parseAccessor(
                            modelData,
                            primitive.attributes.POSITION,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        ),

                        indices: WheezyGLBLoader.parseAccessor(
                            modelData,
                            primitive.indices,
                            GPUBufferUsage.INDEX,
                            bufferIndexMap
                        ),
                        mode: primitive.mode ?? 4,
                    })
                }
            )
        }

        nodeJsonData?.children?.forEach((childIndex: number) => {
            dataStructEntry.children.push(
                this.loadNode(childIndex, modelData, bufferIndexMap)
            )
        })

        return dataStructEntry
    }
}
