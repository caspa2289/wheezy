import { mat4, type Mat4, type Vec3, vec3 } from 'wgpu-matrix'
import { type IArcBallCamera } from '../../../types/core/Camera'
import { Camera, type ICameraProps } from '../Camera'

export interface ArcBallCameraProps extends ICameraProps {}

export class ArcBallCamera extends Camera implements IArcBallCamera {
    #distance = 0
    #axis = vec3.create()

    constructor(props: ArcBallCameraProps) {
        super(props)

        const positionVec = props?.position ?? vec3.create(0, 0, 0)
        super.position = positionVec
        this.#distance = vec3.len(super.position)
        super.back = vec3.normalize(super.position)
        this.recalculateRight()
        this.recalculateUp()
        super.view = mat4.invert(super.matrix)
    }

    get axis() {
        return this.#axis
    }

    set axis(vec: Vec3) {
        vec3.copy(vec, this.#axis)
    }

    get distance() {
        return this.#distance
    }

    set distance(value) {
        this.#distance = value
    }

    override get matrix() {
        return super.matrix
    }

    override set matrix(mat: Mat4) {
        super.matrix = mat
        this.#distance = vec3.len(super.position)
    }

    recalculateRight() {
        super.right = vec3.normalize(vec3.cross(super.up, super.back))
    }

    recalculateUp() {
        super.up = vec3.normalize(vec3.cross(super.back, super.right))
    }
}
