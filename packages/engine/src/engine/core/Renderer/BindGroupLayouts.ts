/**
 * Every bind-group layout and pipeline layout of the renderer, created once at
 * init. Layouts carry no ordering constraints (only the bind groups that use
 * them do), so this module has a single dependency: the device.
 *
 * Bind group slots of the lighting pipeline (maxBindGroups defaults to 4, all
 * in use):
 *   0 — uniforms (view + debug params), shared by every pass
 *   1 — G-buffer textures
 *   2 — light storage buffers
 *   3 — shadow atlas + shadow data + cluster culling results + IBL (merged)
 */
export class BindGroupLayouts {
    readonly uniforms: GPUBindGroupLayout
    readonly nodeParams: GPUBindGroupLayout
    readonly material: GPUBindGroupLayout
    readonly lights: GPUBindGroupLayout
    readonly gBuffer: GPUBindGroupLayout
    readonly post: GPUBindGroupLayout
    readonly fxaa: GPUBindGroupLayout
    readonly shadowData: GPUBindGroupLayout
    readonly shadow: GPUBindGroupLayout
    readonly cullLights: GPUBindGroupLayout
    readonly clusterCompute: GPUBindGroupLayout
    readonly iblEnv: GPUBindGroupLayout
    readonly iblCubeOut: GPUBindGroupLayout
    readonly iblLutOut: GPUBindGroupLayout

    readonly geometryPipelineLayout: GPUPipelineLayout
    readonly lightingPipelineLayout: GPUPipelineLayout
    readonly postPipelineLayout: GPUPipelineLayout
    readonly fxaaPipelineLayout: GPUPipelineLayout
    readonly shadowPipelineLayout: GPUPipelineLayout
    readonly cullingPipelineLayout: GPUPipelineLayout
    readonly iblCubePipelineLayout: GPUPipelineLayout
    readonly iblLutPipelineLayout: GPUPipelineLayout

    constructor(device: GPUDevice) {
        // COMPUTE visibility included: the light-culling pass reads the view params
        this.uniforms = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility:
                        GPUShaderStage.VERTEX |
                        GPUShaderStage.FRAGMENT |
                        GPUShaderStage.COMPUTE,
                    buffer: { type: 'uniform' },
                },
                {
                    binding: 1,
                    visibility:
                        GPUShaderStage.VERTEX |
                        GPUShaderStage.FRAGMENT |
                        GPUShaderStage.COMPUTE,
                    buffer: { type: 'uniform' },
                },
            ],
        })

        // group 1 of the geometry and shadow pipelines: the per-draw node
        // index (dynamic offset into a slot buffer) selecting this node's
        // world matrix in the shared storage buffer
        this.nodeParams = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                        hasDynamicOffset: true,
                        minBindingSize: 4,
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        const sampleType = 'float'

        this.material = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform',
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 6,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                        viewDimension: 'cube',
                    },
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType,
                    },
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 9,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 10,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 11,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 13,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 14,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
            ],
        })

        this.lights = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        minBindingSize: 0,
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        minBindingSize: 0,
                    },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'read-only-storage',
                        minBindingSize: 0,
                    },
                },
            ],
        })

        this.gBuffer = device.createBindGroupLayout({
            label: 'gBufferBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'depth' },
                },
            ],
        })

        // group 0 is shared with the geometry/lighting passes (view + debug
        // params); group 1 carries only the HDR texture
        this.post = device.createBindGroupLayout({
            label: 'post bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float' },
                },
            ],
        })

        // FXAA reads the tonemapped LDR target; a filtering sampler is required
        // because its taps land between pixels
        this.fxaa = device.createBindGroupLayout({
            label: 'fxaa bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'filtering' },
                },
            ],
        })

        // group 0 of the shadow pipelines (dynamic-offset caster index + data storage)
        this.shadowData = device.createBindGroupLayout({
            label: 'shadow data bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform',
                        hasDynamicOffset: true,
                        minBindingSize: 4,
                    },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        // group 3 of the lighting pipeline (atlas + comparison sampler + data +
        // cluster counts/indices + IBL — merged because maxBindGroups defaults to 4)
        this.shadow = device.createBindGroupLayout({
            label: 'shadow bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'depth' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'comparison' },
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'read-only-storage' },
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'read-only-storage' },
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: { type: 'read-only-storage' },
                },
                // image-based lighting: irradiance cube, roughness-prefiltered
                // cube, split-sum BRDF LUT and their shared trilinear sampler
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float', viewDimension: 'cube' },
                },
                {
                    binding: 6,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float', viewDimension: 'cube' },
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: { sampleType: 'float', viewDimension: '2d' },
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: { type: 'filtering' },
                },
            ],
        })

        this.cullLights = device.createBindGroupLayout({
            label: 'cull lights bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'read-only-storage' },
                },
            ],
        })

        this.clusterCompute = device.createBindGroupLayout({
            label: 'cluster compute bind group layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'storage' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: { type: 'storage' },
                },
            ],
        })

        this.iblEnv = device.createBindGroupLayout({
            label: 'ibl env source layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: { sampleType: 'float', viewDimension: 'cube' },
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    sampler: { type: 'filtering' },
                },
            ],
        })

        this.iblCubeOut = device.createBindGroupLayout({
            label: 'ibl cube output layout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format: 'rgba8unorm',
                        viewDimension: '2d-array',
                    },
                },
            ],
        })

        this.iblLutOut = device.createBindGroupLayout({
            label: 'ibl brdf lut output layout',
            entries: [
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {
                        access: 'write-only',
                        format: 'rgba16float',
                        viewDimension: '2d',
                    },
                },
            ],
        })

        this.geometryPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.uniforms, this.nodeParams, this.material],
        })

        this.lightingPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [
                this.uniforms,
                this.gBuffer,
                this.lights,
                this.shadow,
            ],
        })

        this.postPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.uniforms, this.post],
        })

        this.fxaaPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.uniforms, this.fxaa],
        })

        this.shadowPipelineLayout = device.createPipelineLayout({
            label: 'shadow render pipeline layout',
            bindGroupLayouts: [this.shadowData, this.nodeParams],
        })

        this.cullingPipelineLayout = device.createPipelineLayout({
            label: 'light culling pipeline layout',
            bindGroupLayouts: [
                this.uniforms,
                this.cullLights,
                this.clusterCompute,
            ],
        })

        this.iblCubePipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.iblEnv, this.iblCubeOut],
        })

        // the LUT needs no environment input, but group 0 is part of its layout
        // and must still be bound at dispatch time
        this.iblLutPipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [this.iblEnv, this.iblLutOut],
        })
    }
}
