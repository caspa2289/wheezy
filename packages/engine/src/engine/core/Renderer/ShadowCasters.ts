import { mat4, type Mat4, vec3, type Vec3 } from 'wgpu-matrix'
import { type IScene } from '../../types'
import { type ILightSourceV2 } from '../lights/LightSourceV2'
import { type ISpotLight } from '../lights/SpotLight'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type StagingBuffers } from './StagingBuffers'
import {
    MAX_POINT_LIGHTS,
    MAX_SHADOW_CASTERS,
    MAX_SPOT_LIGHTS,
    SHADOW_ATLAS_SIZE,
    SHADOW_CASTER_STRIDE,
    SHADOW_DATA_BUFFER_SIZE,
    SHADOW_DATA_HEADER_SIZE,
    SHADOW_DISTANCE,
    SHADOW_FRUSTUM_Z_EXTEND,
    SHADOW_INDEX_SLOT_SIZE,
    SHADOW_LOCAL_FAR,
    SHADOW_TEXEL_BUDGET,
    SHADOW_TILE_DIRECTIONAL,
    SHADOW_TILE_POINT_FACE,
    SHADOW_TILE_SPOT,
    SPOT_MAX_CONE_HALF_ANGLE,
} from './constants'

// point-light cube shadow faces — order must match pointShadowFactor in
// lighting.wgsl: +X -X +Y -Y +Z -Z
const POINT_FACE_DIRECTIONS = [
    vec3.fromValues(1, 0, 0),
    vec3.fromValues(-1, 0, 0),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, -1, 0),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(0, 0, -1),
]
// ups that are never parallel to the face direction
const POINT_FACE_UPS = [
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, 0, -1),
    vec3.fromValues(0, 0, 1),
    vec3.fromValues(0, 1, 0),
    vec3.fromValues(0, 1, 0),
]
// ups that are never parallel to a directional/spot light direction
const UP_Y = vec3.fromValues(0, 1, 0)
const UP_Z = vec3.fromValues(0, 0, 1)

const POINT_FACE_COUNT = 6

/** one atlas tile to render this frame: pixel rect + caster entry index */
export interface ShadowTile {
    x: number
    y: number
    size: number
    casterIndex: number
}

/** pooled per-light shadow candidate — reused across frames, never reallocated */
interface ShadowCandidate {
    light: ILightSourceV2
    distance: number
    tileSize: number
    /** caster entries this light occupies (1 for directional/spot, 6 for point) */
    entryCount: number
    /** entries whose faces passed culling (the texel-budget unit) */
    visibleCount: number
    /** one VP per caster entry; entries with faceVisible = false are stale */
    vps: Mat4[]
    faceVisible: boolean[]
    rectX: Int32Array
    rectY: Int32Array
}

/**
 * Shadow atlas allocator: camera-sphere fit, per-light VP construction,
 * point-face culling, texel budget, hysteresis and the shelf packer. Owns the
 * persistent shadow-data buffer (+ its dynamic-offset caster-index mechanism)
 * and the per-frame tile list. All per-frame state is pooled — allocate()
 * reuses candidates, tiles, the caster-base map and the hysteresis sets.
 */
export class ShadowCasters {
    readonly dataBuffer: GPUBuffer
    /** group 0 of the shadow pipelines (dynamic-offset caster index + data storage) */
    readonly dataBindGroup: GPUBindGroup
    /** pooled — read `frameTileCount` entries, the array may be longer */
    readonly frameTiles: ShadowTile[] = []
    frameTileCount = 0

    #device: GPUDevice
    #staging: StagingBuffers

    #candidatePool: ShadowCandidate[] = []
    #candidateCount = 0
    /** the active pool prefix, sorted for budget assignment (reused array) */
    #sortedCandidates: ShadowCandidate[] = []
    #casterBases = new Map<ILightSourceV2, number>()
    // hysteresis: lights that held a tile last frame get budget priority
    #prevShadowedLights = new Set<ILightSourceV2>()
    #assignedLights = new Set<ILightSourceV2>()

    // sphere-fit scratch (reused every frame)
    #sphere = { center: vec3.create(), radius: 0 }
    #sphereCorners = new Float32Array(8 * 3)
    #cornerVecs: Vec3[] = []
    #scratchCorner = vec3.create()
    #scratchUnprojected = vec3.create()
    #scratchToCorner = vec3.create()
    #scratchDirection = vec3.create()
    #scratchEye = vec3.create()
    #scratchTarget = vec3.create()
    #scratchLightView = mat4.create()
    #scratchLightProjection = mat4.create()

    // shelf packer state
    #shelfX = 0
    #shelfY = 0
    #shelfHeight = 0

    #candidateComparator = (a: ShadowCandidate, b: ShadowCandidate) => {
        const prevA = this.#prevShadowedLights.has(a.light) ? 0 : 1
        const prevB = this.#prevShadowedLights.has(b.light) ? 0 : 1
        if (prevA !== prevB) {
            return prevA - prevB
        }
        return a.distance - b.distance
    }

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        staging: StagingBuffers
    ) {
        this.#device = device
        this.#staging = staging

        for (let i = 0; i < 8; i++) {
            this.#cornerVecs.push(
                this.#sphereCorners.subarray(i * 3, i * 3 + 3) as Vec3
            )
        }

        this.dataBuffer = device.createBuffer({
            label: 'shadow data buffer',
            size: SHADOW_DATA_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        // slot i of the index buffer holds the u32 value i; bound with a dynamic
        // offset (i × 256) per atlas tile draw
        const indexBuffer = device.createBuffer({
            label: 'shadow caster index buffer',
            size: MAX_SHADOW_CASTERS * SHADOW_INDEX_SLOT_SIZE,
            usage: GPUBufferUsage.UNIFORM,
            mappedAtCreation: true,
        })
        {
            const slots = new Uint32Array(indexBuffer.getMappedRange())
            for (let i = 0; i < MAX_SHADOW_CASTERS; i++) {
                slots[(i * SHADOW_INDEX_SLOT_SIZE) / 4] = i
            }
            indexBuffer.unmap()
        }

        this.dataBindGroup = device.createBindGroup({
            label: 'shadow data bind group',
            layout: layouts.shadowData,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: indexBuffer,
                        offset: 0,
                        size: 4,
                    },
                },
                { binding: 1, resource: { buffer: this.dataBuffer } },
            ],
        })
    }

    /**
     * Ranks all lights (directional first, then by camera distance,
     * previously-shadowed lights keep priority as hysteresis), assigns atlas
     * tiles within the texel budget, builds each light's VP matrices, fills
     * the shadow-data buffer and returns the light → caster-entry-base map
     * used to patch the light storage buffers. A point light occupies 6
     * consecutive entries (face order +X -X +Y -Y +Z -Z); culled faces stay
     * `enabled = 0` (the shader treats them as lit).
     *
     * The range arrays come from LightUploader.computeRanges, which must run
     * first — this is the single per-frame range derivation.
     */
    allocate(
        scene: IScene,
        cameraPosition: Vec3,
        inverseViewProjection: Mat4,
        pointRanges: Float32Array,
        spotRanges: Float32Array
    ): Map<ILightSourceV2, number> {
        const floats = this.#staging.shadowDataFloats
        const ints = this.#staging.shadowDataInts
        floats.fill(0)
        this.frameTileCount = 0
        this.#casterBases.clear()
        this.#candidateCount = 0

        const sphere = this.#cameraShadowSphere(
            cameraPosition,
            inverseViewProjection,
            SHADOW_DISTANCE
        )

        for (const light of scene.directionalLights) {
            if (vec3.length(light.direction) <= 1e-6) {
                continue
            }
            const candidate = this.#nextCandidate(
                light,
                0,
                SHADOW_TILE_DIRECTIONAL,
                1
            )
            this.#directionalShadowVP(
                light.direction,
                sphere,
                SHADOW_TILE_DIRECTIONAL,
                candidate.vps[0]!
            )
            candidate.faceVisible[0] = true
            candidate.visibleCount = 1
        }

        for (let i = 0; i < scene.spotLights.length; i++) {
            const light = scene.spotLights[i]!
            const candidate = this.#nextCandidate(
                light,
                vec3.distance(light.position, cameraPosition),
                SHADOW_TILE_SPOT,
                1
            )
            this.#spotShadowVP(
                light,
                i < MAX_SPOT_LIGHTS ? spotRanges[i]! : 0,
                candidate.vps[0]!
            )
            candidate.faceVisible[0] = true
            candidate.visibleCount = 1
        }

        for (let i = 0; i < scene.pointLights.length; i++) {
            const light = scene.pointLights[i]!
            const range = i < MAX_POINT_LIGHTS ? pointRanges[i]! : 0
            const far = Math.min(Math.max(range, 1), SHADOW_LOCAL_FAR)
            const candidate = this.#nextCandidate(
                light,
                vec3.distance(light.position, cameraPosition),
                SHADOW_TILE_POINT_FACE,
                POINT_FACE_COUNT
            )
            let visibleCount = 0
            for (let face = 0; face < POINT_FACE_COUNT; face++) {
                const visible = this.#pointFaceVisible(
                    face,
                    light.position,
                    sphere
                )
                candidate.faceVisible[face] = visible
                if (visible) {
                    this.#pointFaceShadowVP(
                        light.position,
                        face,
                        far,
                        candidate.vps[face]!
                    )
                    visibleCount++
                }
            }
            candidate.visibleCount = visibleCount
        }

        // hysteresis: lights that held tiles last frame first, then relevance
        const candidates = this.#sortedCandidates
        candidates.length = 0
        for (let i = 0; i < this.#candidateCount; i++) {
            candidates.push(this.#candidatePool[i]!)
        }
        candidates.sort(this.#candidateComparator)

        // shelf packer over the atlas
        this.#shelfX = 0
        this.#shelfY = 0
        this.#shelfHeight = 0

        let casterCount = 0
        let texelsLeft = SHADOW_TEXEL_BUDGET
        const assigned = this.#assignedLights
        assigned.clear()

        for (const candidate of candidates) {
            const entryCount = candidate.entryCount
            if (casterCount + entryCount > MAX_SHADOW_CASTERS) {
                continue
            }
            const texels =
                candidate.visibleCount * candidate.tileSize * candidate.tileSize
            if (texels > texelsLeft) {
                continue
            }

            // place all tiles first; a light whose tiles don't all fit stays unshadowed
            let fits = true
            for (let i = 0; i < entryCount; i++) {
                if (!candidate.faceVisible[i]) {
                    continue // culled face — entry stays disabled
                }
                if (
                    !this.#placeTile(
                        candidate.tileSize,
                        candidate.rectX,
                        candidate.rectY,
                        i
                    )
                ) {
                    fits = false
                    break
                }
            }
            if (!fits) {
                continue
            }

            const base = casterCount
            for (let i = 0; i < entryCount; i++) {
                if (!candidate.faceVisible[i]) {
                    continue // culled face — entry stays disabled
                }
                const entry =
                    (SHADOW_DATA_HEADER_SIZE +
                        (base + i) * SHADOW_CASTER_STRIDE) /
                    4 // float offset
                floats.set(candidate.vps[i]!, entry)
                const rectX = candidate.rectX[i]!
                const rectY = candidate.rectY[i]!
                floats[entry + 16] = rectX / SHADOW_ATLAS_SIZE
                floats[entry + 17] = rectY / SHADOW_ATLAS_SIZE
                floats[entry + 18] = candidate.tileSize / SHADOW_ATLAS_SIZE
                floats[entry + 19] = candidate.tileSize / SHADOW_ATLAS_SIZE
                ints[entry + 20] = 1 // enabled

                const tile = this.#tileAt(this.frameTileCount)
                tile.x = rectX
                tile.y = rectY
                tile.size = candidate.tileSize
                tile.casterIndex = base + i
                this.frameTileCount++
            }
            casterCount += entryCount
            texelsLeft -= texels
            this.#casterBases.set(candidate.light, base)
            assigned.add(candidate.light)
        }

        ints[0] = casterCount
        // swap the hysteresis sets: this frame's assignment becomes next
        // frame's priority, and the old priority set is reused (cleared above)
        const previous = this.#prevShadowedLights
        this.#prevShadowedLights = assigned
        this.#assignedLights = previous
        this.#device.queue.writeBuffer(
            this.dataBuffer,
            0,
            this.#staging.shadowData
        )
        return this.#casterBases
    }

    #nextCandidate(
        light: ILightSourceV2,
        distance: number,
        tileSize: number,
        entryCount: number
    ): ShadowCandidate {
        let candidate = this.#candidatePool[this.#candidateCount]
        if (!candidate) {
            candidate = {
                light,
                distance,
                tileSize,
                entryCount,
                visibleCount: 0,
                vps: [],
                faceVisible: [],
                rectX: new Int32Array(POINT_FACE_COUNT),
                rectY: new Int32Array(POINT_FACE_COUNT),
            }
            for (let i = 0; i < POINT_FACE_COUNT; i++) {
                candidate.vps.push(mat4.create())
                candidate.faceVisible.push(false)
            }
            this.#candidatePool.push(candidate)
        } else {
            candidate.light = light
            candidate.distance = distance
            candidate.tileSize = tileSize
            candidate.entryCount = entryCount
            candidate.visibleCount = 0
        }
        this.#candidateCount++
        return candidate
    }

    #tileAt(index: number): ShadowTile {
        let tile = this.frameTiles[index]
        if (!tile) {
            tile = { x: 0, y: 0, size: 0, casterIndex: 0 }
            this.frameTiles.push(tile)
        }
        return tile
    }

    #placeTile(
        size: number,
        rectX: Int32Array,
        rectY: Int32Array,
        slot: number
    ): boolean {
        if (this.#shelfX + size > SHADOW_ATLAS_SIZE) {
            this.#shelfX = 0
            this.#shelfY += this.#shelfHeight
            this.#shelfHeight = 0
        }
        if (this.#shelfY + size > SHADOW_ATLAS_SIZE) {
            return false
        }
        rectX[slot] = this.#shelfX
        rectY[slot] = this.#shelfY
        this.#shelfX += size
        this.#shelfHeight = Math.max(this.#shelfHeight, size)
        return true
    }

    /**
     * Bounding sphere of the camera frustum, clamped to `maxDistance` — the
     * shared fit target for directional shadow frusta and the relevance volume
     * for point-light face culling.
     */
    #cameraShadowSphere(
        cameraPosition: Vec3,
        inverseViewProjection: Mat4,
        maxDistance: number
    ): { center: Vec3; radius: number } {
        let cornerIndex = 0
        for (let xi = 0; xi < 2; xi++) {
            const x = xi === 0 ? -1 : 1
            for (let yi = 0; yi < 2; yi++) {
                const y = yi === 0 ? -1 : 1
                for (let zi = 0; zi < 2; zi++) {
                    const corner = this.#scratchCorner
                    vec3.set(x, y, zi, corner)
                    const unprojected = vec3.transformMat4(
                        corner,
                        inverseViewProjection,
                        this.#scratchUnprojected
                    )
                    // clamp to maxDistance around the camera — the raw far-plane
                    // corners sit at zFar (1000) and would blow the fit up to
                    // world-scale texels
                    const toCorner = vec3.sub(
                        unprojected,
                        cameraPosition,
                        this.#scratchToCorner
                    )
                    const distance = vec3.length(toCorner)
                    if (distance > maxDistance) {
                        vec3.addScaled(
                            cameraPosition,
                            toCorner,
                            maxDistance / distance,
                            unprojected
                        )
                    }
                    const vec = this.#cornerVecs[cornerIndex]!
                    vec[0] = unprojected[0]!
                    vec[1] = unprojected[1]!
                    vec[2] = unprojected[2]!
                    cornerIndex++
                }
            }
        }

        const center = this.#sphere.center
        center[0] = 0
        center[1] = 0
        center[2] = 0
        for (const corner of this.#cornerVecs) {
            vec3.add(center, corner, center)
        }
        vec3.scale(center, 1 / 8, center)

        let radius = 0
        for (const corner of this.#cornerVecs) {
            radius = Math.max(radius, vec3.distance(corner, center))
        }
        this.#sphere.radius = radius
        return this.#sphere
    }

    #directionalShadowVP(
        lightDirection: Vec3,
        sphere: { center: Vec3; radius: number },
        tileSize: number,
        dst: Mat4
    ) {
        // direction = the way the light travels (shaders use -direction as "to light")
        const direction = vec3.normalize(lightDirection, this.#scratchDirection)
        const up = Math.abs(direction[1]!) > 0.99 ? UP_Z : UP_Y
        const eyeDistance = sphere.radius + SHADOW_FRUSTUM_Z_EXTEND
        const eye = vec3.addScaled(
            sphere.center,
            direction,
            -eyeDistance,
            this.#scratchEye
        )
        const lightView = mat4.lookAt(
            eye,
            sphere.center,
            up,
            this.#scratchLightView
        )

        // snap the extent to tile-texel increments (prevents crawl on camera motion)
        const texel = (2 * sphere.radius) / tileSize
        const extent = Math.max(texel, Math.ceil(sphere.radius / texel) * texel)

        const lightProjection = mat4.ortho(
            -extent,
            extent,
            -extent,
            extent,
            // start just in front of the light eye: catches casters between the
            // light and the camera sphere
            0.05,
            eyeDistance + extent,
            this.#scratchLightProjection
        )
        mat4.mul(lightProjection, lightView, dst)
    }

    #spotShadowVP(light: ISpotLight, range: number, dst: Mat4) {
        const direction = vec3.normalize(
            light.direction,
            this.#scratchDirection
        )
        const up = Math.abs(direction[1]!) > 0.99 ? UP_Z : UP_Y
        const target = vec3.addScaled(
            light.position,
            direction,
            1,
            this.#scratchTarget
        )
        const lightView = mat4.lookAt(
            light.position,
            target,
            up,
            this.#scratchLightView
        )

        // cutoff is stored pre-cosined (see SpotLight.cutoff setter); the min()
        // is the same clamp applied defensively in case `_cutoff` was written
        // directly, and keeps the projection away from π where it degenerates
        const halfAngle = Math.acos(Math.min(1, Math.max(-1, light.cutoff)))
        const fov = Math.min(2 * halfAngle, 2 * SPOT_MAX_CONE_HALF_ANGLE)
        const far = Math.min(Math.max(range, 1), SHADOW_LOCAL_FAR)
        const lightProjection = mat4.perspective(
            fov,
            1,
            0.1,
            far,
            this.#scratchLightProjection
        )
        mat4.mul(lightProjection, lightView, dst)
    }

    #pointFaceShadowVP(
        lightPosition: Vec3,
        face: number,
        far: number,
        dst: Mat4
    ) {
        const faceDirection = POINT_FACE_DIRECTIONS[face]!
        const target = vec3.add(
            lightPosition,
            faceDirection,
            this.#scratchTarget
        )
        const lightView = mat4.lookAt(
            lightPosition,
            target,
            POINT_FACE_UPS[face]!,
            this.#scratchLightView
        )
        const lightProjection = mat4.perspective(
            Math.PI / 2,
            1,
            0.1,
            far,
            this.#scratchLightProjection
        )
        mat4.mul(lightProjection, lightView, dst)
    }

    /**
     * Conservative cone/sphere test: does this cube face's 90° frustum see any
     * part of the camera bounding sphere?
     */
    #pointFaceVisible(
        face: number,
        lightPosition: Vec3,
        sphere: { center: Vec3; radius: number }
    ): boolean {
        const toCenter = vec3.sub(
            sphere.center,
            lightPosition,
            this.#scratchToCorner
        )
        const distance = vec3.length(toCenter)
        if (distance <= sphere.radius) {
            // light inside the camera sphere — every face is relevant
            return true
        }
        vec3.normalize(toCenter, toCenter)
        const cosAngle = vec3.dot(toCenter, POINT_FACE_DIRECTIONS[face]!)
        const radiusOverDistance = Math.min(1, sphere.radius / distance)
        // cos(45° + asin(r/d)) — the face cone widened by the sphere's angular radius
        const threshold =
            Math.SQRT1_2 *
                Math.sqrt(
                    Math.max(0, 1 - radiusOverDistance * radiusOverDistance)
                ) -
            Math.SQRT1_2 * radiusOverDistance
        return cosAngle >= threshold
    }
}
