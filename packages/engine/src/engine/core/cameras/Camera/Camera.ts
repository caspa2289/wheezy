import { type Mat4, mat4, vec3, type Vec3 } from 'wgpu-matrix'
import { type ICamera } from '../../../types/core/Camera'
import { type ITransform } from '../../../types'
import { GameObject } from '../../GameObject'
import { Transform } from '../../Transform'

export interface ICameraProps {
    zFar?: number
    zNear?: number
    position?: Vec3
    target?: Vec3
    canvasWidth: number
    canvasHeight: number
}

export class Camera extends GameObject implements ICamera {
    readonly #view = mat4.identity()

    #transform: ITransform

    // column views aliased into #transform.matrix: right (0), up (1),
    // back (2); the position column (3) is exposed by Transform itself.
    // Every setter copies into the matrix buffer in place — reassigning
    // transform.matrix would orphan these views
    #right: Float32Array
    #up: Float32Array
    #back: Float32Array

    #zFar: number
    #zNear: number
    #aspectRatio: number
    #projectionMatrix

    constructor(props: ICameraProps) {
        super()

        this.#transform = new Transform(this)
        const matrixBuffer = this.#transform.matrix.buffer
        this.#right = new Float32Array(matrixBuffer, 4 * 0, 4)
        this.#up = new Float32Array(matrixBuffer, 4 * 4, 4)
        this.#back = new Float32Array(matrixBuffer, 4 * 8, 4)

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

    override get transform() {
        return this.#transform
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
        return this.#transform.matrix
    }

    set matrix(value: Mat4) {
        mat4.copy(value, this.#transform.matrix)
    }

    get position() {
        return this.#transform.position
    }

    set position(value: Vec3) {
        // Transform's own position setter copies 4 elements (Vec4) — routing
        // a Vec3 through it would write NaN into w; write xyz in place
        vec3.copy(value, this.#transform.position)
    }
}
