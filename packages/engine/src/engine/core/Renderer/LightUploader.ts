import { vec3, type Vec3 } from 'wgpu-matrix'
import { type IScene } from '../../types'
import { type ILightSourceV2 } from '../lights/LightSourceV2'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type StagingBuffers } from './StagingBuffers'
import {
    CLUSTER_DEPTH_SLICES,
    CLUSTER_MAX_LIGHTS,
    CLUSTER_TILE_SIZE,
    CULL_LIGHTS_BUFFER_SIZE,
    CULL_LIGHTS_HEADER_SIZE,
    CULL_LIGHT_STRIDE,
    DIRECTIONAL_LIGHT_BYTESTRIDE,
    DIRECTIONAL_LIGHT_ELEMENT_COUNT,
    LIGHT_RANGE_THRESHOLD,
    MAX_CULL_LIGHTS,
    MAX_DIRECTIONAL_LIGHTS,
    MAX_POINT_LIGHTS,
    MAX_SPOT_LIGHTS,
    POINT_LIGHT_BYTESTRIDE,
    POINT_LIGHT_ELEMENT_COUNT,
    SHADOW_LOCAL_FAR,
    SPOT_LIGHT_BYTESTRIDE,
    SPOT_LIGHT_ELEMENT_COUNT,
    VIEW_PARAMS_DIRECTIONAL_COUNT_SLOT,
    VIEW_PARAMS_POINT_COUNT_SLOT,
    VIEW_PARAMS_SPOT_COUNT_SLOT,
} from './constants'

// float slot of the `shadow_caster: i32` field inside each light type's GPU
// layout (occupies the pad slot — see the WGSL structs in lighting.wgsl)
const DIRECTIONAL_CASTER_SLOT = 7
const POINT_CASTER_SLOT = 10
const SPOT_CASTER_SLOT = 3
// float slot of the `range: f32` field inside the point/spot GPU layouts (the
// remaining pad slot) — the culling-derived radius the shader's fade window
// uses to smooth the contribution to zero before the cluster cutoff
const POINT_RANGE_SLOT = 11
const SPOT_RANGE_SLOT = 7

/**
 * Light storage buffers, the derived-range cache and the compact culling
 * upload for the clustered light-culling compute pass.
 *
 * The three light buffers are persistent and sized to fixed capacities
 * (MAX_*_LIGHTS); the per-frame counts travel in the view params (floats 63–65)
 * and bound the shader loops, so the buffers and the lights bind group are
 * created exactly once. Per-light influence radii are derived once per frame
 * into preallocated arrays shared with ShadowCasters.
 */
export class LightUploader {
    readonly lightsBindGroup: GPUBindGroup
    readonly cullLightsBindGroup: GPUBindGroup
    readonly clusterComputeBindGroup: GPUBindGroup
    readonly clusterCountsBuffer: GPUBuffer
    readonly clusterIndicesBuffer: GPUBuffer
    readonly clusterTilesX: number
    readonly clusterTilesY: number
    readonly clusterCount: number

    /** derived influence radius per point/spot light, indexed by position in the scene arrays */
    readonly pointRanges = new Float32Array(MAX_POINT_LIGHTS)
    readonly spotRanges = new Float32Array(MAX_SPOT_LIGHTS)

    #device: GPUDevice
    #staging: StagingBuffers
    #directionalLightsBuffer: GPUBuffer
    #pointLightsBuffer: GPUBuffer
    #spotLightsBuffer: GPUBuffer
    #cullLightsBuffer: GPUBuffer
    #cullCount = 0
    #scratchDirection = vec3.create()
    #capacityWarned = false

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        staging: StagingBuffers,
        canvas: HTMLCanvasElement
    ) {
        this.#device = device
        this.#staging = staging

        // grid sized from the canvas (fixed at init — no resize support, same
        // as the G-buffer)
        this.clusterTilesX = Math.ceil(canvas.width / CLUSTER_TILE_SIZE)
        this.clusterTilesY = Math.ceil(canvas.height / CLUSTER_TILE_SIZE)
        this.clusterCount =
            this.clusterTilesX * this.clusterTilesY * CLUSTER_DEPTH_SLICES

        this.clusterCountsBuffer = device.createBuffer({
            label: 'cluster light counts',
            size: this.clusterCount * 4,
            usage: GPUBufferUsage.STORAGE,
        })

        this.clusterIndicesBuffer = device.createBuffer({
            label: 'cluster light indices',
            size: this.clusterCount * CLUSTER_MAX_LIGHTS * 4,
            usage: GPUBufferUsage.STORAGE,
        })

        this.#cullLightsBuffer = device.createBuffer({
            label: 'cull lights buffer',
            size: CULL_LIGHTS_BUFFER_SIZE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        this.#directionalLightsBuffer = device.createBuffer({
            label: 'directional lights buffer',
            size: MAX_DIRECTIONAL_LIGHTS * DIRECTIONAL_LIGHT_BYTESTRIDE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
        this.#pointLightsBuffer = device.createBuffer({
            label: 'point lights buffer',
            size: MAX_POINT_LIGHTS * POINT_LIGHT_BYTESTRIDE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })
        this.#spotLightsBuffer = device.createBuffer({
            label: 'spot lights buffer',
            size: MAX_SPOT_LIGHTS * SPOT_LIGHT_BYTESTRIDE,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        })

        this.cullLightsBindGroup = device.createBindGroup({
            label: 'cull lights bind group',
            layout: layouts.cullLights,
            entries: [
                { binding: 0, resource: { buffer: this.#cullLightsBuffer } },
            ],
        })

        this.clusterComputeBindGroup = device.createBindGroup({
            label: 'cluster compute bind group',
            layout: layouts.clusterCompute,
            entries: [
                { binding: 0, resource: { buffer: this.clusterCountsBuffer } },
                {
                    binding: 1,
                    resource: { buffer: this.clusterIndicesBuffer },
                },
            ],
        })

        // static: the light buffers are persistent, and the shader loops are
        // bounded by the counts in the view params, not by the buffer sizes
        this.lightsBindGroup = device.createBindGroup({
            label: 'lights bind group',
            layout: layouts.lights,
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.#directionalLightsBuffer },
                },
                { binding: 1, resource: { buffer: this.#pointLightsBuffer } },
                { binding: 2, resource: { buffer: this.#spotLightsBuffer } },
            ],
        })
    }

    get cullingWorkgroups() {
        return Math.ceil(this.clusterCount / 64)
    }

    /**
     * Distance at which a light's contribution drops below
     * LIGHT_RANGE_THRESHOLD — attenuation is `c + l·d + e·d²`.
     */
    #deriveLightRange(
        intensity: number,
        attenuationConstant: number,
        attenuationLinear: number,
        attenuationExponential: number
    ): number {
        const reach = intensity / LIGHT_RANGE_THRESHOLD
        if (reach <= attenuationConstant) {
            return 0
        }
        if (attenuationExponential > 1e-8) {
            const discriminant =
                attenuationLinear * attenuationLinear +
                4 * attenuationExponential * (reach - attenuationConstant)
            return (
                (-attenuationLinear + Math.sqrt(Math.max(0, discriminant))) /
                (2 * attenuationExponential)
            )
        }
        if (attenuationLinear > 1e-8) {
            return (reach - attenuationConstant) / attenuationLinear
        }
        return SHADOW_LOCAL_FAR
    }

    /** the single per-frame range derivation — ShadowCasters and the uploads read these arrays */
    computeRanges(scene: IScene) {
        const pointCount = Math.min(scene.pointLights.length, MAX_POINT_LIGHTS)
        for (let i = 0; i < pointCount; i++) {
            const light = scene.pointLights[i]!
            this.pointRanges[i] = this.#deriveLightRange(
                light.intensity,
                light.attenuationConstant,
                light.attenuationLinear,
                light.attenuationExponential
            )
        }
        const spotCount = Math.min(scene.spotLights.length, MAX_SPOT_LIGHTS)
        for (let i = 0; i < spotCount; i++) {
            const light = scene.spotLights[i]!
            this.spotRanges[i] = this.#deriveLightRange(
                light.intensity,
                light.attenuationConstant,
                light.attenuationLinear,
                light.attenuationExponential
            )
        }
    }

    /**
     * Rewrites the three persistent light buffers (used prefix only) and the
     * light counts in the view-params staging. `casterBases` comes from
     * ShadowCasters.allocate, which must run first.
     */
    upload(scene: IScene, casterBases: Map<ILightSourceV2, number>) {
        const staging = this.#staging
        const queue = this.#device.queue

        const directionalCount = Math.min(
            scene.directionalLights.length,
            MAX_DIRECTIONAL_LIGHTS
        )
        const pointCount = Math.min(scene.pointLights.length, MAX_POINT_LIGHTS)
        const spotCount = Math.min(scene.spotLights.length, MAX_SPOT_LIGHTS)
        this.#warnIfTruncated(scene)

        const directionalFloats = staging.directionalLightsFloats
        const directionalInts = staging.directionalLightsInts
        for (let i = 0; i < directionalCount; i++) {
            const light = scene.directionalLights[i]!
            const offset = i * DIRECTIONAL_LIGHT_ELEMENT_COUNT
            light.fillLightData(directionalFloats, offset)
            // patch the shadow caster base index into the layout's pad slot
            // (-1 = this light casts no shadow this frame)
            directionalInts[offset + DIRECTIONAL_CASTER_SLOT] =
                casterBases.get(light) ?? -1
        }
        if (directionalCount > 0) {
            queue.writeBuffer(
                this.#directionalLightsBuffer,
                0,
                staging.directionalLights,
                0,
                directionalCount * DIRECTIONAL_LIGHT_BYTESTRIDE
            )
        }

        const pointFloats = staging.pointLightsFloats
        const pointInts = staging.pointLightsInts
        for (let i = 0; i < pointCount; i++) {
            const light = scene.pointLights[i]!
            const offset = i * POINT_LIGHT_ELEMENT_COUNT
            light.fillLightData(pointFloats, offset)
            pointInts[offset + POINT_CASTER_SLOT] = casterBases.get(light) ?? -1
            // the derived influence radius — the shader fades the light to
            // zero at this distance
            pointFloats[offset + POINT_RANGE_SLOT] = this.pointRanges[i]!
        }
        if (pointCount > 0) {
            queue.writeBuffer(
                this.#pointLightsBuffer,
                0,
                staging.pointLights,
                0,
                pointCount * POINT_LIGHT_BYTESTRIDE
            )
        }

        const spotFloats = staging.spotLightsFloats
        const spotInts = staging.spotLightsInts
        for (let i = 0; i < spotCount; i++) {
            const light = scene.spotLights[i]!
            const offset = i * SPOT_LIGHT_ELEMENT_COUNT
            light.fillLightData(spotFloats, offset)
            spotInts[offset + SPOT_CASTER_SLOT] = casterBases.get(light) ?? -1
            spotFloats[offset + SPOT_RANGE_SLOT] = this.spotRanges[i]!
        }
        if (spotCount > 0) {
            queue.writeBuffer(
                this.#spotLightsBuffer,
                0,
                staging.spotLights,
                0,
                spotCount * SPOT_LIGHT_BYTESTRIDE
            )
        }

        // the WGSL loops are bounded by these counts (see ViewParams in lighting.wgsl)
        const viewInts = staging.viewParamsInts
        viewInts[VIEW_PARAMS_DIRECTIONAL_COUNT_SLOT] = directionalCount
        viewInts[VIEW_PARAMS_POINT_COUNT_SLOT] = pointCount
        viewInts[VIEW_PARAMS_SPOT_COUNT_SLOT] = spotCount
    }

    /**
     * Fills the compact culling buffer for the clustered light-culling compute
     * pass: all point (type 0) and spot (type 1) lights with derived ranges.
     */
    updateCullLights(scene: IScene) {
        const floats = this.#staging.cullLightsFloats
        const ints = this.#staging.cullLightsInts
        floats.fill(0)
        this.#cullCount = 0

        const pointCount = Math.min(scene.pointLights.length, MAX_POINT_LIGHTS)
        for (let i = 0; i < pointCount; i++) {
            const light = scene.pointLights[i]!
            this.#addCullLight(
                light.position,
                this.pointRanges[i]!,
                null,
                -2, // point marker — no cone test in the shader
                0,
                i
            )
        }

        const spotCount = Math.min(scene.spotLights.length, MAX_SPOT_LIGHTS)
        for (let i = 0; i < spotCount; i++) {
            const light = scene.spotLights[i]!
            this.#addCullLight(
                light.position,
                this.spotRanges[i]!,
                vec3.normalize(light.direction, this.#scratchDirection),
                light.cutoff,
                1,
                i
            )
        }

        ints[0] = this.#cullCount
        this.#device.queue.writeBuffer(
            this.#cullLightsBuffer,
            0,
            this.#staging.cullLights
        )
    }

    #addCullLight(
        position: Vec3,
        range: number,
        direction: Vec3 | null,
        cosCutoff: number,
        type: number,
        index: number
    ) {
        if (this.#cullCount >= MAX_CULL_LIGHTS) {
            return
        }
        const floats = this.#staging.cullLightsFloats
        const ints = this.#staging.cullLightsInts
        const entry =
            (CULL_LIGHTS_HEADER_SIZE + this.#cullCount * CULL_LIGHT_STRIDE) / 4
        floats.set(position, entry)
        floats[entry + 3] = range
        if (direction) {
            floats.set(direction, entry + 4)
        }
        floats[entry + 7] = cosCutoff
        ints[entry + 8] = (type << 16) | index
        this.#cullCount++
    }

    #warnIfTruncated(scene: IScene) {
        if (
            this.#capacityWarned ||
            (scene.directionalLights.length <= MAX_DIRECTIONAL_LIGHTS &&
                scene.pointLights.length <= MAX_POINT_LIGHTS &&
                scene.spotLights.length <= MAX_SPOT_LIGHTS)
        ) {
            return
        }
        this.#capacityWarned = true
        console.warn(
            `wheezy: light counts exceed the fixed capacities ` +
                `(${MAX_DIRECTIONAL_LIGHTS} directional / ${MAX_POINT_LIGHTS} point / ` +
                `${MAX_SPOT_LIGHTS} spot) — extra lights are ignored`
        )
    }
}
