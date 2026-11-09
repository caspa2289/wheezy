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

fn gamma_correct(color: float4) -> float4 {
    return float4(pow(color, float4(1.0/2.2)));
}

fn calculateDirectionalLight(
    light: DirectionalLightData,
    normal: float3,
    world_position: float3,
    metallic: f32
) -> float4 {
    let diffuse_factor = dot(normal, -light.direction);

    var diffuse_color = float4(0, 0, 0, 0);
    var specular_color = float4(0, 0, 0, 0);

    if (diffuse_factor > 0.0) {

        diffuse_color = float4(light.color * light.intensity * diffuse_factor, 1.0);
        let vertex_to_eye = normalize(view_params.camera_position.xyz - world_position);
        let light_reflect = normalize(reflect(light.direction, normal));
        var specular_factor = dot(vertex_to_eye, light_reflect);

        if (specular_factor > 0.0) {
            //FIXME: calculate specular power and intensity somehow
            //this is not it but looks fine from afar
            let specular_power = metallic * 255;
            let specular_intensity = metallic;
            specular_factor = pow(specular_factor, specular_power);
            specular_color = float4(light.color * specular_intensity * specular_factor, 1.0f);
        }
    }

    return (diffuse_color + specular_color);
}

fn calculatePointLight(
    light: PointLightData,
    normal: float3,
    world_position: float3,
    metallic: f32
) -> float4 {
    let light_direction = world_position - light.position;
    let distance = length(light_direction);

    var directionalLight: DirectionalLightData;

    directionalLight.color = light.color;
    directionalLight.intensity = light.intensity;
    directionalLight.direction = normalize(light_direction);
    directionalLight.shadow_caster = -1;


    let color = calculateDirectionalLight(directionalLight, normal, world_position, metallic);

    let attenuation = max(0.00000001, light.atten_constant +
        light.atten_linear * distance +
        light.atten_exponential * distance * distance);

    let lit = color / attenuation;
    // smooth fade to zero at the culling-derived range — the cluster lists
    // drop the light beyond it, and without this window that cutoff would be
    // a hard visible edge (contribution at range is still ~15% in sRGB)
    if (light.range <= 0.0) {
        return lit;
    }
    return lit * (1.0 - smoothstep(0.75 * light.range, light.range, distance));
}

fn calculateSpotLight(
    light: SpotLightData,
    normal: float3,
    world_position: float3,
    metallic: f32
) -> float4 {
    let light_to_pixel = normalize(world_position - light.position);
    let spot_factor = dot(light_to_pixel, light.direction);

    if (spot_factor > light.cutoff) {
        var point_light: PointLightData;

        point_light.color = light.color;
        point_light.intensity = light.intensity;
        point_light.position = light.position;
        point_light.atten_constant = light.atten_constant;
        point_light.atten_linear = light.atten_linear;
        point_light.atten_exponential = light.atten_exponential;
        point_light.shadow_caster = -1;
        point_light.range = light.range;

        let color = calculatePointLight(point_light, normal, world_position, metallic);

        return color * (1.0 - (1.0 - spot_factor) * 1.0 / (1.0 - light.cutoff));
    } else {
        return vec4(0, 0, 0, 0);
    }
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

            var albedo_color = albedo * metallic_roughness.r;

            var total_light = float4(0.0, 0.0, 0.0, 0.0);

            // directional lights are global — always looped in full
            for (var i = 0u; i < arrayLength(&directionalLightsBuffer.lights); i++) {
                var directional = calculateDirectionalLight(directionalLightsBuffer.lights[i], fragment_normal, world_position, metallic);
                if (directionalLightsBuffer.lights[i].shadow_caster >= 0) {
                    directional *= calculateShadowFactor(directionalLightsBuffer.lights[i].shadow_caster, world_position);
                }
                total_light += directional;
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
                    var color = calculatePointLight(light, fragment_normal, world_position, metallic);
                    if (light.shadow_caster >= 0) {
                        color *= pointShadowFactor(light.shadow_caster, world_position, light.position);
                    }
                    total_light += color;
                } else {
                    let light = spotLightsBuffer.lights[light_index];
                    var color = calculateSpotLight(light, fragment_normal, world_position, metallic);
                    if (light.shadow_caster >= 0) {
                        color *= calculateShadowFactor(light.shadow_caster, world_position);
                    }
                    total_light += color;
                }
            }

            if ((total_light[0] == 0.0) & (total_light[1] == 0.0) & (total_light[2] == 0.0)) {
                total_light = float4(view_params.ambient_light_color.xyz * view_params.ambient_light_color.w, 0.0f);
            }

            return gamma_correct(
                (albedo_color * total_light) + emission
            );
        }
    }
};
