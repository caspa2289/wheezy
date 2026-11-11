import { mat4, vec3 } from 'wgpu-matrix'
import {
    type IMesh,
    type IRenderer,
    type IRendererProps,
    type IScene,
    RENDER_OUTPUT_SOURCES,
    type TAntiAliasing,
    type TRenderOutputSource,
    type TSkyboxBitmaps,
} from '../../types'
import { LightGizmo } from '../lights/LightGizmo'
import { Profiler } from '../Profiler'
import { BindGroupLayouts } from './BindGroupLayouts'
import { Environment } from './Environment'
import { FramePlan, type TPassKind } from './FramePlan'
import { GpuTimer } from './GpuTimer'
import { LightUploader } from './LightUploader'
import { MeshGpuData } from './MeshGpuData'
import { Pipelines } from './Pipelines'
import { RenderTargets } from './RenderTargets'
import { RendererContext } from './RendererContext'
import { SceneTraversal } from './SceneTraversal'
import { ShadowCasters } from './ShadowCasters'
import { SkinningUploader } from './SkinningUploader'
import { StagingBuffers } from './StagingBuffers'
import {
    ANIM_DRAW_SLOT_SIZE,
    NODE_INDEX_SLOT_SIZE,
    SHADOW_INDEX_SLOT_SIZE,
    VIEW_PARAMS_EXPOSURE_SLOT,
} from './constants'

// per-frame scratch for the view-projection product and its inverse (both
// accept a dst argument — no per-frame allocation)
const scratchViewProjection = mat4.create()
const scratchInverseViewProjection = mat4.create()

/**
 * Renderer orchestration: owns the subsystem instances, wires the two
 * cross-system bind groups, and drives the frame — upload (view params,
 * shadow atlas, lights, culling, skybox), traverse, then iterate the frame
 * plan's resolved pass list. All GPU resources are persistent; a frame
 * creates nothing but the command encoder and the swapchain view.
 */
export class Renderer implements IRenderer {
    #context: RendererContext
    #staging!: StagingBuffers
    #layouts!: BindGroupLayouts
    #targets!: RenderTargets
    #gpuTimer!: GpuTimer
    #pipelines!: Pipelines
    #environment!: Environment
    #lightUploader!: LightUploader
    #shadowCasters!: ShadowCasters
    #skinning!: SkinningUploader
    #meshGpuData!: MeshGpuData
    #traversal!: SceneTraversal
    #framePlan!: FramePlan

    // group 3 of the lighting pipeline: shadow atlas + comparison sampler +
    // shadow data + cluster culling results + IBL, merged into one static bind
    // group (maxBindGroups defaults to 4 and all four are in use)
    #lightingShadowBindGroup!: GPUBindGroup

    #passHandlers!: Record<TPassKind, (encoder: GPUCommandEncoder) => void>
    #frameScene!: IScene
    // reusable dynamic bind-group offsets (one dynamic binding per call)
    #dynamicOffsets = new Uint32Array(1)

    // environment tint and strength for the image-based lighting term — white
    // at full strength means "the skybox lights the scene as authored"
    public ambientLightColor = vec3.create(1, 1, 1)
    public ambientLightIntensity: number = 1
    // applied to the HDR lighting result before tonemapping (1 = unchanged)
    public exposure: number = 1

    #antiAliasing: TAntiAliasing = 'fxaa'
    #outputSource: TRenderOutputSource = RENDER_OUTPUT_SOURCES.DEFAULT

    constructor({ canvas }: IRendererProps) {
        this.#context = new RendererContext(canvas)
    }

    public async init() {
        await this.#context.init()
        const device = this.#context.device

        this.#staging = new StagingBuffers()
        this.#layouts = new BindGroupLayouts(device)
        this.#targets = new RenderTargets(device, this.#context, this.#layouts)
        this.#gpuTimer = new GpuTimer(device, this.#context.gpuTimingSupported)
        this.#pipelines = new Pipelines(device, this.#layouts, this.#targets)
        this.#environment = new Environment(
            device,
            this.#pipelines,
            this.#targets,
            this.#layouts,
            this.#staging
        )
        this.#lightUploader = new LightUploader(
            device,
            this.#layouts,
            this.#staging,
            this.#context.canvas
        )
        this.#shadowCasters = new ShadowCasters(
            device,
            this.#layouts,
            this.#staging
        )
        this.#skinning = new SkinningUploader(
            device,
            this.#layouts,
            this.#staging
        )
        this.#meshGpuData = new MeshGpuData(
            device,
            this.#layouts,
            this.#pipelines,
            this.#environment,
            this.#skinning
        )
        this.#traversal = new SceneTraversal(
            device,
            this.#layouts,
            this.#staging,
            this.#skinning
        )
        this.#framePlan = new FramePlan(
            device,
            this.#targets,
            this.#layouts,
            this.#staging,
            this.#gpuTimer,
            this.#antiAliasing
        )

        // the init ordering constraints are constructor dependencies now:
        // the IBL views exist before this group is built, and so do the
        // cluster buffers and the shadow-data buffer
        this.#lightingShadowBindGroup = device.createBindGroup({
            label: 'shadow bind group',
            layout: this.#layouts.shadow,
            entries: [
                { binding: 0, resource: this.#targets.shadowAtlasView },
                { binding: 1, resource: this.#targets.shadowDepthSampler },
                {
                    binding: 2,
                    resource: { buffer: this.#shadowCasters.dataBuffer },
                },
                {
                    binding: 3,
                    resource: {
                        buffer: this.#lightUploader.clusterCountsBuffer,
                    },
                },
                {
                    binding: 4,
                    resource: {
                        buffer: this.#lightUploader.clusterIndicesBuffer,
                    },
                },
                { binding: 5, resource: this.#targets.iblIrradianceView },
                { binding: 6, resource: this.#targets.iblPrefilteredView },
                { binding: 7, resource: this.#targets.iblBrdfLutView },
                { binding: 8, resource: this.#targets.iblSampler },
            ],
        })

        this.#passHandlers = {
            geometry: this.#encodeGeometryPass,
            shadow: this.#encodeShadowPass,
            culling: this.#encodeCullingPass,
            lighting: this.#encodeLightingPass,
            skybox: this.#encodeSkyboxPass,
            post: this.#encodePostPass,
            fxaa: this.#encodeFxaaPass,
        }

        this.#framePlan.setOutputSource(this.#outputSource)

        await this.#environment.setDefaultSkyBoxTexture()
    }

    public async setDefaultSkyBoxTexture() {
        await this.#environment.setDefaultSkyBoxTexture()
    }

    public setSkyBoxTexture(bitmaps: TSkyboxBitmaps) {
        this.#environment.setSkyBoxTexture(bitmaps)
    }

    public buildRenderPipeline(mesh: IMesh, scene: IScene) {
        this.#meshGpuData.buildRenderPipeline(mesh, scene)
    }

    get device() {
        return this.#context.device
    }

    get adapter() {
        return this.#context.adapter
    }

    get context() {
        return this.#context.context
    }

    get swapChainFormat() {
        return this.#context.swapChainFormat
    }

    get depthTextureFormat() {
        return this.#context.depthTextureFormat
    }

    get lightsBindGroupLayout() {
        return this.#layouts.lights
    }

    get antiAliasing() {
        return this.#antiAliasing
    }

    set antiAliasing(value: TAntiAliasing) {
        this.#antiAliasing = value
        this.#framePlan?.rebuild(value)
    }

    get outputSource() {
        return this.#outputSource
    }

    set outputSource(value: TRenderOutputSource) {
        if (this.#outputSource === value) {
            return
        }
        this.#outputSource = value
        this.#framePlan?.setOutputSource(value)
    }

    public render(deltaTime: number, scene: IScene) {
        const frameStart = performance.now()
        scene.onRender(deltaTime)
        const afterSceneUpdate = performance.now()
        Profiler.sample('sceneUpdate', afterSceneUpdate - frameStart)

        // animation playback runs right after the scene's game loop and
        // before the traversal, so play/stop/tweaks made in onRender apply
        // within the same frame (poses land on the Transforms directly)
        scene.animations.update(deltaTime)
        const afterAnimation = performance.now()
        Profiler.sample('animation', afterAnimation - afterSceneUpdate)

        // attach/detach/re-pin the debug light gizmos before the traversal so
        // a profiler-HUD toggle takes effect this frame (dev-only: the
        // Profiler is disabled in production builds)
        LightGizmo.sync(scene, Profiler.enabled && Profiler.gizmosEnabled)

        this.#frameScene = scene

        const staging = this.#staging
        const floats = staging.viewParamsFloats
        const ints = staging.viewParamsInts

        // inverse view-projection for world-position reconstruction in the
        // deferred lighting pass (float offset 40 — see ViewParams in lighting.wgsl)
        const inverseViewProjection = mat4.inverse(
            mat4.mul(
                scene.camera.projectionMatrix,
                scene.camera.view,
                scratchViewProjection
            ),
            scratchInverseViewProjection
        )

        floats.set(scene.camera.projectionMatrix, 0)
        floats.set(scene.camera.view, 16)
        floats.set(scene.camera.position, 32)
        // environment tint (rgb) and strength (a) for the IBL term
        floats[36] = this.ambientLightColor[0]!
        floats[37] = this.ambientLightColor[1]!
        floats[38] = this.ambientLightColor[2]!
        floats[39] = this.ambientLightIntensity
        floats.set(inverseViewProjection, 40)
        // camera range + cluster grid for the light-culling compute pass
        // (floats 56/57 as f32, 58–61 as u32 — see ViewParams in lightCulling.wgsl)
        floats[56] = scene.camera.zNear
        floats[57] = scene.camera.zFar
        ints[58] = this.#lightUploader.clusterTilesX
        ints[59] = this.#lightUploader.clusterTilesY
        ints[60] = this.#context.canvas.width
        ints[61] = this.#context.canvas.height
        // post-pass exposure (see ViewParams in post.wgsl)
        floats[VIEW_PARAMS_EXPOSURE_SLOT] = this.exposure

        // light ranges are derived exactly once per frame; the shadow
        // allocator, the light-buffer fade slots and the culling upload all
        // read the same arrays
        this.#lightUploader.computeRanges(scene)

        // shadow atlas allocation must run before the lights upload: their
        // `shadow_caster` pad slots are patched with the caster base indices
        const casterBases = this.#shadowCasters.allocate(
            scene,
            scene.camera.position,
            inverseViewProjection,
            this.#lightUploader.pointRanges,
            this.#lightUploader.spotRanges
        )

        // rewrites the persistent light buffers and the light counts in the
        // view-params staging (floats 63–65)
        this.#lightUploader.upload(scene, casterBases)
        this.#lightUploader.updateCullLights(scene)
        this.#framePlan.flushViewParams()
        this.#environment.updateFrameParams(scene.camera)

        const afterUploads = performance.now()
        Profiler.sample('uploads', afterUploads - afterAnimation)

        this.#traversal.traverse(scene, this.#meshGpuData)
        // joint palettes (jointWorld × inverseBind from the traversal
        // staging) and morph weights — one writeBuffer each
        this.#skinning.upload(this.#staging)

        const afterTraverse = performance.now()
        Profiler.sample('traverse', afterTraverse - afterUploads)

        const commandEncoder = this.device.createCommandEncoder()
        this.#framePlan.setSwapchainView(this.#context.getCurrentTextureView())

        const passes = this.#framePlan.passes
        for (let i = 0; i < passes.length; i++) {
            this.#passHandlers[passes[i]!](commandEncoder)
        }

        const gpuTimingThisFrame = this.#gpuTimer.canResolveThisFrame
        if (gpuTimingThisFrame) {
            this.#gpuTimer.resolve(commandEncoder, this.#framePlan.queryCount)
        }

        const afterEncode = performance.now()
        Profiler.sample('encode', afterEncode - afterTraverse)

        this.device.queue.submit([commandEncoder.finish()])
        Profiler.sample('submit', performance.now() - afterEncode)

        if (gpuTimingThisFrame) {
            this.#gpuTimer.readTimestamps(this.#framePlan.fxaaTimed)
        }
    }

    // --- pass encoders (created once, referenced from the frame plan's list) ---

    #encodeGeometryPass = (commandEncoder: GPUCommandEncoder) => {
        const scene = this.#frameScene
        const meshData = scene.meshRenderDataStorage.data
        const pass = commandEncoder.beginRenderPass(
            this.#framePlan.geometryPassDescriptor
        )

        pass.setBindGroup(0, this.#framePlan.viewParamsBindGroup)

        const nodeParams = this.#traversal.nodeParamsBindGroup
        const offsets = this.#dynamicOffsets
        const meshes = this.#traversal.drawMeshes
        // the list is sorted by material, so the material bind group only
        // changes at group boundaries; pipeline variants (skinning/morph
        // overrides) are hoisted the same way
        let lastMaterial: GPUBindGroup | null = null
        let lastPipeline: GPURenderPipeline | null = null

        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i]!
            const entry = meshData.get(mesh.id)!
            offsets[0] = entry.nodeIndex * NODE_INDEX_SLOT_SIZE
            pass.setBindGroup(1, nodeParams, offsets, 0, 1)
            if (entry.materialBindGroup !== lastMaterial) {
                pass.setBindGroup(2, entry.materialBindGroup)
                lastMaterial = entry.materialBindGroup
            }
            offsets[0] = entry.animSlotIndex * ANIM_DRAW_SLOT_SIZE
            pass.setBindGroup(3, entry.skinParamsBindGroup, offsets, 0, 1)
            if (entry.geometryPipeline !== lastPipeline) {
                pass.setPipeline(entry.geometryPipeline)
                lastPipeline = entry.geometryPipeline
            }
            this.#meshGpuData.encodeMesh(mesh, entry, pass)
        }

        pass.end()
    }

    #encodeShadowPass = (commandEncoder: GPUCommandEncoder) => {
        const scene = this.#frameScene
        const meshData = scene.meshRenderDataStorage.data
        // helper geometry (light gizmos) opts out of the atlas via castShadow,
        // so the caster list was filled during the traversal itself
        const shadowCasters = this.#shadowCasters
        // one pass over the whole atlas; each tile gets its viewport/scissor and
        // selects its caster entry via the dynamic bind-group offset
        const pass = commandEncoder.beginRenderPass(
            this.#framePlan.shadowPassDescriptor
        )

        const nodeParams = this.#traversal.nodeParamsBindGroup
        const offsets = this.#dynamicOffsets
        const meshes = this.#traversal.shadowCasters

        for (let t = 0; t < shadowCasters.frameTileCount; t++) {
            const tile = shadowCasters.frameTiles[t]!
            pass.setViewport(tile.x, tile.y, tile.size, tile.size, 0, 1)
            pass.setScissorRect(tile.x, tile.y, tile.size, tile.size)
            offsets[0] = tile.casterIndex * SHADOW_INDEX_SLOT_SIZE
            pass.setBindGroup(0, shadowCasters.dataBindGroup, offsets, 0, 1)

            // the caster list is sorted by shadow pipeline (the cache is keyed
            // by vertex format plus skinning/morph variant), so this rarely changes
            let lastPipeline: GPURenderPipeline | null = null
            for (let i = 0; i < meshes.length; i++) {
                const mesh = meshes[i]!
                const entry = meshData.get(mesh.id)!
                offsets[0] = entry.nodeIndex * NODE_INDEX_SLOT_SIZE
                pass.setBindGroup(1, nodeParams, offsets, 0, 1)
                offsets[0] = entry.animSlotIndex * ANIM_DRAW_SLOT_SIZE
                pass.setBindGroup(2, entry.skinParamsBindGroup, offsets, 0, 1)
                if (entry.shadowRenderPipeline !== lastPipeline) {
                    pass.setPipeline(entry.shadowRenderPipeline)
                    lastPipeline = entry.shadowRenderPipeline
                }
                this.#meshGpuData.encodeMeshShadow(mesh, entry, pass)
            }
        }

        pass.end()
    }

    #encodeCullingPass = (commandEncoder: GPUCommandEncoder) => {
        const pass = commandEncoder.beginComputePass(
            this.#framePlan.cullingPassDescriptor
        )

        pass.setBindGroup(0, this.#framePlan.viewParamsBindGroup)
        pass.setBindGroup(1, this.#lightUploader.cullLightsBindGroup)
        pass.setBindGroup(2, this.#lightUploader.clusterComputeBindGroup)

        const cullingWorkgroups = this.#lightUploader.cullingWorkgroups
        pass.setPipeline(this.#pipelines.cullReset)
        pass.dispatchWorkgroups(cullingWorkgroups)
        // dispatches within a compute pass are ordered with memory barriers
        pass.setPipeline(this.#pipelines.cull)
        pass.dispatchWorkgroups(cullingWorkgroups)

        pass.end()
    }

    #encodeLightingPass = (commandEncoder: GPUCommandEncoder) => {
        const pass = commandEncoder.beginRenderPass(
            this.#framePlan.lightingPassDescriptor
        )

        pass.setBindGroup(0, this.#framePlan.viewParamsBindGroup)
        pass.setBindGroup(1, this.#targets.gBufferBindGroup)
        pass.setBindGroup(2, this.#lightUploader.lightsBindGroup)
        pass.setBindGroup(3, this.#lightingShadowBindGroup)
        pass.setPipeline(this.#pipelines.lighting)
        pass.draw(3) // fullscreen triangle

        pass.end()
    }

    #encodeSkyboxPass = (commandEncoder: GPUCommandEncoder) => {
        // composited into the HDR target so the post chain sees the sky and the
        // geometry/sky silhouette gets antialiased too
        const pass = commandEncoder.beginRenderPass(
            this.#framePlan.skyboxPassDescriptor
        )
        this.#environment.encodeSkybox(pass)
        pass.end()
    }

    #encodePostPass = (commandEncoder: GPUCommandEncoder) => {
        // exposure → ACES tonemap → sRGB; the debug channel views pass through
        // this shader untouched
        const pass = commandEncoder.beginRenderPass(
            this.#framePlan.postPassDescriptor
        )

        pass.setBindGroup(0, this.#framePlan.viewParamsBindGroup)
        pass.setBindGroup(1, this.#targets.postBindGroup)
        pass.setPipeline(this.#pipelines.post)
        pass.draw(3) // fullscreen triangle

        pass.end()
    }

    #encodeFxaaPass = (commandEncoder: GPUCommandEncoder) => {
        const pass = commandEncoder.beginRenderPass(
            this.#framePlan.fxaaPassDescriptor
        )

        pass.setBindGroup(0, this.#framePlan.viewParamsBindGroup)
        pass.setBindGroup(1, this.#targets.fxaaBindGroup)
        pass.setPipeline(this.#pipelines.fxaa)
        pass.draw(3) // fullscreen triangle

        pass.end()
    }
}
