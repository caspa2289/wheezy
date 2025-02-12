struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    light_projection_matrix: mat4x4<f32>,
    light_view_matrix: mat4x4<f32>,
    light_position: vec4f,
    ambient_light_color: vec4f
};

struct DebugParams {
    output_type: u32,
    normal_type: u32
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(0) @binding(1)
var<uniform> debug_params: DebugParams;

@group(1) @binding(0)
var g_normal_texture: texture_2d<f32>;

@group(1) @binding(1)
var g_albedo_texture: texture_2d<f32>;

@group(1) @binding(2)
var g_emission_texture: texture_2d<f32>;

@group(1) @binding(3)
var g_metallic_roughness_texture: texture_2d<f32>;

@group(1) @binding(4)
var g_occlusion_texture: texture_2d<f32>;

@group(1) @binding(5)
var g_depth_texture: texture_depth_2d;


fn world_from_screen_coord(coord : vec2f, depth_sample: f32, camera_view_projection_matrix: mat4x4<f32>) -> vec3f {
  // reconstruct world-space position from the screen coordinate.
  let posClip = vec4(coord.x * 2.0 - 1.0, (1.0 - coord.y) * 2.0 - 1.0, depth_sample, 1.0);
  let posWorldW = camera_view_projection_matrix * posClip;
  let posWorld = posWorldW.xyz / posWorldW.www;
  return posWorld;
}

fn linear_to_srgb(x: f32) -> f32 {
    if (x <= 0.0031308) {
        return 12.92 * x;
    }
    return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}

fn decode_color(color: vec4f) -> vec4f {
    return vec4f(linear_to_srgb(color.x), linear_to_srgb(color.y), linear_to_srgb(color.z), 1.0);
}

@vertex
fn vertex_main(
    @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
    const pos = array(
        vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
        vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0),
    );

    return vec4f(pos[VertexIndex], 0.0, 1.0);
}

@fragment
fn fragment_main(
     @builtin(position) coord : vec4f
) -> @location(0) vec4f {

    let tex_coord = vec2i(floor(coord.xy));

    let depth = textureLoad(g_depth_texture, tex_coord, 0);

    if (depth >= 1.0) {
        discard;
    }

    let buffer_size = textureDimensions(g_depth_texture);
    let coord_UV = coord.xy / vec2f(buffer_size);
    let camera_view_projection_matrix = view_params.camera_projection_matrix * view_params.camera_view_matrix;

    let position = world_from_screen_coord(coord_UV, depth, camera_view_projection_matrix);
    let normal = textureLoad(g_normal_texture, tex_coord, 0).xyz;
    let albedo_color = textureLoad(g_albedo_texture, tex_coord, 0).rgb;
    let metallic_roughness = textureLoad(g_metallic_roughness_texture, tex_coord, 0).rgb;
    let roughness = metallic_roughness.g;
    let metallic = metallic_roughness.b;
    let emission = textureLoad(g_emission_texture, tex_coord, 0).rgb;
    let occlusion = textureLoad(g_occlusion_texture, tex_coord, 0).rgb;

    return decode_color(vec4(albedo_color, 1.0));    
}
