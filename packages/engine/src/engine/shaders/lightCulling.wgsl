alias float4 = vec4<f32>;
alias float3 = vec3<f32>;
alias float2 = vec2<f32>;

// Clustered (froxel) light culling — Phase 3 of .qwen/proposals/lighting-upgrade/.
// Grid: CLUSTER_TILE × CLUSTER_TILE screen tiles × CLUSTER_DEPTH_SLICES log
// depth slices; cluster id = (tileX + tileY·tilesX)·SLICES + slice.
// Must match CLUSTER_* in Renderer/constants.ts and lighting.wgsl.
const CLUSTER_TILE = 16u;
const CLUSTER_SLICES = 16u;
const CLUSTER_MAX_LIGHTS = 64u;

struct ViewParams {
    camera_projection_matrix: mat4x4<f32>,
    camera_view_matrix: mat4x4<f32>,
    camera_position: vec4f,
    ambient_light_color: vec4f,
    inverse_view_projection: mat4x4<f32>,
    camera_near: f32,
    camera_far: f32,
    cluster_tiles_x: u32,
    cluster_tiles_y: u32,
    viewport_width: u32,
    viewport_height: u32,
};

// compact CPU-side light data for culling (48 B per entry)
struct CullLight {
    position: float3,
    range: f32,
    direction: float3,
    cos_cutoff: f32, // -2.0 marks a point light (no cone test)
    type_and_index: u32, // (type << 16) | index; type 0 = point, 1 = spot
    _pad0: u32,
    _pad1: u32,
    _pad2: u32,
};

struct CullLightsBuffer {
    count: u32,
    _padh0: u32,
    _padh1: u32,
    _padh2: u32,
    lights: array<CullLight>,
};

@group(0) @binding(0)
var<uniform> view_params: ViewParams;

@group(1) @binding(0)
var<storage, read> cull_lights: CullLightsBuffer;

@group(2) @binding(0)
var<storage, read_write> cluster_counts: array<atomic<u32>>;

@group(2) @binding(1)
var<storage, read_write> cluster_indices: array<u32>;

@compute @workgroup_size(64)
fn reset_main(@builtin(global_invocation_id) gid: vec3u) {
    if (gid.x >= arrayLength(&cluster_counts)) {
        return;
    }
    atomicStore(&cluster_counts[gid.x], 0u);
}

// NDC z (WebGPU [0,1]) for a positive view distance d
fn ndc_z(d: f32) -> f32 {
    let n = view_params.camera_near;
    let f = view_params.camera_far;
    return f / (f - n) - (n * f / (f - n)) / d;
}

@compute @workgroup_size(64)
fn cull_main(@builtin(global_invocation_id) gid: vec3u) {
    let cluster = gid.x;
    if (cluster >= arrayLength(&cluster_counts)) {
        return;
    }

    let tiles_x = view_params.cluster_tiles_x;
    let slice = cluster % CLUSTER_SLICES;
    let tile = cluster / CLUSTER_SLICES;
    let tile_x = tile % tiles_x;
    let tile_y = tile / tiles_x;

    // log-distributed slice depth range
    let near = view_params.camera_near;
    let ratio = view_params.camera_far / near;
    let d0 = near * pow(ratio, f32(slice) / f32(CLUSTER_SLICES));
    let d1 = near * pow(ratio, f32(slice + 1u) / f32(CLUSTER_SLICES));

    // tile NDC extents (framebuffer y is down, NDC y is up)
    let dim_x = f32(view_params.viewport_width);
    let dim_y = f32(view_params.viewport_height);
    let x0 = f32(tile_x * CLUSTER_TILE) / dim_x * 2.0 - 1.0;
    let x1 = f32(min((tile_x + 1u) * CLUSTER_TILE, view_params.viewport_width)) / dim_x * 2.0 - 1.0;
    let y0 = 1.0 - f32(tile_y * CLUSTER_TILE) / dim_y * 2.0;
    let y1 = 1.0 - f32(min((tile_y + 1u) * CLUSTER_TILE, view_params.viewport_height)) / dim_y * 2.0;
    let z0 = ndc_z(d0);
    let z1 = ndc_z(d1);

    // conservative bounding sphere of the froxel: unproject the 8 corners
    var points = array<float3, 8>();
    var idx = 0u;
    for (var cx = 0u; cx < 2u; cx = cx + 1u) {
        for (var cy = 0u; cy < 2u; cy = cy + 1u) {
            for (var cz = 0u; cz < 2u; cz = cz + 1u) {
                let ndc = float3(
                    select(x0, x1, cx == 1u),
                    select(y0, y1, cy == 1u),
                    select(z0, z1, cz == 1u)
                );
                let homogeneous = view_params.inverse_view_projection * float4(ndc, 1.0);
                points[idx] = homogeneous.xyz / homogeneous.w;
                idx = idx + 1u;
            }
        }
    }
    var center = float3(0.0);
    for (var i = 0u; i < 8u; i = i + 1u) {
        center = center + points[i];
    }
    center = center / 8.0;
    var radius = 0.0;
    for (var i = 0u; i < 8u; i = i + 1u) {
        radius = max(radius, distance(points[i], center));
    }

    let light_count = cull_lights.count;
    for (var li = 0u; li < light_count; li = li + 1u) {
        let light = cull_lights.lights[li];

        // sphere test (light influence sphere vs froxel bounding sphere)
        if (distance(light.position, center) > light.range + radius) {
            continue;
        }

        // spot cone test (cos_cutoff <= -1.0 marks point lights → skip)
        if (light.cos_cutoff > -1.0) {
            let to_center = center - light.position;
            let d = length(to_center);
            if (d > 0.0001) {
                let cos_angle = dot(to_center / d, light.direction);
                let sin_half = sqrt(max(0.0, 1.0 - light.cos_cutoff * light.cos_cutoff));
                let r_over_d = min(1.0, radius / d);
                // cos(coneHalfAngle + asin(radius/d)) — conservative cone/sphere test
                let threshold = light.cos_cutoff * sqrt(max(0.0, 1.0 - r_over_d * r_over_d)) - sin_half * r_over_d;
                if (cos_angle < threshold) {
                    continue;
                }
            }
        }

        let slot = atomicAdd(&cluster_counts[cluster], 1u);
        if (slot < CLUSTER_MAX_LIGHTS) {
            cluster_indices[cluster * CLUSTER_MAX_LIGHTS + slot] = light.type_and_index;
        }
    }
}
