alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
    @location(1) texcoords: float2,
    @location(2) vertex_normal: float3,
    @location(3) vertex_tangent: float3
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) world_position: float3,
    @location(1) texcoords: float2,
    @location(2) vertex_normal: float3,
    @location(3) vertex_tangent: float3,
};

struct FragmentOutput {
    @location(0) normal: float4,
    @location(1) albedo: float4,
    @location(2) emission: float4,
    @location(3) metallic_roughness: float4,
    @location(4) occlusion: float4,
}

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    light_projection_matrix: mat4x4<f32>,
    light_view_matrix: mat4x4<f32>,
    light_position: vec4f,
    ambient_light_color: vec4f
};

struct NodeParams {
    transform: mat4x4<f32>,
};

struct DebugParams {
    output_type: u32,
    normal_type: u32
}

struct MaterialParams {
    base_color_factor: float4,
    metallic_factor: f32,
    roughness_factor: f32,
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@group(1) @binding(0)
var<uniform> node_params: NodeParams;

@group(2) @binding(0)
var<uniform> material_params: MaterialParams;

@group(3) @binding(1)
var base_color_sampler: sampler;

@group(2) @binding(1)
var base_color_texture: texture_2d<f32>;

@group(3) @binding(2)
var metallic_roughness_sampler: sampler;

@group(2) @binding(2)
var metallic_roughness_texture: texture_2d<f32>;

@group(3) @binding(3)
var fragment_normal_sampler: sampler;

@group(2) @binding(3)
var fragment_normal_texture: texture_2d<f32>;

@group(3) @binding(4)
var occlusion_sampler: sampler;

@group(2) @binding(4)
var occlusion_texture: texture_2d<f32>;

@group(3) @binding(5)
var skybox_sampler: sampler;

@group(2) @binding(5)
var skybox_texture: texture_cube<f32>;

@group(3) @binding(6)
var emission_sampler: sampler;

@group(2) @binding(6)
var emission_texture: texture_2d<f32>;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;

    let camera_view_projection_matrix = view_params.camera_projection_matrix * view_params.camera_view_matrix;

    out.position = camera_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);
    out.world_position = (node_params.transform * float4(vert.position, 1.0)).xyz;
    out.texcoords = vert.texcoords;
    out.vertex_normal = normalize(node_params.transform * float4(vert.vertex_normal, 0.0)).xyz;
    //FIXME: w component is tangent handedness 1 or -1, google more on that
    out.vertex_tangent = normalize(node_params.transform * float4(vert.vertex_tangent, 0.0)).xyz;

    return out;
};

fn calculateBumpedNormal(in: VertexOutput) -> float3 {
    let normal = normalize(in.vertex_normal);
    var tangent = normalize(in.vertex_tangent);
    //gram-schmidt orthogonalization
    tangent = normalize(tangent - dot(tangent, normal) * normal);
    let bitangent = cross(tangent, normal);
    let bump_map_normal = normalize(textureSample(fragment_normal_texture, fragment_normal_sampler, in.texcoords).rgb * 2.0 - 1.0);
    let tbn_matrix = mat3x3f(tangent, bitangent, normal);

    return normalize(tbn_matrix * bump_map_normal);
}

@fragment
fn fragment_main(in: VertexOutput) -> FragmentOutput {
    var out: FragmentOutput;

    out.albedo = textureSample(base_color_texture, base_color_sampler, in.texcoords) 
        * material_params.base_color_factor;
    out.metallic_roughness = textureSample(metallic_roughness_texture, metallic_roughness_sampler, in.texcoords);
    out.occlusion = textureSample(occlusion_texture, occlusion_sampler, in.texcoords);
    out.normal = vec4(calculateBumpedNormal(in), 1);
    out.emission = textureSample(emission_texture, emission_sampler, in.texcoords);

    return out;
};
