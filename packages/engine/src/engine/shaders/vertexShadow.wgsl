alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) world_position: float3,
    // @location(1) texcoords: float2,
    // @location(2) vertex_normal: float3,
    // @location(3) vertex_tangent: float3,
    // @location(4) camera_position: float3,
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

    out.position = vec4(vert.position, 1.0);
    out.world_position = (node_params.transform * float4(vert.position, 1.0)).xyz;
    // out.texcoords = vert.texcoords;
    // out.vertex_normal = normalize(node_params.transform * float4(vert.vertex_normal, 0.0)).xyz;
    // out.vertex_tangent = normalize(node_params.transform * float4(vert.vertex_tangent, 0.0)).xyz;
    // out.camera_position = view_params.camera_position.xyz;

    return out;
};

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {

    //TODO: figure this shit out
    // for (var i = 0u; i < arrayLength(&spotLightsBuffer.lights); i++) {
    //     let light = spotLightsBuffer.lights[i];
    //     let light_view_projection_matrix = light.light_projection_matrix * light.light_view_matrix;

    //     let position = light_view_projection_matrix * node_params.transform * in.position;
    //     // vec4 camera_space_position = glModelViewMatrix * gl_Vertex;
    //     let distToCamera = -position.z;
    //     // gl_Position = gl_ProjectionMatrix * cs_position;
    //     textureStore(spotLightTextures, vec2u(u32(in.position.x), u32(in.position.y)), i, vec4f(distToCamera));
    //     // total_light += calculateDirectionalLight(spotLightsBuffer.lights[i], fragment_normal, in, metallic);
    // }
    
    textureStore(spotLightTextures, vec2u(0, 0), 0, vec4f(1));

    return in.position;
} 
