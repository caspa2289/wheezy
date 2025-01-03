import { mat4, Mat4 } from 'wgpu-matrix'
import {
    EntityTypes,
    IMesh,
    IRenderer,
    IRendererProps,
    IScene,
    SceneNodeContent,
} from '../../types'
import {
    DEFAULT_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    MSAA_SAMPLE_COUNT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'
import { Stuff } from '../../../utils/Stuff'
import { IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import shaderCode from '../../shaders/testShader.wgsl'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

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

    private _shaderModule!: GPUShaderModule

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

        this._shaderModule = this.device.createShaderModule({
            code: shaderCode,
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

    public buildRenderPipeline(mesh: IMesh, scene: IScene) {
        const meshDataEntry = {} as IMeshRenderData

        //FIXME: REFACTOR THIS SHIT
        meshDataEntry.materialParamsBuffer = this.device.createBuffer({
            size: 8 * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })

        if (mesh.material) {
            const params = new Float32Array(
                meshDataEntry.materialParamsBuffer.getMappedRange()
            )
            params.set(mesh.material.baseColorFactor, 0)
            params.set(
                [mesh.material.metallicFactor, mesh.material.roughnessFactor],
                4
            )

            meshDataEntry.materialParamsBuffer.unmap()
        }

        const sampleType = 'float'

        let materialBindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: {
                    type: 'uniform',
                },
            },
        ]

        let samplerBindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = []

        let samplerBindGroupEntries: GPUBindGroupEntry[] = []

        let materialBindGroupEntries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: meshDataEntry.materialParamsBuffer,
                    size: 8 * 4,
                },
            },
        ]

        if (mesh.material?.baseColorTexture) {
            samplerBindGroupLayoutEntries.push({
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            })
            materialBindGroupLayoutEntries.push({
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType,
                },
            })

            samplerBindGroupEntries.push({
                binding: 1,
                resource: mesh.material.baseColorTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 1,
                resource: mesh.material.baseColorTexture.view,
            })
        }

        if (mesh.material?.metallicRoughnessTexture) {
            samplerBindGroupLayoutEntries.push({
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            })
            materialBindGroupLayoutEntries.push({
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType,
                },
            })

            samplerBindGroupEntries.push({
                binding: 2,
                resource: mesh.material?.metallicRoughnessTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 2,
                resource: mesh.material?.metallicRoughnessTexture.view,
            })
        }

        if (mesh.material?.normalTexture) {
            samplerBindGroupLayoutEntries.push({
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            })

            materialBindGroupLayoutEntries.push({
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {
                    sampleType,
                },
            })

            samplerBindGroupEntries.push({
                binding: 3,
                resource: mesh.material?.normalTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 3,
                resource: mesh.material?.normalTexture.view,
            })
        }

        const vertexState: GPUVertexState = {
            module: this._shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: mesh.positions.byteStride,
                    attributes: [
                        {
                            format: mesh.positions.elementType,
                            offset: 0,
                            shaderLocation: 0,
                        },
                    ],
                },
            ],
        }

        if (mesh.textureCoordinates) {
            ;(vertexState.buffers as GPUVertexBufferLayout[]).push({
                arrayStride: mesh.textureCoordinates.byteStride,
                attributes: [
                    {
                        format: mesh.textureCoordinates.elementType,
                        offset: 0,
                        shaderLocation: 1,
                    },
                ],
            })
        }

        if (mesh.normals) {
            ;(vertexState.buffers as GPUVertexBufferLayout[]).push({
                arrayStride: mesh.normals.byteStride,
                attributes: [
                    {
                        format: mesh.normals.elementType,
                        offset: 0,
                        shaderLocation: 2,
                    },
                ],
            })
        }

        const fragmentState: GPUFragmentState = {
            module: this._shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format: this._swapChainFormat }],
        }

        const primitive: GPUPrimitiveState = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
        }

        if (mesh.mode === 5) {
            primitive.topology = 'triangle-strip'
            primitive.stripIndexFormat = mesh?.indices
                ?.elementType as GPUIndexFormat
        }

        const samplerBindGroupLayout = this.device.createBindGroupLayout({
            entries: samplerBindGroupLayoutEntries,
            label: 'samplerBindGroupLayout',
        })

        const materialBindGroupLayout = this.device.createBindGroupLayout({
            entries: materialBindGroupLayoutEntries,
            label: 'materialBindGroupLayout',
        })

        meshDataEntry.samplerBindGroup = this.device.createBindGroup({
            layout: samplerBindGroupLayout,
            entries: samplerBindGroupEntries,
        })

        meshDataEntry.materialBindGroup = this.device.createBindGroup({
            layout: materialBindGroupLayout,
            entries: materialBindGroupEntries,
        })

        const layout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this.uniformsBGLayout,
                this.nodeParamsBGLayout,
                materialBindGroupLayout,
                samplerBindGroupLayout,
            ],
        })

        meshDataEntry.renderPipeline = this.device.createRenderPipeline({
            layout: layout,
            vertex: vertexState,
            fragment: fragmentState,
            primitive: primitive,
            depthStencil: {
                format: this._depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {
                count: this.msaaSampleCount,
            },
        })

        const positionsView = new Uint8Array(
            scene.bufferStorage.buffers.get(
                mesh.positions.bufferId
            ) as ArrayBuffer,
            mesh.positions.byteOffset,
            mesh.positions.byteLength
        )

        meshDataEntry.positionsBuffer = this.device.createBuffer({
            size: alignTo(mesh.positions.byteLength, 4),
            usage: mesh.positions.usage,
            mappedAtCreation: true,
        })

        new Uint8Array(meshDataEntry.positionsBuffer.getMappedRange()).set(
            positionsView
        )
        meshDataEntry.positionsBuffer.unmap()

        if (mesh.textureCoordinates) {
            const textureCoordinatesBuffer = scene.bufferStorage.buffers.get(
                mesh?.textureCoordinates.bufferId
            )

            const textureCoordinatesView = new Uint8Array(
                textureCoordinatesBuffer as ArrayBuffer,
                mesh.textureCoordinates.byteOffset,
                mesh.textureCoordinates.byteLength
            )

            meshDataEntry.textureCoordinatesBuffer = this.device.createBuffer({
                size: alignTo(mesh.textureCoordinates.byteLength, 4),
                usage: mesh.textureCoordinates.usage,
                mappedAtCreation: true,
            })
            new Uint8Array(
                meshDataEntry.textureCoordinatesBuffer.getMappedRange()
            ).set(textureCoordinatesView)
            meshDataEntry.textureCoordinatesBuffer.unmap()
        }

        if (mesh.normals) {
            const normalsBuffer = scene.bufferStorage.buffers.get(
                mesh?.normals.bufferId
            )

            const normalsView = new Uint8Array(
                normalsBuffer as ArrayBuffer,
                mesh.normals.byteOffset,
                mesh.normals.byteLength
            )

            meshDataEntry.normalsBuffer = this.device.createBuffer({
                size: alignTo(mesh.normals.byteLength, 4),
                usage: mesh.normals.usage,
                mappedAtCreation: true,
            })
            new Uint8Array(meshDataEntry.normalsBuffer.getMappedRange()).set(
                normalsView
            )
            meshDataEntry.normalsBuffer.unmap()
        }

        if (mesh.indices) {
            const indicesBuffer = scene.bufferStorage.buffers.get(
                mesh?.indices.bufferId
            )

            const indicesView = new Uint8Array(
                indicesBuffer as ArrayBuffer,
                mesh.indices.byteOffset,
                mesh.indices.byteLength
            )
            meshDataEntry.indicesBuffer = this.device.createBuffer({
                size: alignTo(mesh.indices.byteLength, 4),
                usage: mesh.indices.usage,
                mappedAtCreation: true,
            })
            new Uint8Array(meshDataEntry.indicesBuffer.getMappedRange()).set(
                indicesView
            )
            meshDataEntry.indicesBuffer.unmap()
        }

        scene.meshRenderDataStorage.data.set(mesh.id, meshDataEntry)
        mesh.isPipelineBuilt = true
    }

    private renderMesh(
        mesh: IMesh,
        scene: IScene,
        renderPassEncoder: GPURenderPassEncoder
    ) {
        const {
            renderPipeline,
            materialBindGroup,
            samplerBindGroup,
            positionsBuffer,
            textureCoordinatesBuffer,
            normalsBuffer,
            indicesBuffer,
            nodeParamsBindGroup,
        } = scene.meshRenderDataStorage.data.get(mesh.id) as IMeshRenderData

        renderPassEncoder.setBindGroup(1, nodeParamsBindGroup as GPUBindGroup)

        renderPassEncoder.setPipeline(renderPipeline as GPURenderPipeline)

        if (materialBindGroup) {
            renderPassEncoder.setBindGroup(2, materialBindGroup)
        }

        if (samplerBindGroup) {
            renderPassEncoder.setBindGroup(3, samplerBindGroup)
        }

        renderPassEncoder.setVertexBuffer(
            0,
            positionsBuffer as GPUBuffer,
            0,
            mesh.positions.byteLength
        )

        if (mesh.textureCoordinates) {
            renderPassEncoder.setVertexBuffer(
                1,
                textureCoordinatesBuffer as GPUBuffer,
                0,
                mesh.textureCoordinates.byteLength
            )
        }

        if (mesh.normals) {
            renderPassEncoder.setVertexBuffer(
                2,
                normalsBuffer as GPUBuffer,
                0,
                mesh.normals.byteLength
            )
        }

        if (mesh.indices) {
            renderPassEncoder.setIndexBuffer(
                indicesBuffer as GPUBuffer,
                mesh.indices.elementType as GPUIndexFormat,
                0,
                mesh.indices.byteLength
            )
            renderPassEncoder.drawIndexed(mesh.indices.count)
        } else {
            renderPassEncoder.draw(mesh.positions.count)
        }
    }

    public render(deltaTime: number, scene: IScene) {
        scene.onRender(deltaTime)

        const meshesToRender: IMesh[] = []
        const nodeParamsBindGroups: GPUBindGroup[] = []

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

            const viewMatrix = mat4.copy(scene.camera.view)

            mat4.translate(
                viewMatrix,
                mat4.getTranslation(meshMatrix),
                viewMatrix
            )

            mat4.scale(viewMatrix, mat4.getScaling(meshMatrix), viewMatrix)

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

            const nodeParamsBindGroup = this.device.createBindGroup({
                layout: this.nodeParamsBGLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: nodeParamsUploadBuffer,
                        },
                    },
                ],
            })

            node?.gameObject?.components?.forEach((component: any) => {
                if (component.type === EntityTypes.mesh) {
                    meshesToRender.push(component)

                    if (!(component as IMesh).isPipelineBuilt) {
                        this.buildRenderPipeline(component, scene)
                    }

                    scene.meshRenderDataStorage.data.get(
                        component.id
                    )!.nodeParamsBindGroup = nodeParamsBindGroup
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

        meshesToRender.forEach((mesh, index) => {
            this.renderMesh(mesh, scene, renderPass)
        })

        renderPass.end()
        this.device.queue.submit([commandEncoder.finish()])
        viewParamsUploadBuffer.destroy()
    }
}
