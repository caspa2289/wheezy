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
};

struct PointLightData {
    color: vec3f,
    intensity: f32,
    position: vec3f,
    atten_constant: f32,
    atten_linear: f32,
    atten_exponential: f32
}

struct SpotLightData {
    color: vec3f,
    position: vec3f,
    direction: vec3f,
    cutoff: f32,
    intensity: f32,
    atten_constant: f32,
    atten_linear: f32,
    atten_exponential: f32
}

struct DirectionalLightsBuffer {
  lights: array<DirectionalLightData>,
}

struct PointLightsBuffer {
    lights: array<PointLightData>
}

struct SpotLightsBuffer {
    lights: array<SpotLightData>
}

@group(3) @binding(0) 
var<storage, read> directionalLightsBuffer: DirectionalLightsBuffer;

@group(3) @binding(1) 
var<storage, read> pointLightsBuffer: PointLightsBuffer;

@group(3) @binding(2) 
var<storage, read> spotLightsBuffer: SpotLightsBuffer;

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

fn gamma_correct(color: vec4f) -> vec4f {
    return vec4f(pow(color, vec4f(1.0/2.2)));
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

fn calculateDirectionalLight(
    light: DirectionalLightData,
    normal: float3,
    in: VertexOutput,
    metallic: f32
) -> float4 {
    let diffuse_factor = dot(normal, -light.direction);

    var diffuse_color = float4(0, 0, 0, 0);
    var specular_color = float4(0, 0, 0, 0);

    if (diffuse_factor > 0.0) {

        diffuse_color = float4(light.color * light.intensity * diffuse_factor, 1.0);
        let vertex_to_eye = normalize(in.camera_position - in.world_position);
        let light_reflect = normalize(reflect(light.direction, normal));
        var specular_factor = dot(vertex_to_eye, light_reflect);

        if (specular_factor > 0.0) {
            //FIXME: calculate specular power and intensity somehow
            //this is not it but looks fine from afar
            let specular_power = metallic * 255;
            let specular_intensity = metallic;
            specular_factor = pow(specular_factor, specular_power);
            specular_color = float4(light.color * specular_intensity * specular_factor, 1.0f);
        }
    }

    return (diffuse_color + specular_color);
}

fn calculatePointLight(
    light: PointLightData,
    normal: float3,
    in: VertexOutput,
    metallic: f32
) -> float4 {
    var light_direction = in.world_position - light.position;
    let distance = length(light_direction);

    var directionalLight: DirectionalLightData;

    directionalLight.color = light.color;
    directionalLight.intensity = light.intensity;
    directionalLight.direction = normalize(light_direction);


    let color = calculateDirectionalLight(directionalLight, normal, in, metallic);

    let attenuation = max(0.00000001, light.atten_constant +
        light.atten_linear * distance +
        light.atten_exponential * distance * distance);

    return color / attenuation;
}

fn calculateSpotLight(
    light: SpotLightData,
    normal: float3,
    in: VertexOutput,
    metallic: f32
) -> float4 {
    let light_to_pixel = normalize(in.world_position - light.position);
    let spot_factor = dot(light_to_pixel, light.direction);

    if (spot_factor > light.cutoff) {
        var point_light: PointLightData;

        point_light.color = light.color;
        point_light.intensity = light.intensity;
        point_light.position = light.position;
        point_light.atten_constant = light.atten_constant;
        point_light.atten_linear = light.atten_linear;
        point_light.atten_exponential = light.atten_exponential;

        let color = calculatePointLight(point_light, normal, in, metallic);

        return color * (1.0 - (1.0 - spot_factor) * 1.0 / (1.0 - light.cutoff));
    } else {
        return vec4(0, 0, 0, 0);
    }
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
        total_light += calculateDirectionalLight(directionalLightsBuffer.lights[i], fragment_normal, in, metallic);
    }

    for (var i = 0u; i < arrayLength(&pointLightsBuffer.lights); i++) {
        total_light += calculatePointLight(pointLightsBuffer.lights[i], fragment_normal, in, metallic);
    }

    for (var i = 0u; i < arrayLength(&spotLightsBuffer.lights); i++) {
        total_light += calculateSpotLight(spotLightsBuffer.lights[i], fragment_normal, in, metallic);
    }

    if ((total_light[0] == 0.0) & (total_light[1] == 0.0) & (total_light[2] == 0.0)) {
        total_light = float4(view_params.ambient_light_color.xyz * view_params.ambient_light_color.w, 0.0f);
    }

    let result_color = gamma_correct(
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
