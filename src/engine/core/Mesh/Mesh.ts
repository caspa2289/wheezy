import { mat4 } from 'wgpu-matrix'
import { EntityTypes, GLTFAccessor, IGameObject, IMesh } from '../../types'
import { Component } from '../Component'

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    mode = 4 // GPU topology mode
    positions: GLTFAccessor //buffer view or accessor?
    indices?: GLTFAccessor
    renderPipeline?: GPURenderPipeline

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
        uniformsBGLayout: GPUBindGroupLayout
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
            bindGroupLayouts: [uniformsBGLayout],
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
    }

    render(renderPassEncoder: GPURenderPassEncoder) {
        renderPassEncoder.setPipeline(this.renderPipeline as GPURenderPipeline)

        renderPassEncoder.setVertexBuffer(
            0,
            this.positions.bufferView.buffer,
            this.positions.byteOffset,
            this.positions.byteLength
        )

        if (this.indices) {
            renderPassEncoder.setIndexBuffer(
                this.indices.bufferView.buffer,
                this.indices.elementType as GPUIndexFormat,
                this.indices.byteOffset,
                this.indices.byteLength
            )
            renderPassEncoder.drawIndexed(this.indices.count)
        } else {
            renderPassEncoder.draw(this.positions.count)
        }
    }
}
