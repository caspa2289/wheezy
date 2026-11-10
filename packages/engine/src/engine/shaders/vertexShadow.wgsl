alias float4 = vec4<f32>;
alias float3 = vec3<f32>;

struct VertexInput {
    @location(0) position: float3,
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

@group(0) @binding(0)
var<uniform> caster_index: CasterIndex;

@group(0) @binding(1)
var<storage, read> shadow_data: ShadowDataBuffer;

@group(1) @binding(0)
var<uniform> node_index: NodeIndex;

@group(1) @binding(1)
var<storage, read> node_matrices: NodeMatrices;

@vertex
fn vertex_main(vert: VertexInput) -> @builtin(position) vec4f {
    return shadow_data.casters[caster_index.index].light_view_projection * node_matrices.matrices[node_index.index] * float4(vert.position, 1.0);
};
