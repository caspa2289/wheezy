import { Mat3, Mat4, Vec4 } from 'wgpu-matrix'
import { EntityTypes, IEntity } from '../Entity'

export interface ICamera extends IEntity<EntityTypes.camera> {
    matrix: Mat3 // This is the inverse of the view matrix.
    view: Mat4
    right: Vec4
    up: Vec4
    back: Vec4
    aspectRatio: number
    zFar: number
    zNear: number
    projectionMatrix: Mat4
}
