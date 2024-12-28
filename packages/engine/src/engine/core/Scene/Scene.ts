import { vec3 } from 'wgpu-matrix'
import {
    IBufferStorage,
    IEngine,
    IGameObject,
    IImageStorage,
    IObjectManager,
    ISamplerStorage,
    IScene,
    ISceneProps,
    ISceneUploadModelProps,
} from '../../types'
import { ICamera } from '../../types/core/Camera'
import { BufferStorage } from '../BufferStorage'
import { ArcBallCamera } from '../cameras/ArcBallCamera'
import { ImageStorage } from '../ImageStorage'
import { MaterialStorage } from '../MaterialStorage'
import { ModelUploader } from '../ModelUploader'
import { ObjectManager } from '../ObjectManager'
import { SamplerStorage } from '../SamplerStorage'
import { TextureStorage } from '../TextureStorage'
import { GameObject } from '../GameObject'

export class Scene implements IScene {
    private _objectManager: IObjectManager = new ObjectManager()
    private _bufferStorage: IBufferStorage = new BufferStorage()
    private _imageStorage: IImageStorage = new ImageStorage()
    private _samplerStorage: ISamplerStorage = new SamplerStorage()
    private _textureStorage = new TextureStorage()
    private _materialStorage = new MaterialStorage()

    private _camera!: ICamera

    protected _engine?: IEngine

    private _root: IGameObject

    constructor(props?: ISceneProps) {
        const { camera } = props ?? {}
        //FIXME: types
        this._engine = (window as any).WheezyEngine as IEngine | undefined

        if (!this._engine) {
            throw new Error(
                'Failed to initialize scene as no instance of Wheezy Engine is found'
            )
        }

        this._root = new GameObject()

        this._objectManager.addObject(this._root)

        this.camera =
            camera ??
            new ArcBallCamera({
                zFar: 1000,
                zNear: 0.1,
                canvasWidth: this._engine.context.canvas.width,
                canvasHeight: this._engine.context.canvas.height,
                position: vec3.create(0, 0, 5),
            })
    }

    get objectManager() {
        return this._objectManager
    }

    get root() {
        return this._root
    }

    get textureStorage() {
        return this._textureStorage
    }

    get materialStorage() {
        return this._materialStorage
    }

    get bufferStorage() {
        return this._bufferStorage
    }

    get imageStorage() {
        return this._imageStorage
    }

    get samplerStorage() {
        return this._samplerStorage
    }

    get camera() {
        return this._camera
    }

    set camera(value) {
        this._camera = value
    }

    get engine() {
        return this._engine as IEngine
    }

    public uploadModel(props: ISceneUploadModelProps): Promise<IGameObject> {
        if (!this._engine) {
            throw new Error(
                'Failed to upload model as no instance of Wheezy Engine is found'
            )
        }

        return ModelUploader.uploadModel(
            props.modelData,
            this._objectManager,
            {
                device: this._engine.device,
                shaderModule: props.shaderModule,
                colorFormat: this._engine.swapChainFormat,
                depthFormat: this._engine.depthTextureFormat,
                uniformsBGLayout: this._engine.uniformsBGLayout,
                nodeParamsBGLayout: this._engine.nodeParamsBGLayout,
                msaaSampleCount: this._engine.msaaSampleCount,
            },
            this._bufferStorage,
            this._imageStorage,
            this._samplerStorage,
            this._materialStorage,
            this._textureStorage,
            this._root
        )
    }

    public onRender(_: number) {
        throw new Error(
            'onRender method should be redefined in extending class'
        )
    }
}
