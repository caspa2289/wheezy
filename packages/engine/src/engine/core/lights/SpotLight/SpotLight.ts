import { vec3, Vec3 } from 'wgpu-matrix'
import {
    ILightSourceV2,
    ILightSourceV2Props,
    LIGHT_SOURCE_TYPES,
    LightSourceV2,
} from '../LightSourceV2'

export interface ISpotLightProps
    extends Omit<ILightSourceV2Props, 'lightType'> {
    position?: Vec3
    direction?: Vec3
    cutoff?: number
    attenuationConstant?: number
    attenuationLinear?: number
    attenuationExponential?: number
}

export interface ISpotLight extends ILightSourceV2 {
    position: Vec3
    direction: Vec3
    cutoff: number
    attenuationConstant: number
    attenuationLinear: number
    attenuationExponential: number
}

export class SpotLight extends LightSourceV2 implements ISpotLight {
    position: Vec3
    direction: Vec3
    _cutoff!: number
    attenuationConstant: number
    attenuationLinear: number
    attenuationExponential: number

    constructor(props: ISpotLightProps) {
        super({ ...props, lightType: LIGHT_SOURCE_TYPES.spot })
        this.position = props?.position ?? vec3.create(0, 0, 0)
        this.attenuationConstant = props?.attenuationConstant ?? 1.0
        this.attenuationLinear = props?.attenuationLinear ?? 0.002
        this.attenuationExponential = props?.attenuationExponential ?? 0.002
        this.direction = props?.direction ?? vec3.create(-1, 0, 0)
        this.cutoff = props?.cutoff ?? 15
    }

    get cutoff() {
        return this._cutoff
    }

    set cutoff(eulerDegrees) {
        this._cutoff = Math.cos(eulerDegrees * 0.01745329252)
    }

    getLightData() {
        return [
            ...this.color,
            0,
            ...this.position,
            0,
            ...this.direction,
            this.cutoff,
            this.intensity,
            this.attenuationConstant,
            this.attenuationLinear,
            this.attenuationExponential,
        ]
    }
}
