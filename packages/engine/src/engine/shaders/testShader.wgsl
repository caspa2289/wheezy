alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

// pipeline variant overrides — see Renderer/Pipelines.ts. With SKINNING = 0
// the joints/weights inputs and the palette bindings are statically unused,
// so unskinned pipelines need neither the vertex buffers nor group 3 bound.
override SKINNING: u32 = 0u;
override MORPH_COUNT: u32 = 0u;

struct VertexInput {
    @builtin(vertex_index) vertex_idx: u32,
    @location(0) position: float3,
    @location(1) texcoords: float2,
    @location(2) vertex_normal: float3,
    @location(3) vertex_tangent: float3,
    @location(4) joints: vec4<u32>,
    @location(5) weights: float4,
};

struct VertexOutput {
    @builtin(position) position: float4,
    @location(0) texcoords: float2,
    @location(1) vertex_normal: float3,
    @location(2) vertex_tangent: float3,
};

// G-buffer MRT output — attachment order must match the geometry pass descriptor.
// 4 targets, not 5: WebGPU's default maxColorAttachmentBytesPerSample is 32 and
// counts each attachment 8-byte-aligned, so occlusion is packed into the
// metallicRoughness target's free .r channel.
struct GBufferOutput {
    @location(0) albedo: float4,
    @location(1) normal: float4,
    @location(2) metallic_roughness: float4,
    @location(3) emission: float4,
};

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
};

// per-draw node index, selected via a dynamic bind-group offset
// (slot i of the index buffer holds the value i — see SceneTraversal)
struct NodeIndex {
    index: u32,
};

// world matrix of every scene node, written once per frame by the traversal
struct NodeMatrices {
    matrices: array<mat4x4<f32>>,
};

struct MaterialParams {
    base_color_factor: float4,
    metallic_factor: f32,
    roughness_factor: f32,
};

// --- group 3: skinning + morph data (see SkinningUploader) ---
// per-draw { joint palette base slot, morph weights block }, selected via a
// dynamic bind-group offset into the anim-draw slot buffer
struct AnimDrawParams {
    palette_base: u32,
    morph_base: u32,
};

// joint matrices of every skin in the scene (jointWorld × inverseBind),
// written once per frame
struct JointPalette {
    matrices: array<mat4x4<f32>>,
};

// morph weights of every morph mesh, 8 floats (2 × vec4) per mesh
struct MorphWeights {
    blocks: array<float4>,
};

struct MorphMeshParams {
    vertex_count: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(1) @binding(0)
var<uniform> node_index: NodeIndex;

@group(1) @binding(1)
var<storage, read> node_matrices: NodeMatrices;

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

@group(2) @binding(14)
var emission_sampler: sampler;

@group(2) @binding(7)
var emission_texture: texture_2d<f32>;

@group(3) @binding(0)
var<uniform> anim_draw: AnimDrawParams;

@group(3) @binding(1)
var<storage, read> joint_palette: JointPalette;

@group(3) @binding(2)
var<storage, read> morph_weights: MorphWeights;

// flat f32 arrays: [targetCount × vertexCount × 3 position deltas]
// followed by [the same layout of normal deltas] — read by vertex pulling
@group(3) @binding(3)
var<storage, read> morph_deltas: array<f32>;

@group(3) @binding(4)
var<uniform> morph_mesh_params: MorphMeshParams;

fn morph_weight(t: u32) -> f32 {
    let block = morph_weights.blocks[anim_draw.morph_base * 2u + t / 4u];
    return block[t % 4u];
}

@vertex
fn vertex_main(vert: VertexInput) -> VertexOutput {
    var out: VertexOutput;

    var position = vert.position;
    var normal = vert.vertex_normal;
    var tangent = vert.vertex_tangent;

    if (MORPH_COUNT > 0u) {
        let vcount = morph_mesh_params.vertex_count;
        let vi = vert.vertex_idx;
        for (var t = 0u; t < MORPH_COUNT; t = t + 1u) {
            let w = morph_weight(t);
            if (w != 0.0) {
                let p_off = (t * vcount + vi) * 3u;
                position = position + w * float3(morph_deltas[p_off], morph_deltas[p_off + 1u], morph_deltas[p_off + 2u]);
                let n_off = MORPH_COUNT * vcount * 3u + p_off;
                normal = normal + w * float3(morph_deltas[n_off], morph_deltas[n_off + 1u], morph_deltas[n_off + 2u]);
            }
        }
    }

    let camera_view_projection_matrix = view_params.camera_projection_matrix * view_params.camera_view_matrix;

    if (SKINNING == 1u) {
        // glTF: skinned vertices are positioned by the joint palette in
        // armature space — the mesh node's own world matrix is ignored
        let pb = anim_draw.palette_base;
        let j = vert.joints;
        let w = vert.weights;
        var skin_mat = mat4x4<f32>(float4(0.0), float4(0.0), float4(0.0), float4(0.0));
        if (w.x > 0.0) { skin_mat = skin_mat + w.x * joint_palette.matrices[pb + j.x]; }
        if (w.y > 0.0) { skin_mat = skin_mat + w.y * joint_palette.matrices[pb + j.y]; }
        if (w.z > 0.0) { skin_mat = skin_mat + w.z * joint_palette.matrices[pb + j.z]; }
        if (w.w > 0.0) { skin_mat = skin_mat + w.w * joint_palette.matrices[pb + j.w]; }
        let skin3 = mat3x3<f32>(skin_mat[0].xyz, skin_mat[1].xyz, skin_mat[2].xyz);

        out.position = camera_view_projection_matrix * skin_mat * float4(position, 1.0);
        out.vertex_normal = normalize(skin3 * normal);
        out.vertex_tangent = normalize(skin3 * tangent);
    } else {
        let node_transform = node_matrices.matrices[node_index.index];
        out.position = camera_view_projection_matrix * node_transform * float4(position, 1.0);
        out.vertex_normal = normalize(node_transform * float4(normal, 0.0)).xyz;
        out.vertex_tangent = normalize(node_transform * float4(tangent, 0.0)).xyz;
    }

    out.texcoords = vert.texcoords;

    return out;
};

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

@fragment
fn fragment_main(in: VertexOutput) -> GBufferOutput {
    var out: GBufferOutput;

    out.albedo = textureSample(base_color_texture, base_color_sampler, in.texcoords)
            * material_params.base_color_factor;
    out.normal = float4(calculateBumpedNormal(in), 1.0);
    // packed material target: occlusion in .r, roughness in .g, metallic in .b
    // (glTF metallicRoughness channel convention + the free .r slot)
    let metallic_roughness = textureSample(metallic_roughness_texture, metallic_roughness_sampler, in.texcoords);
    let occlusion = textureSample(occlusion_texture, occlusion_sampler, in.texcoords).r;
    // glTF: the factors scale the sampled texture channels
    out.metallic_roughness = float4(
        occlusion,
        metallic_roughness.g * material_params.roughness_factor,
        metallic_roughness.b * material_params.metallic_factor,
        1.0
    );
    out.emission = textureSample(emission_texture, emission_sampler, in.texcoords);

    return out;
};
