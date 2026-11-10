import {
    DEFAULT_IMAGE_IDS,
    type IImageStorage,
} from '../../types/core/ImageStorage'

export class ImageStorage implements IImageStorage {
    #images: Map<string, ImageBitmap> = new Map()

    public async createDefaults() {
        const whiteBitmap = await createImageBitmap(
            new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1)
        )

        const greyBitmap = await createImageBitmap(
            new ImageData(new Uint8ClampedArray([255, 252, 235, 255]), 1, 1)
        )

        const blackBitmap = await createImageBitmap(
            new ImageData(new Uint8ClampedArray([0, 0, 0, 255]), 1, 1)
        )

        const normalBitmap = await createImageBitmap(
            new ImageData(new Uint8ClampedArray([128, 128, 255, 255]), 1, 1)
        )

        this.#images.set(DEFAULT_IMAGE_IDS.metallicRoughness, whiteBitmap)
        this.#images.set(DEFAULT_IMAGE_IDS.occlusion, whiteBitmap)

        this.#images.set(DEFAULT_IMAGE_IDS.baseColor, greyBitmap)

        this.#images.set(DEFAULT_IMAGE_IDS.emission, blackBitmap)

        this.#images.set(DEFAULT_IMAGE_IDS.normal, normalBitmap)
    }

    get images() {
        return this.#images
    }
}
