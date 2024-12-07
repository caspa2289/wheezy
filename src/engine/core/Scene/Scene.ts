import { mat4, Mat4, vec3 } from 'wgpu-matrix'
import {
    EntityTypes,
    IBufferStorage,
    IEngine,
    IGameObject,
    IImageStorage,
    IMesh,
    IObjectManager,
    ISamplerStorage,
    IScene,
    ISceneProps,
    ISceneUploadModelProps,
    ITransform,
    SceneNodeContent,
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
import { Stuff } from '../../../utils/Stuff'
import { Mesh } from '../Mesh'

export class Scene implements IScene {
    private _objectManager: IObjectManager = new ObjectManager()
    private _bufferStorage: IBufferStorage = new BufferStorage()
    private _imageStorage: IImageStorage = new ImageStorage()
    private _samplerStorage: ISamplerStorage = new SamplerStorage()
    private _textureStorage = new TextureStorage()
    private _materialStorage = new MaterialStorage()

    private _camera!: ICamera

    private _engine?: IEngine

    private _renderPassDescriptor: GPURenderPassDescriptor

    private _viewParamsBuffer!: GPUBuffer
    private _viewParamsBindGroup!: GPUBindGroup

    constructor({ camera }: ISceneProps) {
        //FIXME: types
        this._engine = (window as any).WheezyEngine as IEngine | undefined

        if (!this._engine) {
            throw new Error(
                'Failed to initialize scene as no instance of Wheezy Engine is found'
            )
        }

        this._initializeViewParams()

        this._renderPassDescriptor = {
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.4, 0.4, 0.4, 1],
                    storeOp: 'store' as GPUStoreOp,
                },
            ],
            depthStencilAttachment: {
                view: this._engine.depthTexture.createView(),
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
                stencilLoadOp: 'clear' as GPULoadOp,
                stencilClearValue: 0,
                stencilStoreOp: 'store' as GPUStoreOp,
            },
        }

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

    get renderPassDescriptor() {
        return this._renderPassDescriptor
    }

    get camera() {
        return this._camera
    }

    set camera(value) {
        this._camera = value
    }

    get viewParamsBuffer() {
        return this._viewParamsBuffer
    }

    get viewParamsBindGroup() {
        return this._viewParamsBindGroup
    }

    private _initializeViewParams() {
        if (!this._engine) {
            throw new Error(
                'Failed to initialize buffers as no instance of Wheezy Engine is found'
            )
        }

        this._viewParamsBuffer = this._engine.device.createBuffer({
            size: this._engine.viewParamsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this._viewParamsBindGroup = this._engine.device.createBindGroup({
            layout: this._engine.uniformsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this._viewParamsBuffer } },
            ],
        })
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
            },
            this._bufferStorage,
            this._imageStorage,
            this._samplerStorage,
            this._materialStorage,
            this._textureStorage
        )
    }

    public render(deltaTime?: number) {
        if (!this._engine) {
            throw new Error(
                'Failed to render scene as no instance of Wheezy Engine is found'
            )
        }

        // this.camera.update()
        const meshesToRender: Mesh[] = []

        const viewParamsUploadBuffer = this._engine.device.createBuffer({
            size: this._engine.viewParamsBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const viewMap = new Float32Array(
            viewParamsUploadBuffer.getMappedRange()
        )
        viewMap.set(this.camera.projectionMatrix)
        viewMap.set(this.camera.position, 16)

        viewParamsUploadBuffer.unmap()

        const iterateNode = (node: SceneNodeContent, worldMatrix: Mat4) => {
            const nodeTransform = [...node.gameObject.components.values()].find(
                (component) => component.type === EntityTypes.transform
            ) as ITransform | undefined

            const meshMatrix = nodeTransform
                ? mat4.mul(worldMatrix, nodeTransform.matrix)
                : worldMatrix

            node?.gameObject?.components?.forEach((component: any) => {
                if (!this._engine) {
                    throw new Error(
                        'Failed to iterate nodes as no instance of Wheezy Engine is found'
                    )
                }
                if (component.type === EntityTypes.mesh) {
                    //FIXME: this can be done once per node, and only if node contains meshes
                    const viewMatrix = mat4.copy(this.camera.view)

                    mat4.translate(
                        viewMatrix,
                        mat4.getTranslation(meshMatrix),
                        viewMatrix
                    )

                    mat4.scale(
                        viewMatrix,
                        mat4.getScaling(meshMatrix),
                        viewMatrix
                    )

                    //FIXME: Do this once on load
                    const meshRotation = Stuff.extractEulerRotation(meshMatrix)

                    mat4.rotateX(viewMatrix, meshRotation[0], viewMatrix)
                    mat4.rotateY(viewMatrix, meshRotation[1], viewMatrix)
                    mat4.rotateZ(viewMatrix, meshRotation[2], viewMatrix)

                    const nodeParamsUploadBuffer =
                        this._engine.device.createBuffer({
                            size: 16 * 4,
                            usage:
                                GPUBufferUsage.UNIFORM |
                                GPUBufferUsage.COPY_DST,
                            mappedAtCreation: true,
                        })
                    const nodeParamsMap = new Float32Array(
                        nodeParamsUploadBuffer.getMappedRange()
                    )
                    nodeParamsMap.set(viewMatrix)
                    nodeParamsUploadBuffer.unmap()

                    component.nodeParamsBindGroup =
                        this._engine.device.createBindGroup({
                            layout: this._engine.nodeParamsBGLayout,
                            entries: [
                                {
                                    binding: 0,
                                    resource: {
                                        buffer: nodeParamsUploadBuffer,
                                    },
                                },
                            ],
                        })

                    meshesToRender.push(component)
                }
            })

            node?.children?.forEach((child: any) => {
                iterateNode(child, meshMatrix)
            })
        }

        this.objectManager.sceneTree.nodes.forEach((node) => {
            iterateNode(node, mat4.identity())
        })

        const commandEncoder = this._engine.device.createCommandEncoder()

        commandEncoder.copyBufferToBuffer(
            viewParamsUploadBuffer,
            0,
            this.viewParamsBuffer,
            0,
            this._engine.viewParamsBufferSize
        )
        ;(this.renderPassDescriptor as any).colorAttachments[0].view =
            this._engine.context.getCurrentTexture().createView()
        const renderPass = commandEncoder.beginRenderPass(
            this.renderPassDescriptor
        )

        renderPass.setBindGroup(0, this.viewParamsBindGroup)

        meshesToRender.forEach((mesh) => {
            renderPass.setBindGroup(1, mesh.nodeParamsBindGroup as GPUBindGroup)
            mesh.render(renderPass)
        })

        renderPass.end()
        this._engine.device.queue.submit([commandEncoder.finish()])
        viewParamsUploadBuffer.destroy()
    }
}
