import { mat4, type Mat4, vec3 } from 'wgpu-matrix'
import { type ICamera } from '../../types/core/Camera'
import { type TSkyboxBitmaps } from '../../types'
import { cubeVertexArray, cubeVertexCount } from '../../primitives/cube'
import { type BindGroupLayouts } from './BindGroupLayouts'
import { type Pipelines } from './Pipelines'
import { type RenderTargets } from './RenderTargets'
import { type StagingBuffers } from './StagingBuffers'
import {
    IBL_BRDF_LUT_SIZE,
    IBL_IRRADIANCE_SIZE,
    IBL_PREFILTER_MIP_LEVELS,
    IBL_PREFILTER_SIZE,
    SKYBOX_UNIFORM_BUFFER_SIZE,
} from './constants'

// the sky cube is drawn scaled around the camera-independent world origin;
// its fragments are depth-forced to 1.0 in skybox.wgsl
const SKYBOX_MODEL_MATRIX: Mat4 = mat4.scaling(vec3.fromValues(100, 100, 100))

/**
 * Skybox and image-based lighting: owns the skybox texture, its uniform
 * buffer/bind group and cube geometry, plus the IBL bind groups and the
 * environment prefilter dispatch. The IBL *targets* live in RenderTargets
 * (the lighting bind group samples their static views); only their contents
 * are rewritten here, once per skybox assignment — never per frame.
 */
export class Environment {
    #device: GPUDevice
    #pipelines: Pipelines
    #targets: RenderTargets
    #layouts: BindGroupLayouts
    #staging: StagingBuffers

    #skyboxTexture!: GPUTexture
    #skyboxCubeView!: GPUTextureView
    #skyboxSampler: GPUSampler
    #verticesBuffer: GPUBuffer
    #uniformBuffer: GPUBuffer
    #uniformBindGroup!: GPUBindGroup

    #iblEnvBG!: GPUBindGroup
    #iblIrradianceOutBG: GPUBindGroup
    #iblPrefilterOutBGs: GPUBindGroup[] = []
    #iblLutOutBG: GPUBindGroup

    constructor(
        device: GPUDevice,
        pipelines: Pipelines,
        targets: RenderTargets,
        layouts: BindGroupLayouts,
        staging: StagingBuffers
    ) {
        this.#device = device
        this.#pipelines = pipelines
        this.#targets = targets
        this.#layouts = layouts
        this.#staging = staging

        this.#skyboxSampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
        })

        this.#verticesBuffer = device.createBuffer({
            size: cubeVertexArray.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        })
        new Float32Array(this.#verticesBuffer.getMappedRange()).set(
            cubeVertexArray
        )
        this.#verticesBuffer.unmap()

        this.#uniformBuffer = device.createBuffer({
            size: SKYBOX_UNIFORM_BUFFER_SIZE,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        })

        // the output bind groups are static: the IBL targets never change,
        // only their contents (see #prefilterEnvironment)
        this.#iblIrradianceOutBG = device.createBindGroup({
            label: 'ibl irradiance output',
            layout: layouts.iblCubeOut,
            entries: [
                {
                    binding: 0,
                    resource: targets.iblIrradianceTexture.createView({
                        dimension: '2d-array',
                    }),
                },
            ],
        })

        // one output bind group per prefilter mip: WGSL's textureStore has no
        // mip argument, so each level is written through its own single-mip view
        for (let mip = 0; mip < IBL_PREFILTER_MIP_LEVELS; mip++) {
            this.#iblPrefilterOutBGs.push(
                device.createBindGroup({
                    label: `ibl prefilter output mip ${mip}`,
                    layout: layouts.iblCubeOut,
                    entries: [
                        {
                            binding: 0,
                            resource: targets.iblPrefilteredTexture.createView({
                                dimension: '2d-array',
                                baseMipLevel: mip,
                                mipLevelCount: 1,
                            }),
                        },
                    ],
                })
            )
        }

        this.#iblLutOutBG = device.createBindGroup({
            label: 'ibl brdf lut output',
            layout: layouts.iblLutOut,
            entries: [{ binding: 1, resource: targets.iblBrdfLutView }],
        })
    }

    /** cube view of the current skybox — bound into per-mesh material bind groups */
    get skyboxCubeView() {
        return this.#skyboxCubeView
    }

    get skyboxSampler() {
        return this.#skyboxSampler
    }

    async setDefaultSkyBoxTexture() {
        const images = new Array(6).fill(
            new ImageData(new Uint8ClampedArray([75, 76, 76, 255]), 1, 1)
        )
        const promises = images.map(async (image) => {
            return createImageBitmap(image)
        })
        const imageBitmaps = (await Promise.all(promises)) as TSkyboxBitmaps

        this.setSkyBoxTexture(imageBitmaps)
    }

    setSkyBoxTexture(bitmaps: TSkyboxBitmaps) {
        const device = this.#device

        this.#skyboxTexture = device.createTexture({
            dimension: '2d',
            size: [bitmaps[0].width, bitmaps[0].height, 6],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        })

        for (let i = 0; i < bitmaps.length; i++) {
            const imageBitmap = bitmaps[i]!
            device.queue.copyExternalImageToTexture(
                { source: imageBitmap },
                { texture: this.#skyboxTexture, origin: [0, 0, i] },
                [imageBitmap.width, imageBitmap.height]
            )
        }

        this.#skyboxCubeView = this.#skyboxTexture.createView({
            dimension: 'cube',
        })

        this.#uniformBindGroup = device.createBindGroup({
            label: 'skybox uniform bindgroup',
            layout: this.#pipelines.skybox.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.#uniformBuffer,
                        offset: 0,
                        size: SKYBOX_UNIFORM_BUFFER_SIZE,
                    },
                },
                {
                    binding: 1,
                    resource: this.#skyboxSampler,
                },
                {
                    binding: 2,
                    resource: this.#skyboxCubeView,
                },
            ],
        })

        // the skybox texture is recreated on every assignment, so this group
        // cannot be built once at init
        this.#iblEnvBG = device.createBindGroup({
            label: 'ibl env source',
            layout: this.#layouts.iblEnv,
            entries: [
                { binding: 0, resource: this.#skyboxCubeView },
                { binding: 1, resource: this.#targets.iblSampler },
            ],
        })

        // indirect light comes from this skybox, so it has to be re-convolved
        this.#prefilterEnvironment()
    }

    /** writes the skybox uniforms (model/proj/view/camera position) for this frame */
    updateFrameParams(camera: ICamera) {
        const floats = this.#staging.skyboxParamsFloats
        floats.set(SKYBOX_MODEL_MATRIX, 0)
        floats.set(camera.projectionMatrix, 16)
        floats.set(camera.view, 32)
        floats.set(camera.position, 48)
        this.#device.queue.writeBuffer(
            this.#uniformBuffer,
            0,
            this.#staging.skyboxParams
        )
    }

    encodeSkybox(pass: GPURenderPassEncoder) {
        pass.setPipeline(this.#pipelines.skybox)
        pass.setVertexBuffer(0, this.#verticesBuffer)
        pass.setBindGroup(0, this.#uniformBindGroup)
        pass.draw(cubeVertexCount)
    }

    /**
     * Convolves the current skybox into the irradiance map, the roughness-indexed
     * prefiltered specular map and the BRDF integration LUT. Runs once per
     * skybox assignment, not per frame.
     */
    #prefilterEnvironment() {
        const device = this.#device
        const pipelines = this.#pipelines

        const encoder = device.createCommandEncoder({
            label: 'ibl prefilter encoder',
        })
        const pass = encoder.beginComputePass({
            label: 'ibl prefilter pass',
        })

        pass.setBindGroup(0, this.#iblEnvBG)

        pass.setPipeline(pipelines.iblIrradiance)
        pass.setBindGroup(1, this.#iblIrradianceOutBG)
        pass.dispatchWorkgroups(
            IBL_IRRADIANCE_SIZE / 8,
            IBL_IRRADIANCE_SIZE / 8,
            6
        )

        pass.setPipeline(pipelines.iblPrefilter)
        for (let mip = 0; mip < IBL_PREFILTER_MIP_LEVELS; mip++) {
            const size = IBL_PREFILTER_SIZE >> mip
            pass.setBindGroup(1, this.#iblPrefilterOutBGs[mip]!)
            pass.dispatchWorkgroups(
                Math.max(1, size / 8),
                Math.max(1, size / 8),
                6
            )
        }

        pass.setPipeline(pipelines.iblBrdfLut)
        pass.setBindGroup(1, this.#iblLutOutBG)
        pass.dispatchWorkgroups(IBL_BRDF_LUT_SIZE / 8, IBL_BRDF_LUT_SIZE / 8, 1)

        pass.end()
        device.queue.submit([encoder.finish()])
    }
}
