// Tonemapping post pass: reads the linear HDR result of the lighting pass and
// writes display-referred sRGB into the swapchain. Debug channel views
// (output_type != OUT_DEFAULT) are passed through untouched, because they show
// raw G-buffer values that tonemapping would distort.

alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

// must stay in sync with RENDER_OUTPUT_SOURCES (types/core/Renderer/index.ts)
const OUT_DEFAULT = 0;

struct VertexOutput {
    @builtin(position) position: float4,
};

// layout must match the CPU view-params buffer; exposure sits at float offset 62
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
    exposure: f32,
};

struct DebugParams {
    output_type: u32,
}

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@group(1) @binding(0)
var lit_texture: texture_2d<f32>;

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

// ACES filmic approximation (Narkowicz fit); output is clamped to [0, 1]
fn aces_film(color: float3) -> float3 {
    let a = 2.51;
    let b = 0.03;
    let c = 2.43;
    let d = 0.59;
    let e = 0.14;
    return clamp(
        (color * (a * color + b)) / (color * (c * color + d) + e),
        float3(0.0),
        float3(1.0)
    );
}

// exact sRGB transfer function, not the pow(1/2.2) approximation
fn linear_to_srgb_channel(value: f32) -> f32 {
    if (value <= 0.0031308) {
        return 12.92 * value;
    }
    return 1.055 * pow(value, 1.0 / 2.4) - 0.055;
}

fn linear_to_srgb(color: float3) -> float3 {
    return float3(
        linear_to_srgb_channel(color.r),
        linear_to_srgb_channel(color.g),
        linear_to_srgb_channel(color.b)
    );
}

// Rec.709 luma of a display-referred color. Stored in the target's alpha so the
// FXAA pass reads it per tap instead of recomputing it.
fn luma(color: float3) -> f32 {
    return dot(color, float3(0.2126, 0.7152, 0.0722));
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    // 1:1 with the HDR target's pixels — no filtering needed
    let hdr = textureLoad(lit_texture, vec2i(in.position.xy), 0).rgb;

    if (debug_params.output_type != OUT_DEFAULT) {
        // debug views show raw G-buffer channels: not tonemapped, not antialiased
        return float4(hdr, 1.0);
    }

    let encoded = linear_to_srgb(aces_film(hdr * view_params.exposure));
    return float4(encoded, luma(encoded));
};
