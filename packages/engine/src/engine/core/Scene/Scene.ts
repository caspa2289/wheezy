import { vec3 } from 'wgpu-matrix'
import {
    type IAnimationSystem,
    type IBufferStorage,
    type IGameObject,
    type IImageStorage,
    type IObjectManager,
    type ISamplerStorage,
    type IScene,
    type ISceneProps,
    type ISceneUploadModelProps,
    type ISkin,
} from '../../types'
import { type ICamera } from '../../types/core/Camera'
import { BufferStorage } from '../BufferStorage'
import { ArcBallCamera } from '../cameras/ArcBallCamera'
import { isEngineReady, renderer } from '../globals'
import { ImageStorage } from '../ImageStorage'
import { MaterialStorage } from '../MaterialStorage'
import { ModelUploader } from '../ModelUploader'
import { ObjectManager } from '../ObjectManager'
import { SamplerStorage } from '../SamplerStorage'
import { TextureStorage } from '../TextureStorage'
import { GameObject } from '../GameObject'
import { MeshRenderDataStorage } from '../MeshRenderDataStorage'
import { type IDirectionalLight } from '../lights/DirectionalLightV2'
import { type IPointLight, type ISpotLight } from '../lights'
import { AnimationSystem } from '../animation'

export class Scene implements IScene {
    #objectManager: IObjectManager = new ObjectManager()
    #bufferStorage: IBufferStorage = new BufferStorage()
    #imageStorage: IImageStorage = new ImageStorage()
    #samplerStorage: ISamplerStorage
    #textureStorage = new TextureStorage()
    #materialStorage = new MaterialStorage()
    #meshRenderDataStorage = new MeshRenderDataStorage()

    #camera!: ICamera

    #root: IGameObject

    directionalLights: IDirectionalLight[] = []
    pointLights: IPointLight[] = []
    spotLights: ISpotLight[] = []
    skins: ISkin[] = []
    readonly animations: IAnimationSystem = new AnimationSystem()

    constructor(props?: ISceneProps) {
        const { camera } = props ?? {}

        if (!isEngineReady()) {
            throw new Error(
                'Failed to initialize scene as no instance of Wheezy Engine is found'
            )
        }

        this.#samplerStorage = new SamplerStorage(renderer.device)

        this.#root = new GameObject()

        this.#objectManager.addObject(this.#root)

        this.camera =
            camera ??
            new ArcBallCamera({
                zFar: 1000,
                zNear: 0.1,
                canvasWidth: renderer.context.canvas.width,
                canvasHeight: renderer.context.canvas.height,
                position: vec3.create(0, 0, 5),
            })
    }

    public async init() {
        await this.imageStorage.createDefaults()
    }

    get objectManager() {
        return this.#objectManager
    }

    get root() {
        return this.#root
    }

    get textureStorage() {
        return this.#textureStorage
    }

    get meshRenderDataStorage() {
        return this.#meshRenderDataStorage
    }

    get materialStorage() {
        return this.#materialStorage
    }

    get bufferStorage() {
        return this.#bufferStorage
    }

    get imageStorage() {
        return this.#imageStorage
    }

    get samplerStorage() {
        return this.#samplerStorage
    }

    get camera() {
        return this.#camera
    }

    set camera(value) {
        this.#camera = value
    }

    public async uploadModel(
        props: ISceneUploadModelProps
    ): Promise<IGameObject> {
        return ModelUploader.uploadModel(
            props.modelData,
            this.#objectManager,
            this.#bufferStorage,
            this.#imageStorage,
            this.#samplerStorage,
            this.#materialStorage,
            this.#textureStorage,
            this.#root,
            renderer.device,
            this.skins,
            this.animations
        )
    }

    public onRender(_: number) {
        throw new Error(
            'onRender method should be redefined in extending class'
        )
    }
}
