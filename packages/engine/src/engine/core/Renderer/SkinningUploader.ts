import { mat4, type Mat4 } from 'wgpu-matrix'
import { type EntityID, type IMesh, type IScene, type ISkin } from '../../types'
import { type IMeshRenderData } from '../../types/core/MeshRenderDataStorage'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type StagingBuffers } from './StagingBuffers'
import {
    ANIM_DRAW_SLOT_SIZE,
    MAX_ANIM_DRAW_SLOTS,
    MAX_MORPH_MESHES,
    MAX_SKIN_JOINTS,
    MORPH_WEIGHT_FLOATS_PER_MESH,
    SKIN_PALETTE_BUFFER_SIZE,
} from './constants'

interface SkinGpuViews {
    /** per joint: view of the static inverse bind matrix */
    ibm: Float32Array[]
    /** per joint: view of the joint's palette slots in the staging buffer */
    dst: Float32Array[]
}

interface MorphUploadEntry {
    weights: Float32Array
    base: number
}

/**
 * GPU-side skinning data: one shared joint-palette storage buffer for the
 * whole scene (each skin owns a contiguous run of mat4 slots), one shared
 * morph-weights storage buffer (one block per morph mesh) and a
 * dynamic-offset anim-draw slot buffer whose 8-byte slots carry
 * { palette_base, morph_base } per draw — the same mechanism the node
 * matrices and shadow caster indices use.
 *
 * Per frame: the traversal records the node indices of registered joints and
 * collects the drawn skinned/morph meshes, then `upload` fills the palette
 * (joint world matrix × inverse bind matrix — the world matrices come
 * straight from the traversal staging) and the morph weights (written by the
 * animation mixer onto the meshes), one `writeBuffer` each.
 */
export class SkinningUploader {
    #device: GPUDevice
    #layouts: BindGroupLayouts
    #staging: StagingBuffers

    readonly paletteBuffer: GPUBuffer
    readonly morphWeightsBuffer: GPUBuffer

    #animIndexBuffer: GPUBuffer
    /** 16-byte zero storage bound as morph deltas for meshes without them */
    readonly dummyDeltasBuffer: GPUBuffer
    /** 16-byte zero uniform bound as mesh params for meshes without morphs */
    readonly dummyParamsBuffer: GPUBuffer
    /**
     * zero-filled joints/weights vertex buffers for unskinned meshes — the
     * shaders statically declare both attributes in every variant (Dawn's
     * static-use analysis does not fold the SKINNING override), so every
     * pipeline and draw must provide them
     */
    readonly dummyJointsBuffer: GPUBuffer
    readonly dummyWeightsBuffer: GPUBuffer
    /** skinParams group over the dummies, bound by unskinned/unmorphed meshes */
    readonly dummyBindGroup: GPUBindGroup

    #jointIds = new Set<EntityID>()
    #frameJointIndices = new Map<EntityID, number>()
    #skinsSynced = -1

    #skinViews = new Map<ISkin, SkinGpuViews>()
    #activeSkins: ISkin[] = []
    #activeSkinSet = new Set<ISkin>()
    #activeMorphs: MorphUploadEntry[] = []

    #nextPaletteJoint = 0
    #nextMorphBlock = 0
    #nextDrawSlot = 0
    #paletteWarned = false
    #morphWarned = false
    #slotWarned = false
    #missingJointWarned = new Set<ISkin>()

    #slotData = new Uint32Array(2)
    #scratchJointMatrix: Mat4 = mat4.create()

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        staging: StagingBuffers
    ) {
        this.#device = device
        this.#layouts = layouts
        this.#staging = staging

        this.paletteBuffer = device.createBuffer({
            label: 'joint palette buffer',
            size: SKIN_PALETTE_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        this.morphWeightsBuffer = device.createBuffer({
            label: 'morph weights buffer',
            size: MAX_MORPH_MESHES * MORPH_WEIGHT_FLOATS_PER_MESH * 4,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        this.#animIndexBuffer = device.createBuffer({
            label: 'anim draw slot buffer',
            size: MAX_ANIM_DRAW_SLOTS * ANIM_DRAW_SLOT_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.dummyDeltasBuffer = device.createBuffer({
            label: 'dummy morph deltas buffer',
            size: 16,
            usage: GPUBufferUsage.STORAGE,
        })

        this.dummyParamsBuffer = device.createBuffer({
            label: 'dummy morph params buffer',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.dummyJointsBuffer = device.createBuffer({
            label: 'dummy joints buffer',
            size: 16,
            usage: GPUBufferUsage.VERTEX,
        })

        this.dummyWeightsBuffer = device.createBuffer({
            label: 'dummy weights buffer',
            size: 16,
            usage: GPUBufferUsage.VERTEX,
        })

        // slot 0 of the anim-draw buffer is reserved for the dummy group:
        // { palette_base: 0, morph_base: 0 } — unskinned draws never read it
        this.#slotData[0] = 0
        this.#slotData[1] = 0
        device.queue.writeBuffer(this.#animIndexBuffer, 0, this.#slotData)
        this.#nextDrawSlot = 1

        this.dummyBindGroup = device.createBindGroup({
            label: 'dummy skin params bind group',
            layout: layouts.skinParams,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#animIndexBuffer,
                        offset: 0,
                        size: 8,
                    },
                },
                { binding: 1, resource: { buffer: this.paletteBuffer } },
                { binding: 2, resource: { buffer: this.morphWeightsBuffer } },
                { binding: 3, resource: { buffer: this.dummyDeltasBuffer } },
                { binding: 4, resource: { buffer: this.dummyParamsBuffer } },
            ],
        })
    }

    // --- build-time registration (called from MeshGpuData) ---

    /**
     * Assigns the skin's run of palette slots and prepares the per-joint
     * matrix views. Leaves paletteOffset at -1 when the palette is full.
     */
    registerSkin(skin: ISkin) {
        if (this.#nextPaletteJoint + skin.jointCount > MAX_SKIN_JOINTS) {
            if (!this.#paletteWarned) {
                this.#paletteWarned = true
                console.warn(
                    `wheezy: joint palette exceeds ${MAX_SKIN_JOINTS} joints — overflowing skins render unskinned`
                )
            }
            return
        }

        skin.paletteOffset = this.#nextPaletteJoint
        this.#nextPaletteJoint += skin.jointCount

        const ibm: Float32Array[] = []
        const dst: Float32Array[] = []
        for (let j = 0; j < skin.jointCount; j++) {
            ibm.push(
                skin.inverseBindMatrices.subarray(
                    j * 16,
                    (j + 1) * 16
                ) as Float32Array
            )
            // direct views into the palette staging — mat4.multiply writes
            // the upload payload in place
            dst.push(
                this.#staging.skinPaletteFloats.subarray(
                    (skin.paletteOffset + j) * 16,
                    (skin.paletteOffset + j + 1) * 16
                ) as Float32Array
            )
        }
        this.#skinViews.set(skin, { ibm, dst })

        for (const jointId of skin.jointIds) {
            this.#jointIds.add(jointId)
        }
    }

    /** assigns a morph-weights block; -1 when full */
    allocateMorphBlock(): number {
        if (this.#nextMorphBlock >= MAX_MORPH_MESHES) {
            if (!this.#morphWarned) {
                this.#morphWarned = true
                console.warn(
                    `wheezy: more than ${MAX_MORPH_MESHES} morph meshes — overflowing meshes render without morph targets`
                )
            }
            return -1
        }
        return this.#nextMorphBlock++
    }

    /**
     * Allocates a dynamic-offset anim-draw slot for one mesh and writes its
     * { palette_base, morph_base }; -1 when full.
     */
    allocateDrawSlot(paletteBase: number, morphBase: number): number {
        if (this.#nextDrawSlot >= MAX_ANIM_DRAW_SLOTS) {
            if (!this.#slotWarned) {
                this.#slotWarned = true
                console.warn(
                    `wheezy: more than ${MAX_ANIM_DRAW_SLOTS} skinned/morph meshes — overflowing meshes render unskinned`
                )
            }
            return -1
        }

        const slot = this.#nextDrawSlot++
        this.#slotData[0] = paletteBase
        this.#slotData[1] = morphBase
        this.#device.queue.writeBuffer(
            this.#animIndexBuffer,
            slot * ANIM_DRAW_SLOT_SIZE,
            this.#slotData
        )
        return slot
    }

    /** per-mesh morph params uniform ({ vertex_count, pad }) */
    createMeshParamsBuffer(vertexCount: number): GPUBuffer {
        const buffer = this.#device.createBuffer({
            label: 'morph mesh params buffer',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        })
        new Uint32Array(buffer.getMappedRange())[0] = vertexCount
        buffer.unmap()
        return buffer
    }

    /** the mesh's skinParams bind group (bound with the anim-slot dynamic offset) */
    createMeshBindGroup(
        morphDeltasBuffer: GPUBuffer,
        meshParamsBuffer: GPUBuffer
    ): GPUBindGroup {
        return this.#device.createBindGroup({
            label: 'skin params bind group',
            layout: this.#layouts.skinParams,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#animIndexBuffer,
                        offset: 0,
                        size: 8,
                    },
                },
                { binding: 1, resource: { buffer: this.paletteBuffer } },
                {
                    binding: 2,
                    resource: { buffer: this.morphWeightsBuffer },
                },
                { binding: 3, resource: { buffer: morphDeltasBuffer } },
                { binding: 4, resource: { buffer: meshParamsBuffer } },
            ],
        })
    }

    // --- per-frame collection (called from SceneTraversal) ---

    beginFrame(scene: IScene) {
        this.#activeSkins.length = 0
        this.#activeSkinSet.clear()
        this.#activeMorphs.length = 0
        this.#frameJointIndices.clear()

        if (scene.skins.length !== this.#skinsSynced) {
            this.#skinsSynced = scene.skins.length
            this.#jointIds.clear()
            for (const skin of scene.skins) {
                for (const jointId of skin.jointIds) {
                    this.#jointIds.add(jointId)
                }
            }
        }
    }

    recordNodeIndex(gameObjectId: EntityID, nodeIndex: number) {
        if (this.#jointIds.size > 0 && this.#jointIds.has(gameObjectId)) {
            this.#frameJointIndices.set(gameObjectId, nodeIndex)
        }
    }

    collect(mesh: IMesh, entry: IMeshRenderData) {
        if (mesh.skin && mesh.skin.paletteOffset >= 0) {
            if (!this.#activeSkinSet.has(mesh.skin)) {
                this.#activeSkinSet.add(mesh.skin)
                this.#activeSkins.push(mesh.skin)
            }
        }
        if (entry.morphBase >= 0 && mesh.morphWeights) {
            this.#activeMorphs.push({
                weights: mesh.morphWeights,
                base: entry.morphBase,
            })
        }
    }

    // --- per-frame upload (called from Renderer.render after the traversal) ---

    upload(staging: StagingBuffers) {
        let paletteJointsUsed = 0

        for (const skin of this.#activeSkins) {
            const views = this.#skinViews.get(skin)
            if (!views || skin.paletteOffset < 0) {
                continue
            }

            for (let j = 0; j < skin.jointCount; j++) {
                const jointId = skin.jointIds[j]!
                const nodeIndex = this.#frameJointIndices.get(jointId)
                if (nodeIndex === undefined) {
                    if (!this.#missingJointWarned.has(skin)) {
                        this.#missingJointWarned.add(skin)
                        console.warn(
                            `wheezy: skin "${skin.name}" has a joint outside the scene graph — its palette entry is not updated`
                        )
                    }
                    continue
                }

                // joint world matrix, straight from the traversal staging
                const source = nodeIndex * 16
                const nodeMatrices = staging.nodeMatricesFloats
                const scratch = this.#scratchJointMatrix
                for (let k = 0; k < 16; k++) {
                    scratch[k] = nodeMatrices[source + k]!
                }

                // palette[j] = jointWorld × inverseBind[j], written straight
                // into the palette staging through the prebuilt views
                mat4.multiply(scratch, views.ibm[j]!, views.dst[j]! as Mat4)
            }

            paletteJointsUsed = Math.max(
                paletteJointsUsed,
                skin.paletteOffset + skin.jointCount
            )
        }

        if (paletteJointsUsed > 0) {
            this.#device.queue.writeBuffer(
                this.paletteBuffer,
                0,
                staging.skinPalette,
                0,
                paletteJointsUsed * 64
            )
        }

        let morphFloatsUsed = 0
        const morphFloats = staging.morphWeightsFloats
        for (const entry of this.#activeMorphs) {
            const offset = entry.base * MORPH_WEIGHT_FLOATS_PER_MESH
            for (let i = 0; i < MORPH_WEIGHT_FLOATS_PER_MESH; i++) {
                morphFloats[offset + i] = entry.weights[i] ?? 0
            }
            morphFloatsUsed = Math.max(
                morphFloatsUsed,
                offset + MORPH_WEIGHT_FLOATS_PER_MESH
            )
        }

        if (morphFloatsUsed > 0) {
            this.#device.queue.writeBuffer(
                this.morphWeightsBuffer,
                0,
                staging.morphWeights,
                0,
                morphFloatsUsed * 4
            )
        }
    }
}
