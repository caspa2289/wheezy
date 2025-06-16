export const DEFAULT_SWAP_CHAIN_FORMAT: GPUTextureFormat = 'rgba8unorm'
export const DEFAULT_DEPTH_FORMAT: GPUTextureFormat = 'depth24plus-stencil8'
export const DEFAULT_SHADOW_DEPTH_FORMAT: GPUTextureFormat = 'depth32float'
export const DEFAULT_STORAGE_TEXTURE_FORMAT: GPUTextureFormat = 'r32float'
export const DEFULT_SHADOW_TEXTURE_SIZE: number = 1024
export const VIEW_PARAMS_BUFFER_SIZE: number =
    16 * 4 + 16 * 4 + 4 * 4 + 4 * 4 + 16 * 4 + 16 * 4 + 16 + 16 * 3 + 4 + 4
export const MSAA_SAMPLE_COUNT: number = 4
export const DIRECTIONAL_LIGHT_ELEMENT_COUNT = 8 // 7 floats and 1 pad
export const POINT_LIGHT_ELEMENT_COUNT = 12 // 10 floats and 2 pads
export const SPOT_LIGHT_ELEMENT_COUNT = 16 + 32 // 14 real floats and 2 pads + 3 matrices
export const DIRECTIONAL_LIGHT_BYTESTRIDE =
    DIRECTIONAL_LIGHT_ELEMENT_COUNT * Float32Array.BYTES_PER_ELEMENT
export const POINT_LIGHT_BYTESTRIDE =
    POINT_LIGHT_ELEMENT_COUNT * Float32Array.BYTES_PER_ELEMENT
export const SPOT_LIGHT_BYTESTRIDE =
    SPOT_LIGHT_ELEMENT_COUNT * Float32Array.BYTES_PER_ELEMENT
