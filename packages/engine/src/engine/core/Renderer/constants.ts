export const DEFAULT_SWAP_CHAIN_FORMAT: GPUTextureFormat = 'rgba8unorm'
// must stay sampleable as texture_depth_2d — the deferred lighting pass
// reconstructs world positions from it (depth24plus sampling is implementation-defined)
export const DEFAULT_DEPTH_FORMAT: GPUTextureFormat = 'depth32float'
export const DEFAULT_SHADOW_DEPTH_FORMAT: GPUTextureFormat = 'depth32float'
export const VIEW_PARAMS_BUFFER_SIZE: number =
    16 * 4 + 16 * 4 + 4 * 4 + 4 * 4 + 16 * 4 + 16 * 4 + 16 + 16 * 3 + 4 + 4
export const DIRECTIONAL_LIGHT_ELEMENT_COUNT = 8 // 7 floats and 1 pad
export const POINT_LIGHT_ELEMENT_COUNT = 12 // 10 floats and 2 pads
export const SPOT_LIGHT_ELEMENT_COUNT = 16 // 14 real floats and 2 pads
export const DIRECTIONAL_LIGHT_BYTESTRIDE =
    DIRECTIONAL_LIGHT_ELEMENT_COUNT * Float32Array.BYTES_PER_ELEMENT
export const POINT_LIGHT_BYTESTRIDE =
    POINT_LIGHT_ELEMENT_COUNT * Float32Array.BYTES_PER_ELEMENT
export const SPOT_LIGHT_BYTESTRIDE =
    SPOT_LIGHT_ELEMENT_COUNT * Float32Array.BYTES_PER_ELEMENT
// shadow atlas: one depth32float texture, per-light square tiles (Phase 2).
// layouts must match ShadowDataBuffer in vertexShadow.wgsl / lighting.wgsl:
// header: caster_count u32 + 3 pads (16 B), then per caster (96 B):
// light_view_projection mat4 (64) + tile_rect vec4 (16) + enabled u32 + 3 pads (16)
export const SHADOW_ATLAS_SIZE = 4096
export const SHADOW_TILE_DIRECTIONAL = 2048
export const SHADOW_TILE_SPOT = 1024
export const SHADOW_TILE_POINT_FACE = 512
export const SHADOW_DATA_HEADER_SIZE = 16
export const SHADOW_CASTER_STRIDE = 96
// caster entries, NOT lights: a point light occupies 6 consecutive entries
// (one per cube face, face order +X -X +Y -Y +Z -Z)
export const MAX_SHADOW_CASTERS = 64
export const SHADOW_DATA_BUFFER_SIZE =
    SHADOW_DATA_HEADER_SIZE + MAX_SHADOW_CASTERS * SHADOW_CASTER_STRIDE
// dynamic-offset uniform stride for the per-draw caster index
// (WebGPU min uniform buffer offset alignment)
export const SHADOW_INDEX_SLOT_SIZE = 256
// per-frame shadow texel budget (~the atlas area); lights beyond it render unshadowed
export const SHADOW_TEXEL_BUDGET = 16_000_000
// shadow acne bias lives in the shader (SHADOW_DEPTH_BIAS in lighting.wgsl) —
// WebGPU comparison samplers have no bias field
// how far the directional shadow frustum extends behind the camera sphere
// (world units) to catch casters outside the view
export const SHADOW_FRUSTUM_Z_EXTEND = 20
// max distance from the camera at which geometry still contributes to the
// directional shadow frustum fit — without it the fit spans the whole zFar
// (1000) and texels become world-scale. geometry beyond it receives no
// directional shadow.
export const SHADOW_DISTANCE = 20
// far plane of spot / point-face shadow frustums (clamped by light range)
export const SHADOW_LOCAL_FAR = 20
// a light's influence radius ends where intensity/attenuation drops below this
export const LIGHT_RANGE_THRESHOLD = 0.02

// clustered (froxel) light culling — Phase 3. grid values must match
// lightCulling.wgsl / lighting.wgsl
export const CLUSTER_TILE_SIZE = 16
export const CLUSTER_DEPTH_SLICES = 16
export const CLUSTER_MAX_LIGHTS = 64
// compact per-light culling data: header (16 B) + 48 B entries
export const MAX_CULL_LIGHTS = 256
export const CULL_LIGHTS_HEADER_SIZE = 16
export const CULL_LIGHT_STRIDE = 48
export const CULL_LIGHTS_BUFFER_SIZE =
    CULL_LIGHTS_HEADER_SIZE + MAX_CULL_LIGHTS * CULL_LIGHT_STRIDE
