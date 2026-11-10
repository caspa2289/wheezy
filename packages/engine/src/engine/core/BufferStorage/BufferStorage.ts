import { type IBufferStorage } from '../../types/core/BufferStorage'

export class BufferStorage implements IBufferStorage {
    #buffers: Map<string, ArrayBuffer> = new Map()

    get buffers() {
        return this.#buffers
    }
}
