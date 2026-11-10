import { type TAntiAliasing, type TRenderOutputSource } from '../../types'
import { type BindGroupLayouts } from './BindGroupLayouts'
import {
    GPU_QUERY_COUNT_FULL,
    GPU_QUERY_COUNT_NO_FXAA,
    type GpuTimer,
} from './GpuTimer'
import { type RenderTargets } from './RenderTargets'
import { type StagingBuffers } from './StagingBuffers'
import { VIEW_PARAMS_BUFFER_SIZE } from './constants'

export type TPassKind =
    'geometry' | 'shadow' | 'culling' | 'lighting' | 'skybox' | 'post' | 'fxaa'

// pass order: geometry (G-buffer) → shadow (atlas tiles) → culling (compute)
// → lighting (HDR) → skybox (into HDR) → tonemap (LDR or swapchain) → fxaa
const BASE_PASSES: TPassKind[] = [
    'geometry',
    'shadow',
    'culling',
    'lighting',
    'skybox',
    'post',
]

/**
 * The resolved frame: the ordered pass list, every pass descriptor and the
 * group-0 uniform buffers (view + debug params). Rebuilt when a *setting*
 * changes (anti-aliasing mode, GPU-timing support) — never per frame; the
 * only per-frame mutation is the swapchain attachment view. `render()`
 * iterates `passes` with no configuration branches.
 */
export class FramePlan {
    readonly passes: TPassKind[] = []
    /** timestamps this frame produces (the fxaa pass adds 2) */
    queryCount = GPU_QUERY_COUNT_NO_FXAA
    fxaaTimed = false

    readonly viewParamsBuffer: GPUBuffer
    readonly debugParamsBuffer: GPUBuffer
    readonly viewParamsBindGroup: GPUBindGroup

    geometryPassDescriptor!: GPURenderPassDescriptor
    shadowPassDescriptor!: GPURenderPassDescriptor
    cullingPassDescriptor!: GPUComputePassDescriptor
    lightingPassDescriptor!: GPURenderPassDescriptor
    skyboxPassDescriptor!: GPURenderPassDescriptor
    postPassDescriptor!: GPURenderPassDescriptor
    fxaaPassDescriptor!: GPURenderPassDescriptor

    #device: GPUDevice
    #targets: RenderTargets
    #staging: StagingBuffers
    #gpuTimer: GpuTimer
    #fxaaEnabled = true
    // held so the swapchain view can be reassigned without `as any` casts
    #postAttachment!: GPURenderPassColorAttachment
    #fxaaAttachment!: GPURenderPassColorAttachment

    constructor(
        device: GPUDevice,
        targets: RenderTargets,
        layouts: BindGroupLayouts,
        staging: StagingBuffers,
        gpuTimer: GpuTimer,
        antiAliasing: TAntiAliasing
    ) {
        this.#device = device
        this.#targets = targets
        this.#staging = staging
        this.#gpuTimer = gpuTimer

        this.viewParamsBuffer = device.createBuffer({
            label: 'view params buffer',
            size: VIEW_PARAMS_BUFFER_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.debugParamsBuffer = device.createBuffer({
            label: 'debug params buffer',
            size: 8,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        this.viewParamsBindGroup = device.createBindGroup({
            layout: layouts.uniforms,
            entries: [
                { binding: 0, resource: { buffer: this.viewParamsBuffer } },
                { binding: 1, resource: { buffer: this.debugParamsBuffer } },
            ],
        })

        this.rebuild(antiAliasing)
    }

    /** resolves a settings change into the pass list and descriptors */
    rebuild(antiAliasing: TAntiAliasing) {
        this.#fxaaEnabled = antiAliasing === 'fxaa'
        const querySet = this.#gpuTimer.querySet
        const timestampWrites = (beginIndex: number) =>
            querySet
                ? {
                      querySet,
                      beginningOfPassWriteIndex: beginIndex,
                      endOfPassWriteIndex: beginIndex + 1,
                  }
                : undefined

        const targets = this.#targets

        this.#postAttachment = {
            // swapchain when FXAA is off, postColor when it is on (set below)
            view: null as unknown as GPUTextureView,
            loadOp: 'clear',
            clearValue: [0.0, 0.0, 0.0, 1.0],
            storeOp: 'store',
        }
        this.#fxaaAttachment = {
            view: null as unknown as GPUTextureView, // swap chain, assigned per frame
            loadOp: 'clear',
            clearValue: [0.0, 0.0, 0.0, 1.0],
            storeOp: 'store',
        }

        // attachment order must match GBufferOutput @location order in testShader.wgsl.
        // 4 targets: WebGPU's default maxColorAttachmentBytesPerSample is 32 and counts
        // each attachment 8-byte-aligned — occlusion is packed into metallicRoughness .r
        this.geometryPassDescriptor = {
            label: 'geometry pass descriptor',
            colorAttachments: [
                {
                    view: targets.albedo,
                    loadOp: 'clear',
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store',
                },
                {
                    view: targets.normal,
                    loadOp: 'clear',
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store',
                },
                {
                    view: targets.metallicRoughness,
                    loadOp: 'clear',
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store',
                },
                {
                    view: targets.emission,
                    loadOp: 'clear',
                    clearValue: [0.0, 0.0, 0.0, 0.0],
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: targets.depth,
                depthLoadOp: 'clear',
                depthClearValue: 1.0,
                depthStoreOp: 'store',
            },
            timestampWrites: timestampWrites(0),
        }

        this.shadowPassDescriptor = {
            label: 'shadow pass descriptor',
            colorAttachments: [],
            depthStencilAttachment: {
                view: targets.shadowAtlasView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
            },
            timestampWrites: timestampWrites(2),
        }

        this.cullingPassDescriptor = {
            label: 'light culling compute pass',
            timestampWrites: timestampWrites(4),
        }

        // the lighting pass renders into the HDR target and the post pass
        // tonemaps that into the swapchain, so this view is static
        this.lightingPassDescriptor = {
            label: 'lighting pass descriptor',
            colorAttachments: [
                {
                    view: targets.litColor,
                    loadOp: 'clear',
                    clearValue: [0.0, 0.0, 0.0, 1.0],
                    storeOp: 'store',
                },
            ],
            timestampWrites: timestampWrites(6),
        }

        this.skyboxPassDescriptor = {
            label: 'skybox render pass',
            colorAttachments: [
                {
                    // static: the sky composites into the HDR target, which the
                    // tonemap pass then reads
                    view: targets.litColor,
                    loadOp: 'load', // lighting result is already on the target
                    storeOp: 'store',
                },
            ],
            depthStencilAttachment: {
                view: targets.depth,
                depthLoadOp: 'load',
                depthStoreOp: 'store',
            },
            timestampWrites: timestampWrites(8),
        }

        this.postPassDescriptor = {
            label: 'post pass descriptor',
            colorAttachments: [this.#postAttachment],
            timestampWrites: timestampWrites(10),
        }

        this.fxaaPassDescriptor = {
            label: 'fxaa pass descriptor',
            colorAttachments: [this.#fxaaAttachment],
            timestampWrites: timestampWrites(12),
        }

        // tonemap writes the LDR target when FXAA follows it, otherwise straight
        // to the swapchain — so disabling AA skips a pass instead of running it
        if (this.#fxaaEnabled) {
            this.#postAttachment.view = targets.postColor
        }

        this.passes.length = 0
        this.passes.push(...BASE_PASSES)
        if (this.#fxaaEnabled) {
            this.passes.push('fxaa')
        }
        this.queryCount = this.#fxaaEnabled
            ? GPU_QUERY_COUNT_FULL
            : GPU_QUERY_COUNT_NO_FXAA
        this.fxaaTimed = this.#fxaaEnabled
    }

    /** the only per-frame descriptor mutation: where the final pass presents */
    setSwapchainView(view: GPUTextureView) {
        if (this.#fxaaEnabled) {
            this.#fxaaAttachment.view = view
        } else {
            this.#postAttachment.view = view
        }
    }

    /** uploads the debug params — called only when outputSource changes */
    setOutputSource(outputSource: TRenderOutputSource) {
        this.#staging.debugParamsView.setUint32(0, outputSource, true)
        this.#device.queue.writeBuffer(
            this.debugParamsBuffer,
            0,
            this.#staging.debugParams
        )
    }

    /** uploads the view-params staging buffer filled during the frame setup */
    flushViewParams() {
        this.#device.queue.writeBuffer(
            this.viewParamsBuffer,
            0,
            this.#staging.viewParams
        )
    }
}
