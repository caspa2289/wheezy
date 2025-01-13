alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

const OUT_DEFAULT = 0;
const OUT_V_NORMAL = 1;
const OUT_AMBIENT = 2;
const OUT_DIFFUSE = 3;
const OUT_METALLIC = 4;
const OUT_ROUGHNESS = 5;
const OUT_F_NORMAL = 6;
const OUT_V_TANGENT = 7;

const USE_V_NORMAL = 0;
const USE_F_NORMAL = 1;

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
    @location(5) shadow_position: vec3f
};

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
var shadow_sampler: sampler_comparison;

@group(2) @binding(4)
var shadow_texture: texture_depth_2d;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;

    let light_view_projection_matrix = view_params.light_projection_matrix * view_params.light_view_matrix;
    let camera_view_projection_matrix = view_params.camera_projection_matrix * view_params.camera_view_matrix;
    let light_space_position = light_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);

    out.shadow_position = vec3(light_space_position.xy * vec2(0.5, -0.5) + vec2(0.5, 0.5), light_space_position.z);

    out.position = camera_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);
    out.world_position = (node_params.transform * float4(vert.position, 1.0)).xyz;
    out.texcoords = vert.texcoords;
    out.vertex_normal = normalize(node_params.transform * float4(vert.vertex_normal, 0.0)).xyz;
    //FIXME: w component is tangent handedness 1 or -1, google more on that
    out.vertex_tangent = normalize(node_params.transform * float4(vert.vertex_tangent, -1.0)).xyz;
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

const LIGHT_COLOR = vec4f(1.0, 1.0, 1.0, 0.0);
const LIGHT_DIFFUSE_INTENSITY = 1.0;

//FIXME: this is not a constant
const SPECULAR_POWER = 32.0;

fn calculateBumpedNormal(in: VertexOutput) -> float3 {
    let Normal = normalize(in.vertex_normal);
    var Tangent = normalize(in.vertex_tangent);
    Tangent = normalize(Tangent - dot(Tangent, Normal) * Normal);
    let Bitangent = cross(Tangent, Normal);
    let BumpMapNormal = normalize(textureSample(fragment_normal_texture, fragment_normal_sampler, in.texcoords).rgb * 2.0 - 1.0);
    let TBN = mat3x3f(Tangent, Bitangent, Normal);
    let NewNormal = normalize(TBN * BumpMapNormal);

    return NewNormal;
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let albedo_color = decode_color(
        textureSample(base_color_texture, base_color_sampler, in.texcoords) 
            * material_params.base_color_factor
    );

    var fragment_normal: float3;
    switch(debug_params.normal_type) {
        case(USE_V_NORMAL): {
            fragment_normal = in.vertex_normal;
            break;
        }
        default: {
            fragment_normal = calculateBumpedNormal(in);
        }
    }

    let ambient_color = vec4(view_params.ambient_light_color.xyz * view_params.ambient_light_color.w, 1.0f);

    let metallic_roughness = textureSample(metallic_roughness_texture, metallic_roughness_sampler, in.texcoords);
    let roughness = metallic_roughness.g;
    let metallic = metallic_roughness.b;

    let visibility = get_visibility(in.shadow_position);
    let diffuse_factor = get_lambert_factor(view_params.light_position.xyz, in.world_position, fragment_normal);
    var specular_color = vec4(0.0, 0.0, 0.0, 0.0);

    var diffuse_color = vec4f();

    if (diffuse_factor > 0) {
        diffuse_color = vec4f(LIGHT_COLOR.xyz * LIGHT_DIFFUSE_INTENSITY * diffuse_factor, 1.0);
    }
    else {
        diffuse_color = vec4f(0, 0, 0, 0);
    }

    if (visibility > 0.0) {
        let vertex_to_eye_vec = normalize(in.camera_position - in.world_position);

        let light_reflection = normalize(reflect(in.shadow_position, fragment_normal));

        var specular_factor = dot(vertex_to_eye_vec, light_reflection);

        if (specular_factor > 0.0) {
            specular_factor = pow(specular_factor, SPECULAR_POWER);
            specular_color = vec4f(LIGHT_COLOR.xyz * metallic * specular_factor, 1.0f);
        }
    }

    let lighting_factor = get_lighting_factor(view_params.ambient_light_color.w, visibility, diffuse_factor);

    switch(debug_params.output_type) {
        case(OUT_V_NORMAL): {
            return vec4(in.vertex_normal, 1.0);
        }
        case(OUT_AMBIENT): {
            return ambient_color;
        }
        case(OUT_DIFFUSE): {
            return diffuse_color;
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
        default: {
            return vec4(
                (ambient_color.xyz + lighting_factor *
                (specular_color.xyz + diffuse_color.xyz)) * albedo_color.xyz,
                1.0
            );
        }
    }
};
