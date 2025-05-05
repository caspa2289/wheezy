alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
};

struct VertexOutput {
    @builtin(position) position: float4,
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

struct SpotLightData {
    color: vec3f,
    intensity: f32,
    position: vec3f,
    atten_constant: f32,
    atten_linear: f32,
    atten_exponential: f32,
    light_projection_matrix: mat4x4<f32>,
    light_view_matrix: mat4x4<f32>,
};

struct SpotLightsBuffer {
    lights: array<SpotLightData>
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(1) @binding(0)
var<uniform> node_params: NodeParams;

@group(2) @binding(2) 
var<storage, read> spotLightsBuffer: SpotLightsBuffer;

@group(2) @binding(3)
var spotLightTextures: texture_storage_2d_array<r32float, read_write>;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {

    var out: VertexOutput;
    out.position = vec4f(vert.position, 0.0);

    return out;
};

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    // for (var i = 0u; i < arrayLength(&spotLightsBuffer.lights); i++) {
    //     let light_view_projection_matrix = 
    //         spotLightsBuffer.lights[i].light_projection_matrix * spotLightsBuffer.lights[i].light_view_matrix;

    textureStore(spotLightTextures, vec2(0, 0), 0, vec4f(1, 1, 1, 1));
        // return light_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);
    // }

    return in.position;
} 
