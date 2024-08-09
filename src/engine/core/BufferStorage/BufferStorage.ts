import { IBufferStorage } from '../../types/core/BufferStorage'

export class BufferStorage implements IBufferStorage {
    buffers: Map<string, ArrayBuffer> = new Map()
}
