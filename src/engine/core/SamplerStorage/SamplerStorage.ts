import { ISamplerStorage } from '../../types'

export class SamplerStorage implements ISamplerStorage {
    _samplers: Map<string, GPUSampler> = new Map()

    get samplers() {
        return this._samplers
    }
}
