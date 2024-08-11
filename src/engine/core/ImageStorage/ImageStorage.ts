import { IImageStorage } from '../../types/ImageStorage'

export class ImageStorage implements IImageStorage {
    private _images: Map<string, ImageBitmap> = new Map()

    get images() {
        return this._images
    }
}
