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

    fillLightData(dst: Float32Array, offset: number) {
        // layout: color(3) + shadow_caster pad, position(3) + range pad,
        // direction(3) cutoff intensity attenuation(3) — the two pad slots
        // are patched by the LightUploader
        dst[offset] = this.color[0]!
        dst[offset + 1] = this.color[1]!
        dst[offset + 2] = this.color[2]!
        dst[offset + 3] = 0
        dst[offset + 4] = this.position[0]!
        dst[offset + 5] = this.position[1]!
        dst[offset + 6] = this.position[2]!
        dst[offset + 7] = 0
        dst[offset + 8] = this.direction[0]!
        dst[offset + 9] = this.direction[1]!
        dst[offset + 10] = this.direction[2]!
        dst[offset + 11] = this.cutoff
        dst[offset + 12] = this.intensity
        dst[offset + 13] = this.attenuationConstant
        dst[offset + 14] = this.attenuationLinear
        dst[offset + 15] = this.attenuationExponential
    }

    override get gizmoPosition(): Vec3 {
        return this.position
    }
}
