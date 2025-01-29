import { DEFAULT_SAMPLER_IDS, ISamplerStorage } from '../../types'

export class SamplerStorage implements ISamplerStorage {
    _samplers: Map<string, GPUSampler> = new Map()

    constructor(device: GPUDevice) {
        const sampler = device.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'repeat',
            addressModeV: 'repeat',
            mipmapFilter: 'nearest',
        })

        this.samplers.set(DEFAULT_SAMPLER_IDS.baseColor, sampler)
        this.samplers.set(DEFAULT_SAMPLER_IDS.emission, sampler)
        this.samplers.set(DEFAULT_SAMPLER_IDS.metallicRoughness, sampler)
        this.samplers.set(DEFAULT_SAMPLER_IDS.normal, sampler)
        this.samplers.set(DEFAULT_SAMPLER_IDS.occlusion, sampler)
    }

    get samplers() {
        return this._samplers
    }
}
