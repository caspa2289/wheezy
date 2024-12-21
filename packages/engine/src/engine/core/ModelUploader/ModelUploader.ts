import { vec3, vec4 } from 'wgpu-matrix'
import {
    GLTFAccessor,
    GLTFTextureFilter,
    GLTFTextureWrap,
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
            console.warn('No texture data')

            return
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
        modelData.materials.forEach((value, key) => {
            const material: IMaterial = {
                name: value.name,
                emissiveFactor: value?.emissiveFactor ?? vec3.create(1, 1, 1),
                metallicFactor: value?.metallicFactor ?? 1,
                roughnessFactor: value.roughnessFactor ?? 1,
                baseColorFactor:
                    value?.baseColorFactor ?? vec4.create(1, 1, 1, 1),
            }

            if (value.baseColorTextureId) {
                material.baseColorTexture = this.createGPUTexture(
                    device,
                    'rgba8unorm-srgb',
                    samplerStorage,
                    imageStorage,
                    textureStorage.textures.get(value.baseColorTextureId)
                )
            }

            if (value.metallicRoughnessTextureId) {
                material.metallicRoughnessTexture = this.createGPUTexture(
                    device,
                    'rgba8unorm',
                    samplerStorage,
                    imageStorage,
                    textureStorage.textures.get(
                        value.metallicRoughnessTextureId
                    )
                )
            }

            if (value.normalTextureId) {
                material.normalTexture = this.createGPUTexture(
                    device,
                    'rgba8unorm-srgb',
                    samplerStorage,
                    imageStorage,
                    textureStorage.textures.get(value.normalTextureId)
                )
            }

            materialStorage.materials.set(key, material)
        })
    }

    private static traversePreloadNode(
        node: IPreloadEntity,
        parentGameObject: IGameObject,
        objectManager: IObjectManager,
        pipelineParams: {
            device: GPUDevice
            shaderModule: GPUShaderModule
            colorFormat: GPUTextureFormat
            depthFormat: GPUTextureFormat
            msaaSampleCount: number | undefined
            uniformsBGLayout: GPUBindGroupLayout
            nodeParamsBGLayout: GPUBindGroupLayout
        },
        bufferStorage: IBufferStorage,
        materialStorage: IMaterialStorage
    ) {
        const { trsMatrix, meshes, children } = node

        const gameObject = new GameObject()

        objectManager.addObject(gameObject, parentGameObject)

        new Transform(gameObject, trsMatrix)

        const {
            device,
            shaderModule,
            colorFormat: swapChainFormat,
            depthFormat,
            msaaSampleCount,
            uniformsBGLayout: viewParamsBindGroupLayout,
            nodeParamsBGLayout: nodeParamsBindGroupLayout,
        } = pipelineParams

        meshes.forEach((meshData) => {
            const mesh = new Mesh(
                gameObject,
                meshData.positions as GLTFAccessor,
                meshData.indices,
                meshData.normals,
                meshData.textureCoordinates,
                meshData.materialId
                    ? materialStorage.materials.get(meshData.materialId)
                    : undefined
            )

            mesh.buildRenderPipeline(
                device,
                shaderModule,
                swapChainFormat,
                depthFormat,
                msaaSampleCount,
                viewParamsBindGroupLayout,
                nodeParamsBindGroupLayout,
                bufferStorage
            )
        })

        children.forEach((child) => {
            this.traversePreloadNode(
                child,
                gameObject,
                objectManager,
                pipelineParams,
                bufferStorage,
                materialStorage
            )
        })
    }

    public static async uploadModel(
        modelData: IModelPreloadData,
        objectManager: IObjectManager,
        pipelineParams: {
            device: GPUDevice
            shaderModule: GPUShaderModule
            colorFormat: GPUTextureFormat
            depthFormat: GPUTextureFormat
            uniformsBGLayout: GPUBindGroupLayout
            nodeParamsBGLayout: GPUBindGroupLayout
            msaaSampleCount: number | undefined
        },
        bufferStorage: IBufferStorage,
        imageStorage: IImageStorage,
        samplerStorage: ISamplerStorage,
        materialStorage: IMaterialStorage,
        textureStorage: ITextureStorage,
        sceneObject: IGameObject
    ) {
        const {
            device,
            shaderModule,
            colorFormat: swapChainFormat,
            depthFormat,
            uniformsBGLayout: viewParamsBindGroupLayout,
            nodeParamsBGLayout: nodeParamsBindGroupLayout,
            msaaSampleCount,
        } = pipelineParams

        this.uploadBuffers(modelData, bufferStorage)
        await this.uploadImages(modelData, bufferStorage, imageStorage)
        this.uploadSamplers(modelData, samplerStorage, pipelineParams.device)
        this.uploadTextures(modelData, textureStorage)
        this.uploadMaterials(
            modelData,
            textureStorage,
            samplerStorage,
            imageStorage,
            materialStorage,
            pipelineParams.device
        )

        const { trsMatrix, meshes, children } = modelData.model

        const meshObject = new GameObject()

        objectManager.addObject(meshObject, sceneObject)

        new Transform(meshObject, trsMatrix)

        meshes.forEach((meshData) => {
            const mesh = new Mesh(
                meshObject,
                meshData.positions as GLTFAccessor,
                meshData.indices,
                meshData.normals,
                meshData.textureCoordinates,
                meshData.materialId
                    ? materialStorage.materials.get(meshData.materialId)
                    : undefined
            )

            mesh.buildRenderPipeline(
                device,
                shaderModule,
                swapChainFormat,
                depthFormat,
                msaaSampleCount,
                viewParamsBindGroupLayout,
                nodeParamsBindGroupLayout,
                bufferStorage
            )
        })

        children.forEach((child) => {
            this.traversePreloadNode(
                child,
                meshObject,
                objectManager,
                pipelineParams,
                bufferStorage,
                materialStorage
            )
        })

        return meshObject
    }
}
