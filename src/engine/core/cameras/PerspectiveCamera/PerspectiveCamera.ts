import { Mat4, mat4, vec3, Vec3 } from 'wgpu-matrix'
import { EntityTypes } from '../../../types'
import { Entity } from '../../Entity'
import { Stuff } from '../../../../utils/Stuff'

export interface PerspectiveCameraProps {
    zFar: number
    zNear: number
    position: Vec3
    canvasWidth: number
    canvasHeight: number
}

export class PerspectiveCamera extends Entity<EntityTypes.camera> {
    private readonly _view = mat4.create()

    private _matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0])
    private _right = new Float32Array(this._matrix.buffer, 4 * 0, 4)
    private _up = new Float32Array(this._matrix.buffer, 4 * 4, 4)
    private _back = new Float32Array(this._matrix.buffer, 4 * 8, 4)

    private _zFar: number
    private _zNear: number
    private _aspectRatio: number
    private _projectionMatrix

    private _pitch = 0
    private _yaw = 0

    constructor({
        zFar,
        zNear,
        position,
        canvasWidth,
        canvasHeight,
    }: PerspectiveCameraProps) {
        super(EntityTypes.camera)
        this._zFar = zFar ?? 1000
        this._zNear = zNear ?? 0.1
        this._aspectRatio = canvasWidth / canvasHeight
        this._projectionMatrix = mat4.perspective(
            (2 * Math.PI) / 5,
            this._aspectRatio,
            this._zNear,
            this._zFar
        )
        // const target = vec3.create(0, 0, 0)
        // const forward = vec3.normalize(vec3.sub(target, vec3.create(0, 0, 0)))
        // this._recalculateAngles(forward)
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

    // private _recalculateAngles(direction: Vec3) {
    //     this.yaw = Math.atan2(direction[0], direction[2])
    //     this.pitch = -Math.asin(direction[1])
    // }

    get pitch() {
        return this._pitch
    }

    get yaw() {
        return this._yaw
    }

    set pitch(value) {
        this._pitch = value
    }

    set yaw(value) {
        this._yaw = value
    }

    get matrix() {
        return this._matrix
    }

    update(): Mat4 {
        this.yaw = Stuff.mod(this.yaw, Math.PI * 2)
        this.pitch = Stuff.clamp(this.pitch, -Math.PI / 2, Math.PI / 2)

        this._matrix = mat4.rotateX(mat4.rotationY(this.yaw), this.pitch)
        this.view = mat4.invert(this._matrix)

        return this.view
    }
}
