export const DEFAULT_SWAP_CHAIN_FORMAT: GPUTextureFormat = 'rgba8unorm'
// must stay sampleable as texture_depth_2d — the deferred lighting pass
// reconstructs world positions from it (depth24plus sampling is implementation-defined)
export const DEFAULT_DEPTH_FORMAT: GPUTextureFormat = 'depth32float'
export const DEFAULT_SHADOW_DEPTH_FORMAT: GPUTextureFormat = 'depth32float'
// linear HDR target of the lighting pass, tonemapped into the swapchain by the
// post pass. Shared by GBuffer (the texture) and the lighting pipeline (the
// attachment format) — a mismatch is a validation error, so keep one constant.
export const HDR_TARGET_FORMAT: GPUTextureFormat = 'rgba16float'
// --- image-based lighting (environment prefilter, one-off per skybox change) ---
// the WGSL side duplicates the sizes as module consts (no shared header), so
// ibl.wgsl and lighting.wgsl must be updated together with these
export const IBL_IRRADIANCE_SIZE = 32
export const IBL_PREFILTER_SIZE = 128
export const IBL_PREFILTER_MIP_LEVELS = 5
export const IBL_BRDF_LUT_SIZE = 256
export const IBL_IRRADIANCE_SAMPLES = 1024
export const IBL_PREFILTER_SAMPLES = 256
export const IBL_BRDF_SAMPLES = 512
export const VIEW_PARAMS_BUFFER_SIZE: number =
    16 * 4 + 16 * 4 + 4 * 4 + 4 * 4 + 16 * 4 + 16 * 4 + 16 + 16 * 3 + 4 + 4
// view-params float slots (see ViewParams in lighting.wgsl): 62 carries the
// exposure, 63–65 the directional/point/spot light counts that bound the
// shader's loops over the fixed-capacity light buffers
export const VIEW_PARAMS_EXPOSURE_SLOT = 62
export const VIEW_PARAMS_DIRECTIONAL_COUNT_SLOT = 63
export const VIEW_PARAMS_POINT_COUNT_SLOT = 64
export const VIEW_PARAMS_SPOT_COUNT_SLOT = 65
// skybox uniforms: model, projection and view matrices + camera position
export const SKYBOX_UNIFORM_BUFFER_SIZE = 4 * 16 * 3 + 4 * 4
// fixed capacities of the persistent light storage buffers — the per-frame
// counts travel in the view params instead of buffer sizes, so the buffers
// and the lights bind group stay static; point + spot sum to MAX_CULL_LIGHTS
export const MAX_DIRECTIONAL_LIGHTS = 16
export const MAX_POINT_LIGHTS = 128
export const MAX_SPOT_LIGHTS = 128
// node world matrices: one mat4 per scene node in a single storage buffer,
// written once per frame; each draw selects its slot through a dynamic-offset
// index uniform (the same mechanism as the shadow caster index)
export const MAX_SCENE_NODES = 4096
export const NODE_MATRIX_SIZE = 16 * 4
export const NODE_MATRICES_BUFFER_SIZE = MAX_SCENE_NODES * NODE_MATRIX_SIZE
// dynamic-offset stride for the per-draw node index
// (WebGPU min uniform buffer offset alignment)
export const NODE_INDEX_SLOT_SIZE = 256
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
// widest spot cone the shadow frustum can represent: mat4.perspective
// degenerates as fov approaches π, so _spotShadowVP clamps there. SpotLight's
// cutoff setter clamps to the same value — otherwise a wider cone stays lit
// outside the shadow map's NDC range and renders unshadowed.
export const SPOT_MAX_CONE_HALF_ANGLE = 1.45 // radians (~83°)
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

// --- mesh skinning & morph targets ---
// joint palettes of every skin in a scene share one storage buffer; each
// skin owns a contiguous run of mat4 slots (paletteOffset), and each draw
// selects its run through a dynamic-offset anim-draw slot (the node-matrix /
// shadow-caster idiom). Layouts must match testShader.wgsl / vertexShadow.wgsl.
export const MAX_SKIN_JOINTS = 2048
export const SKIN_JOINT_MATRIX_SIZE = 16 * 4
export const SKIN_PALETTE_BUFFER_SIZE = MAX_SKIN_JOINTS * SKIN_JOINT_MATRIX_SIZE
// one 256-byte dynamic-offset slot per skinned/morph mesh; the first 8 bytes
// hold { palette_base: u32, morph_base: u32 }
export const MAX_ANIM_DRAW_SLOTS = 256
export const ANIM_DRAW_SLOT_SIZE = 256
// morph target weights: one block of MAX_MORPH_TARGETS floats (2 × vec4 in
// WGSL) per morph mesh in a shared storage buffer, written every frame
export const MAX_MORPH_TARGETS = 8
export const MAX_MORPH_MESHES = 256
export const MORPH_WEIGHT_FLOATS_PER_MESH = 8
export const MORPH_WEIGHTS_BUFFER_SIZE =
    MAX_MORPH_MESHES * MORPH_WEIGHT_FLOATS_PER_MESH * 4
