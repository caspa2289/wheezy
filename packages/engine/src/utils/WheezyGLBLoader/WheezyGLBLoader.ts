import { load } from '@loaders.gl/core'
import { GLB, GLBLoader } from '@loaders.gl/gltf'
import {
    BufferMap,
    GLTFAccessor,
    ImageMap,
    IMaterialPreloadData,
    IModelPreloadData,
    IPreloadEntity,
    IPreloadMesh,
    ISamplerPreloadData,
    ITexturePreloadData,
    MaterialMap,
    SamplerMap,
    TextureMap,
} from '../../engine/types'
import { getTypeSize, getVertexType, GLTFComponentType } from './helpers'
import { mat4, vec2, vec3, Vec3, Vec4 } from 'wgpu-matrix'

type IndexMap = Map<number, string>

const generateId = () => {
    return String(Math.random())
}

export class WheezyGLBLoader {
    private static loadImages(
        modelData: GLB,
        bufferIndexMap: IndexMap
    ): {
        imagesIndexMap: IndexMap
        imagesMap: ImageMap
    } {
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
                const bufferId = bufferIndexMap.get(bufferViewData.buffer)

                const bufferOffset =
                    modelData.binChunks[bufferViewData.buffer].byteOffset ?? 0
                bufferViewData.buffer = bufferId
                bufferViewData.byteOffset += bufferOffset

                const id = generateId()
                imagesIndexMap.set(index, id)
                imagesMap.set(id, { bufferView: bufferViewData, mimeType })
            }
        )

        return { imagesIndexMap, imagesMap }
    }

    private static loadSamplers = (
        modelData: GLB
    ): {
        samplersIndexMap: IndexMap
        samplersMap: SamplerMap
    } => {
        const samplersIndexMap: IndexMap = new Map()
        const samplersMap: SamplerMap = new Map()

        modelData.json?.samplers?.forEach(
            (sampler: ISamplerPreloadData, index: number) => {
                const id = generateId()
                samplersIndexMap.set(index, id)
                samplersMap.set(id, sampler)
            }
        )

        return { samplersIndexMap, samplersMap }
    }

    private static loadTextures = (
        modelData: GLB,
        samplersIndexMap: IndexMap,
        imagesIndexMap: IndexMap
    ): {
        texturesIndexMap: IndexMap
        texturesMap: TextureMap
    } => {
        const texturesIndexMap: IndexMap = new Map()
        const texturesMap: TextureMap = new Map()

        modelData.json?.textures?.forEach(
            (
                textureData: { source: number; sampler: number },
                index: number
            ) => {
                const id = generateId()
                const texture: ITexturePreloadData = {
                    samplerId: samplersIndexMap.get(
                        textureData.sampler
                    ) as string,
                    imageId: imagesIndexMap.get(textureData.source) as string,
                }

                texturesIndexMap.set(index, id)
                texturesMap.set(id, texture)
            }
        )

        return { texturesIndexMap, texturesMap }
    }

    private static loadMaterials = (
        modelData: GLB,
        texturesIndexMap: IndexMap
    ): {
        materialsIndexMap: IndexMap
        materialsMap: MaterialMap
    } => {
        const materialsIndexMap: IndexMap = new Map()
        const materialsMap: MaterialMap = new Map()

        modelData.json?.materials?.forEach(
            (
                //FIXME: check types
                materialData: {
                    pbrMetallicRoughness?: {
                        baseColorTexture?: {
                            index: number
                        }
                        metallicRoughnessTexture?: {
                            index: number
                        }
                        baseColorFactor?: Vec4
                        metallicFactor?: number
                        roughnessFactor?: number
                    }
                    normalTexture?: { index: number }
                    emissiveTexture?: { index: number }
                    occlusionTexture?: { index: number }
                    emissiveFactor?: Vec3
                    name?: string
                },
                index: number
            ) => {
                const material: IMaterialPreloadData = {
                    name: materialData.name,
                    baseColorFactor:
                        materialData?.pbrMetallicRoughness?.baseColorFactor,
                    emissiveFactor: materialData.emissiveFactor,
                    metallicFactor:
                        materialData?.pbrMetallicRoughness?.metallicFactor,
                    roughnessFactor:
                        materialData?.pbrMetallicRoughness?.roughnessFactor,
                    baseColorTextureId:
                        materialData?.pbrMetallicRoughness?.baseColorTexture
                            ?.index !== undefined
                            ? texturesIndexMap.get(
                                  materialData?.pbrMetallicRoughness
                                      ?.baseColorTexture?.index
                              )
                            : undefined,
                    metallicRoughnessTextureId:
                        materialData?.pbrMetallicRoughness
                            ?.metallicRoughnessTexture?.index !== undefined
                            ? texturesIndexMap.get(
                                  materialData?.pbrMetallicRoughness
                                      ?.metallicRoughnessTexture?.index
                              )
                            : undefined,
                    normalTextureId:
                        materialData?.normalTexture?.index !== undefined
                            ? texturesIndexMap.get(
                                  materialData?.normalTexture?.index
                              )
                            : undefined,
                    occlusionTextureId:
                        materialData?.occlusionTexture?.index !== undefined
                            ? texturesIndexMap.get(
                                  materialData?.occlusionTexture?.index
                              )
                            : undefined,
                    emissiveTextureId:
                        materialData?.emissiveTexture?.index !== undefined
                            ? texturesIndexMap.get(
                                  materialData?.emissiveTexture?.index
                              )
                            : undefined,
                }

                const id = generateId()
                materialsIndexMap.set(index, id)
                materialsMap.set(id, material)
            }
        )

        return { materialsIndexMap, materialsMap }
    }

    private static loadBuffers = (modelData: GLB) => {
        const bufferIndexMap: IndexMap = new Map()
        const bufferMap: BufferMap = new Map()

        modelData.binChunks.forEach((chunk, index) => {
            if (chunk.arrayBuffer) {
                const id = generateId()
                bufferIndexMap.set(index, id)
                bufferMap.set(id, chunk.arrayBuffer)
            }
        })

        return { bufferIndexMap, bufferMap }
    }

    public static async loadFromUrl(url: string): Promise<IModelPreloadData> {
        const modelData = await load(url, GLBLoader)

        console.log(modelData)

        const { bufferIndexMap, bufferMap } = this.loadBuffers(modelData)

        const { imagesIndexMap, imagesMap } = this.loadImages(
            modelData,
            bufferIndexMap
        )

        const { samplersIndexMap, samplersMap } = this.loadSamplers(modelData)

        const { texturesIndexMap, texturesMap } = this.loadTextures(
            modelData,
            samplersIndexMap,
            imagesIndexMap
        )

        const { materialsIndexMap, materialsMap } = this.loadMaterials(
            modelData,
            texturesIndexMap
        )

        const modelPreload: IPreloadEntity = {
            trsMatrix: mat4.identity(),
            meshes: [],
            children: [],
        }

        modelData?.json?.scenes?.forEach((scene: { nodes?: number[] }) => {
            scene?.nodes?.forEach((nodeIndex) => {
                modelPreload.children.push(
                    this.loadNode(
                        nodeIndex,
                        modelData,
                        bufferIndexMap,
                        materialsIndexMap,
                        bufferMap
                    )
                )
            })
        })

        return {
            model: modelPreload,
            buffers: bufferMap,
            images: imagesMap,
            samplers: samplersMap,
            textures: texturesMap,
            materials: materialsMap,
        }
    }

    private static parseAccessor = (
        modelData: Record<string, any>,
        accessorId: number,
        usage: GPUBufferUsageFlags,
        bufferIndexMap: IndexMap
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
                (rawAccessor?.byteOffset ?? 0) +
                (rawBufferView?.byteOffset ?? 0) +
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
        bufferIndexMap: IndexMap,
        materialsIndexMap: IndexMap,
        bufferMap: BufferMap
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
                    material?: number
                }) => {
                    const meshData: IPreloadMesh = {
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
                        normals: WheezyGLBLoader.parseAccessor(
                            modelData,
                            primitive.attributes.NORMAL,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        ),
                        textureCoordinates: WheezyGLBLoader.parseAccessor(
                            modelData,
                            primitive.attributes.TEXCOORD_0,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        ),
                        materialId:
                            primitive.material !== undefined
                                ? materialsIndexMap.get(primitive.material)
                                : undefined,
                        mode: primitive.mode ?? 4,
                    }

                    //REFACTOR: move to separate function
                    const positionsBuffer = meshData.positions?.bufferId
                        ? bufferMap.get(meshData.positions.bufferId)
                        : null

                    const textureCoordinatesBuffer = meshData.textureCoordinates
                        ?.bufferId
                        ? bufferMap.get(meshData.textureCoordinates.bufferId)
                        : null

                    const indexBuffer = meshData.indices?.bufferId
                        ? bufferMap.get(meshData.indices.bufferId)
                        : null

                    //FIXME: add a workaround for not indexed meshes
                    if (
                        positionsBuffer &&
                        textureCoordinatesBuffer &&
                        indexBuffer
                    ) {
                        const vertices = new Float32Array(
                            positionsBuffer,
                            meshData.positions?.byteOffset,
                            meshData.positions?.byteLength
                        )
                        const textureCoordinates = new Uint32Array(
                            textureCoordinatesBuffer,
                            meshData.textureCoordinates?.byteOffset,
                            meshData.textureCoordinates?.byteLength
                        )

                        const indices =
                            //FIXME: this could be something other than Uint16
                            new Uint16Array(
                                indexBuffer,
                                meshData.indices?.byteOffset,
                                meshData.indices?.byteLength
                            )

                        const tangents = new Float32Array(vertices.length)

                        for (let i = 0; i < indices.length; i += 9) {
                            const vert0 = vec3.create(
                                vertices[indices[i]],
                                vertices[indices[i + 1]],
                                vertices[indices[i + 2]]
                            )
                            const vert1 = vec3.create(
                                vertices[indices[i + 3]],
                                vertices[indices[i + 4]],
                                vertices[indices[i + 5]]
                            )

                            const vert2 = vec3.create(
                                vertices[indices[i + 6]],
                                vertices[indices[i + 7]],
                                vertices[indices[i + 8]]
                            )

                            const uv0 = vec2.create(
                                textureCoordinates[indices[i]],
                                textureCoordinates[indices[i + 1]]
                            )

                            const uv1 = vec2.create(
                                textureCoordinates[indices[i + 2]],
                                textureCoordinates[indices[i + 3]]
                            )

                            const uv2 = vec2.create(
                                textureCoordinates[indices[i + 4]],
                                textureCoordinates[indices[i + 5]]
                            )

                            const edge1 = vec3.subtract(vert1, vert0)
                            const edge2 = vec3.subtract(vert2, vert0)

                            const deltaU1 = uv1[0] - uv0[0]
                            const deltaV1 = uv1[1] - uv0[1]
                            const deltaU2 = uv2[0] - uv0[0]
                            const deltaV2 = uv2[1] - uv0[1]

                            let f = 1 / (deltaU1 * deltaV2 - deltaU2 * deltaV1)

                            //FIXME: im not sure it should be that
                            if (!isFinite(f)) {
                                f = 0.0
                            }
                            const tangent = vec3.create(
                                f * (deltaV2 * edge1[0] - deltaV1 * edge2[0]),
                                f * (deltaV2 * edge1[1] - deltaV1 * edge2[1]),
                                f * (deltaV2 * edge1[2] - deltaV1 * edge2[2])
                            )

                            tangents[indices[i]] += tangent[0]
                            tangents[indices[i + 1]] += tangent[1]
                            tangents[indices[i + 2]] += tangent[2]

                            tangents[indices[i + 3]] += tangent[0]
                            tangents[indices[i + 4]] += tangent[1]
                            tangents[indices[i + 5]] += tangent[2]

                            tangents[indices[i + 6]] += tangent[0]
                            tangents[indices[i + 7]] += tangent[1]
                            tangents[indices[i + 8]] += tangent[2]
                        }

                        const id = generateId()
                        bufferIndexMap.set(Math.random(), id)
                        bufferMap.set(id, tangents.buffer)

                        meshData.tangents = {
                            bufferId: id,
                            byteStride: 12,
                            byteLength: tangents.byteLength,
                            byteOffset: 0,
                            count: tangents.length / (4 * 3),
                            componentType: GLTFComponentType.FLOAT,
                            elementType: 'float32x3',
                            usage: 32,
                        } as GLTFAccessor
                    }

                    dataStructEntry.meshes.push(meshData)
                }
            )
        }

        nodeJsonData?.children?.forEach((childIndex: number) => {
            dataStructEntry.children.push(
                this.loadNode(
                    childIndex,
                    modelData,
                    bufferIndexMap,
                    materialsIndexMap,
                    bufferMap
                )
            )
        })

        return dataStructEntry
    }
}
