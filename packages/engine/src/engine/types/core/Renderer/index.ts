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

export interface IRenderer {
    adapter: GPUAdapter
    device: GPUDevice
    context: GPUCanvasContext
    swapChainFormat: GPUTextureFormat
    depthTextureFormat: GPUTextureFormat
    ambientLightIntensity: number
    ambientLightColor: Vec3

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
