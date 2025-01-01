alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

struct VertexInput {
    @location(0) position: float3,
    @location(1) texcoords: float2,
    @location(2) normal: float3
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) world_position: float3,
    @location(1) texcoords: float2,
    @location(2) normal: float3,
    @location(3) camera_position: float3,
    @location(4) shadow_position: vec3f
};

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    light_projection_matrix: mat4x4<f32>,
    light_view_matrix: mat4x4<f32>,
    light_position: vec4f
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

@group(3) @binding(1)
var base_color_sampler: sampler;

@group(2) @binding(1)
var base_color_texture: texture_2d<f32>;

@group(3) @binding(2)
var metallic_roughness_sampler: sampler;

@group(2) @binding(2)
var metallic_roughness_texture: texture_2d<f32>;

@group(3) @binding(3)
var tangent_normal_sampler: sampler;

@group(2) @binding(3)
var tangent_normal_texture: texture_2d<f32>;

@group(3) @binding(4)
var shadow_sampler: sampler_comparison;

@group(2) @binding(4)
var shadow_texture: texture_depth_2d;

const ambientFactor = 0.1;


@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;

    let light_view_projection_matrix = view_params.light_projection_matrix * view_params.light_view_matrix;
    let camera_view_projection_matrix = view_params.camera_projection_matrix * view_params.camera_view_matrix;
    let position_from_light = light_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);

    out.shadow_position = vec3(
        position_from_light.xy * vec2(0.5, -0.5) + vec2(0.5),
        position_from_light.z
    );
    out.position = camera_view_projection_matrix * node_params.transform * float4(vert.position, 1.0);
    out.world_position = out.position.xyz;
    out.texcoords = vert.texcoords;
    out.normal = vert.normal;
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

@fragment
fn fragment_main(in: VertexOutput) -> @location(0) float4 {
    let albedoColor = decode_color(
        textureSample(base_color_texture, base_color_sampler, in.texcoords) 
            * material_params.base_color_factor
    );

    var visibility = 0.0;
    let oneOverShadowDepthTextureSize = 1.0 / 1024.0;
    for (var y = -1; y <= 1; y++) {
        for (var x = -1; x <= 1; x++) {
            let offset = vec2f(vec2(x, y)) * oneOverShadowDepthTextureSize;

            visibility += textureSampleCompare(
                shadow_texture, shadow_sampler,
                in.shadow_position.xy + offset, in.shadow_position.z - 0.007
            );
        }
    }
    
    visibility /= 9.0;

    let lambertFactor = max(dot(normalize(view_params.light_position.xyz - in.world_position), normalize(in.normal)), 0.0);

    let lightingFactor = min(ambientFactor + visibility * lambertFactor, 1.0);

    return vec4(lightingFactor * albedoColor.xyz, 1.0);
};
