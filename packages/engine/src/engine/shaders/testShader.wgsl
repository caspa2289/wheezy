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
const OUT_OCCLUSION = 8;

const USE_V_NORMAL = 0;
const USE_F_NORMAL = 1;
const USE_PBR = 2;

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
var occlusion_sampler: sampler;

@group(2) @binding(4)
var occlusion_texture: texture_2d<f32>;

@group(3) @binding(5)
var shadow_sampler: sampler_comparison;

@group(2) @binding(5)
var shadow_texture: texture_depth_2d;

@group(3) @binding(6)
var skybox_sampler: sampler;

@group(2) @binding(6)
var skybox_texture: texture_cube<f32>;

@group(3) @binding(7)
var emission_sampler: sampler;

@group(2) @binding(7)
var emission_texture: texture_2d<f32>;

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
    out.vertex_tangent = normalize(node_params.transform * float4(vert.vertex_tangent, 1.0)).xyz;
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
    let normal = normalize(in.vertex_normal);
    var tangent = normalize(in.vertex_tangent);
    //gram-schmidt orthogonalization
    tangent = normalize(tangent - dot(tangent, normal) * normal);
    let bitangent = cross(tangent, normal);
    let bump_map_normal = normalize(textureSample(fragment_normal_texture, fragment_normal_sampler, in.texcoords).rgb * 2.0 - 1.0);
    let tbn_matrix = mat3x3f(tangent, bitangent, normal);

    return normalize(tbn_matrix * bump_map_normal);
}

fn DistributionGGX( N: float3, H: float3, roughness: f32) -> f32 {
    let a = roughness*roughness;
    let a2 = a * a;
    let NdotH  = max(dot(N, H), 0.0);
    let NdotH2 = NdotH*NdotH;
	
    let num = a2;
    var denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
	
    return num / denom;
}

fn GeometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
    let r = (roughness + 1.0);
    let k = (r*r) / 8.0;

    let num = NdotV;
    let denom = NdotV * (1.0 - k) + k;
	
    return num / denom;
}

fn GeometrySmith( N: float3, V: float3, L: float3, roughness: f32) -> f32 {
    let NdotV = max(dot(N, V), 0.0);
    let NdotL = max(dot(N, L), 0.0);
    let ggx2  = GeometrySchlickGGX(NdotV, roughness);
    let ggx1  = GeometrySchlickGGX(NdotL, roughness);
	
    return ggx1 * ggx2;
}

fn fresnelSchlick(cosTheta: f32, F0: float3, roughness: f32) -> float3 {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
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

    var fragment_normal: float3;
    switch(debug_params.normal_type) {
        case(USE_V_NORMAL): {
            fragment_normal = in.vertex_normal;
            break;
        }
        case(USE_PBR): {
            albedo_color = pow(albedo_color, vec4f(2.2));
            let N = calculateBumpedNormal(in);
            let V = normalize(in.camera_position - in.world_position);
            let R = reflect(-V, N);

            var F0 = vec3(0.04); 
            F0 = mix(F0, albedo_color.rgb, vec3(metallic));
                    
            // reflectance equation
            var Lo = vec3(0.0);
            
            // calculate per-light radiance
            let L = normalize(view_params.light_position.xyz - in.world_position);
            let H = normalize(V + L);
            let distance = length(view_params.light_position.xyz - in.world_position);
            let attenuation = 1.0; //not applicable to directional light
            //1.0 / (distance * distance);
            let radiance = LIGHT_COLOR.rgb * attenuation;        
            
            // cook-torrance brdf
            let NDF = DistributionGGX(N, H, roughness);        
            let G = GeometrySmith(N, V, L, roughness);      
            let F = fresnelSchlick(max(dot(H, V), 0.0), F0, roughness);       
            
            let numerator = NDF * G * F;
            let denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
            let specular = numerator / denominator;  
 
            let kS = F;
            var kD = vec3(1.0) - kS;
            kD *= 1.0 - vec3(metallic);	  

            // add to outgoing radiance Lo
            let NdotL = max(dot(N, L), 0.0);            
            Lo += (kD * albedo_color.rgb / PI + specular) * radiance * NdotL;
  
            let kSl = fresnelSchlick(max(dot(N, V), 0.0), F0, roughness);
            var kDl = 1.0 - kSl;
            kDl *= 1.0 - metallic; 
            let reflection_color = textureSample(skybox_texture, skybox_sampler, R).xyz;
            //FIXME: this should be sampled from cubemap
            let irradiance = vec3f(1, 1, 1); 
            let diffuse = irradiance * albedo_color.rgb;

            let ambient_color = (kDl * diffuse) * occlusion * vec3(0.03);
           
            var color = ambient_color.rgb + Lo + (F * reflection_color) + emission.rgb;

            color = color / (color + vec3(1.0));
            color = pow(color, vec3(1.0/2.2));
        
            return vec4(color, 1.0);
        }
        default: {
            fragment_normal = calculateBumpedNormal(in);
        }
    }

    albedo_color *= occlusion;
    let ambient_color = vec4(view_params.ambient_light_color.xyz * view_params.ambient_light_color.w, 1.0f);

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
        case(OUT_OCCLUSION) : {
            return vec4(occlusion);
        }
        default: {
            return decode_color(vec4(
                (ambient_color.xyz + lighting_factor *
                (specular_color.xyz + diffuse_color.xyz)) * albedo_color.xyz + emission.xyz,
                1.0
            ));
        }
    }
};
