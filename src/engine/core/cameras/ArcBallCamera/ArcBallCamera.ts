import { mat4, Mat4, Vec3, vec3 } from 'wgpu-matrix'
import { IArcBallCamera } from '../../../types/core/Camera'
import { Camera, ICameraProps } from '../Camera'

export interface ArcBallCameraProps extends ICameraProps {}

export class ArcBallCamera extends Camera implements IArcBallCamera {
    private _distance = 0
    private _axis = vec3.create()

    constructor(props: ArcBallCameraProps) {
        super(props)

        const positionVec = props?.position ?? vec3.create(0, 0, 0)
        super.position = positionVec
        this._distance = vec3.len(super.position)
        super.back = vec3.normalize(super.position)
        this.recalculateRight()
        this.recalculateUp()
    }

    get axis() {
        return this._axis
    }

    set axis(vec: Vec3) {
        vec3.copy(vec, this._axis)
    }

    get distance() {
        return this._distance
    }

    set distance(value) {
        this._distance = value
    }

    get matrix() {
        return super.matrix
    }

    set matrix(mat: Mat4) {
        super.matrix = mat
        this._distance = vec3.len(super.position)
    }

    recalculateRight() {
        super.right = vec3.normalize(vec3.cross(super.up, super.back))
    }

    recalculateUp() {
        super.up = vec3.normalize(vec3.cross(super.back, super.right))
    }

    update() {
        super.view = mat4.invert(super.matrix)
        return super.view
    }
}
