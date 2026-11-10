import { vec3, type Vec3 } from 'wgpu-matrix'
import {
    type ILightSourceV2,
    type ILightSourceV2Props,
    LIGHT_SOURCE_TYPES,
    LightSourceV2,
} from '../LightSourceV2'
import { SPOT_MAX_CONE_HALF_ANGLE } from '../../Renderer/constants'

export interface ISpotLightProps extends Omit<
    ILightSourceV2Props,
    'lightType'
> {
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
    pointAt: (target: Vec3) => void
}

export class SpotLight extends LightSourceV2 implements ISpotLight {
    position: Vec3
    direction: Vec3
    #cutoff!: number
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
        return this.#cutoff
    }

    set cutoff(eulerDegrees) {
        // clamped to the widest cone the shadow frustum can represent, so the
        // lit cone and the shadowed cone always cover the same solid angle
        const halfAngle = Math.min(
            eulerDegrees * 0.01745329252,
            SPOT_MAX_CONE_HALF_ANGLE
        )
        this.#cutoff = Math.cos(halfAngle)
    }

    /**
     * Aim the cone at a world-space point: direction = normalize(target −
     * position). Normalizes explicitly — the plain `direction` property does
     * not, and the shader's cone test consumes it raw. A degenerate target
     * (at the light's position) keeps the current direction instead of
     * producing NaN.
     */
    pointAt(target: Vec3) {
        const toTarget = vec3.sub(target, this.position)
        if (vec3.len(toTarget) > 1e-6) {
            this.direction = vec3.normalize(toTarget)
        }
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

    override get gizmoPosition(): Vec3 {
        return this.position
    }
}
