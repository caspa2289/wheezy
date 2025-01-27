struct Uniforms {
    transform : mat4x4f,
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
}

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var skybox_sampler: sampler;
@group(0) @binding(2) var skybox_texture: texture_cube<f32>;

struct VertexOutput {
    @builtin(position) Position : vec4f,
    @location(0) texture_coordinates : vec2f,
    @location(1) world_position: vec4f,
}

@vertex
fn vertex_main(
    @location(0) position : vec4f,
    @location(1) uv : vec2f
) -> VertexOutput {
    var output : VertexOutput;
    let camera_view_projection_matrix = uniforms.camera_projection_matrix * uniforms.camera_view_matrix;

    output.Position = camera_view_projection_matrix * uniforms.transform * position;
    output.texture_coordinates = uv;
    output.world_position = 0.5 * (position + vec4(1.0, 1.0, 1.0, 1.0));
    return output;
}

@fragment
fn fragment_main(
    @location(0) texture_coordinates: vec2f,
    @location(1) world_position: vec4f
) -> @location(0) vec4f {
    var sample_vector = world_position.xyz - vec3(0.5);
    sample_vector.z *= -1;
    return textureSample(skybox_texture, skybox_sampler, sample_vector);
}
