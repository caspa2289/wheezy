import { Mat4, mat4, vec3, Vec3, vec4 } from 'wgpu-matrix'
import { Stuff } from '../../../../utils/Stuff'
import { Camera, ICameraProps } from '../Camera/Camera'

export interface PerspectiveCameraProps extends ICameraProps {}

export class PerspectiveCamera extends Camera {
    private _pitch = 0
    private _yaw = 0

    constructor(props: PerspectiveCameraProps) {
        super(props)

        const positionVec = props?.position ?? vec3.create(0, 0, 0)
        const targetVec = props?.target ?? vec3.copy(positionVec)
        const back = vec3.normalize(vec3.sub(positionVec, targetVec))
        this._recalculateAngles(back)
        this.position = positionVec
    }

    private _recalculateAngles(direction: Vec3) {
        this.yaw = Math.atan2(direction[0], direction[2])
        this.pitch = -Math.asin(direction[1])
    }

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

    // set matrix(value: Mat4) {
    //     super.matrix = value
    //     this._recalculateAngles(this.back)
    // }

    update(): Mat4 {
        this.yaw = Stuff.mod(this.yaw, Math.PI * 2)
        this.pitch = Stuff.clamp(this.pitch, -Math.PI / 2, Math.PI / 2)

        const position = vec3.copy(this.position)
        super.matrix = mat4.rotateX(mat4.rotationY(this.yaw), this.pitch)
        super.position = position

        super.view = mat4.invert(super.matrix)

        return this.view
    }
}
