import { IImageStorage } from '../../types/ImageStorage'

export class ImageStorage implements IImageStorage {
    private _images: Map<string, ArrayBuffer> = new Map()

    get images() {
        return this._images
    }
}
