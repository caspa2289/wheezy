// Environment prefiltering for image-based lighting. Three compute entry points
// run once per skybox change (Renderer._prefilterEnvironment):
//
//   irradiance_main  — cosine-weighted convolution of the skybox into a small
//                      cube map (diffuse indirect light)
//   prefilter_main   — GGX importance-sampled convolution per mip level, where
//                      the mip encodes roughness (specular indirect light)
//   brdf_lut_main    — the split-sum BRDF integration LUT (scale/bias for F0)
//
// The sizes below mirror the IBL_* constants in Renderer/constants.ts — WGSL has
// no shared header, so both sides must be edited together.

alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

const PI = 3.14159265359;
const PREFILTER_BASE_SIZE = 128.0;
const PREFILTER_MIP_LEVELS = 5.0;
const IRRADIANCE_SAMPLES = 1024u;
const PREFILTER_SAMPLES = 256u;
const BRDF_SAMPLES = 512u;

@group(0) @binding(0)
var env_texture: texture_cube<f32>;

@group(0) @binding(1)
var env_sampler: sampler;

// irradiance / prefiltered output, bound as a 2d array (one layer per cube face)
// because textureStore cannot target a cube view; the prefilter binds a
// single-mip view so textureDimensions() reports that mip's size
@group(1) @binding(0)
var cube_out: texture_storage_2d_array<rgba8unorm, write>;

// rgba16float because rg16float is not a storage-capable format in WebGPU
@group(1) @binding(1)
var lut_out: texture_storage_2d<rgba16float, write>;

// radical inverse Van der Corput — the second Hammersley coordinate
fn radical_inverse_vdc(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}

fn hammersley(i: u32, n: u32) -> float2 {
    return float2(f32(i) / f32(n), radical_inverse_vdc(i));
}

// cube face + [0,1]² texel uv → world-space direction. Face order matches the
// WebGPU/OpenGL cube layout (+X −X +Y −Y +Z −Z), v increasing downward.
fn cubemap_direction(face: u32, uv: float2) -> float3 {
    let u = uv.x * 2.0 - 1.0;
    let v = uv.y * 2.0 - 1.0;
    switch (face) {
        case 0u: { return float3(1.0, -v, -u); }
        case 1u: { return float3(-1.0, -v, u); }
        case 2u: { return float3(u, 1.0, v); }
        case 3u: { return float3(u, -1.0, -v); }
        case 4u: { return float3(u, -v, 1.0); }
        default: { return float3(-u, -v, -1.0); }
    }
}

// orthonormal basis with n as its third column
fn tangent_basis(n: float3) -> mat3x3<f32> {
    let up = select(float3(1.0, 0.0, 0.0), float3(0.0, 1.0, 0.0), abs(n.z) < 0.999);
    let tangent = normalize(cross(up, n));
    let bitangent = cross(n, tangent);
    return mat3x3<f32>(tangent, bitangent, n);
}

fn cosine_sample_hemisphere(xi: float2) -> float3 {
    let phi = 2.0 * PI * xi.x;
    let cos_theta = sqrt(xi.y);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    return float3(cos(phi) * sin_theta, sin(phi) * sin_theta, cos_theta);
}

fn importance_sample_ggx(xi: float2, roughness: f32) -> float3 {
    let a = roughness * roughness;
    let phi = 2.0 * PI * xi.x;
    let cos_theta = sqrt((1.0 - xi.y) / max(1e-7, 1.0 + (a * a - 1.0) * xi.y));
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    return float3(cos(phi) * sin_theta, sin(phi) * sin_theta, cos_theta);
}

// Smith-GGX visibility with k = a²/2, the convention used for image-based lighting
fn geometry_ibl(n_dot_v: f32, n_dot_l: f32, roughness: f32) -> f32 {
    let a = roughness * roughness;
    let k = max(a * a * 0.5, 1e-4);
    let g_v = n_dot_v / (n_dot_v * (1.0 - k) + k);
    let g_l = n_dot_l / (n_dot_l * (1.0 - k) + k);
    return g_v * g_l;
}

@compute @workgroup_size(8, 8, 1)
fn irradiance_main(@builtin(global_invocation_id) gid: vec3u) {
    let dims = textureDimensions(cube_out);
    if (gid.x >= dims.x || gid.y >= dims.y || gid.z >= 6u) {
        return;
    }

    let uv = (float2(gid.xy) + float2(0.5)) / float2(dims);
    let n = cubemap_direction(gid.z, uv);
    let basis = tangent_basis(n);

    var sum = float3(0.0);
    for (var i = 0u; i < IRRADIANCE_SAMPLES; i++) {
        let xi = hammersley(i, IRRADIANCE_SAMPLES);
        let direction = basis * cosine_sample_hemisphere(xi);
        sum += textureSampleLevel(env_texture, env_sampler, direction, 0.0).rgb;
    }

    // cosine-weighted sampling has pdf = cosθ/π, so the cosθ of the irradiance
    // integral cancels and the estimator reduces to π · mean(L). The extra π is
    // dropped here because the lighting pass divides diffuse by π anyway — what
    // is stored is irradiance/π, which keeps the values inside rgba8unorm range.
    textureStore(
        cube_out,
        vec2i(gid.xy),
        i32(gid.z),
        float4(sum / f32(IRRADIANCE_SAMPLES), 1.0)
    );
}

@compute @workgroup_size(8, 8, 1)
fn prefilter_main(@builtin(global_invocation_id) gid: vec3u) {
    let dims = textureDimensions(cube_out);
    if (gid.x >= dims.x || gid.y >= dims.y || gid.z >= 6u) {
        return;
    }

    // the storage view is bound per mip, so its dimensions identify the level
    let mip = log2(PREFILTER_BASE_SIZE / f32(dims.x));
    let roughness = clamp(mip / (PREFILTER_MIP_LEVELS - 1.0), 0.0, 1.0);

    let uv = (float2(gid.xy) + float2(0.5)) / float2(dims);
    let n = cubemap_direction(gid.z, uv);
    let basis = tangent_basis(n);

    var color = float3(0.0);
    var total_weight = 0.0;
    for (var i = 0u; i < PREFILTER_SAMPLES; i++) {
        let xi = hammersley(i, PREFILTER_SAMPLES);
        let h = basis * importance_sample_ggx(xi, roughness);
        // split-sum approximation: the view direction is taken to be the normal
        let l = normalize(2.0 * dot(n, h) * h - n);
        let n_dot_l = max(dot(n, l), 0.0);
        if (n_dot_l > 0.0) {
            color += textureSampleLevel(env_texture, env_sampler, l, 0.0).rgb * n_dot_l;
            total_weight += n_dot_l;
        }
    }
    if (total_weight > 0.0) {
        color = color / total_weight;
    }

    textureStore(cube_out, vec2i(gid.xy), i32(gid.z), float4(color, 1.0));
}

@compute @workgroup_size(8, 8, 1)
fn brdf_lut_main(@builtin(global_invocation_id) gid: vec3u) {
    let dims = textureDimensions(lut_out);
    if (gid.x >= dims.x || gid.y >= dims.y) {
        return;
    }

    let uv = (float2(gid.xy) + float2(0.5)) / float2(dims);
    // x = NdotV, y = roughness — must match the lookup in lighting.wgsl
    let n_dot_v = max(uv.x, 1e-4);
    let roughness = uv.y;

    // the LUT is integrated in tangent space, so the normal is +Z and only the
    // .z components of the sampled vectors are needed
    let v = normalize(float3(sqrt(max(0.0, 1.0 - n_dot_v * n_dot_v)), 0.0, n_dot_v));

    var scale = 0.0;
    var bias = 0.0;
    for (var i = 0u; i < BRDF_SAMPLES; i++) {
        let xi = hammersley(i, BRDF_SAMPLES);
        let h = importance_sample_ggx(xi, roughness);
        let l = normalize(2.0 * dot(v, h) * h - v);
        let n_dot_l = max(l.z, 0.0);
        if (n_dot_l <= 0.0) {
            continue;
        }
        let n_dot_h = max(h.z, 0.0);
        let v_dot_h = max(dot(v, h), 0.0);
        let g = geometry_ibl(n_dot_v, n_dot_l, roughness);
        let g_vis = g * v_dot_h / max(n_dot_h * n_dot_v, 1e-7);
        let f_c = pow(1.0 - v_dot_h, 5.0);
        scale += (1.0 - f_c) * g_vis;
        bias += f_c * g_vis;
    }

    // textureStore always takes a vec4, whatever the storage format — the
    // unused channels are dropped for rg16float
    textureStore(
        lut_out,
        vec2i(gid.xy),
        float4(scale / f32(BRDF_SAMPLES), bias / f32(BRDF_SAMPLES), 0.0, 1.0)
    );
}
