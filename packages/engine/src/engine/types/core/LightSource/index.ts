import { Mat4, Vec3, Vec4 } from 'wgpu-matrix'
import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'
import { IGameObject } from '../GameObject'
import { ITransform } from '../Transform'

export enum LIGHT_SOURCE_TYPES {
    directional = 'directional',
    point = 'point',
    spot = 'spot',
}

export type TLightSourceType = keyof typeof LIGHT_SOURCE_TYPES

export interface ILightSource extends IComponent<EntityTypes.light> {
    lightSourceType: TLightSourceType
    transform: ITransform
    position: Vec4
    right: Vec4
    up: Vec4
    back: Vec4
    viewMatrix: Mat4
    projectionMatrix: Mat4
    color: Vec3
}

export interface ILightSourceProps {
    parent: IGameObject
}
