import { ITexture, ITextureStorage } from '../../types/core/TextureStorage'

export class TextureStorage implements ITextureStorage {
    _textures: Map<string, ITexture> = new Map()

    get textures() {
        return this._textures
    }
}
