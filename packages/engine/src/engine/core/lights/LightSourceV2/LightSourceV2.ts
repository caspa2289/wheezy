import { vec3, type Vec3 } from 'wgpu-matrix'
import { Component } from '../../Component'
import { EntityTypes, type IGameObject } from '../../../types'

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
    /** debug marker managed by LightGizmo.sync — do not set manually */
    gizmo?: IGameObject
    /**
     * world position the debug gizmo pins to; null means no gizmo. Point/spot
     * return their position, directional the world origin (their pointAt
     * anchor).
     */
    gizmoPosition: Vec3 | null

    getLightData(): number[]
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
    gizmo?: IGameObject
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

    get gizmoPosition(): Vec3 | null {
        return null
    }

    abstract getLightData(): number[]
}
