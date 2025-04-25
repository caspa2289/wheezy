import { vec3, Vec3 } from 'wgpu-matrix'
import { Component } from '../../Component'
import { EntityTypes, IGameObject } from '../../../types'

export enum LIGHT_SOURCE_TYPES {
    directional = 'directional',
    point = 'point',
    spot = 'spot',
}

export type TLightSourceType = keyof typeof LIGHT_SOURCE_TYPES

export interface ILightSourceV2 {
    color: Vec3
    intensity: number
    lightType: TLightSourceType
}

export interface ILightSourceV2Props {
    color?: Vec3
    intensity?: number
    lightType: TLightSourceType
    parent: IGameObject
}

export abstract class LightSourceV2
    extends Component<EntityTypes.light>
    implements ILightSourceV2
{
    //color and intensity
    color: Vec3
    intensity: number
    private _lightType: TLightSourceType

    constructor(props: ILightSourceV2Props) {
        super(props.parent, EntityTypes.light)

        this._lightType = props.lightType
        this.color = props.color ?? vec3.create(1, 1, 1)
        this.intensity = props.intensity ?? 1
    }

    get lightType() {
        return this._lightType
    }
}
