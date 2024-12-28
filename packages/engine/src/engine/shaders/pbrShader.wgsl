alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
    @location(1) texcoords: float2,
    @location(2) object_normal: float3
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) world_pos: float3,
    @location(1) texcoords: float2,
    @location(2) object_normal: float3,
    @location(3) camera_position: float3
};

struct ViewParams {
    view_proj: mat4x4<f32>,
    camera_position: vec4f
};

struct NodeParams {
    transform: mat4x4<f32>,
};

struct MaterialParams {
    base_color_factor: float4,
    metallic_factor: f32,
    roughness_factor: f32,
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(1) @binding(0)
var<uniform> node_params: NodeParams;

@group(2) @binding(0)
var<uniform> material_params: MaterialParams;

@group(2) @binding(1)
var base_color_sampler: sampler;

@group(2) @binding(2)
var base_color_texture: texture_2d<f32>;

@group(2) @binding(3)
var metallic_roughness_sampler: sampler;

@group(2) @binding(4)
var metallic_roughness_texture: texture_2d<f32>;

@group(2) @binding(5)
var tangent_normal_sampler: sampler;

@group(2) @binding(6)
var tangent_normal_texture: texture_2d<f32>;

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.position = view_params.view_proj * node_params.transform * float4(vert.position, 1.0);
    out.world_pos = vert.position.xyz;
    out.texcoords = vert.texcoords;
    out.object_normal = vert.object_normal;
    out.camera_position = view_params.camera_position.xyz;

    return out;
};

// Hardcoded lighting
const LightPosition = vec3f(8, 8, 0);
const LightColor = vec3f(1);
const AmbientColorStrength = vec3f(0.1);
const PI = 3.1415926535;

const SpecularColor = vec3f(1);

fn linear_to_srgb(x: f32) -> f32 {
    if (x <= 0.0031308) {
        return 12.92 * x;
    }
    return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

fn decode_color(color: vec4f) -> vec4f {
    return vec4f(linear_to_srgb(color.x), linear_to_srgb(color.y), linear_to_srgb(color.z), 1.0);
}

fn lerp(a: vec3f, b: vec3f, s: f32) -> vec3f {
    let diff = b - a;
    var result = a;
    result.r += diff.r * s;
    result.g += diff.g * s;
    result.b += diff.b * s;

    return result;
}

fn GGXNormalDistribution(roughness: f32, NdotH: f32) ->f32 {
    let roughnessSqr = roughness * roughness;
    let NdotHSqr = NdotH * NdotH;
    let TanNdotHSqr = (1 - NdotHSqr) / NdotHSqr;
    //should there be pow or sqrt?
    return (1.0 / PI) * pow(roughness / (NdotHSqr * (roughnessSqr + TanNdotHSqr)), 2.0);
}

fn ImplicitGeometricShadowing(NdotL: f32, NdotV: f32) -> f32 {
	return NdotL * NdotV;
}

fn SphericalGaussianFresnel(LdotH: f32, SpecularColor: vec3f) -> vec3f {	
  let power = ((-5.55473 * LdotH) - 6.98316) * LdotH;
  return SpecularColor + (1 - SpecularColor) * pow(2, power);
}

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let color = decode_color(
        textureSample(base_color_texture, base_color_sampler, in.texcoords) 
            * material_params.base_color_factor
    );

    let tangent_normal = textureSample(tangent_normal_texture, tangent_normal_sampler, in.texcoords).rgb;

    let DiffuseColor = color.rgb;

    let metallic_roughness = textureSample(metallic_roughness_texture, metallic_roughness_sampler, in.texcoords);

    let normalDirection = normalize(in.object_normal);

    let lightDirection = normalize(lerp(LightPosition, LightPosition - in.world_pos, 1.0));

    let lightReflectDirection = reflect(-lightDirection, normalDirection);

    let viewDirection = normalize(in.camera_position - in.world_pos);

    let viewReflectDirection = normalize(reflect(-viewDirection, normalDirection));

    let halfDirection = normalize(viewDirection + lightDirection); 

    let NdotL = max(0.0, dot(normalDirection, lightDirection));
    let NdotH = max(0.0, dot(normalDirection, halfDirection));
    let NdotV = max(0.0, dot(normalDirection, viewDirection));
    let VdotH = max(0.0, dot(viewDirection, halfDirection));
    let LdotH = max(0.0, dot(lightDirection, halfDirection));
    let LdotV = max(0.0, dot(lightDirection, viewDirection)); 
    let RdotV = max(0.0, dot(lightReflectDirection, viewDirection));

    let attenuation = 1.0;

    let attenColor = attenuation * normalize(LightColor);

    let roughness = metallic_roughness.g;
    let metallic = metallic_roughness.b;

    let diffuseColor = DiffuseColor * (1 - metallic);
    let specColor = lerp(SpecularColor, DiffuseColor, metallic * 0.5);
   
    let SpecularDistribution = specColor * GGXNormalDistribution(roughness, NdotH);
    let GeometricShadow = ImplicitGeometricShadowing(NdotL, NdotV);
    let FresnelFunction = SphericalGaussianFresnel(LdotH, specColor);

    let specularity = (SpecularDistribution * FresnelFunction * GeometricShadow) / (PI * (  NdotL * NdotV));

    let lightingModel = ((diffuseColor + specularity) * NdotL) * attenColor;

    return vec4f(lightingModel, color.a);
};
