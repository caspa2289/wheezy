export interface ISamplerStorage {
    samplers: Map<string, GPUSampler>
}

export enum DEFAULT_SAMPLER_IDS {
    baseColor = 'defaultBaseColor',
    metallicRoughness = 'defaultMetallicRoughness',
    emission = 'defaultEmission',
    normal = 'defaultNormal',
    occlusion = 'defaultOcclusion',
}
