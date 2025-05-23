import { vec3, Vec3 } from 'wgpu-matrix'
import {
    ILightSourceV2,
    ILightSourceV2Props,
    LIGHT_SOURCE_TYPES,
    LightSourceV2,
} from '../LightSourceV2'

export interface IPointLightProps
    extends Omit<ILightSourceV2Props, 'lightType'> {
    position?: Vec3
    attenuationConstant?: number
    attenuationLinear?: number
    attenuationExponential?: number
}

export interface IPointLight extends ILightSourceV2 {
    position: Vec3
    attenuationConstant: number
    attenuationLinear: number
    attenuationExponential: number
}

export class PointLight extends LightSourceV2 implements IPointLight {
    position: Vec3
    attenuationConstant: number
    attenuationLinear: number
    attenuationExponential: number

    constructor(props: IPointLightProps) {
        super({ ...props, lightType: LIGHT_SOURCE_TYPES.point })
        this.position = props?.position ?? vec3.create(0)
        this.attenuationConstant = props?.attenuationConstant ?? 1.0
        this.attenuationLinear = props?.attenuationLinear ?? 0.25
        this.attenuationExponential = props?.attenuationExponential ?? 0.25
    }

    getLightData() {
        return [
            ...this.color,
            this.intensity,
            ...this.position,
            this.attenuationConstant,
            this.attenuationLinear,
            this.attenuationExponential,
            0,
            0,
        ]
    }
}
