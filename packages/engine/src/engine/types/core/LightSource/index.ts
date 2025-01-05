import { Mat4, Vec3 } from 'wgpu-matrix'
import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'
import { ITransform } from '../Transform'
import { IGameObject } from '../GameObject'

export enum LIGHT_SOURCE_TYPES {
    directional = 'directional',
    point = 'point',
    spot = 'spot',
}

export type TLightSourceType = keyof typeof LIGHT_SOURCE_TYPES

export interface ILightSource extends IComponent<EntityTypes.light> {
    lightSourceType: TLightSourceType
    position: Vec3
    viewMatrix: Mat4
    projectionMatrix: Mat4
    color: Vec3
}

export interface ILightSourceProps {
    parent: IGameObject
}
