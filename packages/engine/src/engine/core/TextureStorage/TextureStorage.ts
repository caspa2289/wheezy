import { DEFAULT_IMAGE_IDS, DEFAULT_SAMPLER_IDS } from '../../types'
import { ITexture, ITextureStorage } from '../../types/core/TextureStorage'

export class TextureStorage implements ITextureStorage {
    _textures: Map<string, ITexture> = new Map()

    get textures() {
        return this._textures
    }

    get defaultBaseColor() {
        return {
            samplerId: DEFAULT_SAMPLER_IDS.baseColor,
            imageId: DEFAULT_IMAGE_IDS.baseColor,
        }
    }
    get defaultMetallicRoughness() {
        return {
            samplerId: DEFAULT_SAMPLER_IDS.metallicRoughness,
            imageId: DEFAULT_IMAGE_IDS.metallicRoughness,
        }
    }
    get defaultEmission() {
        return {
            samplerId: DEFAULT_SAMPLER_IDS.emission,
            imageId: DEFAULT_IMAGE_IDS.emission,
        }
    }
    get defaultNormal() {
        return {
            samplerId: DEFAULT_SAMPLER_IDS.normal,
            imageId: DEFAULT_IMAGE_IDS.normal,
        }
    }
    get defaultOcclusion() {
        return {
            samplerId: DEFAULT_SAMPLER_IDS.occlusion,
            imageId: DEFAULT_IMAGE_IDS.baseColor,
        }
    }
}
