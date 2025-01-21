struct Uniforms {
    transform : mat4x4f,
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
}

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var mySampler: sampler;
@group(0) @binding(2) var myTexture: texture_cube<f32>;

struct VertexOutput {
    @builtin(position) Position : vec4f,
    @location(0) fragUV : vec2f,
    @location(1) fragPosition: vec4f,
}

@vertex
fn vertex_main(
    @location(0) position : vec4f,
    @location(1) uv : vec2f
) -> VertexOutput {
    var output : VertexOutput;
    let camera_view_projection_matrix = uniforms.camera_projection_matrix * uniforms.camera_view_matrix;

    output.Position = camera_view_projection_matrix * uniforms.transform * position;
    output.fragUV = uv;
    output.fragPosition = 0.5 * (position + vec4(1.0, 1.0, 1.0, 1.0));
    return output;
}

@fragment
fn fragment_main(
    @location(0) fragUV: vec2f,
    @location(1) fragPosition: vec4f
) -> @location(0) vec4f {
    var cubemapVec = fragPosition.xyz - vec3(0.5);
    cubemapVec.z *= -1;
    return textureSample(myTexture, mySampler, cubemapVec);
}
