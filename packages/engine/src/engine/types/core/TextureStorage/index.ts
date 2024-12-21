export interface ITextureStorage {
    textures: Map<string, ITexture>
}

export interface ITexture {
    samplerId: string
    imageId: string
}
