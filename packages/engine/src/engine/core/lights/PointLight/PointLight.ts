import { vec3, type Vec3 } from 'wgpu-matrix'
import {
    type ILightSourceV2,
    type ILightSourceV2Props,
    LIGHT_SOURCE_TYPES,
    LightSourceV2,
} from '../LightSourceV2'

export interface IPointLightProps extends Omit<
    ILightSourceV2Props,
    'lightType'
> {
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

    fillLightData(dst: Float32Array, offset: number) {
        // layout: color(3) intensity position(3) attenuation(3) + 2 pad slots
        // (shadow_caster and range, patched by the LightUploader)
        dst[offset] = this.color[0]!
        dst[offset + 1] = this.color[1]!
        dst[offset + 2] = this.color[2]!
        dst[offset + 3] = this.intensity
        dst[offset + 4] = this.position[0]!
        dst[offset + 5] = this.position[1]!
        dst[offset + 6] = this.position[2]!
        dst[offset + 7] = this.attenuationConstant
        dst[offset + 8] = this.attenuationLinear
        dst[offset + 9] = this.attenuationExponential
        dst[offset + 10] = 0
        dst[offset + 11] = 0
    }

    override get gizmoPosition(): Vec3 {
        return this.position
    }
}
