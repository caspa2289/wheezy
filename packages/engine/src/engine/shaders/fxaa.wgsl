// FXAA (3.11 "console" quality variant) — the last pass, LDR → swapchain.
//
// Reads the tonemapped LDR target produced by post.wgsl and takes luma from its
// alpha channel instead of recomputing it per tap. All taps use
// textureSampleLevel with an explicit level 0: the target has a single mip level,
// and the explicit form has no uniform-control-flow requirement (the same naga
// constraint that forces textureSampleCompareLevel in the shadow code).

alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

// must stay in sync with RENDER_OUTPUT_SOURCES (types/core/Renderer/index.ts)
const OUT_DEFAULT = 0;

const FXAA_REDUCE_MUL = 1.0 / 8.0;
const FXAA_REDUCE_MIN = 1.0 / 128.0;
const FXAA_SPAN_MAX = 8.0;
// below this luma contrast a pixel is treated as flat and left untouched —
// raise it to blur less (and smooth fewer faint edges), lower it to blur more
const FXAA_EDGE_THRESHOLD = 1.0 / 16.0;

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) uv: float2,
};

struct DebugParams {
    output_type: u32,
}

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@group(1) @binding(0)
var color_texture: texture_2d<f32>;

@group(1) @binding(1)
var color_sampler: sampler;

@vertex
fn vertex_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    // fullscreen triangle, no vertex buffer
    let positions = array<float2, 3>(
        float2(-1.0, -1.0),
        float2(3.0, -1.0),
        float2(-1.0, 3.0)
    );

    let position = positions[vertex_index];
    var out: VertexOutput;
    out.position = float4(position, 0.0, 1.0);
    // clip space (y up, [-1, 1]) → texture uv (y down, [0, 1])
    out.uv = float2(position.x * 0.5 + 0.5, 0.5 - position.y * 0.5);
    return out;
}

fn sample_ldr(uv: float2) -> float4 {
    return textureSampleLevel(color_texture, color_sampler, uv, 0.0);
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let center = sample_ldr(in.uv);

    if (debug_params.output_type != OUT_DEFAULT) {
        // debug views must stay pixel-exact — never blur them
        return float4(center.rgb, 1.0);
    }

    let texel = 1.0 / float2(textureDimensions(color_texture, 0));

    // luma comes from the alpha channel (see post.wgsl)
    let luma_m = center.a;
    let luma_nw = sample_ldr(in.uv + float2(-1.0, -1.0) * texel).a;
    let luma_ne = sample_ldr(in.uv + float2(1.0, -1.0) * texel).a;
    let luma_sw = sample_ldr(in.uv + float2(-1.0, 1.0) * texel).a;
    let luma_se = sample_ldr(in.uv + float2(1.0, 1.0) * texel).a;

    let luma_min = min(luma_m, min(min(luma_nw, luma_ne), min(luma_sw, luma_se)));
    let luma_max = max(luma_m, max(max(luma_nw, luma_ne), max(luma_sw, luma_se)));

    // flat region: keep the sample sharp instead of blurring detail for nothing
    if (luma_max - luma_min < max(FXAA_EDGE_THRESHOLD, luma_max * FXAA_EDGE_THRESHOLD)) {
        return float4(center.rgb, 1.0);
    }

    // edge direction, perpendicular to the local luma gradient
    var dir = float2(
        -((luma_nw + luma_ne) - (luma_sw + luma_se)),
        ((luma_nw + luma_sw) - (luma_ne + luma_se))
    );

    let dir_reduce = max(
        (luma_nw + luma_ne + luma_sw + luma_se) * 0.25 * FXAA_REDUCE_MUL,
        FXAA_REDUCE_MIN
    );
    let rcp_dir_min = 1.0 / (min(abs(dir.x), abs(dir.y)) + dir_reduce);
    dir = clamp(dir * rcp_dir_min, float2(-FXAA_SPAN_MAX), float2(FXAA_SPAN_MAX)) * texel;

    // two taps along the edge, then a wider pair to blend across it
    let rgb_a = 0.5 * (
        sample_ldr(in.uv + dir * (1.0 / 3.0 - 0.5)).rgb +
            sample_ldr(in.uv + dir * (2.0 / 3.0 - 0.5)).rgb
    );
    let rgb_b = rgb_a * 0.5 + 0.25 * (
        sample_ldr(in.uv + dir * -0.5).rgb + sample_ldr(in.uv + dir * 0.5).rgb
    );

    // if the wider blend drifted off the feature, keep the narrower one
    let luma_b = dot(rgb_b, float3(0.2126, 0.7152, 0.0722));
    if (luma_b < luma_min || luma_b > luma_max) {
        return float4(rgb_a, 1.0);
    }
    return float4(rgb_b, 1.0);
};
