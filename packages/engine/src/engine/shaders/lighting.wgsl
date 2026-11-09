alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

// must stay in sync with RENDER_OUTPUT_SOURCES (types/core/Renderer/index.ts)
const OUT_DEFAULT = 0;
const OUT_ALBEDO = 1;
const OUT_NORMAL = 2;
const OUT_METALLIC = 3;
const OUT_ROUGHNESS = 4;
const OUT_OCCLUSION = 5;
const OUT_EMISSION = 6;
const OUT_DEPTH = 7;

// must match SHADOW_ATLAS_SIZE in Renderer/constants.ts
const ATLAS_SIZE = 4096;
const ATLAS_TEXEL = 1.0 / f32(ATLAS_SIZE);
// constant reference-depth bias against shadow acne (WebGPU comparison samplers
// have no bias field; tune: acne → raise, peter-panning → lower).
// in world units this is bias × shadow depth range
const SHADOW_DEPTH_BIAS = 0.0008;

// clustered light culling grid — must match lightCulling.wgsl / constants.ts
const CLUSTER_TILE = 16u;
const CLUSTER_SLICES = 16u;
const CLUSTER_MAX_LIGHTS = 64u;

struct VertexOutput {
    @builtin(position) position: float4,
};

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    ambient_light_color: vec4f,
    inverse_view_projection: mat4x4<f32>,
    camera_near: f32,
    camera_far: f32,
    cluster_tiles_x: u32,
    cluster_tiles_y: u32,
    viewport_width: u32,
    viewport_height: u32,
};

struct DebugParams {
    output_type: u32,
}

// light structs must match the CPU float layouts in Renderer/constants.ts;
// shadow_caster is the (base) index into shadow_data.casters, or -1 when the
// light casts no shadow this frame (it occupies the pad slot of each layout —
// spot's sits between color and position)
struct DirectionalLightData {
  color: vec3f,
  intensity: f32,
  direction: vec3f,
  shadow_caster: i32,
};

struct PointLightData {
    color: vec3f,
    intensity: f32,
    position: vec3f,
    atten_constant: f32,
    atten_linear: f32,
    atten_exponential: f32,
    shadow_caster: i32,
    range: f32, // culling-derived influence radius (0 = no fade)
}

struct SpotLightData {
    color: vec3f,
    shadow_caster: i32,
    position: vec3f,
    range: f32, // culling-derived influence radius (0 = no fade)
    direction: vec3f,
    cutoff: f32,
    intensity: f32,
    atten_constant: f32,
    atten_linear: f32,
    atten_exponential: f32
}

struct DirectionalLightsBuffer {
  lights: array<DirectionalLightData>,
}

struct PointLightsBuffer {
    lights: array<PointLightData>
}

struct SpotLightsBuffer {
    lights: array<SpotLightData>
}

// G-buffer inputs, read 1:1 per pixel via textureLoad — binding order
// must match the renderer's G-buffer bind group. Occlusion is packed into
// the metallicRoughness target's .r channel (see testShader.wgsl).
@group(1) @binding(0)
var albedo_texture: texture_2d<f32>;

@group(1) @binding(1)
var normal_texture: texture_2d<f32>;

@group(1) @binding(2)
var metallic_roughness_texture: texture_2d<f32>;

@group(1) @binding(3)
var emission_texture: texture_2d<f32>;

@group(1) @binding(4)
var depth_texture: texture_depth_2d;

@group(2) @binding(0)
var<storage, read> directionalLightsBuffer: DirectionalLightsBuffer;

@group(2) @binding(1)
var<storage, read> pointLightsBuffer: PointLightsBuffer;

@group(2) @binding(2)
var<storage, read> spotLightsBuffer: SpotLightsBuffer;

// must match the CPU layout in Renderer/constants.ts (SHADOW_* constants)
struct ShadowCasterData {
    light_view_projection: mat4x4<f32>,
    tile_rect: vec4f, // atlas UV rect: x, y, w, h
    enabled: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

struct ShadowDataBuffer {
    caster_count: u32,
    _padh0: u32,
    _padh1: u32,
    _padh2: u32,
    casters: array<ShadowCasterData>,
};

@group(3) @binding(0)
var shadow_map: texture_depth_2d;

@group(3) @binding(1)
var shadow_sampler: sampler_comparison;

@group(3) @binding(2)
var<storage, read> shadow_data: ShadowDataBuffer;

// cluster light lists built by lightCulling.wgsl — bindings 3/4 of the shadow
// group (WebGPU's default maxBindGroups is 4, so no separate group 4)
@group(3) @binding(3)
var<storage, read> cluster_counts: array<u32>;

@group(3) @binding(4)
var<storage, read> cluster_indices: array<u32>;

// image-based lighting, convolved from the skybox by ibl.wgsl — bindings 5–8 of
// the same group, because WebGPU's default maxBindGroups is 4
@group(3) @binding(5)
var irradiance_texture: texture_cube<f32>;

@group(3) @binding(6)
var prefiltered_texture: texture_cube<f32>;

@group(3) @binding(7)
var brdf_lut_texture: texture_2d<f32>;

@group(3) @binding(8)
var ibl_sampler: sampler;

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@vertex
fn vertex_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    // fullscreen triangle, no vertex buffer
    let positions = array<float2, 3>(
        float2(-1.0, -1.0),
        float2(3.0, -1.0),
        float2(-1.0, 3.0)
    );

    var out: VertexOutput;
    out.position = float4(positions[vertex_index], 0.0, 1.0);
    return out;
}

const PI = 3.14159265359;

// --- Cook-Torrance microfacet BRDF, metallic-roughness workflow ---

// Trowbridge-Reitz / GGX normal distribution function
fn distribution_ggx(n_dot_h: f32, roughness: f32) -> f32 {
    let a = roughness * roughness;
    let a2 = a * a;
    let d = n_dot_h * n_dot_h * (a2 - 1.0) + 1.0;
    return a2 / max(PI * d * d, 1e-7);
}

// Schlick's approximation of the Fresnel equation
fn fresnel_schlick(cos_theta: f32, f0: float3) -> float3 {
    let f = pow(clamp(1.0 - cos_theta, 0.0, 1.0), 5.0);
    return f0 + (float3(1.0) - f0) * f;
}

fn geometry_schlick_ggx(n_dot_x: f32, k: f32) -> f32 {
    return n_dot_x / (n_dot_x * (1.0 - k) + k);
}

// Smith's method with the Schlick-GGX approximation; k = a/2 for direct lighting
fn geometry_smith(n_dot_v: f32, n_dot_l: f32, roughness: f32) -> f32 {
    let k = max(roughness * roughness * 0.5, 1e-4);
    return geometry_schlick_ggx(n_dot_v, k) * geometry_schlick_ggx(n_dot_l, k);
}

// Outgoing radiance from one light. `to_light` points from the surface toward the
// light; `radiance` is the light's color × intensity after attenuation and any
// cone/fade windows, without the NdotL term (this function applies it).
fn shade_pbr(
    to_light: float3,
    radiance: float3,
    normal: float3,
    to_eye: float3,
    albedo: float3,
    metallic: f32,
    roughness: f32
) -> float3 {
    let n_dot_l = dot(normal, to_light);
    if (n_dot_l <= 0.0) {
        return float3(0.0);
    }
    let n_dot_v = max(dot(normal, to_eye), 1e-4);
    let half_vector = normalize(to_light + to_eye);
    let n_dot_h = max(dot(normal, half_vector), 0.0);
    let h_dot_v = max(dot(half_vector, to_eye), 0.0);

    // dielectrics reflect ~4% specularly and take their color from diffuse;
    // metals have no diffuse and tint the specular lobe with the albedo
    let f0 = mix(float3(0.04), albedo, metallic);
    let d = distribution_ggx(n_dot_h, roughness);
    let g = geometry_smith(n_dot_v, n_dot_l, roughness);
    let f = fresnel_schlick(h_dot_v, f0);

    let specular = d * g * f / max(4.0 * n_dot_v * n_dot_l, 1e-4);
    // whatever the specular lobe reflects cannot also be diffusely reflected
    let kd = (float3(1.0) - f) * (1.0 - metallic);
    let diffuse = kd * albedo / PI;

    return (diffuse + specular) * radiance * n_dot_l;
}

// --- image-based lighting (split sum) ---

// must match IBL_PREFILTER_MIP_LEVELS in Renderer/constants.ts
const IBL_PREFILTER_MIP_LEVELS = 5.0;

// Fresnel with a roughness-dependent cap: a rough surface does not reflect the
// full F0 at grazing angles the way a mirror does
fn fresnel_schlick_roughness(cos_theta: f32, f0: float3, roughness: f32) -> float3 {
    let f = pow(clamp(1.0 - cos_theta, 0.0, 1.0), 5.0);
    return f0 + (max(float3(1.0 - roughness), f0) - f0) * f;
}

// Indirect light from the skybox: irradiance for the diffuse lobe, the
// roughness-indexed prefiltered mip plus the BRDF integration LUT for the
// specular one. `strength` is the environment tint × intensity.
fn calculate_ibl(
    normal: float3,
    to_eye: float3,
    albedo: float3,
    metallic: f32,
    roughness: f32,
    strength: float3
) -> float3 {
    let n_dot_v = max(dot(normal, to_eye), 1e-4);
    let f0 = mix(float3(0.04), albedo, metallic);
    let f = fresnel_schlick_roughness(n_dot_v, f0, roughness);
    let kd = (float3(1.0) - f) * (1.0 - metallic);

    // the irradiance map stores irradiance/π (see ibl.wgsl), which is exactly
    // the factor the diffuse BRDF would otherwise divide by
    let irradiance = textureSampleLevel(irradiance_texture, ibl_sampler, normal, 0.0).rgb;
    let diffuse = kd * irradiance * albedo;

    let reflected = reflect(-to_eye, normal);
    let mip = roughness * (IBL_PREFILTER_MIP_LEVELS - 1.0);
    let prefiltered = textureSampleLevel(prefiltered_texture, ibl_sampler, reflected, mip).rgb;
    // LUT x = NdotV, y = roughness — must match ibl.wgsl's brdf_lut_main.
    // SampleLevel, not Sample: the LUT has one mip level, and the explicit
    // level keeps this outside naga's uniform-control-flow requirement (the
    // caller is inside a switch on the debug output source).
    let env_brdf = textureSampleLevel(brdf_lut_texture, ibl_sampler, float2(n_dot_v, roughness), 0.0).rg;
    let specular = prefiltered * (f * env_brdf.x + env_brdf.y);

    return (diffuse + specular) * strength;
}

fn calculateDirectionalLight(
    light: DirectionalLightData,
    normal: float3,
    world_position: float3,
    albedo: float3,
    metallic: f32,
    roughness: f32
) -> float3 {
    let to_eye = normalize(view_params.camera_position.xyz - world_position);
    // light.direction is the way the light travels, so negate it for "to light"
    return shade_pbr(
        -light.direction,
        light.color * light.intensity,
        normal,
        to_eye,
        albedo,
        metallic,
        roughness
    );
}

fn calculatePointLight(
    light: PointLightData,
    normal: float3,
    world_position: float3,
    albedo: float3,
    metallic: f32,
    roughness: f32
) -> float3 {
    let to_pixel = world_position - light.position;
    let distance = length(to_pixel);
    // guarded: at distance 0 the direction is degenerate
    let to_light = -to_pixel / max(distance, 1e-6);

    let attenuation = max(0.00000001, light.atten_constant +
        light.atten_linear * distance +
        light.atten_exponential * distance * distance);
    var radiance = light.color * light.intensity / attenuation;

    // smooth fade to zero at the culling-derived range — the cluster lists
    // drop the light beyond it, and without this window that cutoff would be
    // a hard visible edge
    if (light.range > 0.0) {
        radiance *= 1.0 - smoothstep(0.75 * light.range, light.range, distance);
    }

    let to_eye = normalize(view_params.camera_position.xyz - world_position);
    return shade_pbr(to_light, radiance, normal, to_eye, albedo, metallic, roughness);
}

fn calculateSpotLight(
    light: SpotLightData,
    normal: float3,
    world_position: float3,
    albedo: float3,
    metallic: f32,
    roughness: f32
) -> float3 {
    let to_pixel = world_position - light.position;
    let distance = length(to_pixel);
    let light_to_pixel = to_pixel / max(distance, 1e-6);
    let spot_factor = dot(light_to_pixel, light.direction);

    if (spot_factor <= light.cutoff) {
        return float3(0.0);
    }

    // linear ramp from the cone edge (cutoff) to the axis; the cutoff setter
    // clamps the cone so 1 - cutoff cannot degenerate
    let cone = 1.0 - (1.0 - spot_factor) / (1.0 - light.cutoff);

    let attenuation = max(0.00000001, light.atten_constant +
        light.atten_linear * distance +
        light.atten_exponential * distance * distance);
    var radiance = light.color * light.intensity * cone / attenuation;

    if (light.range > 0.0) {
        radiance *= 1.0 - smoothstep(0.75 * light.range, light.range, distance);
    }

    let to_eye = normalize(view_params.camera_position.xyz - world_position);
    return shade_pbr(-light_to_pixel, radiance, normal, to_eye, albedo, metallic, roughness);
}

// 3×3 PCF tent over one atlas tile; returns visibility in [0, 1] (1 = fully
// lit). ...CompareLevel is required: plain textureSampleCompare must be called
// from uniform control flow, which the early returns below would violate.
fn calculateShadowFactor(caster_index: i32, world_position: float3) -> f32 {
    if (caster_index < 0 || caster_index >= i32(shadow_data.caster_count)) {
        return 1.0;
    }
    let caster = shadow_data.casters[caster_index];
    if (caster.enabled == 0u) {
        return 1.0;
    }

    let light_clip = caster.light_view_projection * float4(world_position, 1.0);
    let ndc = light_clip.xyz / light_clip.w;

    // outside the light frustum → not shadowed
    if (ndc.x < -1.0 || ndc.x > 1.0 || ndc.y < -1.0 || ndc.y > 1.0 || ndc.z < 0.0 || ndc.z > 1.0) {
        return 1.0;
    }

    var uv_in_tile = ndc.xy * 0.5 + 0.5;
    // framebuffer/texture origin is top-left in WebGPU, NDC y is up
    uv_in_tile.y = 1.0 - uv_in_tile.y;

    var uv = caster.tile_rect.xy + uv_in_tile * caster.tile_rect.zw;
    // keep all PCF taps inside this tile (no bleeding from atlas neighbors)
    let inset = ATLAS_TEXEL * 1.5;
    uv = clamp(uv, caster.tile_rect.xy + vec2f(inset), caster.tile_rect.xy + caster.tile_rect.zw - vec2f(inset));

    var factor = 0.0;
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            factor += textureSampleCompareLevel(
                shadow_map,
                shadow_sampler,
                uv + float2(f32(x), f32(y)) * ATLAS_TEXEL,
                ndc.z - SHADOW_DEPTH_BIAS
            );
        }
    }
    return factor / 9.0;
}

// point-light cube face selection — face order +X -X +Y -Y +Z -Z must match
// the CPU allocator (Renderer._allocateShadowCasters)
fn pointShadowFactor(caster_base: i32, world_position: float3, light_position: float3) -> f32 {
    let v = world_position - light_position;
    let av = abs(v);
    var face: i32;
    if (av.x >= av.y && av.x >= av.z) {
        face = select(1, 0, v.x > 0.0);
    } else if (av.y >= av.z) {
        face = select(3, 2, v.y > 0.0);
    } else {
        face = select(5, 4, v.z > 0.0);
    }
    return calculateShadowFactor(caster_base + face, world_position);
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let coords = vec2i(in.position.xy);

    let depth = textureLoad(depth_texture, coords, 0);
    let albedo = textureLoad(albedo_texture, coords, 0);
    let normal = textureLoad(normal_texture, coords, 0);
    let metallic_roughness = textureLoad(metallic_roughness_texture, coords, 0);
    let emission = textureLoad(emission_texture, coords, 0);

    switch(debug_params.output_type) {
        case(OUT_ALBEDO): {
            return albedo;
        }
        case(OUT_NORMAL): {
            return float4(normal.xyz, 1.0);
        }
        case(OUT_METALLIC): {
            return float4(metallic_roughness.b);
        }
        case(OUT_ROUGHNESS): {
            return float4(metallic_roughness.g);
        }
        case(OUT_OCCLUSION): {
            return float4(metallic_roughness.r);
        }
        case(OUT_EMISSION): {
            return emission;
        }
        case(OUT_DEPTH): {
            return float4(depth);
        }
        default: {
            // reconstruct world position from depth (WebGPU NDC: x/y in [-1,1], y up, z in [0,1])
            let dims = float2(textureDimensions(albedo_texture, 0));
            let ndc = float3(
                (in.position.x / dims.x) * 2.0 - 1.0,
                1.0 - (in.position.y / dims.y) * 2.0,
                depth
            );
            let world_homogeneous = view_params.inverse_view_projection * float4(ndc, 1.0);
            let world_position = world_homogeneous.xyz / world_homogeneous.w;

            let fragment_normal = normalize(normal.xyz);
            // packed material target: occlusion in .r, roughness in .g, metallic in .b
            let metallic = metallic_roughness.b;
            let roughness = metallic_roughness.g;
            let occlusion = metallic_roughness.r;

            // outgoing radiance, accumulated per light
            var lo = float3(0.0);

            // directional lights are global — always looped in full
            for (var i = 0u; i < arrayLength(&directionalLightsBuffer.lights); i++) {
                var directional = calculateDirectionalLight(directionalLightsBuffer.lights[i], fragment_normal, world_position, albedo.rgb, metallic, roughness);
                if (directionalLightsBuffer.lights[i].shadow_caster >= 0) {
                    directional *= calculateShadowFactor(directionalLightsBuffer.lights[i].shadow_caster, world_position);
                }
                lo += directional;
            }

            // point + spot lights come from the froxel cluster lists
            let tile_x = u32(in.position.x) / CLUSTER_TILE;
            let tile_y = u32(in.position.y) / CLUSTER_TILE;
            let view_position = view_params.camera_view_matrix * float4(world_position, 1.0);
            let view_depth = max(-view_position.z, view_params.camera_near);
            let near = view_params.camera_near;
            let slice_ratio = log2(view_depth / near) / log2(view_params.camera_far / near);
            let slice = clamp(u32(floor(slice_ratio * f32(CLUSTER_SLICES))), 0u, CLUSTER_SLICES - 1u);
            let cluster = (tile_x + tile_y * view_params.cluster_tiles_x) * CLUSTER_SLICES + slice;

            let cluster_light_count = min(cluster_counts[cluster], CLUSTER_MAX_LIGHTS);
            for (var j = 0u; j < cluster_light_count; j++) {
                let packed = cluster_indices[cluster * CLUSTER_MAX_LIGHTS + j];
                let light_type = packed >> 16u;
                let light_index = packed & 0xFFFFu;

                if (light_type == 0u) {
                    let light = pointLightsBuffer.lights[light_index];
                    var color = calculatePointLight(light, fragment_normal, world_position, albedo.rgb, metallic, roughness);
                    if (light.shadow_caster >= 0) {
                        color *= pointShadowFactor(light.shadow_caster, world_position, light.position);
                    }
                    lo += color;
                } else {
                    let light = spotLightsBuffer.lights[light_index];
                    var color = calculateSpotLight(light, fragment_normal, world_position, albedo.rgb, metallic, roughness);
                    if (light.shadow_caster >= 0) {
                        color *= calculateShadowFactor(light.shadow_caster, world_position);
                    }
                    lo += color;
                }
            }

            // indirect light from the skybox — `ambient_light_color.rgb` is the
            // environment tint and `.w` its intensity. This is what fills
            // shadows, physically, so no artificial visibility floor is needed.
            let to_eye = normalize(view_params.camera_position.xyz - world_position);
            let ibl = calculate_ibl(
                fragment_normal,
                to_eye,
                albedo.rgb,
                metallic,
                roughness,
                view_params.ambient_light_color.xyz * view_params.ambient_light_color.w
            ) * occlusion;

            // linear HDR output — the post pass applies exposure, tonemapping
            // and the sRGB transfer function
            return float4(lo + ibl + emission.rgb, 1.0);
        }
    }
};
