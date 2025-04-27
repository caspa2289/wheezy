export interface ITextureStorage {
    textures: Map<string, ITexture>
    defaultBaseColor: ITexture
    defaultMetallicRoughness: ITexture
    defaultEmission: ITexture
    defaultNormal: ITexture
    defaultOcclusion: ITexture
}

export interface ITexture {
    samplerId: string
    imageId: string
}
