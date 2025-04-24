alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

const OUT_DEFAULT = 0;
const OUT_V_NORMAL = 1;
const OUT_AMBIENT = 2;
const OUT_METALLIC = 4;
const OUT_ROUGHNESS = 5;
const OUT_F_NORMAL = 6;
const OUT_V_TANGENT = 7;
const OUT_OCCLUSION = 8;

const PI = 3.14159265359;

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
    @location(4) camera_position: float3,
};

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    ambient_light_color: vec4f
};

struct NodeParams {
    transform: mat4x4<f32>,
};

struct DebugParams {
    output_type: u32,
}

struct MaterialParams {
    base_color_factor: float4,
    metallic_factor: f32,
    roughness_factor: f32,
};

struct DirectionalLightData {
  color: vec3f,
  intensity: f32,
  direction: vec3f,
  diffuse_intensity: f32
};

struct DirectionalLightsBuffer {
  lights: array<DirectionalLightData>,
}

@group(3) @binding(0) 
var<storage, read> directionalLightsBuffer: DirectionalLightsBuffer;

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@group(1) @binding(0)
var<uniform> node_params: NodeParams;

@group(2) @binding(0)
var<uniform> material_params: MaterialParams;

@group(2) @binding(8)
var base_color_sampler: sampler;

@group(2) @binding(1)
var base_color_texture: texture_2d<f32>;

@group(2) @binding(9)
var metallic_roughness_sampler: sampler;

@group(2) @binding(2)
var metallic_roughness_texture: texture_2d<f32>;

@group(2) @binding(10)
var fragment_normal_sampler: sampler;

@group(2) @binding(3)
var fragment_normal_texture: texture_2d<f32>;

@group(2) @binding(11)
var occlusion_sampler: sampler;

@group(2) @binding(4)
var occlusion_texture: texture_2d<f32>;

@group(2) @binding(12)
var shadow_sampler: sampler_comparison;

@group(2) @binding(5)
var shadow_texture: texture_depth_2d;

@group(2) @binding(13)
var skybox_sampler: sampler;

@group(2) @binding(6)
var skybox_texture: texture_cube<f32>;

@group(2) @binding(14)
var emission_sampler: sampler;

@group(2) @binding(7)
var emission_texture: texture_2d<f32>;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;

    let camera_view_projection_matrix = view_params.camera_projection_matrix * view_params.camera_view_matrix;
    out.position = camera_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);
    out.world_position = (node_params.transform * float4(vert.position, 1.0)).xyz;
    out.texcoords = vert.texcoords;
    out.vertex_normal = normalize(node_params.transform * float4(vert.vertex_normal, 0.0)).xyz;
    out.vertex_tangent = normalize(node_params.transform * float4(vert.vertex_tangent, 0.0)).xyz;
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

fn get_visibility(shadow_position: float3) -> f32 {
    var visibility = 0.0;
    let shadow_texel_size = 1.0 / f32(textureDimensions(shadow_texture).x);
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let offset = vec2f(vec2(x, y)) * shadow_texel_size;

            visibility += textureSampleCompare(
                shadow_texture, shadow_sampler,
                shadow_position.xy + offset, shadow_position.z - 0.005
            );
        }
    }
    
    return visibility / 9.0;
}

fn get_lambert_factor(light_position: float3, world_position: float3, normal: float3) -> f32 {
    return max(dot(normalize(light_position - world_position), normalize(normal)), 0.0);
}

fn get_lighting_factor(ambient_intensity: f32, visibility: f32, lambert_factor: f32) -> f32 {
    return min(ambient_intensity + max(0.2, visibility) * lambert_factor, 1.0);
}

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

fn calculateDirectionalLight(light: DirectionalLightData, normal: float3, in: VertexOutput) -> float4 {
    let diffuse_factor = dot(normal, -light.direction);

    var diffuse_color = float4(0, 0, 0, 0);
    var specular_color = float4(0, 0, 0, 0);

    if (diffuse_factor > 0.0) {

        diffuse_color = float4(light.color * light.diffuse_intensity * diffuse_factor, 1.0);
        let vertex_to_eye = normalize(in.camera_position - in.world_position);
        let light_reflect = normalize(reflect(light.direction, normal));
        var specular_factor = dot(vertex_to_eye, light_reflect);

        if (specular_factor > 0.0) {
            //FIXME: calculate specular power and intensity somehow
            let specular_power = 0.2;
            let specular_intensity = 0.2;
            specular_factor = pow(specular_factor, specular_power);
            specular_color = float4(light.color * specular_intensity * specular_factor, 1.0f);
        }
    }

    //FIXME: check if specular color is contributing anything
    return (diffuse_color + specular_color);
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    var albedo_color = textureSample(base_color_texture, base_color_sampler, in.texcoords) 
            * material_params.base_color_factor;
    let metallic_roughness = textureSample(metallic_roughness_texture, metallic_roughness_sampler, in.texcoords);
    let roughness = metallic_roughness.g;
    let metallic = metallic_roughness.b;
    let occlusion = textureSample(occlusion_texture, occlusion_sampler, in.texcoords).r;
    let emission = textureSample(emission_texture, emission_sampler, in.texcoords);

    let fragment_normal = calculateBumpedNormal(in);

    albedo_color *= occlusion;

    var total_light = float4(0.0, 0.0, 0.0, 0.0);

    for (var i = 0u; i < arrayLength(&directionalLightsBuffer.lights); i++) {
        total_light += calculateDirectionalLight(directionalLightsBuffer.lights[i], fragment_normal, in);
    }

    if ((total_light[0] == 0.0) & (total_light[1] == 0.0) & (total_light[2] == 0.0)) {
        total_light = float4(view_params.ambient_light_color.xyz * view_params.ambient_light_color.w, 0.0f);
    }

    let result_color = decode_color(
        (albedo_color * total_light) + emission
    );

    switch(debug_params.output_type) {
        case(OUT_V_NORMAL): {
            return vec4(in.vertex_normal, 1.0);
        }
        case(OUT_METALLIC): {
            return vec4(metallic);
        }
        case(OUT_ROUGHNESS): {
            return vec4(roughness);
        }
        case(OUT_F_NORMAL): {
            return vec4(fragment_normal, 1.0);
        }
        case(OUT_V_TANGENT): {
            return vec4(in.vertex_tangent, 1.0);
        }
        case(OUT_OCCLUSION) : {
            return vec4(occlusion);
        }
        default: {
            return result_color;
        }
    }
};
