import { load } from '@loaders.gl/core'
import { type GLB, GLBLoader } from '@loaders.gl/gltf'
import {
    type BufferMap,
    DEFAULT_SAMPLER_IDS,
    type GLTFAccessor,
    type ImageMap,
    type IMaterialPreloadData,
    type IModelPreloadData,
    type IPreloadAnimation,
    type IPreloadAnimationTrack,
    type IPreloadEntity,
    type IPreloadMesh,
    type IPreloadMorphTarget,
    type IPreloadSkin,
    type ISamplerPreloadData,
    type ITexturePreloadData,
    type MaterialMap,
    type SamplerMap,
    type SkinMap,
    type TAnimationInterpolation,
    type TAnimationTargetPath,
    type TextureMap,
} from '../../engine/types'
import {
    getTypeComponentsAmount,
    getTypeSize,
    getVertexType,
    GLTFComponentType,
} from './helpers'
import { mat4, vec2, vec3, type Vec3, type Vec4 } from 'wgpu-matrix'

type IndexMap = Map<number, string>

const generateId = () => {
    return String(Math.random())
}

export class WheezyGLBLoader {
    static #loadImages(
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

                if (!bufferViewData.byteOffset) {
                    bufferViewData.byteOffset = 0
                }

                const bufferOffset =
                    modelData.binChunks[bufferViewData.buffer]!.byteOffset ?? 0
                bufferViewData.buffer = bufferId
                bufferViewData.byteOffset += bufferOffset

                const id = generateId()
                imagesIndexMap.set(index, id)
                imagesMap.set(id, { bufferView: bufferViewData, mimeType })
            }
        )

        return { imagesIndexMap, imagesMap }
    }

    static #loadSamplers = (
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

    static #loadTextures = (
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
                    samplerId:
                        samplersIndexMap.get(textureData.sampler) ??
                        DEFAULT_SAMPLER_IDS.baseColor,
                    imageId: imagesIndexMap.get(textureData.source) as string,
                }

                texturesIndexMap.set(index, id)
                texturesMap.set(id, texture)
            }
        )

        return { texturesIndexMap, texturesMap }
    }

    static #loadMaterials = (
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

    static #loadBuffers = (modelData: GLB) => {
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

        const { bufferIndexMap, bufferMap } = this.#loadBuffers(modelData)

        const { imagesIndexMap, imagesMap } = this.#loadImages(
            modelData,
            bufferIndexMap
        )

        const { samplersIndexMap, samplersMap } = this.#loadSamplers(modelData)

        const { texturesIndexMap, texturesMap } = this.#loadTextures(
            modelData,
            samplersIndexMap,
            imagesIndexMap
        )

        const { materialsIndexMap, materialsMap } = this.#loadMaterials(
            modelData,
            texturesIndexMap
        )

        // skin ids are allocated up front so nodes can reference them while
        // the tree is walked; joint node ids resolve after the walk
        const skinIndexMap: IndexMap = new Map()
        const skinsMap: SkinMap = new Map()
        modelData.json?.skins?.forEach((_: unknown, index: number) => {
            skinIndexMap.set(index, generateId())
        })

        const nodeIdMap: IndexMap = new Map()

        const modelPreload: IPreloadEntity = {
            nodeId: generateId(),
            trsMatrix: mat4.identity(),
            meshes: [],
            children: [],
        }

        modelData?.json?.scenes?.forEach((scene: { nodes?: number[] }) => {
            scene?.nodes?.forEach((nodeIndex) => {
                modelPreload.children.push(
                    this.#loadNode(
                        nodeIndex,
                        modelData,
                        bufferIndexMap,
                        materialsIndexMap,
                        bufferMap,
                        nodeIdMap,
                        skinIndexMap
                    )
                )
            })
        })

        this.#loadSkins(modelData, skinIndexMap, nodeIdMap, skinsMap)
        const animations = this.#loadAnimations(modelData, nodeIdMap)

        return {
            model: modelPreload,
            buffers: bufferMap,
            images: imagesMap,
            samplers: samplersMap,
            textures: texturesMap,
            materials: materialsMap,
            skins: skinsMap,
            animations,
        }
    }

    static #createNormalsBuffer = (
        meshData: IPreloadMesh,
        bufferIndexMap: IndexMap,
        bufferMap: BufferMap
    ) => {
        const positionsBuffer = bufferMap.get(
            meshData.positions.bufferId
        ) as ArrayBuffer

        const vertices = new Float32Array(
            positionsBuffer,
            meshData.positions?.byteOffset,
            meshData.positions?.byteLength / 4
        )

        const indices = this.#readIndices(meshData, bufferMap)

        const normals = new Float32Array(vertices.length)

        for (let i = 0; i < indices.length; i += 3) {
            const vert0 = vec3.create(
                vertices[indices[i]! * 3],
                vertices[indices[i]! * 3 + 1],
                vertices[indices[i]! * 3 + 2]
            )
            const vert1 = vec3.create(
                vertices[indices[i + 1]! * 3],
                vertices[indices[i + 1]! * 3 + 1],
                vertices[indices[i + 1]! * 3 + 2]
            )

            const vert2 = vec3.create(
                vertices[indices[i + 2]! * 3],
                vertices[indices[i + 2]! * 3 + 1],
                vertices[indices[i + 2]! * 3 + 2]
            )

            // p = cross(B-A, C-A)
            const normal = vec3.cross(
                vec3.subtract(vert1, vert0),
                vec3.subtract(vert2, vert0)
            )

            normals[indices[i]! * 3]! += normal[0]!
            normals[indices[i]! * 3 + 1]! += normal[1]!
            normals[indices[i]! * 3 + 2]! += normal[2]!

            normals[indices[i + 1]! * 3]! += normal[0]!
            normals[indices[i + 1]! * 3 + 1]! += normal[1]!
            normals[indices[i + 1]! * 3 + 2]! += normal[2]!

            normals[indices[i + 2]! * 3]! += normal[0]!
            normals[indices[i + 2]! * 3 + 1]! += normal[1]!
            normals[indices[i + 2]! * 3 + 2]! += normal[2]!
        }

        for (let i = 0; i < indices.length; i += 3) {
            const normalizedNormal = vec3.normalize(
                vec3.create(
                    normals[indices[i]! * 3],
                    normals[indices[i]! * 3 + 1],
                    normals[indices[i]! * 3 + 2]
                )
            )

            normals[indices[i]! * 3] = normalizedNormal[0]!
            normals[indices[i]! * 3 + 1] = normalizedNormal[1]!
            normals[indices[i]! * 3 + 2] = normalizedNormal[2]!
        }

        const id = generateId()
        bufferIndexMap.set(Math.random(), id)
        bufferMap.set(id, normals.buffer)

        return {
            bufferId: id,
            byteStride: 12,
            byteLength: normals.byteLength,
            byteOffset: 0,
            count: normals.byteLength / (4 * 3),
            componentType: GLTFComponentType.FLOAT,
            elementType: 'float32x3',
            usage: GPUBufferUsage.VERTEX,
        } as GLTFAccessor
    }

    static #createTextureCoordinatesBuffer = (
        bufferIndexMap: IndexMap,
        bufferMap: BufferMap
    ) => {
        const texCoords = new Uint32Array()
        const id = generateId()
        bufferIndexMap.set(Math.random(), id)
        bufferMap.set(id, texCoords.buffer)

        return {
            bufferId: id,
            byteStride: 8,
            byteLength: texCoords.byteLength,
            byteOffset: 0,
            count: texCoords.byteLength / (4 * 2),
            componentType: GLTFComponentType.FLOAT,
            elementType: 'float32x2',
            usage: 32,
        } as GLTFAccessor
    }

    /** sequential 0..n-1 indices for non-indexed glTF primitives */
    static #createIndicesBuffer = (
        meshData: IPreloadMesh,
        bufferIndexMap: IndexMap,
        bufferMap: BufferMap
    ) => {
        const count = meshData.positions.count
        const use32 = count > 65535
        const indices = use32 ? new Uint32Array(count) : new Uint16Array(count)
        for (let i = 0; i < count; i++) {
            indices[i] = i
        }

        const id = generateId()
        bufferIndexMap.set(Math.random(), id)
        bufferMap.set(id, indices.buffer as ArrayBuffer)

        return {
            bufferId: id,
            byteStride: use32 ? 4 : 2,
            byteLength: indices.byteLength,
            byteOffset: 0,
            count,
            componentType: use32
                ? GLTFComponentType.UNSIGNED_INT
                : GLTFComponentType.UNSIGNED_SHORT,
            elementType: use32 ? 'uint32' : 'uint16',
            usage: GPUBufferUsage.INDEX,
        } as GLTFAccessor
    }

    /** index view honoring the accessor's component type (uint16 or uint32) */
    static #readIndices(meshData: IPreloadMesh, bufferMap: BufferMap) {
        const indexBuffer = bufferMap.get(
            meshData.indices.bufferId
        ) as ArrayBuffer
        return meshData.indices.componentType === GLTFComponentType.UNSIGNED_INT
            ? new Uint32Array(
                  indexBuffer,
                  meshData.indices.byteOffset,
                  meshData.indices.count
              )
            : new Uint16Array(
                  indexBuffer,
                  meshData.indices.byteOffset,
                  meshData.indices.count
              )
    }

    static #createTangentsBuffer = (
        meshData: IPreloadMesh,
        bufferIndexMap: IndexMap,
        bufferMap: BufferMap
    ) => {
        const positionsBuffer = bufferMap.get(
            meshData.positions.bufferId
        ) as ArrayBuffer

        const textureCoordinatesBuffer = bufferMap.get(
            meshData.textureCoordinates.bufferId
        ) as ArrayBuffer

        const vertices = new Float32Array(
            positionsBuffer,
            meshData.positions?.byteOffset,
            meshData.positions?.byteLength / 4
        )

        const textureCoordinates = new Uint32Array(
            textureCoordinatesBuffer,
            meshData.textureCoordinates?.byteOffset,
            meshData.textureCoordinates?.byteLength / 4
        )

        const indices = this.#readIndices(meshData, bufferMap)

        const tangents = new Float32Array(vertices.length)

        for (let i = 0; i < indices.length; i += 3) {
            const vert0 = vec3.create(
                vertices[indices[i]! * 3],
                vertices[indices[i]! * 3 + 1],
                vertices[indices[i]! * 3 + 2]
            )
            const vert1 = vec3.create(
                vertices[indices[i + 1]! * 3],
                vertices[indices[i + 1]! * 3 + 1],
                vertices[indices[i + 1]! * 3 + 2]
            )

            const vert2 = vec3.create(
                vertices[indices[i + 2]! * 3],
                vertices[indices[i + 2]! * 3 + 1],
                vertices[indices[i + 2]! * 3 + 2]
            )

            const uv0 = vec2.create(
                textureCoordinates[indices[i]! * 2],
                textureCoordinates[indices[i]! * 2 + 1]
            )

            const uv1 = vec2.create(
                textureCoordinates[indices[i + 1]! * 2],
                textureCoordinates[indices[i + 1]! * 2 + 1]
            )

            const uv2 = vec2.create(
                textureCoordinates[indices[i + 2]! * 2],
                textureCoordinates[indices[i + 2]! * 2 + 1]
            )

            const edge1 = vec3.subtract(vert1, vert0)
            const edge2 = vec3.subtract(vert2, vert0)

            const deltaU1 = uv1[0]! - uv0[0]!
            const deltaV1 = uv1[1]! - uv0[1]!
            const deltaU2 = uv2[0]! - uv0[0]!
            const deltaV2 = uv2[1]! - uv0[1]!

            let f = 1 / (deltaU1 * deltaV2 - deltaU2 * deltaV1)

            //FIXME: im not sure it should be that
            if (!isFinite(f)) {
                f = 0.0
            }
            const tangent = vec3.create(
                f * (deltaV2 * edge1[0]! - deltaV1 * edge2[0]!),
                f * (deltaV2 * edge1[1]! - deltaV1 * edge2[1]!),
                f * (deltaV2 * edge1[2]! - deltaV1 * edge2[2]!)
            )

            tangents[indices[i]! * 3]! += tangent[0]!
            tangents[indices[i]! * 3 + 1]! += tangent[1]!
            tangents[indices[i]! * 3 + 2]! += tangent[2]!

            tangents[indices[i + 1]! * 3]! += tangent[0]!
            tangents[indices[i + 1]! * 3 + 1]! += tangent[1]!
            tangents[indices[i + 1]! * 3 + 2]! += tangent[2]!

            tangents[indices[i + 2]! * 3]! += tangent[0]!
            tangents[indices[i + 2]! * 3 + 1]! += tangent[1]!
            tangents[indices[i + 2]! * 3 + 2]! += tangent[2]!
        }

        const id = generateId()
        bufferIndexMap.set(Math.random(), id)
        bufferMap.set(id, tangents.buffer)

        return {
            bufferId: id,
            byteStride: 12,
            byteLength: tangents.byteLength,
            byteOffset: 0,
            count: tangents.byteLength / (4 * 3),
            componentType: GLTFComponentType.FLOAT,
            elementType: 'float32x3',
            usage: 32,
        } as GLTFAccessor
    }

    static #parseAccessor = (
        modelData: Record<string, any>,
        accessorId: number | undefined,
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

    static #loadNode(
        nodeIndex: number,
        modelData: Record<string, any>,
        bufferIndexMap: IndexMap,
        materialsIndexMap: IndexMap,
        bufferMap: BufferMap,
        nodeIdMap: IndexMap,
        skinIndexMap: IndexMap
    ) {
        const nodeJsonData = modelData?.json?.nodes[nodeIndex]
        const nodeId = generateId()
        // first visit wins: skins/animations resolve through this map after
        // the whole node walk
        if (!nodeIdMap.has(nodeIndex)) {
            nodeIdMap.set(nodeIndex, nodeId)
        }

        const dataStructEntry: IPreloadEntity = {
            nodeId,
            trsMatrix: WheezyGLBLoader.#composeNodeMatrix(nodeJsonData),
            meshes: [],
            name: nodeJsonData.name,
            children: [],
        }

        if (nodeJsonData.mesh !== undefined) {
            const meshJsonData = modelData.json.meshes[nodeJsonData.mesh]
            const skinId =
                nodeJsonData.skin !== undefined
                    ? skinIndexMap.get(nodeJsonData.skin)
                    : undefined

            meshJsonData.primitives.forEach(
                (primitive: {
                    attributes: {
                        NORMAL: number
                        POSITION: number
                        TEXCOORD_0: number
                        JOINTS_0?: number
                        WEIGHTS_0?: number
                    }
                    indices: number
                    mode: number
                    material?: number
                    targets?: { POSITION?: number; NORMAL?: number }[]
                }) => {
                    //FIXME: generate indices for non-indexed geometry
                    const meshData: Partial<IPreloadMesh> = {
                        positions: WheezyGLBLoader.#parseAccessor(
                            modelData,
                            primitive.attributes.POSITION,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        ),
                        indices: WheezyGLBLoader.#parseAccessor(
                            modelData,
                            primitive.indices,
                            GPUBufferUsage.INDEX,
                            bufferIndexMap
                        ),
                        normals: WheezyGLBLoader.#parseAccessor(
                            modelData,
                            primitive.attributes.NORMAL,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        ),
                        textureCoordinates: WheezyGLBLoader.#parseAccessor(
                            modelData,
                            primitive.attributes.TEXCOORD_0,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        ),
                        materialId:
                            primitive.material !== undefined
                                ? materialsIndexMap.get(primitive.material)
                                : 'default',
                        mode: primitive.mode ?? 4,
                        skinId,
                    }

                    if (!meshData.indices) {
                        meshData.indices = this.#createIndicesBuffer(
                            meshData as IPreloadMesh,
                            bufferIndexMap,
                            bufferMap
                        )
                    }

                    if (skinId !== undefined) {
                        meshData.joints = WheezyGLBLoader.#parseAccessor(
                            modelData,
                            primitive.attributes.JOINTS_0,
                            GPUBufferUsage.VERTEX,
                            bufferIndexMap
                        )
                        meshData.weights =
                            WheezyGLBLoader.#parseSkinWeightsAccessor(
                                modelData,
                                primitive.attributes.WEIGHTS_0,
                                bufferIndexMap
                            )
                    }

                    if (primitive.targets?.length) {
                        const morphTargets: IPreloadMorphTarget[] = []
                        for (const target of primitive.targets) {
                            const positions = WheezyGLBLoader.#parseAccessor(
                                modelData,
                                target.POSITION,
                                GPUBufferUsage.VERTEX,
                                bufferIndexMap
                            )
                            if (!positions) {
                                continue
                            }
                            morphTargets.push({
                                positions,
                                normals: WheezyGLBLoader.#parseAccessor(
                                    modelData,
                                    target.NORMAL,
                                    GPUBufferUsage.VERTEX,
                                    bufferIndexMap
                                ),
                            })
                        }
                        if (morphTargets.length > 0) {
                            meshData.morphTargets = morphTargets
                            meshData.morphWeights = meshJsonData.weights
                        }
                    }

                    if (!meshData.normals) {
                        meshData.normals = this.#createNormalsBuffer(
                            meshData as IPreloadMesh,
                            bufferIndexMap,
                            bufferMap
                        )
                    }

                    if (!meshData.textureCoordinates) {
                        meshData.textureCoordinates =
                            this.#createTextureCoordinatesBuffer(
                                bufferIndexMap,
                                bufferMap
                            )
                    }

                    meshData.tangents = this.#createTangentsBuffer(
                        meshData as IPreloadMesh,
                        bufferIndexMap,
                        bufferMap
                    )

                    dataStructEntry.meshes.push(meshData as IPreloadMesh)
                }
            )
        }

        nodeJsonData?.children?.forEach((childIndex: number) => {
            dataStructEntry.children.push(
                this.#loadNode(
                    childIndex,
                    modelData,
                    bufferIndexMap,
                    materialsIndexMap,
                    bufferMap,
                    nodeIdMap,
                    skinIndexMap
                )
            )
        })

        return dataStructEntry
    }

    /** node.matrix when present, otherwise composed from translation/rotation/scale */
    static #composeNodeMatrix(nodeJsonData: Record<string, any>) {
        if (nodeJsonData.matrix) {
            return nodeJsonData.matrix as Float32Array
        }

        const translation = nodeJsonData.translation as Vec3 | undefined
        const rotation = nodeJsonData.rotation as number[] | undefined
        const scale = nodeJsonData.scale as Vec3 | undefined

        if (!translation && !rotation && !scale) {
            return mat4.identity()
        }

        // glTF rotation is a quaternion in xyzw order, matching wgpu-matrix
        const matrix = mat4.fromQuat(
            rotation ?? [0, 0, 0, 1],
            mat4.create()
        ) as Float32Array
        mat4.scale(matrix, scale ?? vec3.create(1, 1, 1), matrix)
        if (translation) {
            matrix[12] = translation[0]!
            matrix[13] = translation[1]!
            matrix[14] = translation[2]!
        }
        return matrix
    }

    /** WEIGHTS_0 may be stored normalized (unorm8x4 / unorm16x4 on the GPU) */
    static #parseSkinWeightsAccessor(
        modelData: Record<string, any>,
        accessorId: number | undefined,
        bufferIndexMap: IndexMap
    ): GLTFAccessor | undefined {
        if (accessorId === undefined || accessorId === null) {
            return undefined
        }

        const accessor = WheezyGLBLoader.#parseAccessor(
            modelData,
            accessorId,
            GPUBufferUsage.VERTEX,
            bufferIndexMap
        )
        if (!accessor) {
            return undefined
        }

        const rawAccessor = modelData.json.accessors[accessorId]
        if (rawAccessor.normalized) {
            accessor.elementType = getVertexType(
                rawAccessor.componentType,
                rawAccessor.type,
                true
            )
        }
        return accessor
    }

    /**
     * Materializes a float accessor (animation times/values, inverse bind
     * matrices) into a dense Float32Array — handles bufferView strides and
     * unaligned offsets via DataView.
     */
    static #readAccessorFloats(
        modelData: Record<string, any>,
        accessorIndex: number
    ): Float32Array {
        const rawAccessor = modelData.json.accessors[accessorIndex]
        const rawBufferView = modelData.json.bufferViews[rawAccessor.bufferView]
        const buffer = modelData.binChunks[rawBufferView.buffer]

        if (rawAccessor.componentType !== GLTFComponentType.FLOAT) {
            throw new Error(
                `wheezy: only float animation/skin accessors are supported (got componentType ${rawAccessor.componentType})`
            )
        }

        const componentCount = getTypeComponentsAmount(rawAccessor.type)
        const count = rawAccessor.count as number
        const out = new Float32Array(count * componentCount)

        const byteOffset =
            (rawAccessor.byteOffset ?? 0) +
            (rawBufferView.byteOffset ?? 0) +
            (buffer?.byteOffset ?? 0)
        const stride = Math.max(
            rawBufferView.byteStride ?? 0,
            componentCount * 4
        )

        const view = new DataView(buffer.arrayBuffer)
        for (let i = 0; i < count; i++) {
            for (let c = 0; c < componentCount; c++) {
                out[i * componentCount + c] = view.getFloat32(
                    byteOffset + i * stride + c * 4,
                    true
                )
            }
        }

        return out
    }

    static #loadSkins(
        modelData: Record<string, any>,
        skinIndexMap: IndexMap,
        nodeIdMap: IndexMap,
        skinsMap: SkinMap
    ) {
        modelData.json?.skins?.forEach(
            (
                skinData: {
                    name?: string
                    inverseBindMatrices?: number
                    joints: number[]
                },
                index: number
            ) => {
                const jointNodeIds: string[] = []
                for (const jointIndex of skinData.joints) {
                    const nodeId = nodeIdMap.get(jointIndex)
                    if (nodeId === undefined) {
                        console.warn(
                            `wheezy: skin ${index} references node ${jointIndex} outside the loaded scenes — the joint stays bindless`
                        )
                    }
                    jointNodeIds.push(nodeId as string)
                }

                const jointCount = jointNodeIds.length
                const inverseBindMatrices = new Float32Array(jointCount * 16)
                if (skinData.inverseBindMatrices !== undefined) {
                    inverseBindMatrices.set(
                        WheezyGLBLoader.#readAccessorFloats(
                            modelData,
                            skinData.inverseBindMatrices
                        )
                    )
                } else {
                    // no accessor: identity binds
                    for (let j = 0; j < jointCount; j++) {
                        const o = j * 16
                        inverseBindMatrices[o] = 1
                        inverseBindMatrices[o + 5] = 1
                        inverseBindMatrices[o + 10] = 1
                        inverseBindMatrices[o + 15] = 1
                    }
                }

                const id = skinIndexMap.get(index) as string
                const skin: IPreloadSkin = {
                    name: skinData.name,
                    jointNodeIds,
                    inverseBindMatrices,
                }
                skinsMap.set(id, skin)
            }
        )
    }

    static #loadAnimations(
        modelData: Record<string, any>,
        nodeIdMap: IndexMap
    ): IPreloadAnimation[] {
        const animations: IPreloadAnimation[] = []

        modelData.json?.animations?.forEach(
            (
                animationData: {
                    name?: string
                    channels: {
                        sampler: number
                        target: { node?: number; path: string }
                    }[]
                    samplers: {
                        input: number
                        output: number
                        interpolation?: string
                    }[]
                },
                animationIndex: number
            ) => {
                const tracks: IPreloadAnimationTrack[] = []

                for (const channel of animationData.channels) {
                    const sampler = animationData.samplers[channel.sampler]
                    if (!sampler || channel.target.node === undefined) {
                        continue
                    }

                    const targetNodeId = nodeIdMap.get(channel.target.node)
                    if (targetNodeId === undefined) {
                        console.warn(
                            `wheezy: animation "${animationData.name}" targets node ${channel.target.node} outside the loaded scenes — channel skipped`
                        )
                        continue
                    }

                    tracks.push({
                        targetNodeId,
                        path: channel.target.path as TAnimationTargetPath,
                        interpolation: (sampler.interpolation ??
                            'LINEAR') as TAnimationInterpolation,
                        input: WheezyGLBLoader.#readAccessorFloats(
                            modelData,
                            sampler.input
                        ),
                        output: WheezyGLBLoader.#readAccessorFloats(
                            modelData,
                            sampler.output
                        ),
                    })
                }

                if (tracks.length > 0) {
                    animations.push({
                        name:
                            animationData.name ?? `Animation ${animationIndex}`,
                        tracks,
                    })
                }
            }
        )

        return animations
    }
}
