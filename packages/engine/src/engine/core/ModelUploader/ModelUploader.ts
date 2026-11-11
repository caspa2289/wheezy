import { vec3, vec4 } from 'wgpu-matrix'
import {
    type GLTFAccessor,
    GLTFTextureFilter,
    GLTFTextureWrap,
    type IAnimationSystem,
    type IAnimationTrackDescriptor,
    type IBufferStorage,
    type IGameObject,
    type IImageStorage,
    type IMaterial,
    type IMesh,
    type IModelPreloadData,
    type IMorphTargets,
    type IObjectManager,
    type IPreloadEntity,
    type IPreloadMesh,
    type ISamplerStorage,
    type ISkin,
    type ITexture,
    type ITextureStorage,
    EntityTypes,
} from '../../types'
import { type IMaterialStorage } from '../../types/core/MaterialStorage'
import { AnimationClip } from '../animation'
import { Animator } from '../animation'
import { GameObject } from '../GameObject'
import { Mesh } from '../Mesh'
import { MAX_MORPH_TARGETS } from '../Renderer/constants'
import { Transform } from '../Transform'

export class ModelUploader {
    static #getTextureFilterMode(filter?: GLTFTextureFilter) {
        switch (filter) {
            case GLTFTextureFilter.NEAREST_MIPMAP_NEAREST:
            case GLTFTextureFilter.NEAREST_MIPMAP_LINEAR:
            case GLTFTextureFilter.NEAREST:
                return 'nearest' as GPUFilterMode
            case GLTFTextureFilter.LINEAR_MIPMAP_NEAREST:
            case GLTFTextureFilter.LINEAR_MIPMAP_LINEAR:
            case GLTFTextureFilter.LINEAR:
                return 'linear' as GPUFilterMode
            default:
                return 'linear'
        }
    }

    static #getTextureMipMapMode(filter: GLTFTextureFilter) {
        switch (filter) {
            case GLTFTextureFilter.NEAREST_MIPMAP_NEAREST:
            case GLTFTextureFilter.LINEAR_MIPMAP_NEAREST:
            case GLTFTextureFilter.NEAREST:
                return 'nearest' as GPUMipmapFilterMode
            case GLTFTextureFilter.LINEAR_MIPMAP_LINEAR:
            case GLTFTextureFilter.NEAREST_MIPMAP_LINEAR:
            case GLTFTextureFilter.LINEAR:
                return 'linear' as GPUMipmapFilterMode
        }
    }

    static #getTextureAddressMode(mode?: GLTFTextureWrap) {
        switch (mode) {
            case GLTFTextureWrap.REPEAT:
                return 'repeat' as GPUAddressMode
            case GLTFTextureWrap.CLAMP_TO_EDGE:
                return 'clamp-to-edge' as GPUAddressMode
            case GLTFTextureWrap.MIRRORED_REPEAT:
                return 'mirror-repeat' as GPUAddressMode
            default:
                return 'repeat'
        }
    }

    static async #uploadImages(
        modelData: IModelPreloadData,
        bufferStorage: IBufferStorage,
        imageStorage: IImageStorage
    ) {
        for (let [key, value] of modelData.images.entries()) {
            const {
                bufferView: { buffer, byteLength, byteOffset },
                mimeType,
            } = value

            const imageView = new Uint8Array(
                bufferStorage.buffers.get(buffer) as ArrayBuffer,
                byteOffset,
                byteLength
            )

            const blob = new Blob([imageView], { type: mimeType })
            const bitmap = await createImageBitmap(blob)
            imageStorage.images.set(key, bitmap)
        }
    }

    static #uploadBuffers(
        modelData: IModelPreloadData,
        bufferStorage: IBufferStorage
    ) {
        modelData.buffers.forEach((value, key) => {
            bufferStorage.buffers.set(key, value)
        })
    }

    static #uploadSamplers(
        modelData: IModelPreloadData,
        samplerStorage: ISamplerStorage,
        device: GPUDevice
    ) {
        modelData.samplers.forEach((value, key) => {
            const gpuSampler = device.createSampler({
                magFilter: this.#getTextureFilterMode(value?.magFilter),
                minFilter: this.#getTextureFilterMode(value?.minFilter),
                addressModeU: this.#getTextureAddressMode(value?.wrapS),
                addressModeV: this.#getTextureAddressMode(value?.wrapT),
                //FIXME: use mipmap filtration
                mipmapFilter: 'nearest',
            })
            samplerStorage.samplers.set(key, gpuSampler)
        })
    }

    static #uploadTextures(
        modelData: IModelPreloadData,
        textureStorage: ITextureStorage
    ) {
        modelData.textures.forEach((value, key) => {
            textureStorage.textures.set(key, value)
        })
    }

    static #createGPUTexture(
        device: GPUDevice,
        format: GPUTextureFormat,
        samplerStorage: ISamplerStorage,
        imageStorage: IImageStorage,
        texturePreloadData?: ITexture
    ) {
        let textureView: GPUTextureView | undefined
        let textureSampler: GPUSampler | undefined

        if (!texturePreloadData) {
            throw new Error('No texture data')
        }

        if (!texturePreloadData.imageId) {
            throw new Error('No image view for this texture')
        }

        if (!texturePreloadData.samplerId) {
            throw new Error('No sampler for this texture')
        }

        textureSampler = samplerStorage.samplers.get(
            texturePreloadData.samplerId
        ) as GPUSampler

        const imageBitmap = imageStorage.images.get(
            texturePreloadData.imageId
        ) as ImageBitmap

        const imageSize = [imageBitmap.width, imageBitmap.height, 1]

        const imageTexture = device.createTexture({
            size: imageSize,
            format: format,
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        })

        device.queue.copyExternalImageToTexture(
            { source: imageBitmap },
            { texture: imageTexture },
            imageSize
        )

        textureView = imageTexture.createView()

        return { view: textureView, sampler: textureSampler }
    }

    static #uploadMaterials(
        modelData: IModelPreloadData,
        textureStorage: ITextureStorage,
        samplerStorage: ISamplerStorage,
        imageStorage: IImageStorage,
        materialStorage: IMaterialStorage,
        device: GPUDevice
    ) {
        let defaultMaterial = materialStorage.materials.get(
            'default'
        ) as IMaterial

        if (!defaultMaterial) {
            defaultMaterial = {
                name: 'Default wheezy material',
                emissiveFactor: vec3.create(1, 1, 1),
                metallicFactor: 1,
                roughnessFactor: 1,
                baseColorFactor: vec4.create(1, 1, 1, 1),
                baseColorTexture: this.#createGPUTexture(
                    device,
                    'rgba8unorm-srgb',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultBaseColor
                ),
                metallicRoughnessTexture: this.#createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultMetallicRoughness
                ),
                normalTexture: this.#createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultNormal
                ),
                occlusionTexture: this.#createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultOcclusion
                ),
                emissiveTexture: this.#createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultEmission
                ),
            }
            materialStorage.materials.set('default', defaultMaterial)
        }

        modelData.materials.forEach((value, key) => {
            const material: IMaterial = {
                name: value.name,
                emissiveFactor:
                    value?.emissiveFactor ?? defaultMaterial.emissiveFactor,
                metallicFactor:
                    value?.metallicFactor ?? defaultMaterial.metallicFactor,
                roughnessFactor:
                    value.roughnessFactor ?? defaultMaterial.roughnessFactor,
                baseColorFactor:
                    value?.baseColorFactor ?? defaultMaterial.baseColorFactor,
                baseColorTexture: value.baseColorTextureId
                    ? this.#createGPUTexture(
                          device,
                          'rgba8unorm-srgb',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.baseColorTextureId)
                      )
                    : defaultMaterial.baseColorTexture,
                metallicRoughnessTexture: value.metallicRoughnessTextureId
                    ? this.#createGPUTexture(
                          device,
                          'rgba8unorm',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(
                              value.metallicRoughnessTextureId
                          )
                      )
                    : defaultMaterial.metallicRoughnessTexture,
                normalTexture: value.normalTextureId
                    ? this.#createGPUTexture(
                          device,
                          'rgba8unorm',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.normalTextureId)
                      )
                    : defaultMaterial.normalTexture,
                occlusionTexture: value.occlusionTextureId
                    ? this.#createGPUTexture(
                          device,
                          'rgba8unorm',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.occlusionTextureId)
                      )
                    : defaultMaterial.occlusionTexture,
                emissiveTexture: value.emissiveTextureId
                    ? this.#createGPUTexture(
                          device,
                          'rgba8unorm',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.emissiveTextureId)
                      )
                    : defaultMaterial.emissiveTexture,
            }

            materialStorage.materials.set(key, material)
        })
    }

    /** creates the Mesh components of one preload node, incl. skinning/morph data */
    static #createMeshes(
        gameObject: IGameObject,
        meshes: IPreloadMesh[],
        materialStorage: IMaterialStorage,
        skinMap: Map<string, ISkin>
    ) {
        meshes.forEach((meshData) => {
            let morphTargets: IMorphTargets | undefined
            let morphWeights: Float32Array | undefined

            if (meshData.morphTargets?.length) {
                morphTargets = {
                    positions: meshData.morphTargets.map(
                        (target) => target.positions
                    ),
                    normals: meshData.morphTargets.map(
                        (target) => target.normals
                    ),
                    targetCount: meshData.morphTargets.length,
                    vertexCount: meshData.positions.count,
                }
                morphWeights = new Float32Array(MAX_MORPH_TARGETS)
                meshData.morphWeights?.forEach((weight, index) => {
                    if (index < MAX_MORPH_TARGETS) {
                        morphWeights![index] = weight
                    }
                })
            }

            new Mesh(
                gameObject,
                meshData.positions as GLTFAccessor,
                meshData.indices,
                meshData.normals,
                meshData.textureCoordinates,
                meshData.tangents,
                materialStorage.materials.get(meshData.materialId) as IMaterial,
                {
                    joints: meshData.joints,
                    weights: meshData.weights,
                    skin: meshData.skinId
                        ? skinMap.get(meshData.skinId)
                        : undefined,
                    morphTargets,
                    morphWeights,
                }
            )
        })
    }

    static #traversePreloadNode(
        node: IPreloadEntity,
        parentGameObject: IGameObject,
        objectManager: IObjectManager,
        bufferStorage: IBufferStorage,
        materialStorage: IMaterialStorage,
        device: GPUDevice,
        nodeIdMap: Map<string, IGameObject>,
        skinMap: Map<string, ISkin>
    ) {
        const { nodeId, trsMatrix, meshes, children, name } = node

        const gameObject = new GameObject()
        if (name) {
            gameObject.name = name
        }

        objectManager.addObject(gameObject, parentGameObject)
        nodeIdMap.set(nodeId, gameObject)

        new Transform(gameObject, trsMatrix)

        this.#createMeshes(gameObject, meshes, materialStorage, skinMap)

        children.forEach((child) => {
            this.#traversePreloadNode(
                child,
                gameObject,
                objectManager,
                bufferStorage,
                materialStorage,
                device,
                nodeIdMap,
                skinMap
            )
        })
    }

    /** builds the runtime skins (joints resolved after the node walk) */
    static #createSkins(
        modelData: IModelPreloadData,
        sceneSkins: ISkin[]
    ): Map<string, ISkin> {
        const skinMap = new Map<string, ISkin>()

        modelData.skins?.forEach((preloadSkin, skinId) => {
            const jointCount = preloadSkin.jointNodeIds.length
            const skin: ISkin = {
                name: preloadSkin.name,
                joints: [],
                jointIds: preloadSkin.jointNodeIds.slice(),
                inverseBindMatrices: preloadSkin.inverseBindMatrices,
                jointCount,
                paletteOffset: -1,
            }
            skinMap.set(skinId, skin)
            sceneSkins.push(skin)
        })

        return skinMap
    }

    /** resolves skin joints against the built node map */
    static #resolveSkins(
        skinMap: Map<string, ISkin>,
        modelData: IModelPreloadData,
        nodeIdMap: Map<string, IGameObject>
    ) {
        modelData.skins?.forEach((preloadSkin, skinId) => {
            const skin = skinMap.get(skinId)
            if (!skin) {
                return
            }
            // jointIds must hold the live GameObject ids — the traversal
            // records node indices by entity id, not by preload node id
            const jointIds: string[] = []
            for (const jointNodeId of preloadSkin.jointNodeIds) {
                const joint = nodeIdMap.get(jointNodeId)
                if (!joint) {
                    console.warn(
                        `wheezy: skin "${skin.name}" references a missing joint node — the joint keeps its last palette entry`
                    )
                    skin.joints.push(undefined as unknown as IGameObject)
                    jointIds.push('')
                    continue
                }
                skin.joints.push(joint)
                jointIds.push(joint.id)
            }
            skin.jointIds = jointIds
        })
    }

    /**
     * Builds runtime clips from the preload animations and attaches an
     * Animator to the model root when the file carries any.
     */
    static #createAnimator(
        modelData: IModelPreloadData,
        rootObject: IGameObject,
        nodeIdMap: Map<string, IGameObject>,
        animations: IAnimationSystem
    ) {
        if (!modelData.animations?.length) {
            return
        }

        const clips: AnimationClip[] = []

        for (const preloadAnimation of modelData.animations) {
            const trackDescriptors: IAnimationTrackDescriptor[] = []

            for (const preloadTrack of preloadAnimation.tracks) {
                const target = nodeIdMap.get(preloadTrack.targetNodeId)
                if (!target) {
                    console.warn(
                        `wheezy: animation "${preloadAnimation.name}" targets a missing node — track skipped`
                    )
                    continue
                }

                if (preloadTrack.path === 'weights') {
                    // morph-weight channels apply to every morph-capable mesh
                    // primitive of the target node
                    let hasMorphMesh = false
                    for (const component of target.components.values()) {
                        if (component.type !== EntityTypes.mesh) {
                            continue
                        }
                        const mesh = component as IMesh
                        if (!mesh.morphWeights) {
                            continue
                        }
                        hasMorphMesh = true
                        trackDescriptors.push({
                            mesh,
                            path: 'weights',
                            interpolation: preloadTrack.interpolation,
                            times: preloadTrack.input,
                            values: preloadTrack.output,
                        })
                    }
                    if (!hasMorphMesh) {
                        console.warn(
                            `wheezy: animation "${preloadAnimation.name}" targets node "${target.name}" with no morph meshes — track skipped`
                        )
                    }
                } else {
                    trackDescriptors.push({
                        target,
                        path: preloadTrack.path,
                        interpolation: preloadTrack.interpolation,
                        times: preloadTrack.input,
                        values: preloadTrack.output,
                    })
                }
            }

            if (trackDescriptors.length > 0) {
                clips.push(
                    new AnimationClip({
                        name: preloadAnimation.name,
                        tracks: trackDescriptors,
                    })
                )
            }
        }

        if (clips.length > 0) {
            new Animator(rootObject, animations, clips)
        }
    }

    public static async uploadModel(
        modelData: IModelPreloadData,
        objectManager: IObjectManager,
        bufferStorage: IBufferStorage,
        imageStorage: IImageStorage,
        samplerStorage: ISamplerStorage,
        materialStorage: IMaterialStorage,
        textureStorage: ITextureStorage,
        sceneObject: IGameObject,
        device: GPUDevice,
        sceneSkins: ISkin[],
        animations: IAnimationSystem
    ) {
        this.#uploadBuffers(modelData, bufferStorage)
        await this.#uploadImages(modelData, bufferStorage, imageStorage)
        this.#uploadSamplers(modelData, samplerStorage, device)
        this.#uploadTextures(modelData, textureStorage)
        this.#uploadMaterials(
            modelData,
            textureStorage,
            samplerStorage,
            imageStorage,
            materialStorage,
            device
        )

        const skinMap = this.#createSkins(modelData, sceneSkins)
        const nodeIdMap = new Map<string, IGameObject>()

        const { trsMatrix, meshes, children } = modelData.model

        const meshObject = new GameObject()

        objectManager.addObject(meshObject, sceneObject)
        nodeIdMap.set(modelData.model.nodeId, meshObject)

        new Transform(meshObject, trsMatrix)

        this.#createMeshes(meshObject, meshes, materialStorage, skinMap)

        children.forEach((child) => {
            this.#traversePreloadNode(
                child,
                meshObject,
                objectManager,
                bufferStorage,
                materialStorage,
                device,
                nodeIdMap,
                skinMap
            )
        })

        this.#resolveSkins(skinMap, modelData, nodeIdMap)
        this.#createAnimator(modelData, meshObject, nodeIdMap, animations)

        return meshObject
    }
}
