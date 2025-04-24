import { vec3, Vec3 } from 'wgpu-matrix'
import {
    ILightSourceV2,
    ILightSourceV2Props,
    LIGHT_SOURCE_TYPES,
    LightSourceV2,
} from '../LightSourceV2'

export interface IDirectionalLightProps
    extends Omit<ILightSourceV2Props, 'lightType'> {
    direction?: Vec3
}

export interface IDirectionalLight extends ILightSourceV2 {
    direction: Vec3
    diffuseIntensity: number
}

export class DirectionalLightV2
    extends LightSourceV2
    implements IDirectionalLight
{
    private _direction!: Vec3
    diffuseIntensity = 1

    constructor(props: IDirectionalLightProps) {
        super({ ...props, lightType: LIGHT_SOURCE_TYPES.directional })

        this.direction = props.direction ?? vec3.create(0, 0, 0)
    }

    set direction(value) {
        this._direction = vec3.normalize(value)
    }

    get direction() {
        return this._direction
    }
}
