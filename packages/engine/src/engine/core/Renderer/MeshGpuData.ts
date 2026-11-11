import { type GLTFAccessor, type IMesh, type IScene } from '../../types'
import { type IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type Environment } from './Environment'
import { type AnimPipelineOptions, type Pipelines } from './Pipelines'
import { type SkinningUploader } from './SkinningUploader'
import { MAX_MORPH_TARGETS } from './constants'

export const alignTo = (val: number, align: number) => {
    return Math.floor((val + align - 1) / align) * align
}

/**
 * Per-mesh GPU data: uploads the glTF accessor buffers once (at pipeline
 * build) and encodes the per-draw state (vertex/index buffers, draw call).
 * Material bind groups get stable sort ids so the traversal can order the
 * draw list for hoisted state changes. Skinned/morph meshes also get their
 * anim-draw slot, skinParams bind group and pipeline variants here.
 */
export class MeshGpuData {
    #device: GPUDevice
    #layouts: BindGroupLayouts
    #pipelines: Pipelines
    #environment: Environment
    #skinning: SkinningUploader
    #nextMaterialSortId = 1

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        pipelines: Pipelines,
        environment: Environment,
        skinning: SkinningUploader
    ) {
        this.#device = device
        this.#layouts = layouts
        this.#pipelines = pipelines
        this.#environment = environment
        this.#skinning = skinning
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

        // skinning + morph registration: palette run, morph block and the
        // shared anim-draw slot carrying both base indices for this mesh.
        // Unskinned/unmorphed meshes still get dummy joints/weights buffers
        // and the dummy skinParams group — the shaders statically use those
        // bindings in every pipeline variant.
        let skinning = false
        if (mesh.skin && mesh.joints && mesh.weights) {
            if (mesh.skin.paletteOffset < 0) {
                this.#skinning.registerSkin(mesh.skin)
            }
            skinning = mesh.skin.paletteOffset >= 0
        }

        let morphCount = 0
        let morphBase = -1
        if (mesh.morphTargets && mesh.morphWeights) {
            morphBase = this.#skinning.allocateMorphBlock()
            if (morphBase >= 0) {
                morphCount = Math.min(
                    mesh.morphTargets.targetCount,
                    MAX_MORPH_TARGETS
                )
            }
        }

        let animSlotIndex = 0
        let skinParamsBindGroup: GPUBindGroup = this.#skinning.dummyBindGroup
        let jointsBuffer: GPUBuffer = this.#skinning.dummyJointsBuffer
        let weightsBuffer: GPUBuffer = this.#skinning.dummyWeightsBuffer
        if (skinning || morphCount > 0) {
            const slot = this.#skinning.allocateDrawSlot(
                skinning ? mesh.skin!.paletteOffset : 0,
                morphBase >= 0 ? morphBase : 0
            )
            if (slot >= 0) {
                animSlotIndex = slot
                skinParamsBindGroup = this.#skinning.createMeshBindGroup(
                    morphCount > 0
                        ? this.#createMorphDeltasBuffer(mesh, scene)
                        : this.#skinning.dummyDeltasBuffer,
                    morphCount > 0
                        ? this.#skinning.createMeshParamsBuffer(
                              mesh.morphTargets!.vertexCount
                          )
                        : this.#skinning.dummyParamsBuffer
                )
                if (skinning) {
                    jointsBuffer = this.#createMeshBuffer(mesh.joints!, scene)
                    weightsBuffer = this.#createMeshBuffer(mesh.weights!, scene)
                }
            } else {
                skinning = false
                morphCount = 0
                morphBase = -1
            }
        }

        const animOptions: AnimPipelineOptions = {
            skinning,
            morphCount,
            joints: mesh.joints,
            weights: mesh.weights,
        }

        const shadowPipeline = this.#pipelines.getShadowPipeline(
            mesh.positions.elementType,
            mesh.positions.byteStride,
            animOptions
        )

        const meshDataEntry: IMeshRenderData = {
            materialParamsBuffer,
            materialBindGroup,
            shadowRenderPipeline: shadowPipeline.pipeline,
            geometryPipeline: this.#pipelines.getGeometryPipeline(animOptions),
            positionsBuffer: this.#createMeshBuffer(mesh.positions, scene),
            textureCoordinatesBuffer: this.#createMeshBuffer(
                mesh.textureCoordinates,
                scene
            ),
            normalsBuffer: this.#createMeshBuffer(mesh.normals, scene),
            tangentsBuffer: this.#createMeshBuffer(mesh.tangents, scene),
            indicesBuffer: this.#createMeshBuffer(mesh.indices, scene),
            jointsBuffer,
            weightsBuffer,
            skinParamsBindGroup,
            animSlotIndex,
            morphBase,
            // assigned per frame by the scene traversal
            nodeIndex: 0,
            materialSortId: this.#nextMaterialSortId++,
            shadowPipelineSortId: shadowPipeline.sortId,
        }

        scene.meshRenderDataStorage.data.set(mesh.id, meshDataEntry)
        mesh.isPipelineBuilt = true
    }

    /**
     * Packs every morph target's POSITION and NORMAL deltas into one flat
     * f32 storage buffer: [all position deltas][all normal deltas], each
     * section targetCount × vertexCount × vec3 — the vertex shaders read it
     * by vertex pulling (WebGPU caps vertex buffers at 16 slots). Targets
     * without NORMAL deltas get zeros.
     */
    #createMorphDeltasBuffer(mesh: IMesh, scene: IScene) {
        const morph = mesh.morphTargets!
        const floatsPerSection = morph.targetCount * morph.vertexCount * 3
        const data = new Float32Array(floatsPerSection * 2)

        for (let t = 0; t < morph.targetCount; t++) {
            this.#copyAccessorVec3(
                morph.positions[t]!,
                scene,
                data,
                t * morph.vertexCount * 3
            )
            const normals = morph.normals[t]
            if (normals) {
                this.#copyAccessorVec3(
                    normals,
                    scene,
                    data,
                    floatsPerSection + t * morph.vertexCount * 3
                )
            }
        }

        const buffer = this.#device.createBuffer({
            label: 'morph deltas buffer',
            size: Math.max(alignTo(data.byteLength, 4), 16),
            usage: GPUBufferUsage.STORAGE,
            mappedAtCreation: true,
        })
        new Float32Array(buffer.getMappedRange()).set(data)
        buffer.unmap()
        return buffer
    }

    /** element-wise float3×count copy out of a (possibly strided) accessor */
    #copyAccessorVec3(
        accessor: GLTFAccessor,
        scene: IScene,
        dst: Float32Array,
        dstOffset: number
    ) {
        const source = scene.bufferStorage.buffers.get(
            accessor.bufferId
        ) as ArrayBuffer
        const view = new DataView(source)
        for (let i = 0; i < accessor.count; i++) {
            const base = accessor.byteOffset + i * accessor.byteStride
            const out = dstOffset + i * 3
            dst[out] = view.getFloat32(base, true)
            dst[out + 1] = view.getFloat32(base + 4, true)
            dst[out + 2] = view.getFloat32(base + 8, true)
        }
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
        // joints/weights are statically used by every variant — dummies for
        // unskinned meshes (out-of-range fetches read as zero)
        pass.setVertexBuffer(4, entry.jointsBuffer)
        pass.setVertexBuffer(5, entry.weightsBuffer)
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
        // shadow pipelines carry the skin attributes at slots 1/2
        pass.setVertexBuffer(1, entry.jointsBuffer)
        pass.setVertexBuffer(2, entry.weightsBuffer)
        pass.setIndexBuffer(
            entry.indicesBuffer,
            mesh.indices.elementType as GPUIndexFormat,
            0,
            mesh.indices.byteLength
        )
        pass.drawIndexed(mesh.indices.count)
    }
}
