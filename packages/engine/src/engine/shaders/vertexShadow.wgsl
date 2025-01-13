alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
};

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    light_projection_matrix: mat4x4<f32>,
    light_view_matrix: mat4x4<f32>,
    light_position: vec4f,
    ambient_light_color: vec4f,
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
    let light_view_projection_matrix = view_params.light_projection_matrix * view_params.light_view_matrix;

    return light_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);
};
