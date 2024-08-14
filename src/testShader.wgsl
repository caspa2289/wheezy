alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
    @location(1) texcoords: float2,
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) world_pos: float3,
    @location(1) texcoords: float2,
};

struct ViewParams {
    view_proj: mat4x4<f32>,
};

struct NodeParams {
    transform: mat4x4<f32>,
};

struct MaterialParams {
    base_color_factor: float4,
    metallic_factor: f32,
    roughness_factor: f32,
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(1) @binding(0)
var<uniform> node_params: NodeParams;

@group(2) @binding(0)
var<uniform> material_params: MaterialParams;

@group(2) @binding(1)
var base_color_sampler: sampler;

@group(2) @binding(2)
var base_color_texture: texture_2d<f32>;

@group(2) @binding(3)
var metallic_roughness_sampler: sampler;

@group(2) @binding(4)
var metallic_roughness_texture: texture_2d<f32>;

fn linear_to_srgb(x: f32) -> f32 {
    if (x <= 0.0031308) {
        return 12.92 * x;
    }
    return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.position = view_params.view_proj * node_params.transform * float4(vert.position, 1.0);
    out.world_pos = vert.position.xyz;
    out.texcoords = vert.texcoords;

    return out;
};

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    var color = textureSample(base_color_texture, base_color_sampler, in.texcoords) * material_params.base_color_factor;

    color.x = linear_to_srgb(color.x);
    color.y = linear_to_srgb(color.y);
    color.z = linear_to_srgb(color.z);
    color.w = 1.0;

    // Hardcoded lighting
    const lightDir = vec3f(9, 0, 0);
    const lightColor = vec3f(1);
    const ambientColor = vec3f(0.2);

    //FIXME: upload normals and that would probably really help with lighting and metalness)
    let dx = dpdx(in.world_pos);
    let dy = dpdy(in.world_pos);
    let normal = normalize(cross(dx, dy));

    let N = normalize(normal);
    let L = normalize(lightDir);
    let NDotL = max(dot(N, L), 0.0);
    let surfaceColor = (color.rgb * ambientColor) + (color.rgb * NDotL);

    return vec4f(surfaceColor, color.a);
};
