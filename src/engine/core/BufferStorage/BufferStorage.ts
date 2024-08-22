import { IBufferStorage } from '../../types/core/BufferStorage'

export class BufferStorage implements IBufferStorage {
    _buffers: Map<string, ArrayBuffer> = new Map()

    get buffers() {
        return this._buffers
    }
}
