import { type BindGroupLayouts } from './BindGroupLayouts'
import { type RendererContext } from './RendererContext'
import {
    DEFAULT_SHADOW_DEPTH_FORMAT,
    HDR_TARGET_FORMAT,
    IBL_BRDF_LUT_SIZE,
    IBL_IRRADIANCE_SIZE,
    IBL_PREFILTER_MIP_LEVELS,
    IBL_PREFILTER_SIZE,
    SHADOW_ATLAS_SIZE,
} from './constants'

/**
 * All render targets and their views: the deferred G-buffer, the HDR/LDR post
 * targets, the shadow atlas and the IBL convolution targets. Everything here
 * is created once at init (no resize support — the canvas size is fixed), and
 * the bind groups that reference *only* these targets live here too.
 */
export class RenderTargets {
    readonly swapChainFormat: GPUTextureFormat
    readonly depthTextureFormat: GPUTextureFormat

    // --- G-buffer (geometry pass MRT + depth) ---
    readonly albedo: GPUTextureView
    readonly normal: GPUTextureView
    readonly depth: GPUTextureView
    readonly metallicRoughness: GPUTextureView
    readonly emission: GPUTextureView
    /** linear HDR target of the lighting pass; the skybox composites into it too */
    readonly litColor: GPUTextureView
    /** tonemapped LDR result the FXAA pass reads (luma in .a) */
    readonly postColor: GPUTextureView

    // --- shadow atlas ---
    readonly shadowAtlasTexture: GPUTexture
    readonly shadowAtlasView: GPUTextureView
    readonly shadowDepthSampler: GPUSampler

    // --- image-based lighting targets (contents rewritten by Environment) ---
    readonly iblIrradianceTexture: GPUTexture
    readonly iblPrefilteredTexture: GPUTexture
    readonly iblBrdfLutTexture: GPUTexture
    // cube views for the lighting pass; the compute writes go through
    // 2d-array views because textureStore cannot target a cube view
    readonly iblIrradianceView: GPUTextureView
    readonly iblPrefilteredView: GPUTextureView
    readonly iblBrdfLutView: GPUTextureView
    // trilinear, so roughness picks between the prefilter mip levels
    readonly iblSampler: GPUSampler

    readonly fxaaSampler: GPUSampler

    // --- bind groups over the targets above (all static) ---
    readonly gBufferBindGroup: GPUBindGroup
    readonly postBindGroup: GPUBindGroup
    readonly fxaaBindGroup: GPUBindGroup

    constructor(
        device: GPUDevice,
        context: RendererContext,
        layouts: BindGroupLayouts
    ) {
        this.swapChainFormat = context.swapChainFormat
        this.depthTextureFormat = context.depthTextureFormat

        const createTextureView = (format?: GPUTextureFormat) =>
            device
                .createTexture({
                    size: [context.canvas.width, context.canvas.height],
                    usage:
                        GPUTextureUsage.RENDER_ATTACHMENT |
                        GPUTextureUsage.TEXTURE_BINDING,
                    format: format ?? context.swapChainFormat,
                })
                .createView()

        this.depth = createTextureView(context.depthTextureFormat)
        this.normal = createTextureView('rgba16float')
        this.albedo = createTextureView()
        this.emission = createTextureView()
        this.metallicRoughness = createTextureView()
        // HDR target of the lighting pass, consumed by the tonemapping post pass.
        // Not part of the geometry MRT set, so it does not count against
        // maxColorAttachmentBytesPerSample; rgba16float keeps intensities above 1.
        this.litColor = createTextureView(HDR_TARGET_FORMAT)
        // tonemapped LDR result: the FXAA pass reads this (luma in .a) and writes
        // the swapchain. Skipped when anti-aliasing is off — the tonemap pass then
        // targets the swapchain directly.
        this.postColor = createTextureView()

        this.shadowAtlasTexture = device.createTexture({
            label: 'shadowDepthTexture',
            size: [SHADOW_ATLAS_SIZE, SHADOW_ATLAS_SIZE, 1],
            usage:
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.TEXTURE_BINDING,
            format: DEFAULT_SHADOW_DEPTH_FORMAT,
        })
        this.shadowAtlasView = this.shadowAtlasTexture.createView()
        this.shadowDepthSampler = device.createSampler({
            compare: 'less',
            label: 'shadow depth sampler',
        })

        this.iblIrradianceTexture = device.createTexture({
            label: 'ibl irradiance',
            dimension: '2d',
            size: [IBL_IRRADIANCE_SIZE, IBL_IRRADIANCE_SIZE, 6],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING,
        })

        this.iblPrefilteredTexture = device.createTexture({
            label: 'ibl prefiltered',
            dimension: '2d',
            size: [IBL_PREFILTER_SIZE, IBL_PREFILTER_SIZE, 6],
            format: 'rgba8unorm',
            mipLevelCount: IBL_PREFILTER_MIP_LEVELS,
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING,
        })

        this.iblBrdfLutTexture = device.createTexture({
            label: 'ibl brdf lut',
            dimension: '2d',
            size: [IBL_BRDF_LUT_SIZE, IBL_BRDF_LUT_SIZE],
            // rgba16float, not rg16float: rg16float is not storage-capable in
            // WebGPU (createTexture rejects STORAGE_BINDING for it), and the
            // extra precision helps the envBRDF scale/bias terms
            format: 'rgba16float',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.STORAGE_BINDING,
        })

        this.iblIrradianceView = this.iblIrradianceTexture.createView({
            dimension: 'cube',
        })
        this.iblPrefilteredView = this.iblPrefilteredTexture.createView({
            dimension: 'cube',
        })
        this.iblBrdfLutView = this.iblBrdfLutTexture.createView()

        this.iblSampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
        })

        this.fxaaSampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        })

        // static — G-buffer views never change (no resize support)
        this.gBufferBindGroup = device.createBindGroup({
            label: 'gBuffer bindgroup',
            layout: layouts.gBuffer,
            entries: [
                { binding: 0, resource: this.albedo },
                { binding: 1, resource: this.normal },
                { binding: 2, resource: this.metallicRoughness },
                { binding: 3, resource: this.emission },
                { binding: 4, resource: this.depth },
            ],
        })

        this.postBindGroup = device.createBindGroup({
            label: 'post bind group',
            layout: layouts.post,
            entries: [{ binding: 0, resource: this.litColor }],
        })

        this.fxaaBindGroup = device.createBindGroup({
            label: 'fxaa bind group',
            layout: layouts.fxaa,
            entries: [
                { binding: 0, resource: this.postColor },
                { binding: 1, resource: this.fxaaSampler },
            ],
        })
    }
}
