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
    renderPipeline?: GPURenderPipeline
    nodeParamsBindGroup?: GPUBindGroup
    material?: IMaterial
    private positionsBuffer?: GPUBuffer
    private indicesBuffer?: GPUBuffer
    private textureCoordinatesBuffer?: GPUBuffer
    private materialParamsBuffer?: GPUBuffer
    private materialBindGroup?: GPUBindGroup

    constructor(
        parent: IGameObject,
        positions: GLTFAccessor,
        indices?: GLTFAccessor,
        textureCoordinates?: GLTFAccessor,
        material?: IMaterial
    ) {
        super(parent, EntityTypes.mesh)

        this.positions = positions
        this.indices = indices
        this.textureCoordinates = textureCoordinates
        this.material = material
    }

    public buildRenderPipeline(
        device: GPUDevice,
        shaderModule: GPUShaderModule,
        colorFormat: GPUTextureFormat,
        depthFormat: GPUTextureFormat,
        uniformsBGLayout: GPUBindGroupLayout,
        nodeParamsBGLayout: GPUBindGroupLayout,
        bufferStorage: IBufferStorage
    ) {
        /*** */
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

        let materialBindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = [
            {
                binding: 0,
                visibility: GPUShaderStage.FRAGMENT,
                buffer: {
                    type: 'uniform',
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
            materialBindGroupLayoutEntries.push({
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
            })
            materialBindGroupLayoutEntries.push({
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {},
            })

            materialBindGroupEntries.push({
                binding: 1,
                resource: this.material.baseColorTexture.sampler,
            })
            materialBindGroupEntries.push({
                binding: 2,
                resource: this.material.baseColorTexture.view,
            })
        }

        // if (this.metallicRoughnessTexture) {
        //     bgLayoutEntries.push({
        //         binding: 3,
        //         visibility: GPUShaderStage.FRAGMENT,
        //         sampler: {},
        //     })
        //     bgLayoutEntries.push({
        //         binding: 4,
        //         visibility: GPUShaderStage.FRAGMENT,
        //         texture: {},
        //     })

        //     bgEntries.push({
        //         binding: 3,
        //         resource: this.metallicRoughnessTexture.sampler.sampler,
        //     })
        //     bgEntries.push({
        //         binding: 4,
        //         resource: this.metallicRoughnessTexture.image.view,
        //     })
        // }
        /*** */

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

        const materialBindGroupLayout = device.createBindGroupLayout({
            entries: materialBindGroupLayoutEntries,
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
