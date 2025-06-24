import { vec3, vec4 } from 'wgpu-matrix'
import {
    GLTFAccessor,
    GLTFTextureFilter,
    GLTFTextureWrap,
    IAnimator,
    IBufferStorage,
    IGameObject,
    IImageStorage,
    IMaterial,
    IModelPreloadData,
    IObjectManager,
    IPreloadEntity,
    ISamplerStorage,
    ITexture,
    ITextureStorage,
} from '../../types'
import { IMaterialStorage } from '../../types/core/MaterialStorage'
import { GameObject } from '../GameObject'
import { Mesh } from '../Mesh'
import { Transform } from '../Transform'

export class ModelUploader {
    private static getTextureFilterMode(filter?: GLTFTextureFilter) {
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

    private static getTextureMipMapMode(filter: GLTFTextureFilter) {
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

    private static getTextureAddressMode(mode?: GLTFTextureWrap) {
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

    private static async uploadImages(
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

    private static uploadBuffers(
        modelData: IModelPreloadData,
        bufferStorage: IBufferStorage
    ) {
        modelData.buffers.forEach((value, key) => {
            bufferStorage.buffers.set(key, value)
        })
    }

    private static uploadSamplers(
        modelData: IModelPreloadData,
        samplerStorage: ISamplerStorage,
        device: GPUDevice
    ) {
        modelData.samplers.forEach((value, key) => {
            const gpuSampler = device.createSampler({
                magFilter: this.getTextureFilterMode(value?.magFilter),
                minFilter: this.getTextureFilterMode(value?.minFilter),
                addressModeU: this.getTextureAddressMode(value?.wrapS),
                addressModeV: this.getTextureAddressMode(value?.wrapT),
                //FIXME: use mipmap filtration
                mipmapFilter: 'nearest',
            })
            samplerStorage.samplers.set(key, gpuSampler)
        })
    }

    private static uploadTextures(
        modelData: IModelPreloadData,
        textureStorage: ITextureStorage
    ) {
        modelData.textures.forEach((value, key) => {
            textureStorage.textures.set(key, value)
        })
    }

    private static createGPUTexture(
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

    private static uploadMaterials(
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
                baseColorTexture: this.createGPUTexture(
                    device,
                    'rgba8unorm-srgb',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultBaseColor
                ),
                metallicRoughnessTexture: this.createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultMetallicRoughness
                ),
                normalTexture: this.createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultNormal
                ),
                occlusionTexture: this.createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.defaultOcclusion
                ),
                emissiveTexture: this.createGPUTexture(
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
                    ? this.createGPUTexture(
                          device,
                          'rgba8unorm-srgb',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.baseColorTextureId)
                      )
                    : defaultMaterial.baseColorTexture,
                metallicRoughnessTexture: value.metallicRoughnessTextureId
                    ? this.createGPUTexture(
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
                    ? this.createGPUTexture(
                          device,
                          'rgba8unorm',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.normalTextureId)
                      )
                    : defaultMaterial.normalTexture,
                occlusionTexture: value.occlusionTextureId
                    ? this.createGPUTexture(
                          device,
                          'rgba8unorm',
                          samplerStorage,
                          imageStorage,
                          textureStorage.textures.get(value.occlusionTextureId)
                      )
                    : defaultMaterial.occlusionTexture,
                emissiveTexture: value.emissiveTextureId
                    ? this.createGPUTexture(
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

    private static traversePreloadNode(
        node: IPreloadEntity,
        parentGameObject: IGameObject,
        objectManager: IObjectManager,
        bufferStorage: IBufferStorage,
        materialStorage: IMaterialStorage,
        device: GPUDevice
    ) {
        const { trsMatrix, meshes, children } = node

        const gameObject = new GameObject()

        objectManager.addObject(gameObject, parentGameObject)

        new Transform(gameObject, trsMatrix)

        meshes.forEach((meshData) => {
            new Mesh(
                gameObject,
                meshData.positions as GLTFAccessor,
                meshData.indices,
                meshData.normals,
                meshData.textureCoordinates,
                meshData.tangents,
                materialStorage.materials.get(meshData.materialId) as IMaterial,
                node?.skin
            )
        })

        children.forEach((child) => {
            this.traversePreloadNode(
                child,
                gameObject,
                objectManager,
                bufferStorage,
                materialStorage,
                device
            )
        })
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
        animator: IAnimator
    ) {
        this.uploadBuffers(modelData, bufferStorage)
        await this.uploadImages(modelData, bufferStorage, imageStorage)
        this.uploadSamplers(modelData, samplerStorage, device)
        this.uploadTextures(modelData, textureStorage)
        this.uploadMaterials(
            modelData,
            textureStorage,
            samplerStorage,
            imageStorage,
            materialStorage,
            device
        )

        const { trsMatrix, meshes, children } = modelData.model

        modelData?.animations?.forEach((animation) => {
            animator.animations.set(
                animation.name ?? String(Math.random()),
                animation
            )
        })

        const meshObject = new GameObject()

        objectManager.addObject(meshObject, sceneObject)

        new Transform(meshObject, trsMatrix)

        meshes.forEach((meshData) => {
            new Mesh(
                meshObject,
                meshData.positions as GLTFAccessor,
                meshData.indices,
                meshData.normals,
                meshData.textureCoordinates,
                meshData.tangents,
                materialStorage.materials.get(meshData.materialId) as IMaterial,
                modelData.model?.skin
            )
        })

        children.forEach((child) => {
            this.traversePreloadNode(
                child,
                meshObject,
                objectManager,
                bufferStorage,
                materialStorage,
                device
            )
        })

        return meshObject
    }
}
