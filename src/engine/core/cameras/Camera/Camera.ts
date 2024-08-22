import { Mat4, mat4, vec3, Vec3 } from 'wgpu-matrix'
import { EntityTypes } from '../../../types'
import { Entity } from '../../Entity'
import { ICamera } from '../../../types/core/Camera'

export interface ICameraProps {
    zFar?: number
    zNear?: number
    position?: Vec3
    target?: Vec3
    canvasWidth: number
    canvasHeight: number
}

export class Camera extends Entity<EntityTypes.camera> implements ICamera {
    private readonly _view = mat4.create()

    private _matrix = new Float32Array([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ])
    private _right = new Float32Array(this._matrix.buffer, 4 * 0, 4)
    private _up = new Float32Array(this._matrix.buffer, 4 * 4, 4)
    private _back = new Float32Array(this._matrix.buffer, 4 * 8, 4)
    private _position = new Float32Array(this._matrix.buffer, 4 * 12, 4)

    private _zFar: number
    private _zNear: number
    private _aspectRatio: number
    private _projectionMatrix

    constructor(props: ICameraProps) {
        super(EntityTypes.camera)

        this._zFar = props?.zFar ?? 1000
        this._zNear = props?.zNear ?? 0.1
        this._aspectRatio = props.canvasWidth / props.canvasHeight
        this._projectionMatrix = mat4.perspective(
            (2 * Math.PI) / 5,
            this._aspectRatio,
            this._zNear,
            this._zFar
        )
    }

    get aspectRatio() {
        return this._aspectRatio
    }

    get zFar() {
        return this._zFar
    }

    get zNear() {
        return this._zNear
    }

    get projectionMatrix() {
        return this._projectionMatrix
    }

    get view() {
        return this._view
    }

    set view(mat: Mat4) {
        mat4.copy(mat, this._view)
    }

    get right() {
        return this._right
    }

    set right(vec: Vec3) {
        vec3.copy(vec, this._right)
    }

    get up() {
        return this._up
    }

    set up(vec: Vec3) {
        vec3.copy(vec, this._up)
    }

    get back() {
        return this._back
    }

    set back(vec: Vec3) {
        vec3.copy(vec, this._back)
    }

    get matrix() {
        return this._matrix
    }

    set matrix(value: Mat4) {
        this._matrix = mat4.copy(value, this._matrix)
    }

    get position() {
        return this._position
    }

    set position(value: Vec3) {
        vec3.copy(value, this._position)
    }
}
