import { type Mat4, mat4, vec3, type Vec3 } from 'wgpu-matrix'
import { EntityTypes } from '../../../types'
import { Entity } from '../../Entity'
import { type ICamera } from '../../../types/core/Camera'

export interface ICameraProps {
    zFar?: number
    zNear?: number
    position?: Vec3
    target?: Vec3
    canvasWidth: number
    canvasHeight: number
}

export class Camera extends Entity<EntityTypes.camera> implements ICamera {
    readonly #view = mat4.create()

    #matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    #right = new Float32Array(this.#matrix.buffer, 4 * 0, 4)
    #up = new Float32Array(this.#matrix.buffer, 4 * 4, 4)
    #back = new Float32Array(this.#matrix.buffer, 4 * 8, 4)
    #position = new Float32Array(this.#matrix.buffer, 4 * 12, 4)

    #zFar: number
    #zNear: number
    #aspectRatio: number
    #projectionMatrix

    constructor(props: ICameraProps) {
        super(EntityTypes.camera)

        this.#zFar = props?.zFar ?? 1000
        this.#zNear = props?.zNear ?? 0.1
        this.#aspectRatio = props.canvasWidth / props.canvasHeight
        this.#projectionMatrix = mat4.perspective(
            (2 * Math.PI) / 5,
            this.#aspectRatio,
            this.#zNear,
            this.#zFar
        )
    }

    get aspectRatio() {
        return this.#aspectRatio
    }

    get zFar() {
        return this.#zFar
    }

    get zNear() {
        return this.#zNear
    }

    get projectionMatrix() {
        return this.#projectionMatrix
    }

    get view() {
        return this.#view
    }

    set view(mat: Mat4) {
        mat4.copy(mat, this.#view)
    }

    get right() {
        return this.#right
    }

    set right(vec: Vec3) {
        vec3.copy(vec, this.#right)
    }

    get up() {
        return this.#up
    }

    set up(vec: Vec3) {
        vec3.copy(vec, this.#up)
    }

    get back() {
        return this.#back
    }

    set back(vec: Vec3) {
        vec3.copy(vec, this.#back)
    }

    get matrix() {
        return this.#matrix
    }

    set matrix(value: Mat4) {
        this.#matrix = mat4.copy(value, this.#matrix)
    }

    get position() {
        return this.#position
    }

    set position(value: Vec3) {
        vec3.copy(value, this.#position)
    }
}
