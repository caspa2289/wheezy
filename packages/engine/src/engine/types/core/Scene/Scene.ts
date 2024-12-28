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
    engine: IEngine
    root: IGameObject

    uploadModel: (props: ISceneUploadModelProps) => Promise<IGameObject>
    onRender: (dt: number) => void
}

export interface ISceneProps {
    camera?: ICamera
}
