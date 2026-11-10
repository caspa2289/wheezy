import { vec3, type Vec3 } from 'wgpu-matrix'
import {
    type ILightSourceV2,
    type ILightSourceV2Props,
    LIGHT_SOURCE_TYPES,
    LightSourceV2,
} from '../LightSourceV2'

export interface IDirectionalLightProps extends Omit<
    ILightSourceV2Props,
    'lightType'
> {
    direction?: Vec3
}

// gizmo anchor: a directional light has no position of its own — its debug
// gizmo sits where pointAt anchors, the world origin (shared read-only vector)
const WORLD_ORIGIN = vec3.create(0, 0, 0)

export interface IDirectionalLight extends ILightSourceV2 {
    direction: Vec3
    pointAt: (target: Vec3) => void
}

export class DirectionalLightV2
    extends LightSourceV2
    implements IDirectionalLight
{
    #direction!: Vec3

    constructor(props: IDirectionalLightProps) {
        super({ ...props, lightType: LIGHT_SOURCE_TYPES.directional })

        this.direction = props.direction ?? vec3.create(0, 0, 0)
    }

    set direction(value) {
        this.#direction = vec3.normalize(value)
    }

    get direction() {
        return this.#direction
    }

    /**
     * Aim the light so it travels toward a world-space point, anchored at the
     * world origin (a directional light has no position of its own):
     * direction = normalize(target). A degenerate target at the origin keeps
     * the current direction instead of producing NaN.
     */
    pointAt(target: Vec3) {
        if (vec3.len(target) > 1e-6) {
            this.direction = target
        }
    }

    override get gizmoPosition(): Vec3 {
        return WORLD_ORIGIN
    }

    fillLightData(dst: Float32Array, offset: number) {
        // layout: color(3) intensity direction(3) + 1 pad slot
        // (shadow_caster, patched by the LightUploader)
        dst[offset] = this.color[0]!
        dst[offset + 1] = this.color[1]!
        dst[offset + 2] = this.color[2]!
        dst[offset + 3] = this.intensity
        dst[offset + 4] = this.direction[0]!
        dst[offset + 5] = this.direction[1]!
        dst[offset + 6] = this.direction[2]!
        dst[offset + 7] = 0
    }
}
