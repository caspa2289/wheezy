import { type GLTFAccessor, type IMesh, type IScene } from '../../types'
import { type IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type Environment } from './Environment'
import { type Pipelines } from './Pipelines'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

/**
 * Per-mesh GPU data: uploads the glTF accessor buffers once (at pipeline
 * build) and encodes the per-draw state (vertex/index buffers, draw call).
 * Material bind groups get stable sort ids so the traversal can order the
 * draw list for hoisted state changes.
 */
export class MeshGpuData {
    #device: GPUDevice
    #layouts: BindGroupLayouts
    #pipelines: Pipelines
    #environment: Environment
    #nextMaterialSortId = 1

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        pipelines: Pipelines,
        environment: Environment
    ) {
        this.#device = device
        this.#layouts = layouts
        this.#pipelines = pipelines
        this.#environment = environment
    }

    #createMeshBuffer(accessor: GLTFAccessor, scene: IScene) {
        const view = new Uint8Array(
            scene.bufferStorage.buffers.get(accessor.bufferId) as ArrayBuffer,
            accessor.byteOffset,
            accessor.byteLength
        )

        const buffer = this.#device.createBuffer({
            size: alignTo(accessor.byteLength, 4),
            usage: accessor.usage,
            mappedAtCreation: true,
        })

        new Uint8Array(buffer.getMappedRange()).set(view)
        buffer.unmap()

        return buffer
    }

    public buildRenderPipeline(mesh: IMesh, scene: IScene) {
        const device = this.#device

        const materialParamsBuffer = device.createBuffer({
            size: 8 * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })
        const params = new Float32Array(materialParamsBuffer.getMappedRange())
        params.set(mesh.material.baseColorFactor, 0)
        params.set(
            [mesh.material.metallicFactor, mesh.material.roughnessFactor],
            4
        )
        materialParamsBuffer.unmap()

        const materialBindGroup = device.createBindGroup({
            label: 'material and sampler bindgroup',
            layout: this.#layouts.material,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: materialParamsBuffer,
                        size: 8 * 4,
                    },
                },
                {
                    binding: 1,
                    resource: mesh.material.baseColorTexture.view,
                },
                {
                    binding: 2,
                    resource: mesh.material?.metallicRoughnessTexture.view,
                },
                {
                    binding: 3,
                    resource: mesh.material?.normalTexture.view,
                },
                {
                    binding: 4,
                    resource: mesh.material?.occlusionTexture.view,
                },
                {
                    binding: 6,
                    resource: this.#environment.skyboxCubeView,
                },
                {
                    binding: 7,
                    resource: mesh.material?.emissiveTexture.view,
                },
                {
                    binding: 8,
                    resource: mesh.material.baseColorTexture.sampler,
                },
                {
                    binding: 9,
                    resource: mesh.material.metallicRoughnessTexture.sampler,
                },
                {
                    binding: 10,
                    resource: mesh.material.normalTexture.sampler,
                },
                {
                    binding: 11,
                    resource: mesh.material.occlusionTexture.sampler,
                },
                {
                    binding: 13,
                    resource: this.#environment.skyboxSampler,
                },
                {
                    binding: 14,
                    resource: mesh.material?.emissiveTexture.sampler,
                },
            ],
        })

        const shadowPipeline = this.#pipelines.getShadowPipeline(
            mesh.positions.elementType,
            mesh.positions.byteStride
        )

        const meshDataEntry: IMeshRenderData = {
            materialParamsBuffer,
            materialBindGroup,
            shadowRenderPipeline: shadowPipeline.pipeline,
            positionsBuffer: this.#createMeshBuffer(mesh.positions, scene),
            textureCoordinatesBuffer: this.#createMeshBuffer(
                mesh.textureCoordinates,
                scene
            ),
            normalsBuffer: this.#createMeshBuffer(mesh.normals, scene),
            tangentsBuffer: this.#createMeshBuffer(mesh.tangents, scene),
            indicesBuffer: this.#createMeshBuffer(mesh.indices, scene),
            // assigned per frame by the scene traversal
            nodeIndex: 0,
            materialSortId: this.#nextMaterialSortId++,
            shadowPipelineSortId: shadowPipeline.sortId,
        }

        scene.meshRenderDataStorage.data.set(mesh.id, meshDataEntry)
        mesh.isPipelineBuilt = true
    }

    /** vertex/index buffers + draw; bind groups are set by the pass encoder */
    encodeMesh(
        mesh: IMesh,
        entry: IMeshRenderData,
        pass: GPURenderPassEncoder
    ) {
        pass.setVertexBuffer(
            0,
            entry.positionsBuffer,
            0,
            mesh.positions.byteLength
        )
        pass.setVertexBuffer(
            1,
            entry.textureCoordinatesBuffer,
            0,
            mesh.textureCoordinates.byteLength
        )
        pass.setVertexBuffer(2, entry.normalsBuffer, 0, mesh.normals.byteLength)
        pass.setVertexBuffer(
            3,
            entry.tangentsBuffer,
            0,
            mesh.tangents.byteLength
        )
        pass.setIndexBuffer(
            entry.indicesBuffer,
            mesh.indices.elementType as GPUIndexFormat,
            0,
            mesh.indices.byteLength
        )
        pass.drawIndexed(mesh.indices.count)
    }

    encodeMeshShadow(
        mesh: IMesh,
        entry: IMeshRenderData,
        pass: GPURenderPassEncoder
    ) {
        pass.setVertexBuffer(
            0,
            entry.positionsBuffer,
            0,
            mesh.positions.byteLength
        )
        pass.setIndexBuffer(
            entry.indicesBuffer,
            mesh.indices.elementType as GPUIndexFormat,
            0,
            mesh.indices.byteLength
        )
        pass.drawIndexed(mesh.indices.count)
    }
}
