import { mat4, Mat4, vec3, vec4 } from 'wgpu-matrix'
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
    DEFAULT_SHADOW_DEPTH_FORMAT,
    DEFAULT_SWAP_CHAIN_FORMAT,
    DEFULT_SHADOW_TEXTURE_SIZE,
    MSAA_SAMPLE_COUNT,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'
import { IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import shaderCode from '../../shaders/testShader.wgsl'
import shadowShaderCode from '../../shaders/vertexShadow.wgsl'

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
    private _shadowDepthTexture!: GPUTexture
    private _shadowDepthTextureView!: GPUTextureView
    private _shadowDepthTextureSize = DEFULT_SHADOW_TEXTURE_SIZE
    private _shadowDepthSampler!: GPUSampler

    private _uniformsBGLayout!: GPUBindGroupLayout
    private _nodeParamsBGLayout!: GPUBindGroupLayout

    private _viewParamsBufferSize: number = VIEW_PARAMS_BUFFER_SIZE
    private _msaaSampleCount: number = MSAA_SAMPLE_COUNT

    private _renderPassDescriptor!: GPURenderPassDescriptor
    private _shadowPassDescriptor!: GPURenderPassDescriptor

    private _viewParamsBuffer!: GPUBuffer
    private _viewParamsBindGroup!: GPUBindGroup

    private _multisampleTextureView?: GPUTextureView

    private _shaderModule!: GPUShaderModule

    public ambientLightColor = vec3.create(1, 1, 1)
    public ambientLightIntensity: number = 0.1

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

        this._shadowDepthTexture = this._device.createTexture({
            label: 'shadowDepthTexture',
            size: [
                this._shadowDepthTextureSize,
                this._shadowDepthTextureSize,
                1,
            ],
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.TEXTURE_BINDING,
            format: DEFAULT_SHADOW_DEPTH_FORMAT,
        })

        this._shadowDepthSampler = this.device.createSampler({
            compare: 'less',
            label: 'shadow depth sampler',
        })

        this._shadowDepthTextureView = this._shadowDepthTexture.createView()

        this._shaderModule = this.device.createShaderModule({
            label: 'main shader',
            code: shaderCode,
        })

        this._initializeBindGroupLayouts()

        this._initializeViewParams()

        if (this._msaaSampleCount !== 1) {
            this._multisampleTextureView = this.device
                .createTexture({
                    size: [this._canvas.width, this._canvas.height],
                    sampleCount: this._msaaSampleCount,
                    format: this.swapChainFormat,
                    usage: GPUTextureUsage.RENDER_ATTACHMENT,
                })
                .createView()
        } else {
            this._multisampleTextureView = undefined
        }

        this._renderPassDescriptor = {
            label: 'main render pass descriptor',
            colorAttachments: [
                {
                    view: null as unknown as GPUTextureView,
                    resolveTarget: (this._msaaSampleCount === 1
                        ? undefined
                        : null) as unknown as GPUTextureView,
                    loadOp: 'clear' as GPULoadOp,
                    clearValue: [0.0, 0.0, 0.0, 1],
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: this._depthTexture.createView(),
                depthLoadOp: 'clear' as GPULoadOp,
                depthClearValue: 1.0,
                depthStoreOp: 'store' as GPUStoreOp,
                stencilLoadOp: 'clear' as GPULoadOp,
                stencilClearValue: 0,
                stencilStoreOp: 'store' as GPUStoreOp,
            },
        }

        this._shadowPassDescriptor = {
            colorAttachments: [],
            depthStencilAttachment: {
                view: this._shadowDepthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
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

    private _initializeViewParams() {
        this._viewParamsBuffer = this.device.createBuffer({
            size: this._viewParamsBufferSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this._viewParamsBindGroup = this.device.createBindGroup({
            layout: this._uniformsBGLayout,
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
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: { type: 'uniform' },
                },
            ],
        })

        this._nodeParamsBGLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
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

        samplerBindGroupLayoutEntries.push({
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {
                type: 'comparison',
            },
        })

        materialBindGroupLayoutEntries.push({
            binding: 4,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {
                sampleType: 'depth',
            },
        })

        samplerBindGroupEntries.push({
            binding: 4,
            resource: this._shadowDepthSampler,
        })

        materialBindGroupEntries.push({
            binding: 4,
            resource: this._shadowDepthTextureView,
        })

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
            cullMode: 'back',
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
            label: 'sampler bindgroup',
            layout: samplerBindGroupLayout,
            entries: samplerBindGroupEntries,
        })

        meshDataEntry.materialBindGroup = this.device.createBindGroup({
            label: 'material bindgroup',
            layout: materialBindGroupLayout,
            entries: materialBindGroupEntries,
        })

        const layout = this.device.createPipelineLayout({
            bindGroupLayouts: [
                this._uniformsBGLayout,
                this._nodeParamsBGLayout,
                materialBindGroupLayout,
                samplerBindGroupLayout,
            ],
        })

        meshDataEntry.shadowRenderPipeline = this.device.createRenderPipeline({
            label: 'shadow render pipeline',
            layout: this.device.createPipelineLayout({
                label: 'shadow render pipeline layout',
                bindGroupLayouts: [
                    this._uniformsBGLayout,
                    this._nodeParamsBGLayout,
                ],
            }),
            vertex: {
                module: this.device.createShaderModule({
                    label: 'shadow shader module',
                    code: shadowShaderCode,
                }),
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
            },
            depthStencil: {
                depthWriteEnabled: true,
                depthCompare: 'less',
                format: 'depth32float',
            },
            primitive,
        })

        meshDataEntry.renderPipeline = this.device.createRenderPipeline({
            label: 'main render pipeline',
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
                count: this._msaaSampleCount,
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

    private renderMeshShadows(
        mesh: IMesh,
        scene: IScene,
        renderPassEncoder: GPURenderPassEncoder
    ) {
        const {
            shadowRenderPipeline,
            positionsBuffer,
            indicesBuffer,
            nodeParamsBindGroup,
        } = scene.meshRenderDataStorage.data.get(mesh.id) as IMeshRenderData

        renderPassEncoder.setBindGroup(1, nodeParamsBindGroup as GPUBindGroup)

        renderPassEncoder.setPipeline(shadowRenderPipeline as GPURenderPipeline)

        renderPassEncoder.setVertexBuffer(
            0,
            positionsBuffer as GPUBuffer,
            0,
            mesh.positions.byteLength
        )

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

        const viewParamsUploadBuffer = this.device.createBuffer({
            size: this._viewParamsBufferSize,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const viewMap = new Float32Array(
            viewParamsUploadBuffer.getMappedRange()
        )
        viewMap.set(scene.camera.projectionMatrix)
        viewMap.set(scene.camera.view, 16)
        viewMap.set(scene.camera.position, 32)
        //FIXME: this will be an array of lights in the scene
        viewMap.set(scene.light.projectionMatrix, 36)
        viewMap.set(scene.light.viewMatrix, 52)
        viewMap.set(scene.light.position, 68)
        viewMap.set(
            vec4.create(...this.ambientLightColor, this.ambientLightIntensity),
            72
        )

        viewParamsUploadBuffer.unmap()

        const iterateNode = (node: SceneNodeContent, worldMatrix: Mat4) => {
            const nodeTransform = node.gameObject.transform

            const meshMatrix = nodeTransform
                ? mat4.mul(worldMatrix, nodeTransform.matrix)
                : worldMatrix

            const nodeParamsUploadBuffer = this.device.createBuffer({
                size: 16 * 4,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                mappedAtCreation: true,
            })
            const nodeParamsMap = new Float32Array(
                nodeParamsUploadBuffer.getMappedRange()
            )
            nodeParamsMap.set(meshMatrix)
            nodeParamsUploadBuffer.unmap()

            const nodeParamsBindGroup = this.device.createBindGroup({
                layout: this._nodeParamsBGLayout,
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
                    //FIXME: transform calculations are not performed for the light transform as of now
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
            this._viewParamsBuffer,
            0,
            this._viewParamsBufferSize
        )
        ;(this._renderPassDescriptor as any).colorAttachments[0].view =
            this.context.getCurrentTexture().createView()
        if (this._msaaSampleCount !== 1) {
            ;(this._renderPassDescriptor as any).colorAttachments[0].view =
                this._multisampleTextureView
            ;(
                this._renderPassDescriptor as any
            ).colorAttachments[0].resolveTarget = this.context
                .getCurrentTexture()
                .createView()
        }

        const shadowPass = commandEncoder.beginRenderPass(
            this._shadowPassDescriptor
        )

        shadowPass.setBindGroup(0, this._viewParamsBindGroup)

        meshesToRender.forEach((mesh) => {
            this.renderMeshShadows(mesh, scene, shadowPass)
        })

        shadowPass.end()

        const renderPass = commandEncoder.beginRenderPass(
            this._renderPassDescriptor
        )

        renderPass.setBindGroup(0, this._viewParamsBindGroup)

        meshesToRender.forEach((mesh) => {
            this.renderMesh(mesh, scene, renderPass)
        })

        renderPass.end()

        this.device.queue.submit([commandEncoder.finish()])
        viewParamsUploadBuffer.destroy()
    }
}
