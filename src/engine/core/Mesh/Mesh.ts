import { EntityTypes, GLTFAccessor, IGameObject, IMesh } from '../../types'
import { IBufferStorage } from '../../types/core/BufferStorage'
import { Component } from '../Component'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    mode = 4 // GPU topology mode
    positions: GLTFAccessor
    indices?: GLTFAccessor
    renderPipeline?: GPURenderPipeline
    nodeParamsBindGroup?: GPUBindGroup
    private positionsBuffer?: GPUBuffer
    private indicesBuffer?: GPUBuffer

    constructor(
        parent: IGameObject,
        positions: GLTFAccessor,
        indices?: GLTFAccessor
    ) {
        super(parent, EntityTypes.mesh)

        this.positions = positions
        this.indices = indices
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

        const layout = device.createPipelineLayout({
            bindGroupLayouts: [uniformsBGLayout, nodeParamsBGLayout],
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

        renderPassEncoder.setVertexBuffer(
            0,
            this.positionsBuffer as GPUBuffer,
            0,
            this.positions.byteLength
        )

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
