import { vec3, type Vec3, vec4 } from 'wgpu-matrix'
import {
    type GLTFAccessor,
    type IGameObject,
    type IMaterial,
    type IMaterialTexture,
    type IScene,
} from '../../../types'
import { GameObject } from '../../GameObject'
import { Mesh } from '../../Mesh'
import { Transform } from '../../Transform'
import { type ILightSourceV2 } from '../LightSourceV2'

// marker size + tessellation — small enough not to occlude the scene,
// coarse enough to be near-free
const GIZMO_RADIUS = 0.12
const GIZMO_SEGMENTS = 16
const GIZMO_RINGS = 10

interface GizmoGeometry {
    positions: GLTFAccessor
    indices: GLTFAccessor
    normals: GLTFAccessor
    uvs: GLTFAccessor
    tangents: GLTFAccessor
}

/**
 * Unit-radius UV sphere matching the geometry pipeline's hardcoded vertex
 * layout (float32x3 position/normal/tangent, float32x2 uv, uint16 indices),
 * CCW winding seen from outside — back faces are culled.
 */
function createGizmoSphere() {
    const positions: number[] = []
    const normals: number[] = []
    const tangents: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    for (let ring = 0; ring <= GIZMO_RINGS; ring++) {
        const phi = (ring / GIZMO_RINGS) * Math.PI
        for (let segment = 0; segment <= GIZMO_SEGMENTS; segment++) {
            const theta = (segment / GIZMO_SEGMENTS) * Math.PI * 2
            const x = Math.sin(phi) * Math.cos(theta)
            const y = Math.cos(phi)
            const z = Math.sin(phi) * Math.sin(theta)
            positions.push(x, y, z)
            normals.push(x, y, z)
            tangents.push(-Math.sin(theta), 0, Math.cos(theta))
            uvs.push(segment / GIZMO_SEGMENTS, ring / GIZMO_RINGS)
        }
    }
    for (let ring = 0; ring < GIZMO_RINGS; ring++) {
        for (let segment = 0; segment < GIZMO_SEGMENTS; segment++) {
            const a = ring * (GIZMO_SEGMENTS + 1) + segment
            const b = a + GIZMO_SEGMENTS + 1
            indices.push(a, a + 1, b, a + 1, b + 1, b)
        }
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        tangents: new Float32Array(tangents),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices),
        vertexCount: (GIZMO_RINGS + 1) * (GIZMO_SEGMENTS + 1),
    }
}

/**
 * Debug markers ("gizmos") for positioned lights: a small emissive sphere in
 * the light's own color, pinned to `light.gizmoPosition`. `Renderer.render`
 * drives `sync` every frame before the scene-tree traversal; visibility comes
 * from the profiler HUD's checkbox (`Profiler.enabled && Profiler.gizmosEnabled`),
 * so gizmos are dev-only like the HUD itself.
 *
 * A gizmo is created once per light (lazily) and then attached to / detached
 * from the scene tree on toggle — the Mesh and its GPU buffers in
 * MeshRenderDataStorage survive detachment, so repeated toggling re-uploads
 * nothing. Materials are self-contained (1×1 textures: black albedo, pure
 * emission), so gizmos also work in scenes without any uploaded model. The
 * light color is sampled at creation time; gizmos of lights removed from the
 * scene arrays simply stay detached-orphaned until the scene is discarded.
 */
export class LightGizmo {
    // per-scene shared geometry (buffer data registered in scene.bufferStorage)
    private static _geometry = new WeakMap<IScene, GizmoGeometry>()
    // lights whose gizmo is currently attached to the scene tree
    private static _attached = new WeakSet<ILightSourceV2>()
    // shared 1×1 white texture + sampler for the non-emissive material slots
    private static _white?: IMaterialTexture

    public static sync(scene: IScene, enabled: boolean) {
        for (const light of scene.pointLights) {
            this._syncLight(scene, light, enabled)
        }
        for (const light of scene.spotLights) {
            this._syncLight(scene, light, enabled)
        }
    }

    private static _syncLight(
        scene: IScene,
        light: ILightSourceV2,
        enabled: boolean
    ) {
        const position = light.gizmoPosition
        // directional lights have no position → no gizmo
        if (!position) {
            return
        }

        if (enabled) {
            const gizmo = light.gizmo ?? this._create(scene, light, position)
            if (!this._attached.has(light)) {
                scene.objectManager.addObject(gizmo, scene.root)
                this._attached.add(light)
            }
            // lights move (animations, controllers) — re-pin every frame;
            // translate writes the matrix position column, scale is untouched
            gizmo.transform.translate(position)
            return
        }

        if (light.gizmo && this._attached.has(light)) {
            scene.objectManager.destroyObject(light.gizmo)
            this._attached.delete(light)
        }
    }

    private static _create(
        scene: IScene,
        light: ILightSourceV2,
        position: Vec3
    ): IGameObject {
        const geometry = this._ensureGeometry(scene)
        const gizmo = new GameObject()
        const transform = new Transform(gizmo)
        transform.translate(position)
        transform.scale(vec3.create(GIZMO_RADIUS, GIZMO_RADIUS, GIZMO_RADIUS))
        new Mesh(
            gizmo,
            geometry.positions,
            geometry.indices,
            geometry.normals,
            geometry.uvs,
            geometry.tangents,
            this._createMaterial(scene.engine.renderer.device, light.color)
        )
        light.gizmo = gizmo
        return gizmo
    }

    private static _ensureGeometry(scene: IScene): GizmoGeometry {
        const cached = this._geometry.get(scene)
        if (cached) {
            return cached
        }

        const sphere = createGizmoSphere()
        const register = (
            id: string,
            data: Float32Array | Uint16Array,
            byteStride: number,
            elementType: GLTFAccessor['elementType'],
            componentType: number,
            count: number,
            usage: GPUBufferUsageFlags
        ): GLTFAccessor => {
            scene.bufferStorage.buffers.set(id, data.buffer as ArrayBuffer)
            return {
                byteStride,
                count,
                componentType,
                elementType,
                byteOffset: 0,
                byteLength: data.byteLength,
                bufferId: id,
                usage,
            }
        }

        const geometry: GizmoGeometry = {
            positions: register(
                'wheezy-light-gizmo-positions',
                sphere.positions,
                12,
                'float32x3',
                5126,
                sphere.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            normals: register(
                'wheezy-light-gizmo-normals',
                sphere.normals,
                12,
                'float32x3',
                5126,
                sphere.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            tangents: register(
                'wheezy-light-gizmo-tangents',
                sphere.tangents,
                12,
                'float32x3',
                5126,
                sphere.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            uvs: register(
                'wheezy-light-gizmo-uvs',
                sphere.uvs,
                8,
                'float32x2',
                5126,
                sphere.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            indices: register(
                'wheezy-light-gizmo-indices',
                sphere.indices,
                2,
                'uint16',
                5123,
                sphere.indices.length,
                GPUBufferUsage.INDEX
            ),
        }
        this._geometry.set(scene, geometry)
        return geometry
    }

    private static _createMaterial(device: GPUDevice, color: Vec3): IMaterial {
        const white = (this._white ??= {
            view: this._createSolidTexture(device, [255, 255, 255, 255]),
            sampler: device.createSampler({
                magFilter: 'nearest',
                minFilter: 'nearest',
            }),
        })

        return {
            name: 'light gizmo material',
            // black albedo: the marker shows pure emission in the lighting pass
            baseColorFactor: vec4.create(0, 0, 0, 1),
            metallicFactor: 0,
            roughnessFactor: 1,
            emissiveFactor: vec3.clone(color),
            baseColorTexture: white,
            metallicRoughnessTexture: white,
            normalTexture: white,
            occlusionTexture: white,
            emissiveTexture: {
                view: this._createSolidTexture(device, [
                    Math.round((color[0] ?? 0) * 255),
                    Math.round((color[1] ?? 0) * 255),
                    Math.round((color[2] ?? 0) * 255),
                    255,
                ]),
                sampler: white.sampler,
            },
        }
    }

    private static _createSolidTexture(
        device: GPUDevice,
        rgba: number[]
    ): GPUTextureView {
        const texture = device.createTexture({
            label: 'light gizmo texture',
            size: [1, 1, 1],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        })
        device.queue.writeTexture(
            { texture },
            new Uint8Array(rgba),
            { bytesPerRow: 4 },
            [1, 1, 1]
        )
        return texture.createView()
    }
}
