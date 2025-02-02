export interface IImageStorage {
    images: Map<string, ImageBitmap>
    createDefaults: () => Promise<void>
}

export enum DEFAULT_IMAGE_IDS {
    baseColor = 'defaultBaseColor',
    metallicRoughness = 'defaultMetallicRoughness',
    emission = 'defaultEmission',
    normal = 'defaultNormal',
    occlusion = 'defaultOcclusion',
}
