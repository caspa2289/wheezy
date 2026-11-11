alias float4 = vec4<f32>;
alias float3 = vec3<f32>;

// pipeline variant overrides — see Renderer/Pipelines.ts. With SKINNING = 0
// the joints/weights inputs and the group(2) palette bindings are statically
// unused, so unskinned shadow pipelines need neither.
override SKINNING: u32 = 0u;
override MORPH_COUNT: u32 = 0u;

struct VertexInput {
    @builtin(vertex_index) vertex_idx: u32,
    @location(0) position: float3,
    // shadow pipelines carry only positions besides the skin attributes, so
    // these sit at slots 1/2 (the geometry pass uses 4/5)
    @location(1) joints: vec4<u32>,
    @location(2) weights: float4,
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

// per-draw caster index, selected via a dynamic bind-group offset
// (slot i of the index buffer holds the value i — see Renderer)
struct CasterIndex {
    index: u32,
};

// must match the CPU layout in Renderer/constants.ts (SHADOW_* constants)
struct ShadowCasterData {
    light_view_projection: mat4x4<f32>,
    tile_rect: vec4f,
    enabled: u32,
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

struct ShadowDataBuffer {
    caster_count: u32,
    _padh0: u32,
    _padh1: u32,
    _padh2: u32,
    casters: array<ShadowCasterData>,
};

// --- group 2: skinning + morph data (same layout as the geometry pass's
// group 3 — see SkinningUploader) ---
struct AnimDrawParams {
    palette_base: u32,
    morph_base: u32,
};

struct JointPalette {
    matrices: array<mat4x4<f32>>,
};

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
var<uniform> caster_index: CasterIndex;

@group(0) @binding(1)
var<storage, read> shadow_data: ShadowDataBuffer;

@group(1) @binding(0)
var<uniform> node_index: NodeIndex;

@group(1) @binding(1)
var<storage, read> node_matrices: NodeMatrices;

@group(2) @binding(0)
var<uniform> anim_draw: AnimDrawParams;

@group(2) @binding(1)
var<storage, read> joint_palette: JointPalette;

@group(2) @binding(2)
var<storage, read> morph_weights: MorphWeights;

// flat f32 array of position deltas: targetCount × vertexCount × vec3
// (the normal-delta section of the geometry pass is ignored here)
@group(2) @binding(3)
var<storage, read> morph_deltas: array<f32>;

@group(2) @binding(4)
var<uniform> morph_mesh_params: MorphMeshParams;

@vertex
fn vertex_main(vert: VertexInput) -> @builtin(position) vec4f {
    var position = vert.position;

    if (MORPH_COUNT > 0u) {
        let vcount = morph_mesh_params.vertex_count;
        let vi = vert.vertex_idx;
        for (var t = 0u; t < MORPH_COUNT; t = t + 1u) {
            let w = morph_weights.blocks[anim_draw.morph_base * 2u + t / 4u][t % 4u];
            if (w != 0.0) {
                let p_off = (t * vcount + vi) * 3u;
                position = position + w * float3(morph_deltas[p_off], morph_deltas[p_off + 1u], morph_deltas[p_off + 2u]);
            }
        }
    }

    let light_view_projection = shadow_data.casters[caster_index.index].light_view_projection;

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
        return light_view_projection * skin_mat * float4(position, 1.0);
    }

    return light_view_projection * node_matrices.matrices[node_index.index] * float4(position, 1.0);
};
