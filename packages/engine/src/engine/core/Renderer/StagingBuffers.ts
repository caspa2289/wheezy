import {
    CULL_LIGHTS_BUFFER_SIZE,
    DIRECTIONAL_LIGHT_BYTESTRIDE,
    MAX_DIRECTIONAL_LIGHTS,
    MAX_POINT_LIGHTS,
    MAX_SPOT_LIGHTS,
    NODE_MATRICES_BUFFER_SIZE,
    POINT_LIGHT_BYTESTRIDE,
    SHADOW_DATA_BUFFER_SIZE,
    SKYBOX_UNIFORM_BUFFER_SIZE,
    SPOT_LIGHT_BYTESTRIDE,
    VIEW_PARAMS_BUFFER_SIZE,
} from './constants'

/**
 * Persistent CPU-side staging memory for every `queue.writeBuffer` upload.
 * Allocated once at startup; the per-frame writers reuse these buffers, so no
 * upload allocates. Each ArrayBuffer is exposed with the typed-array views its
 * consumer needs (a single backing buffer per upload — WebGPU rejects
 * overlapping getMappedRange calls, and the same applies conceptually here:
 * one region, several views).
 */
export class StagingBuffers {
    readonly viewParams = new ArrayBuffer(VIEW_PARAMS_BUFFER_SIZE)
    readonly viewParamsFloats = new Float32Array(this.viewParams)
    readonly viewParamsInts = new Uint32Array(this.viewParams)

    readonly skyboxParams = new ArrayBuffer(SKYBOX_UNIFORM_BUFFER_SIZE)
    readonly skyboxParamsFloats = new Float32Array(this.skyboxParams)

    // debug params: output_type u32 + pad
    readonly debugParams = new ArrayBuffer(8)
    readonly debugParamsView = new DataView(this.debugParams)

    readonly shadowData = new ArrayBuffer(SHADOW_DATA_BUFFER_SIZE)
    readonly shadowDataFloats = new Float32Array(this.shadowData)
    readonly shadowDataInts = new Uint32Array(this.shadowData)

    readonly cullLights = new ArrayBuffer(CULL_LIGHTS_BUFFER_SIZE)
    readonly cullLightsFloats = new Float32Array(this.cullLights)
    readonly cullLightsInts = new Uint32Array(this.cullLights)

    readonly directionalLights = new ArrayBuffer(
        MAX_DIRECTIONAL_LIGHTS * DIRECTIONAL_LIGHT_BYTESTRIDE
    )
    readonly directionalLightsFloats = new Float32Array(this.directionalLights)
    readonly directionalLightsInts = new Int32Array(this.directionalLights)

    readonly pointLights = new ArrayBuffer(
        MAX_POINT_LIGHTS * POINT_LIGHT_BYTESTRIDE
    )
    readonly pointLightsFloats = new Float32Array(this.pointLights)
    readonly pointLightsInts = new Int32Array(this.pointLights)

    readonly spotLights = new ArrayBuffer(
        MAX_SPOT_LIGHTS * SPOT_LIGHT_BYTESTRIDE
    )
    readonly spotLightsFloats = new Float32Array(this.spotLights)
    readonly spotLightsInts = new Int32Array(this.spotLights)

    readonly nodeMatrices = new ArrayBuffer(NODE_MATRICES_BUFFER_SIZE)
    readonly nodeMatricesFloats = new Float32Array(this.nodeMatrices)
}
