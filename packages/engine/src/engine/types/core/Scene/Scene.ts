import { IEngine, IModelPreloadData } from '../..'
import { IBufferStorage } from '../BufferStorage'
import { ICamera } from '../Camera'
import { IGameObject } from '../GameObject'
import { IImageStorage } from '../ImageStorage'
import { IMaterialStorage } from '../MaterialStorage'
import { IObjectManager } from '../ObjectManager'
import { ISamplerStorage } from '../SamplerStorage'
import { ITextureStorage } from '../TextureStorage'

export interface ISceneUploadModelProps {
    modelData: IModelPreloadData
    shaderModule: GPUShaderModule
}

export interface IScene {
    camera: ICamera
    objectManager: IObjectManager
    bufferStorage: IBufferStorage
    imageStorage: IImageStorage
    samplerStorage: ISamplerStorage
    textureStorage: ITextureStorage
    materialStorage: IMaterialStorage
    renderPassDescriptor: GPURenderPassDescriptor
    viewParamsBuffer: GPUBuffer
    viewParamsBindGroup: GPUBindGroup
    multisampleTextureView?: GPUTextureView
    engine: IEngine

    uploadModel: (props: ISceneUploadModelProps) => Promise<IGameObject>
    render: (deltaTime: number) => void
}

export interface ISceneProps {
    camera?: ICamera
}
