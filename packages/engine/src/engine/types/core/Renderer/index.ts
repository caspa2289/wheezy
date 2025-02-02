import { Vec3 } from 'wgpu-matrix'
import { IMesh } from '../Mesh'
import { IScene } from '../Scene'

export enum RENDER_OUTPUT_SOURCES {
    DEFAULT,
    V_NORMAL,
    AMBIENT,
    DIFFUSE,
    METALLIC,
    ROUGHNESS,
    F_NORMAL,
    V_TANGENT,
}

export type TRenderOutputSource = number

export type TSkyboxBitmaps = [
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
    ImageBitmap,
]

export enum RENDER_MODES {
    USE_V_NORMAL,
    USE_F_NORMAL,
}

export type TRenderMode = number

export interface IRenderer {
    adapter: GPUAdapter
    device: GPUDevice
    context: GPUCanvasContext
    swapChainFormat: GPUTextureFormat
    depthTextureFormat: GPUTextureFormat
    ambientLightIntensity: number
    ambientLightColor: Vec3

    outputSource: TRenderOutputSource
    renderingMode: TRenderMode

    init: () => Promise<void>
    render: (dt: number, scene: IScene) => void
    buildRenderPipeline: (mesh: IMesh, scene: IScene) => void
    setSkyBoxTexture: (bitmaps: TSkyboxBitmaps) => void
    setDefaultSkyBoxTexture: () => Promise<void>
}

export interface IRendererProps {
    canvas: HTMLCanvasElement
}
