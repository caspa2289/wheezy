import { mat4, vec3, type Vec3, vec4 } from 'wgpu-matrix'
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
// the marker is shaded by the scene like any mesh (albedo = the light's color)
// but keeps this fraction of the color as emission, so it stays visible in a
// scene with no lights at all
const GIZMO_EMISSION = 0.35
// direction cone: fixed length in world units; the opening follows the
// light's real (pre-cosined) cutoff, clamped so ultra-wide cones stay legible
const GIZMO_CONE_LENGTH = 1.0
const GIZMO_CONE_MAX_HALF_ANGLE = (75 * Math.PI) / 180
// directional lights have no cutoff — their gizmo cone uses a fixed half angle
const DIRECTIONAL_GIZMO_COS_CUTOFF = Math.cos((30 * Math.PI) / 180)

// canonical cone axis and scratch objects — sync is single-threaded and
// consumes every scratch value before the next light, so module-level
// scratch keeps the per-frame path allocation-free
const UP = vec3.create(0, 1, 0)
const scratchRotation = mat4.create()
const scratchScale = mat4.create()
const scratchTranslation = mat4.create()
const scratchComposed = mat4.create()
const scratchAxis = vec3.create()
const scratchScaleVec = vec3.create()

interface MeshAccessors {
    positions: GLTFAccessor
    indices: GLTFAccessor
    normals: GLTFAccessor
    uvs: GLTFAccessor
    tangents: GLTFAccessor
}

interface GizmoGeometry {
    sphere: MeshAccessors
    cone: MeshAccessors
}

interface GizmoParts {
    sphere: IGameObject
    cone?: IGameObject
    coneTransform?: Transform
    attached: boolean
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
 * Canonical direction cone: apex at the origin, axis +Y, base cap at y = 1
 * with radius 1 — per-light scaling (tan(halfAngle)·length, length, …) turns
 * it into the light's actual cone. Same vertex-layout contract and CCW
 * outward winding as the sphere. Normals are approximate (the marker renders
 * as pure emission over black albedo, so shading normals are irrelevant).
 */
function createGizmoCone() {
    const positions: number[] = []
    const normals: number[] = []
    const tangents: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    const inverseSqrt2 = 1 / Math.SQRT2

    // lateral surface: an apex + a base-rim vertex per segment boundary
    for (let segment = 0; segment <= GIZMO_SEGMENTS; segment++) {
        const theta = (segment / GIZMO_SEGMENTS) * Math.PI * 2
        const cx = Math.cos(theta)
        const cz = Math.sin(theta)
        // outward normal of the 45° canonical slope: (radial, −1)/√2
        const nx = cx * inverseSqrt2
        const ny = -inverseSqrt2
        const nz = cz * inverseSqrt2
        const u = segment / GIZMO_SEGMENTS

        // apex
        positions.push(0, 0, 0)
        normals.push(nx, ny, nz)
        tangents.push(-cz, 0, cx)
        uvs.push(u, 0)
        // base rim
        positions.push(cx, 1, cz)
        normals.push(nx, ny, nz)
        tangents.push(-cz, 0, cx)
        uvs.push(u, 1)
    }

    // base cap: shared center + its own rim (flat +Y normals)
    const capCenterIndex = 2 * (GIZMO_SEGMENTS + 1)
    positions.push(0, 1, 0)
    normals.push(0, 1, 0)
    tangents.push(1, 0, 0)
    uvs.push(0.5, 0.5)
    for (let segment = 0; segment <= GIZMO_SEGMENTS; segment++) {
        const theta = (segment / GIZMO_SEGMENTS) * Math.PI * 2
        const cx = Math.cos(theta)
        const cz = Math.sin(theta)
        positions.push(cx, 1, cz)
        normals.push(0, 1, 0)
        tangents.push(1, 0, 0)
        uvs.push(cx * 0.5 + 0.5, cz * 0.5 + 0.5)
    }

    for (let segment = 0; segment < GIZMO_SEGMENTS; segment++) {
        const apex = 2 * segment
        const base = apex + 1
        const baseNext = base + 2
        // CCW seen from outside: apex → base_i → base_i+1
        indices.push(apex, base, baseNext)

        // cap fan, CCW seen from +Y: center → rim_i+1 → rim_i
        const rim = capCenterIndex + 1 + segment
        const rimNext = rim + 1
        indices.push(capCenterIndex, rimNext, rim)
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        tangents: new Float32Array(tangents),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices),
        vertexCount: 3 * GIZMO_SEGMENTS + 4,
    }
}

/**
 * Debug markers ("gizmos") for lights: a small emissive **sphere** in the
 * light's own color pinned to `light.gizmoPosition` (the anchor — for
 * directional lights that is the world origin, matching their `pointAt`
 * anchor), plus, for lights with a direction (spot, directional), an
 * emissive **cone** showing where the light points: apex at the anchor,
 * opened along `light.direction` with the spot's real cutoff angle
 * (directional uses a fixed 30° half angle). `Renderer.render` drives `sync`
 * every frame before the scene-tree traversal; visibility comes from the
 * profiler HUD's checkbox (`Profiler.enabled && Profiler.gizmosEnabled`), so
 * gizmos are dev-only like the HUD itself.
 *
 * Parts are created once per light (lazily) and then attached to / detached
 * from the scene tree on toggle — the Meshes and their GPU buffers in
 * MeshRenderDataStorage survive detachment, so repeated toggling re-uploads
 * nothing. Materials are self-contained (1×1 textures: black albedo, pure
 * emission), so gizmos also work in scenes without any uploaded model. The
 * light color is sampled at creation time; positions/directions/cutoffs are
 * re-read every frame, so animated lights drag their gizmos along.
 */
export class LightGizmo {
    // per-scene shared geometry (buffer data registered in scene.bufferStorage)
    private static _geometry = new WeakMap<IScene, GizmoGeometry>()
    // per-light gizmo parts + attachment state
    private static _parts = new WeakMap<ILightSourceV2, GizmoParts>()
    // shared 1×1 white texture + sampler for the non-emissive material slots
    private static _white?: IMaterialTexture

    public static sync(scene: IScene, enabled: boolean) {
        for (const light of scene.pointLights) {
            this._syncLight(scene, light, enabled, null)
        }
        for (const light of scene.spotLights) {
            // cutoff is stored pre-cosined (see SpotLight)
            this._syncLight(
                scene,
                light,
                enabled,
                light.direction,
                light.cutoff
            )
        }
        for (const light of scene.directionalLights) {
            this._syncLight(
                scene,
                light,
                enabled,
                light.direction,
                DIRECTIONAL_GIZMO_COS_CUTOFF
            )
        }
    }

    private static _syncLight(
        scene: IScene,
        light: ILightSourceV2,
        enabled: boolean,
        direction: Vec3 | null,
        cosCutoff = 1
    ) {
        const position = light.gizmoPosition
        // lights without a gizmo anchor get nothing
        if (!position) {
            return
        }

        const parts = this._parts.get(light)

        if (enabled) {
            const gizmo =
                parts ??
                this._create(scene, light, position, direction !== null)
            if (!gizmo.attached) {
                scene.objectManager.addObject(gizmo.sphere, scene.root)
                if (gizmo.cone) {
                    scene.objectManager.addObject(gizmo.cone, scene.root)
                }
                gizmo.attached = true
            }
            // lights move (animations, controllers) — re-pin every frame;
            // translate writes the matrix position column, scale is untouched
            gizmo.sphere.transform.translate(position)
            if (gizmo.coneTransform && direction) {
                this._updateConeTransform(
                    gizmo.coneTransform,
                    position,
                    direction,
                    cosCutoff
                )
            }
            return
        }

        if (parts?.attached) {
            scene.objectManager.destroyObject(parts.sphere)
            if (parts.cone) {
                scene.objectManager.destroyObject(parts.cone)
            }
            parts.attached = false
        }
    }

    private static _create(
        scene: IScene,
        light: ILightSourceV2,
        position: Vec3,
        withCone: boolean
    ): GizmoParts {
        const geometry = this._ensureGeometry(scene)
        // one material shared by both parts of this light
        const material = this._createMaterial(
            scene.engine.renderer.device,
            light.color
        )

        const sphere = new GameObject()
        const sphereTransform = new Transform(sphere)
        sphereTransform.translate(position)
        sphereTransform.scale(
            vec3.create(GIZMO_RADIUS, GIZMO_RADIUS, GIZMO_RADIUS)
        )
        // debug helpers must not shadow the scene they visualize
        new Mesh(
            sphere,
            geometry.sphere.positions,
            geometry.sphere.indices,
            geometry.sphere.normals,
            geometry.sphere.uvs,
            geometry.sphere.tangents,
            material
        ).castShadow = false
        light.gizmo = sphere

        const parts: GizmoParts = { sphere, attached: false }

        if (withCone) {
            const cone = new GameObject()
            parts.coneTransform = new Transform(cone)
            new Mesh(
                cone,
                geometry.cone.positions,
                geometry.cone.indices,
                geometry.cone.normals,
                geometry.cone.uvs,
                geometry.cone.tangents,
                material
            ).castShadow = false
            parts.cone = cone
        }

        this._parts.set(light, parts)
        return parts
    }

    /**
     * Compose the cone's world matrix (translation × rotation(+Y → direction)
     * × scale) and copy it INTO the existing transform.matrix buffer —
     * reassigning `transform.matrix` would orphan Transform's `_position`
     * view, which aliases that buffer.
     */
    private static _updateConeTransform(
        transform: Transform,
        position: Vec3,
        direction: Vec3,
        cosCutoff: number
    ) {
        const clampedCos = Math.min(1, Math.max(-1, cosCutoff))
        const halfAngle = Math.min(
            Math.acos(clampedCos),
            GIZMO_CONE_MAX_HALF_ANGLE
        )
        const radius = Math.tan(halfAngle) * GIZMO_CONE_LENGTH

        const dot = vec3.dot(UP, direction)
        if (dot > 0.999999) {
            mat4.identity(scratchRotation)
        } else if (dot < -0.999999) {
            // anti-parallel: any perpendicular axis works for the 180° flip
            mat4.rotationX(Math.PI, scratchRotation)
        } else {
            vec3.cross(UP, direction, scratchAxis)
            vec3.normalize(scratchAxis, scratchAxis)
            mat4.rotation(scratchAxis, Math.acos(dot), scratchRotation)
        }

        scratchScaleVec[0] = radius
        scratchScaleVec[1] = GIZMO_CONE_LENGTH
        scratchScaleVec[2] = radius
        mat4.scaling(scratchScaleVec, scratchScale)
        mat4.translation(position, scratchTranslation)

        mat4.multiply(scratchRotation, scratchScale, scratchComposed)
        mat4.multiply(scratchTranslation, scratchComposed, scratchComposed)
        mat4.copy(scratchComposed, transform.matrix)
    }

    private static _ensureGeometry(scene: IScene): GizmoGeometry {
        const cached = this._geometry.get(scene)
        if (cached) {
            return cached
        }

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

        const registerMesh = (
            prefix: string,
            mesh: ReturnType<typeof createGizmoSphere>
        ): MeshAccessors => ({
            positions: register(
                `wheezy-light-gizmo-${prefix}-positions`,
                mesh.positions,
                12,
                'float32x3',
                5126,
                mesh.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            normals: register(
                `wheezy-light-gizmo-${prefix}-normals`,
                mesh.normals,
                12,
                'float32x3',
                5126,
                mesh.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            tangents: register(
                `wheezy-light-gizmo-${prefix}-tangents`,
                mesh.tangents,
                12,
                'float32x3',
                5126,
                mesh.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            uvs: register(
                `wheezy-light-gizmo-${prefix}-uvs`,
                mesh.uvs,
                8,
                'float32x2',
                5126,
                mesh.vertexCount,
                GPUBufferUsage.VERTEX
            ),
            indices: register(
                `wheezy-light-gizmo-${prefix}-indices`,
                mesh.indices,
                2,
                'uint16',
                5123,
                mesh.indices.length,
                GPUBufferUsage.INDEX
            ),
        })

        const geometry: GizmoGeometry = {
            sphere: registerMesh('sphere', createGizmoSphere()),
            cone: registerMesh('cone', createGizmoCone()),
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
            // albedo = the light's color, so scene lights shade the marker like
            // any mesh; the emissive texture below is the floor that keeps it
            // visible when nothing lights it (GIZMO_EMISSION of the color)
            baseColorFactor: vec4.create(
                color[0] ?? 0,
                color[1] ?? 0,
                color[2] ?? 0,
                1
            ),
            metallicFactor: 0,
            roughnessFactor: 0.5,
            emissiveFactor: vec3.clone(color),
            baseColorTexture: white,
            metallicRoughnessTexture: white,
            normalTexture: white,
            occlusionTexture: white,
            emissiveTexture: {
                view: this._createSolidTexture(device, [
                    Math.round((color[0] ?? 0) * GIZMO_EMISSION * 255),
                    Math.round((color[1] ?? 0) * GIZMO_EMISSION * 255),
                    Math.round((color[2] ?? 0) * GIZMO_EMISSION * 255),
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
