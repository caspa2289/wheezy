alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
};

struct ViewParams {
    view_proj: mat4x4<f32>,
    camera_position: vec4f,
    light_view_proj: mat4x4<f32>,
    light_pos: vec4f,
};

struct NodeParams {
    transform: mat4x4<f32>,
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(1) @binding(0)
var<uniform> node_params: NodeParams;

@vertex
fn vertex_main(vert: VertexInput) -> @builtin(position) vec4f {
    return view_params.light_view_proj * node_params.transform * float4(vert.position, 1.0);
};
