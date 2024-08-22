alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
    @location(1) texcoords: float2,
    @location(2) object_normal: float3
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) world_pos: float3,
    @location(1) texcoords: float2,
    @location(2) object_normal: float3,
    @location(3) camera_position: float3
};

struct ViewParams {
    view_proj: mat4x4<f32>,
    camera_position: vec4f
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

@group(2) @binding(5)
var tangent_normal_sampler: sampler;

@group(2) @binding(6)
var tangent_normal_texture: texture_2d<f32>;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.position = view_params.view_proj * node_params.transform * float4(vert.position, 1.0);
    out.world_pos = vert.position.xyz;
    out.texcoords = vert.texcoords;
    out.object_normal = vert.object_normal;
    out.camera_position = view_params.camera_position.xyz;

    return out;
};

fn linear_to_srgb(x: f32) -> f32 {
    if (x <= 0.0031308) {
        return 12.92 * x;
    }
    return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

fn decode_color(color: vec4f) -> vec4f {
    return vec4f(linear_to_srgb(color.x), linear_to_srgb(color.y), linear_to_srgb(color.z), 1.0);
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let color = decode_color(
        textureSample(base_color_texture, base_color_sampler, in.texcoords) 
            * material_params.base_color_factor
    );

    return color;
};
