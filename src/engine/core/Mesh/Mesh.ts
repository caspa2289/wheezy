import { EntityTypes, GLTFAccessor, IGameObject, IMesh } from '../../types'
import { Component } from '../Component'

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    mode = 4 // GPU topology mode
    positions: GLTFAccessor //buffer view or accessor?
    renderPipeline?: GPURenderPipeline

    constructor(parent: IGameObject, positions: GLTFAccessor) {
        super(parent, EntityTypes.mesh)

        this.positions = positions
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
                        // Note: We do not pass the positions.byteOffset here, as its
                        // meaning can vary in different glB files, i.e., if it's
                        // being used for interleaved element offset or an absolute
                        // offset.
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

        // Our loader only supports triangle lists and strips, so by default we set
        // the primitive topology to triangle list, and check if it's
        // instead a triangle strip
        const primitive: GPUPrimitiveState = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
        }
        // if (this.mode === 5) {
        //     primitive.topology = 'triangle-strip'
        //     primitive.stripIndexFormat = this.indices.vertexType
        // }

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
}
