export const DEFAULT_SWAP_CHAIN_FORMAT: GPUTextureFormat = 'rgba8unorm'
export const DEFAULT_DEPTH_FORMAT: GPUTextureFormat = 'depth24plus-stencil8'
export const DEFAULT_SHADOW_DEPTH_FORMAT: GPUTextureFormat = 'depth32float'
export const DEFULT_SHADOW_TEXTURE_SIZE: number = 1024
export const VIEW_PARAMS_BUFFER_SIZE: number =
    16 * 4 + 16 * 4 + 4 * 4 + 4 * 4 + 16 * 4 + 16 * 4 + 16 + 16 * 3 + 4 + 4
export const MSAA_SAMPLE_COUNT: number = 4
export const DIRECTIONAL_LIGHT_BYTESTRIDE = 16 * 4 + 16 * 4
