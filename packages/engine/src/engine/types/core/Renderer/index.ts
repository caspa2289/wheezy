import { type Vec3 } from 'wgpu-matrix'
import { type IMesh } from '../Mesh'
import { type IScene } from '../Scene'

// must stay in sync with the OUT_* constants in lighting.wgsl
export enum RENDER_OUTPUT_SOURCES {
    DEFAULT,
    ALBEDO,
    NORMAL,
    METALLIC,
    ROUGHNESS,
    OCCLUSION,
    EMISSION,
    DEPTH,
}

export type TRenderOutputSource = number

/** post-chain anti-aliasing mode; 'none' skips the FXAA pass entirely */
export type TAntiAliasing = 'none' | 'fxaa'

export type TSkyboxBitmaps = [
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
]

export interface IRenderer {
    adapter: GPUAdapter
    device: GPUDevice
    context: GPUCanvasContext
    swapChainFormat: GPUTextureFormat
    depthTextureFormat: GPUTextureFormat
    ambientLightIntensity: number
    ambientLightColor: Vec3
    /** multiplied into the linear HDR lighting result before tonemapping */
    exposure: number
    antiAliasing: TAntiAliasing
    lightsBindGroupLayout: GPUBindGroupLayout

    outputSource: TRenderOutputSource

    init: () => Promise<void>
    render: (dt: number, scene: IScene) => void
    buildRenderPipeline: (mesh: IMesh, scene: IScene) => void
    setSkyBoxTexture: (bitmaps: TSkyboxBitmaps) => void
    setDefaultSkyBoxTexture: () => Promise<void>
}

export interface IRendererProps {
    canvas: HTMLCanvasElement
}
