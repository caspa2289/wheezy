import { mat4, type Mat4 } from 'wgpu-matrix'
import { EntityTypes, type IMesh, type IScene } from '../../types'
import { type SceneNodeContent } from '../../types/core/SceneTree'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type MeshGpuData } from './MeshGpuData'
import { type StagingBuffers } from './StagingBuffers'
import {
    MAX_SCENE_NODES,
    NODE_INDEX_SLOT_SIZE,
    NODE_MATRICES_BUFFER_SIZE,
    NODE_MATRIX_SIZE,
} from './constants'

const IDENTITY_MATRIX = mat4.identity()

/**
 * Scene-graph walk: computes each node's world matrix into the shared
 * node-matrices staging buffer (one `queue.writeBuffer` per frame), assigns
 * node slots to the mesh render-data entries and fills the sorted draw lists
 * (geometry + shadow casters).
 *
 * Node matrices reach the shaders through a single storage buffer; each draw
 * selects its slot with a dynamic offset into a uniform index buffer (slot i
 * holds the value i) — the same mechanism the shadow pass uses for caster
 * indices. The traversal itself is closure-free: plain `for` loops, a
 * per-depth matrix pool and reused comparators.
 */
export class SceneTraversal {
    /** static: binds the node index buffer (dynamic offset) + the matrix storage */
    readonly nodeParamsBindGroup: GPUBindGroup
    /** sorted by material — geometry pass */
    readonly drawMeshes: IMesh[] = []
    /** sorted by shadow pipeline — shadow pass (meshes with castShadow) */
    readonly shadowCasters: IMesh[] = []

    #device: GPUDevice
    #staging: StagingBuffers
    #nodeMatricesBuffer: GPUBuffer
    #nodeCount = 0
    #scene!: IScene
    #matrixPool: Mat4[] = []
    #overflowWarned = false

    #geometryComparator = (a: IMesh, b: IMesh) => {
        const data = this.#scene.meshRenderDataStorage.data
        return (
            (data.get(a.id)?.materialSortId ?? 0) -
            (data.get(b.id)?.materialSortId ?? 0)
        )
    }

    #shadowComparator = (a: IMesh, b: IMesh) => {
        const data = this.#scene.meshRenderDataStorage.data
        return (
            (data.get(a.id)?.shadowPipelineSortId ?? 0) -
            (data.get(b.id)?.shadowPipelineSortId ?? 0)
        )
    }

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        staging: StagingBuffers
    ) {
        this.#device = device
        this.#staging = staging

        this.#nodeMatricesBuffer = device.createBuffer({
            label: 'node matrices buffer',
            size: NODE_MATRICES_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        // slot i of the index buffer holds the u32 value i; bound with a
        // dynamic offset (i × 256) per draw
        const nodeIndexBuffer = device.createBuffer({
            label: 'node index buffer',
            size: MAX_SCENE_NODES * NODE_INDEX_SLOT_SIZE,
            usage: GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })
        {
            const slots = new Uint32Array(nodeIndexBuffer.getMappedRange())
            for (let i = 0; i < MAX_SCENE_NODES; i++) {
                slots[(i * NODE_INDEX_SLOT_SIZE) / 4] = i
            }
            nodeIndexBuffer.unmap()
        }

        this.nodeParamsBindGroup = device.createBindGroup({
            label: 'node params bind group',
            layout: layouts.nodeParams,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: nodeIndexBuffer,
                        offset: 0,
                        size: 4,
                    },
                },
                { binding: 1, resource: { buffer: this.#nodeMatricesBuffer } },
            ],
        })
    }

    get nodeCount() {
        return this.#nodeCount
    }

    traverse(scene: IScene, meshGpuData: MeshGpuData) {
        this.#scene = scene
        this.#nodeCount = 0
        this.drawMeshes.length = 0
        this.shadowCasters.length = 0

        for (const node of scene.objectManager.sceneTree.nodes.values()) {
            this.#walk(node, IDENTITY_MATRIX, 0, meshGpuData)
        }

        if (this.#nodeCount > 0) {
            this.#device.queue.writeBuffer(
                this.#nodeMatricesBuffer,
                0,
                this.#staging.nodeMatrices,
                0,
                this.#nodeCount * NODE_MATRIX_SIZE
            )
        }

        // sorted so setPipeline / material bind-group changes hoist out of the
        // per-mesh encode loops
        this.drawMeshes.sort(this.#geometryComparator)
        this.shadowCasters.sort(this.#shadowComparator)
    }

    #walk(
        node: SceneNodeContent,
        parentMatrix: Mat4,
        depth: number,
        meshGpuData: MeshGpuData
    ) {
        const transform = node.gameObject.transform
        let nodeMatrix = parentMatrix
        let nodeIndex = -1

        if (this.#nodeCount < MAX_SCENE_NODES) {
            nodeIndex = this.#nodeCount++
            //FIXME: transform calculations are not performed for the light transform as of now
            if (transform) {
                nodeMatrix = mat4.mul(
                    parentMatrix,
                    transform.matrix,
                    this.#matrixAt(depth)
                )
            }
            this.#staging.nodeMatricesFloats.set(
                nodeMatrix,
                (nodeIndex * NODE_MATRIX_SIZE) / 4
            )
        } else if (!this.#overflowWarned) {
            this.#overflowWarned = true
            console.warn(
                `wheezy: scene graph exceeds ${MAX_SCENE_NODES} nodes — overflowing nodes are not drawn`
            )
        }

        if (nodeIndex >= 0) {
            for (const component of node.gameObject.components.values()) {
                if (component.type !== EntityTypes.mesh) {
                    continue
                }
                const mesh = component as IMesh
                if (!mesh.isPipelineBuilt) {
                    meshGpuData.buildRenderPipeline(mesh, this.#scene)
                }
                const entry = this.#scene.meshRenderDataStorage.data.get(
                    mesh.id
                )
                if (!entry) {
                    continue
                }
                entry.nodeIndex = nodeIndex
                this.drawMeshes.push(mesh)
                if (mesh.castShadow) {
                    this.shadowCasters.push(mesh)
                }
            }
        }

        const children = node.children
        if (children) {
            for (const child of children.values()) {
                this.#walk(child, nodeMatrix, depth + 1, meshGpuData)
            }
        }
    }

    #matrixAt(depth: number): Mat4 {
        let matrix = this.#matrixPool[depth]
        if (!matrix) {
            matrix = mat4.create()
            this.#matrixPool[depth] = matrix
        }
        return matrix
    }
}
