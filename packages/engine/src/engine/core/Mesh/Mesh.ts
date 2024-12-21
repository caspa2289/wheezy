import {
    EntityTypes,
    GLTFAccessor,
    IGameObject,
    IMaterial,
    IMesh,
} from '../../types'
import { IBufferStorage } from '../../types/core/BufferStorage'
import { Component } from '../Component'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    mode = 4 // GPU topology mode
    positions: GLTFAccessor
    indices?: GLTFAccessor
    textureCoordinates?: GLTFAccessor
    normals?: GLTFAccessor
    renderPipeline?: GPURenderPipeline
    nodeParamsBindGroup?: GPUBindGroup
    material?: IMaterial
    private positionsBuffer?: GPUBuffer
    private indicesBuffer?: GPUBuffer
    private textureCoordinatesBuffer?: GPUBuffer
    private normalsBuffer?: GPUBuffer
    private materialParamsBuffer?: GPUBuffer
    private materialBindGroup?: GPUBindGroup
    private samplerBindGroup?: GPUBindGroup

    constructor(
        parent: IGameObject,
        positions: GLTFAccessor,
        indices?: GLTFAccessor,
        normals?: GLTFAccessor,
        textureCoordinates?: GLTFAccessor,
        material?: IMaterial
    ) {
        super(parent, EntityTypes.mesh)

        this.positions = positions
        this.indices = indices
        this.textureCoordinates = textureCoordinates
        this.material = material
        this.normals = normals
    }

    public buildRenderPipeline(
        device: GPUDevice,
        shaderModule: GPUShaderModule,
        colorFormat: GPUTextureFormat,
        depthFormat: GPUTextureFormat,
        msaaSampleCount: number | undefined,
        uniformsBGLayout: GPUBindGroupLayout,
        nodeParamsBGLayout: GPUBindGroupLayout,
        bufferStorage: IBufferStorage
    ) {
        //FIXME: REFACTOR THIS SHIT
        this.materialParamsBuffer = device.createBuffer({
            size: 8 * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })

        if (this.material) {
            const params = new Float32Array(
                this.materialParamsBuffer.getMappedRange()
            )
            params.set(this.material.baseColorFactor, 0)
            params.set(
                [this.material.metallicFactor, this.material.roughnessFactor],
                4
            )

            this.materialParamsBuffer.unmap()
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

        let samplerBindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: {
                    type: 'uniform',
                },
            },
        ]

        let samplerBindGroupEntries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: this.materialParamsBuffer,
                    size: 8 * 4,
                },
            },
        ]

        let materialBindGroupEntries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: this.materialParamsBuffer,
                    size: 8 * 4,
                },
            },
        ]

        // If we have a base color texture, add the sampler and texture bindings
        if (this.material?.baseColorTexture) {
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
                resource: this.material.baseColorTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 1,
                resource: this.material.baseColorTexture.view,
            })
        }

        if (this.material?.metallicRoughnessTexture) {
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
                resource: this.material?.metallicRoughnessTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 2,
                resource: this.material?.metallicRoughnessTexture.view,
            })
        }

        if (this.material?.normalTexture) {
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
                resource: this.material?.normalTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 3,
                resource: this.material?.normalTexture.view,
            })
        }

        const vertexState: GPUVertexState = {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: this.positions.byteStride,
                    attributes: [
                        {
                            format: this.positions.elementType,
                            offset: 0,
                            shaderLocation: 0,
                        },
                    ],
                },
            ],
        }

        if (this.textureCoordinates) {
            ;(vertexState.buffers as GPUVertexBufferLayout[]).push({
                arrayStride: this.textureCoordinates.byteStride,
                attributes: [
                    {
                        format: this.textureCoordinates.elementType,
                        offset: 0,
                        shaderLocation: 1,
                    },
                ],
            })
        }

        if (this.normals) {
            ;(vertexState.buffers as GPUVertexBufferLayout[]).push({
                arrayStride: this.normals.byteStride,
                attributes: [
                    {
                        format: this.normals.elementType,
                        offset: 0,
                        shaderLocation: 2,
                    },
                ],
            })
        }

        const fragmentState: GPUFragmentState = {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format: colorFormat }],
        }

        const primitive: GPUPrimitiveState = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
        }

        if (this.mode === 5) {
            primitive.topology = 'triangle-strip'
            primitive.stripIndexFormat = this?.indices
                ?.elementType as GPUIndexFormat
        }

        const samplerBindGroupLayout = device.createBindGroupLayout({
            entries: samplerBindGroupLayoutEntries,
            label: 'samplerBindGroupLayout',
        })

        const materialBindGroupLayout = device.createBindGroupLayout({
            entries: materialBindGroupLayoutEntries,
            label: 'materialBindGroupLayout',
        })

        this.samplerBindGroup = device.createBindGroup({
            layout: samplerBindGroupLayout,
            entries: samplerBindGroupEntries,
        })

        this.materialBindGroup = device.createBindGroup({
            layout: materialBindGroupLayout,
            entries: materialBindGroupEntries,
        })

        const layout = device.createPipelineLayout({
            bindGroupLayouts: [
                uniformsBGLayout,
                nodeParamsBGLayout,
                materialBindGroupLayout,
                samplerBindGroupLayout,
            ],
        })

        this.renderPipeline = device.createRenderPipeline({
            layout: layout,
            vertex: vertexState,
            fragment: fragmentState,
            primitive: primitive,
            depthStencil: {
                format: depthFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
            multisample: {
                count: msaaSampleCount,
            },
        })

        const positionsView = new Uint8Array(
            bufferStorage.buffers.get(this.positions.bufferId) as ArrayBuffer,
            this.positions.byteOffset,
            this.positions.byteLength
        )

        this.positionsBuffer = device.createBuffer({
            size: alignTo(this.positions.byteLength, 4),
            usage: this.positions.usage,
            mappedAtCreation: true,
        })

        new Uint8Array(this.positionsBuffer.getMappedRange()).set(positionsView)
        this.positionsBuffer.unmap()

        if (this.textureCoordinates) {
            const textureCoordinatesBuffer = bufferStorage.buffers.get(
                this?.textureCoordinates.bufferId
            )

            const textureCoordinatesView = new Uint8Array(
                textureCoordinatesBuffer as ArrayBuffer,
                this.textureCoordinates.byteOffset,
                this.textureCoordinates.byteLength
            )

            this.textureCoordinatesBuffer = device.createBuffer({
                size: alignTo(this.textureCoordinates.byteLength, 4),
                usage: this.textureCoordinates.usage,
                mappedAtCreation: true,
            })
            new Uint8Array(this.textureCoordinatesBuffer.getMappedRange()).set(
                textureCoordinatesView
            )
            this.textureCoordinatesBuffer.unmap()
        }

        if (this.normals) {
            const normalsBuffer = bufferStorage.buffers.get(
                this?.normals.bufferId
            )

            const normalsView = new Uint8Array(
                normalsBuffer as ArrayBuffer,
                this.normals.byteOffset,
                this.normals.byteLength
            )

            this.normalsBuffer = device.createBuffer({
                size: alignTo(this.normals.byteLength, 4),
                usage: this.normals.usage,
                mappedAtCreation: true,
            })
            new Uint8Array(this.normalsBuffer.getMappedRange()).set(normalsView)
            this.normalsBuffer.unmap()
        }

        if (this.indices) {
            const indicesBuffer = bufferStorage.buffers.get(
                this?.indices.bufferId
            )

            const indicesView = new Uint8Array(
                indicesBuffer as ArrayBuffer,
                this.indices.byteOffset,
                this.indices.byteLength
            )
            this.indicesBuffer = device.createBuffer({
                size: alignTo(this.indices.byteLength, 4),
                usage: this.indices.usage,
                mappedAtCreation: true,
            })
            new Uint8Array(this.indicesBuffer.getMappedRange()).set(indicesView)
            this.indicesBuffer.unmap()
        }
    }

    render(renderPassEncoder: GPURenderPassEncoder) {
        renderPassEncoder.setPipeline(this.renderPipeline as GPURenderPipeline)

        if (this.materialBindGroup) {
            renderPassEncoder.setBindGroup(2, this.materialBindGroup)
        }

        if (this.samplerBindGroup) {
            renderPassEncoder.setBindGroup(3, this.samplerBindGroup)
        }

        renderPassEncoder.setVertexBuffer(
            0,
            this.positionsBuffer as GPUBuffer,
            0,
            this.positions.byteLength
        )

        if (this.textureCoordinates) {
            renderPassEncoder.setVertexBuffer(
                1,
                this.textureCoordinatesBuffer as GPUBuffer,
                0,
                this.textureCoordinates.byteLength
            )
        }

        if (this.normals) {
            renderPassEncoder.setVertexBuffer(
                2,
                this.normalsBuffer as GPUBuffer,
                0,
                this.normals.byteLength
            )
        }

        if (this.indices) {
            renderPassEncoder.setIndexBuffer(
                this.indicesBuffer as GPUBuffer,
                this.indices.elementType as GPUIndexFormat,
                0,
                this.indices.byteLength
            )
            renderPassEncoder.drawIndexed(this.indices.count)
        } else {
            renderPassEncoder.draw(this.positions.count)
        }
    }
}
