import { type IModelPreloadData } from '../..'
import { type IPointLight, type ISpotLight } from '../../../core'
import { type IDirectionalLight } from '../../../core/lights/DirectionalLightV2'
import { type IBufferStorage } from '../BufferStorage'
import { type ICamera } from '../Camera'
import { type IGameObject } from '../GameObject'
import { type IImageStorage } from '../ImageStorage'
import { type IMaterialStorage } from '../MaterialStorage'
import { type IMeshRenderDataStorage } from '../MeshRenderDataStorage'
import { type IObjectManager } from '../ObjectManager'
import { type ISamplerStorage } from '../SamplerStorage'
import { type ITextureStorage } from '../TextureStorage'

export interface ISceneUploadModelProps {
    modelData: IModelPreloadData
}

export interface IScene {
    camera: ICamera
    objectManager: IObjectManager
    bufferStorage: IBufferStorage
    imageStorage: IImageStorage
    samplerStorage: ISamplerStorage
    textureStorage: ITextureStorage
    materialStorage: IMaterialStorage
    meshRenderDataStorage: IMeshRenderDataStorage
    root: IGameObject
    directionalLights: IDirectionalLight[]
    pointLights: IPointLight[]
    spotLights: ISpotLight[]

    init: () => Promise<void>
    uploadModel: (props: ISceneUploadModelProps) => Promise<IGameObject>
    onRender: (dt: number) => void
}

export interface ISceneProps {
    camera?: ICamera
}
