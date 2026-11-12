import { type Mat3, type Mat4, type Vec3, type Vec4 } from 'wgpu-matrix'
import { type IGameObject } from '../GameObject'

export interface ICamera extends IGameObject {
    matrix: Mat3 // This is the inverse of the view matrix.
    view: Mat4
    position: Vec4
    right: Vec4
    up: Vec4
    back: Vec4
    aspectRatio: number
    zFar: number
    zNear: number
    projectionMatrix: Mat4
}

export interface IPerspectiveCamera extends ICamera {
    pitch: number
    yaw: number
    update: () => Mat4
}

export interface IArcBallCamera extends ICamera {
    axis: Vec3
    distance: number
    recalculateRight: VoidFunction
    recalculateUp: VoidFunction
}
