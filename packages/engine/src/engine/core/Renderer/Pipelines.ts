import { type BindGroupLayouts } from './BindGroupLayouts'
import { type RenderTargets } from './RenderTargets'
import { HDR_TARGET_FORMAT } from './constants'
import { type GLTFAccessor } from '../../types'
import shaderCode from '../../shaders/testShader.wgsl'
import lightingShaderCode from '../../shaders/lighting.wgsl'
import lightCullingShaderCode from '../../shaders/lightCulling.wgsl'
import shadowShaderCode from '../../shaders/vertexShadow.wgsl'
import skyboxShaderCode from '../../shaders/skybox.wgsl'
import postShaderCode from '../../shaders/post.wgsl'
import fxaaShaderCode from '../../shaders/fxaa.wgsl'
import iblShaderCode from '../../shaders/ibl.wgsl'
import {
    cubePositionOffset,
    cubeUVOffset,
    cubeVertexSize,
} from '../../primitives/cube'

/** a cached shadow pipeline plus its stable id for draw-list sorting */
export interface ShadowPipelineEntry {
    pipeline: GPURenderPipeline
    sortId: number
}

/**
 * Skinning/morph variant selector shared by the geometry and shadow
 * pipelines — both compile the same WGSL override constants
 * (SKINNING, MORPH_COUNT) into per-mesh pipeline variants.
 */
export interface AnimPipelineOptions {
    skinning: boolean
    morphCount: number
    joints?: GLTFAccessor
    weights?: GLTFAccessor
}

// Dawn's static-use analysis does not fold the SKINNING override, so the
// joints/weights vertex attributes are statically used by every variant —
// every pipeline declares both slots and unskinned meshes bind zero-filled
// dummy buffers (out-of-range vertex fetches read as zero).
const DUMMY_JOINTS_FORMAT: GPUVertexFormat = 'uint8x4'
const DUMMY_WEIGHTS_FORMAT: GPUVertexFormat = 'unorm8x4'

const skinVertexBuffers = (
    options: AnimPipelineOptions | undefined,
    firstLocation: number
): GPUVertexBufferLayout[] => {
    const skinning = options?.skinning ?? false
    return [
        {
            arrayStride: skinning ? options!.joints!.byteStride : 4,
            attributes: [
                {
                    format: skinning
                        ? options!.joints!.elementType
                        : DUMMY_JOINTS_FORMAT,
                    offset: 0,
                    shaderLocation: firstLocation,
                },
            ],
        },
        {
            arrayStride: skinning ? options!.weights!.byteStride : 4,
            attributes: [
                {
                    format: skinning
                        ? options!.weights!.elementType
                        : DUMMY_WEIGHTS_FORMAT,
                    offset: 0,
                    shaderLocation: firstLocation + 1,
                },
            ],
        },
    ]
}

const animVariantKey = (options?: AnimPipelineOptions) => {
    const [joints, weights] = skinVertexBuffers(options, 4) as [
        GPUVertexBufferLayout,
        GPUVertexBufferLayout,
    ]
    return `${options?.skinning ? 1 : 0}:${options?.morphCount ?? 0}:${
        joints.arrayStride
    }:${joints.attributes[0]!.format}:${weights.arrayStride}:${
        weights.attributes[0]!.format
    }`
}

/**
 * Every shader module and pipeline of the renderer. The geometry and shadow
 * pipelines are variant caches keyed by vertex format plus the skinning /
 * morph-target overrides — meshes almost always share `float32x3` positions
 * and are unskinned, so in practice each cache holds ~1 entry per scene.
 */
export class Pipelines {
    readonly lighting: GPURenderPipeline
    readonly post: GPURenderPipeline
    readonly fxaa: GPURenderPipeline
    readonly skybox: GPURenderPipeline
    readonly cullReset: GPUComputePipeline
    readonly cull: GPUComputePipeline
    readonly iblIrradiance: GPUComputePipeline
    readonly iblPrefilter: GPUComputePipeline
    readonly iblBrdfLut: GPUComputePipeline

    #device: GPUDevice
    #layouts: BindGroupLayouts
    #targets: RenderTargets
    #geometryShaderModule: GPUShaderModule
    #shadowShaderModule: GPUShaderModule
    #geometryPipelineCache = new Map<string, GPURenderPipeline>()
    #shadowPipelineCache = new Map<string, ShadowPipelineEntry>()

    constructor(
        device: GPUDevice,
        layouts: BindGroupLayouts,
        targets: RenderTargets
    ) {
        this.#device = device
        this.#layouts = layouts
        this.#targets = targets

        this.#geometryShaderModule = device.createShaderModule({
            label: 'geometry shader',
            code: shaderCode,
        })
        const lightingShaderModule = device.createShaderModule({
            label: 'lighting shader',
            code: lightingShaderCode,
        })
        const postShaderModule = device.createShaderModule({
            label: 'post shader',
            code: postShaderCode,
        })
        const fxaaShaderModule = device.createShaderModule({
            label: 'fxaa shader',
            code: fxaaShaderCode,
        })
        const cullingShaderModule = device.createShaderModule({
            label: 'light culling shader',
            code: lightCullingShaderCode,
        })
        const skyboxShaderModule = device.createShaderModule({
            label: 'skybox shader',
            code: skyboxShaderCode,
        })
        const iblShaderModule = device.createShaderModule({
            label: 'ibl shader',
            code: iblShaderCode,
        })
        this.#shadowShaderModule = device.createShaderModule({
            label: 'shadow shader module',
            code: shadowShaderCode,
        })

        this.lighting = device.createRenderPipeline({
            label: 'lighting render pipeline',
            layout: layouts.lightingPipelineLayout,
            vertex: {
                module: lightingShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: lightingShaderModule,
                entryPoint: 'fragment_main',
                // linear HDR — the post pass tonemaps this into the swapchain
                targets: [{ format: HDR_TARGET_FORMAT }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        })

        this.post = device.createRenderPipeline({
            label: 'post render pipeline',
            layout: layouts.postPipelineLayout,
            vertex: {
                module: postShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: postShaderModule,
                entryPoint: 'fragment_main',
                targets: [{ format: targets.swapChainFormat }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        })

        this.fxaa = device.createRenderPipeline({
            label: 'fxaa render pipeline',
            layout: layouts.fxaaPipelineLayout,
            vertex: {
                module: fxaaShaderModule,
                entryPoint: 'vertex_main',
                buffers: [],
            },
            fragment: {
                module: fxaaShaderModule,
                entryPoint: 'fragment_main',
                targets: [{ format: targets.swapChainFormat }],
            },
            primitive: {
                topology: 'triangle-list',
            },
        })

        this.skybox = device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: skyboxShaderModule,
                buffers: [
                    {
                        arrayStride: cubeVertexSize,
                        attributes: [
                            {
                                shaderLocation: 0,
                                offset: cubePositionOffset,
                                format: 'float32x4',
                            },
                            {
                                shaderLocation: 1,
                                offset: cubeUVOffset,
                                format: 'float32x2',
                            },
                        ],
                    },
                ],
            },
            fragment: {
                module: skyboxShaderModule,
                targets: [
                    {
                        // the sky is composited into the HDR target so the post
                        // chain (tonemap + FXAA) sees the geometry/sky silhouette
                        format: HDR_TARGET_FORMAT,
                    },
                ],
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'front',
            },
            depthStencil: {
                // skybox fragments are forced to depth 1.0 in skybox.wgsl, so
                // 'less-equal' against the G-buffer depth passes only where the
                // depth is still the 1.0 clear value (no geometry)
                depthWriteEnabled: false,
                depthCompare: 'less-equal',
                format: targets.depthTextureFormat,
            },
        })

        this.cullReset = device.createComputePipeline({
            label: 'cluster reset pipeline',
            layout: layouts.cullingPipelineLayout,
            compute: {
                module: cullingShaderModule,
                entryPoint: 'reset_main',
            },
        })

        this.cull = device.createComputePipeline({
            label: 'light culling pipeline',
            layout: layouts.cullingPipelineLayout,
            compute: {
                module: cullingShaderModule,
                entryPoint: 'cull_main',
            },
        })

        this.iblIrradiance = device.createComputePipeline({
            label: 'ibl irradiance pipeline',
            layout: layouts.iblCubePipelineLayout,
            compute: { module: iblShaderModule, entryPoint: 'irradiance_main' },
        })
        this.iblPrefilter = device.createComputePipeline({
            label: 'ibl prefilter pipeline',
            layout: layouts.iblCubePipelineLayout,
            compute: { module: iblShaderModule, entryPoint: 'prefilter_main' },
        })
        this.iblBrdfLut = device.createComputePipeline({
            label: 'ibl brdf lut pipeline',
            layout: layouts.iblLutPipelineLayout,
            compute: { module: iblShaderModule, entryPoint: 'brdf_lut_main' },
        })
    }

    /**
     * Geometry-pass pipeline variant for one mesh: base 4 vertex buffers plus
     * JOINTS_0/WEIGHTS_0 at slots 4/5 (zero-filled dummies when unskinned —
     * the attributes are statically used in every variant), and the
     * SKINNING/MORPH_COUNT override constants baked in.
     */
    getGeometryPipeline(options?: AnimPipelineOptions): GPURenderPipeline {
        const key = animVariantKey(options)
        const cached = this.#geometryPipelineCache.get(key)
        if (cached) {
            return cached
        }

        const skinning = options?.skinning ?? false
        const morphCount = options?.morphCount ?? 0

        const buffers: GPUVertexBufferLayout[] = [
            {
                arrayStride: 12,
                attributes: [
                    { format: 'float32x3', offset: 0, shaderLocation: 0 },
                ],
            },
            {
                arrayStride: 8,
                attributes: [
                    { format: 'float32x2', offset: 0, shaderLocation: 1 },
                ],
            },
            {
                arrayStride: 12,
                attributes: [
                    { format: 'float32x3', offset: 0, shaderLocation: 2 },
                ],
            },
            {
                arrayStride: 12,
                attributes: [
                    { format: 'float32x3', offset: 0, shaderLocation: 3 },
                ],
            },
            ...skinVertexBuffers(options, 4),
        ]

        const targets = this.#targets
        const pipeline = this.#device.createRenderPipeline({
            label: 'geometry render pipeline',
            layout: this.#layouts.geometryPipelineLayout,
            vertex: {
                module: this.#geometryShaderModule,
                entryPoint: 'vertex_main',
                buffers,
                constants: {
                    SKINNING: skinning ? 1 : 0,
                    MORPH_COUNT: morphCount,
                },
            },
            fragment: {
                module: this.#geometryShaderModule,
                entryPoint: 'fragment_main',
                // order must match the geometry pass descriptor attachments
                targets: [
                    { format: targets.swapChainFormat }, // albedo
                    { format: 'rgba16float' }, // normal
                    { format: targets.swapChainFormat }, // metallicRoughness (+ occlusion in .r)
                    { format: targets.swapChainFormat }, // emission
                ],
            },
            primitive: {
                topology: 'triangle-list',
                stripIndexFormat: undefined,
                cullMode: 'back',
            },
            depthStencil: {
                format: targets.depthTextureFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        })
        this.#geometryPipelineCache.set(key, pipeline)
        return pipeline
    }

    getShadowPipeline(
        elementType: GPUVertexFormat,
        byteStride: number,
        options?: AnimPipelineOptions
    ): ShadowPipelineEntry {
        const key = `${elementType}:${byteStride}:${animVariantKey(options)}`
        const cached = this.#shadowPipelineCache.get(key)
        if (cached) {
            return cached
        }

        const skinning = options?.skinning ?? false
        const morphCount = options?.morphCount ?? 0

        const buffers: GPUVertexBufferLayout[] = [
            {
                arrayStride: byteStride,
                attributes: [
                    { format: elementType, offset: 0, shaderLocation: 0 },
                ],
            },
            // joints/weights at slots 1/2 (matching vertexShadow.wgsl);
            // dummies when unskinned, see skinVertexBuffers
            ...skinVertexBuffers(options, 1),
        ]

        const entry: ShadowPipelineEntry = {
            pipeline: this.#device.createRenderPipeline({
                label: 'shadow render pipeline',
                layout: this.#layouts.shadowPipelineLayout,
                vertex: {
                    module: this.#shadowShaderModule,
                    entryPoint: 'vertex_main',
                    buffers,
                    constants: {
                        SKINNING: skinning ? 1 : 0,
                        MORPH_COUNT: morphCount,
                    },
                },
                depthStencil: {
                    depthWriteEnabled: true,
                    depthCompare: 'less',
                    format: 'depth32float',
                },
                primitive: {
                    topology: 'triangle-list',
                    stripIndexFormat: undefined,
                    cullMode: 'back',
                },
            }),
            sortId: this.#shadowPipelineCache.size + 1,
        }
        this.#shadowPipelineCache.set(key, entry)
        return entry
    }
}
