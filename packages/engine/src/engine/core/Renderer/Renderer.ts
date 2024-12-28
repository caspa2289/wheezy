import { mat4, Mat4 } from 'wgpu-matrix'
import {
    EntityTypes,
    IRenderer,
    IRendererProps,
    IScene,
    SceneNodeContent,
} from '../../types'
import { Mesh } from '../Mesh'
import {
    DEFAULT_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    MSAA_SAMPLE_COUNT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'
import { Stuff } from '../../../utils/Stuff'

export class Renderer implements IRenderer {
    private _adapter!: GPUAdapter
    private _device!: GPUDevice
    private _context!: GPUCanvasContext
    private _canvas: HTMLCanvasElement

    private _swapChainFormat: GPUTextureFormat = DEFAULT_SWAP_CHAIN_FORMAT
    private _depthTextureFormat: GPUTextureFormat = DEFAULT_DEPTH_FORMAT
    private _depthTexture!: GPUTexture

    private _uniformsBGLayout!: GPUBindGroupLayout
    private _nodeParamsBGLayout!: GPUBindGroupLayout

    private _viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE
    private _msaaSampleCount: number = MSAA_SAMPLE_COUNT

    private _renderPassDescriptor!: GPURenderPassDescriptor

    private _viewParamsBuffer!: GPUBuffer
    private _viewParamsBindGroup!: GPUBindGroup

    private _multisampleTextureView?: GPUTextureView

    constructor({ canvas }: IRendererProps) {
        this._canvas = canvas
    }

    public async init() {
        await this._initializeContext(this._canvas)

        this._context.configure({
            device: this._device,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            format: this._swapChainFormat,
        })

        this._depthTexture = this._device.createTexture({
            label: 'depthTexture',
            size: {
                width: this._context.canvas.width,
                height: this._context.canvas.height,
            },
            sampleCount: this._msaaSampleCount,
            format: this._depthTextureFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })

        this._initializeBindGroupLayouts()

        this._initializeViewParams()

        if (this.msaaSampleCount !== 1) {
            this._multisampleTextureView = this.device
                .createTexture({
                    size: [this._canvas.width, this._canvas.height],
                    sampleCount: this.msaaSampleCount,
                    format: this.swapChainFormat,
                    usage: GPUTextureUsage.RENDER_ATTACHMENT,
                })
                .createView()
        } else {
            this._multisampleTextureView = undefined
        }

        this._renderPassDescriptor = {
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView,
                    resolveTarget: (this.msaaSampleCount === 1
                        ? undefined
                        : null) as unknown as GPUTextureView,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 1],
                    storeOp:
                        this.msaaSampleCount === 1
                            ? 'store'
                            : ('discard' as GPUStoreOp),
                },
            ],
            depthStencilAttachment: {
                view: this.depthTexture.createView(),
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
                stencilLoadOp: 'clear' as GPULoadOp,
                stencilClearValue: 0,
                stencilStoreOp: 'store' as GPUStoreOp,
            },
        }
    }

    get device() {
        return this._device
    }

    get adapter() {
        return this._adapter
    }

    get context() {
        return this._context
    }

    get swapChainFormat() {
        return this._swapChainFormat
    }

    get depthTextureFormat() {
        return this._depthTextureFormat
    }

    get depthTexture() {
        return this._depthTexture
    }

    get uniformsBGLayout() {
        return this._uniformsBGLayout
    }

    get nodeParamsBGLayout() {
        return this._nodeParamsBGLayout
    }

    get viewParamsBufferSize() {
        return this._viewParamsBufferSize
    }

    get msaaSampleCount() {
        return this._msaaSampleCount
    }

    get renderPassDescriptor() {
        return this._renderPassDescriptor
    }

    get viewParamsBuffer() {
        return this._viewParamsBuffer
    }

    get viewParamsBindGroup() {
        return this._viewParamsBindGroup
    }

    get multisampleTextureView() {
        return this._multisampleTextureView
    }

    private _initializeViewParams() {
        this._viewParamsBuffer = this.device.createBuffer({
            size: this.viewParamsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this._viewParamsBindGroup = this.device.createBindGroup({
            layout: this.uniformsBGLayout,
            entries: [
                { binding: 0, resource: { buffer: this._viewParamsBuffer } },
            ],
        })
    }

    private _initializeBindGroupLayouts() {
        this._uniformsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'uniform' },
                },
            ],
        })

        this._nodeParamsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'uniform' },
                },
            ],
        })
    }

    private async _initializeContext(canvas: HTMLCanvasElement) {
        const adapter = await navigator.gpu.requestAdapter()

        if (!adapter) {
            throw new Error('GPU Adapter Unavailable')
        }

        const device = await adapter.requestDevice()

        this._device = device
        this._adapter = adapter

        canvas.width = document.body.clientWidth * window.devicePixelRatio
        canvas.height = document.body.clientHeight * window.devicePixelRatio

        this._context = canvas.getContext('webgpu') as GPUCanvasContext

        if (!this._context) {
            throw new Error('Failed to acquire GpuCanvasContext')
        }
    }

    public render(deltaTime: number, scene: IScene) {
        scene.onRender(deltaTime)

        //FIXME: replace with interface after refactoring
        const meshesToRender: Mesh[] = []

        const viewParamsUploadBuffer = this.device.createBuffer({
            size: this.viewParamsBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const viewMap = new Float32Array(
            viewParamsUploadBuffer.getMappedRange()
        )
        viewMap.set(scene.camera.projectionMatrix)
        viewMap.set(scene.camera.position, 16)

        viewParamsUploadBuffer.unmap()

        const iterateNode = (node: SceneNodeContent, worldMatrix: Mat4) => {
            const nodeTransform = node.gameObject.transform

            const meshMatrix = nodeTransform
                ? mat4.mul(worldMatrix, nodeTransform.matrix)
                : worldMatrix

            node?.gameObject?.components?.forEach((component: any) => {
                if (component.type === EntityTypes.mesh) {
                    //FIXME: this can be done once per node, and only if node contains meshes
                    const viewMatrix = mat4.copy(scene.camera.view)

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

                    const nodeParamsUploadBuffer = this.device.createBuffer({
                        size: 16 * 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                        mappedAtCreation: true,
                    })
                    const nodeParamsMap = new Float32Array(
                        nodeParamsUploadBuffer.getMappedRange()
                    )
                    nodeParamsMap.set(viewMatrix)
                    nodeParamsUploadBuffer.unmap()

                    component.nodeParamsBindGroup = this.device.createBindGroup(
                        {
                            layout: this.nodeParamsBGLayout,
                            entries: [
                                {
                                    binding: 0,
                                    resource: {
                                        buffer: nodeParamsUploadBuffer,
                                    },
                                },
                            ],
                        }
                    )

                    meshesToRender.push(component)
                }
            })

            node?.children?.forEach((child: any) => {
                iterateNode(child, meshMatrix)
            })
        }

        scene.objectManager.sceneTree.nodes.forEach((node) => {
            iterateNode(node, mat4.identity())
        })

        const commandEncoder = this.device.createCommandEncoder()

        commandEncoder.copyBufferToBuffer(
            viewParamsUploadBuffer,
            0,
            this.viewParamsBuffer,
            0,
            this.viewParamsBufferSize
        )
        ;(this.renderPassDescriptor as any).colorAttachments[0].view =
            this.context.getCurrentTexture().createView()
        if (this.msaaSampleCount !== 1) {
            ;(this.renderPassDescriptor as any).colorAttachments[0].view =
                this._multisampleTextureView
            ;(
                this.renderPassDescriptor as any
            ).colorAttachments[0].resolveTarget = this.context
                .getCurrentTexture()
                .createView()
        }

        const renderPass = commandEncoder.beginRenderPass(
            this.renderPassDescriptor
        )

        renderPass.setBindGroup(0, this.viewParamsBindGroup)

        meshesToRender.forEach((mesh) => {
            renderPass.setBindGroup(1, mesh.nodeParamsBindGroup as GPUBindGroup)
            mesh.render(renderPass)
        })

        renderPass.end()
        this.device.queue.submit([commandEncoder.finish()])
        viewParamsUploadBuffer.destroy()
    }
}
