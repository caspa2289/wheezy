alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

// must stay in sync with RENDER_OUTPUT_SOURCES (types/core/Renderer/index.ts)
const OUT_DEFAULT = 0;
const OUT_ALBEDO = 1;
const OUT_NORMAL = 2;
const OUT_METALLIC = 3;
const OUT_ROUGHNESS = 4;
const OUT_OCCLUSION = 5;
const OUT_EMISSION = 6;
const OUT_DEPTH = 7;

struct VertexOutput {
    @builtin(position) position: float4,
};

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    ambient_light_color: vec4f,
    inverse_view_projection: mat4x4<f32>,
};

struct DebugParams {
    output_type: u32,
}

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

// G-buffer inputs, read 1:1 per pixel via textureLoad — binding order
// must match the renderer's G-buffer bind group. Occlusion is packed into
// the metallicRoughness target's .r channel (see testShader.wgsl).
@group(1) @binding(0)
var albedo_texture: texture_2d<f32>;

@group(1) @binding(1)
var normal_texture: texture_2d<f32>;

@group(1) @binding(2)
var metallic_roughness_texture: texture_2d<f32>;

@group(1) @binding(3)
var emission_texture: texture_2d<f32>;

@group(1) @binding(4)
var depth_texture: texture_depth_2d;

@group(2) @binding(0)
var<storage, read> directionalLightsBuffer: DirectionalLightsBuffer;

@group(2) @binding(1)
var<storage, read> pointLightsBuffer: PointLightsBuffer;

@group(2) @binding(2)
var<storage, read> spotLightsBuffer: SpotLightsBuffer;

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@vertex
fn vertex_main(@builtin(vertex_index) vertex_index: u32) -> VertexOutput {
    // fullscreen triangle, no vertex buffer
    let positions = array<float2, 3>(
        float2(-1.0, -1.0),
        float2(3.0, -1.0),
        float2(-1.0, 3.0)
    );

    var out: VertexOutput;
    out.position = float4(positions[vertex_index], 0.0, 1.0);
    return out;
}

fn gamma_correct(color: float4) -> float4 {
    return float4(pow(color, float4(1.0/2.2)));
}

fn calculateDirectionalLight(
    light: DirectionalLightData,
    normal: float3,
    world_position: float3,
    metallic: f32
) -> float4 {
    let diffuse_factor = dot(normal, -light.direction);

    var diffuse_color = float4(0, 0, 0, 0);
    var specular_color = float4(0, 0, 0, 0);

    if (diffuse_factor > 0.0) {

        diffuse_color = float4(light.color * light.intensity * diffuse_factor, 1.0);
        let vertex_to_eye = normalize(view_params.camera_position.xyz - world_position);
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
    world_position: float3,
    metallic: f32
) -> float4 {
    let light_direction = world_position - light.position;
    let distance = length(light_direction);

    var directionalLight: DirectionalLightData;

    directionalLight.color = light.color;
    directionalLight.intensity = light.intensity;
    directionalLight.direction = normalize(light_direction);


    let color = calculateDirectionalLight(directionalLight, normal, world_position, metallic);

    let attenuation = max(0.00000001, light.atten_constant +
        light.atten_linear * distance +
        light.atten_exponential * distance * distance);

    return color / attenuation;
}

fn calculateSpotLight(
    light: SpotLightData,
    normal: float3,
    world_position: float3,
    metallic: f32
) -> float4 {
    let light_to_pixel = normalize(world_position - light.position);
    let spot_factor = dot(light_to_pixel, light.direction);

    if (spot_factor > light.cutoff) {
        var point_light: PointLightData;

        point_light.color = light.color;
        point_light.intensity = light.intensity;
        point_light.position = light.position;
        point_light.atten_constant = light.atten_constant;
        point_light.atten_linear = light.atten_linear;
        point_light.atten_exponential = light.atten_exponential;

        let color = calculatePointLight(point_light, normal, world_position, metallic);

        return color * (1.0 - (1.0 - spot_factor) * 1.0 / (1.0 - light.cutoff));
    } else {
        return vec4(0, 0, 0, 0);
    }
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let coords = vec2i(in.position.xy);

    let depth = textureLoad(depth_texture, coords, 0);
    let albedo = textureLoad(albedo_texture, coords, 0);
    let normal = textureLoad(normal_texture, coords, 0);
    let metallic_roughness = textureLoad(metallic_roughness_texture, coords, 0);
    let emission = textureLoad(emission_texture, coords, 0);

    switch(debug_params.output_type) {
        case(OUT_ALBEDO): {
            return albedo;
        }
        case(OUT_NORMAL): {
            return float4(normal.xyz, 1.0);
        }
        case(OUT_METALLIC): {
            return float4(metallic_roughness.b);
        }
        case(OUT_ROUGHNESS): {
            return float4(metallic_roughness.g);
        }
        case(OUT_OCCLUSION): {
            return float4(metallic_roughness.r);
        }
        case(OUT_EMISSION): {
            return emission;
        }
        case(OUT_DEPTH): {
            return float4(depth);
        }
        default: {
            // reconstruct world position from depth (WebGPU NDC: x/y in [-1,1], y up, z in [0,1])
            let dims = float2(textureDimensions(albedo_texture, 0));
            let ndc = float3(
                (in.position.x / dims.x) * 2.0 - 1.0,
                1.0 - (in.position.y / dims.y) * 2.0,
                depth
            );
            let world_homogeneous = view_params.inverse_view_projection * float4(ndc, 1.0);
            let world_position = world_homogeneous.xyz / world_homogeneous.w;

            let fragment_normal = normalize(normal.xyz);
            // packed material target: occlusion in .r, roughness in .g, metallic in .b
            let metallic = metallic_roughness.b;

            var albedo_color = albedo * metallic_roughness.r;

            var total_light = float4(0.0, 0.0, 0.0, 0.0);

            for (var i = 0u; i < arrayLength(&directionalLightsBuffer.lights); i++) {
                total_light += calculateDirectionalLight(directionalLightsBuffer.lights[i], fragment_normal, world_position, metallic);
            }

            for (var i = 0u; i < arrayLength(&pointLightsBuffer.lights); i++) {
                total_light += calculatePointLight(pointLightsBuffer.lights[i], fragment_normal, world_position, metallic);
            }

            for (var i = 0u; i < arrayLength(&spotLightsBuffer.lights); i++) {
                total_light += calculateSpotLight(spotLightsBuffer.lights[i], fragment_normal, world_position, metallic);
            }

            if ((total_light[0] == 0.0) & (total_light[1] == 0.0) & (total_light[2] == 0.0)) {
                total_light = float4(view_params.ambient_light_color.xyz * view_params.ambient_light_color.w, 0.0f);
            }

            return gamma_correct(
                (albedo_color * total_light) + emission
            );
        }
    }
};
