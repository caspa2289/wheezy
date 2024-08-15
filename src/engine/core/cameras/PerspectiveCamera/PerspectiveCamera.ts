import { Mat4, mat4, vec3, Vec3, vec4 } from 'wgpu-matrix'
import { Stuff } from '../../../../utils/Stuff'
import { Camera, ICameraProps } from '../Camera/Camera'
import { IPerspectiveCamera } from '../../../types/core/Camera'

export interface PerspectiveCameraProps extends ICameraProps {}

export class PerspectiveCamera extends Camera implements IPerspectiveCamera {
    public pitch = 0
    public yaw = 0

    constructor(props: PerspectiveCameraProps) {
        super(props)

        const positionVec = props?.position ?? vec3.create(0, 0, 0)
        const targetVec = props?.target ?? vec3.copy(positionVec)
        const back = vec3.normalize(vec3.sub(positionVec, targetVec))
        this._recalculateAngles(back)
        super.position = positionVec
    }

    private _recalculateAngles(direction: Vec3) {
        this.yaw = Math.atan2(direction[0], direction[2])
        this.pitch = -Math.asin(direction[1])
    }

    update(): Mat4 {
        this.yaw = Stuff.mod(this.yaw, Math.PI * 2)
        this.pitch = Stuff.clamp(this.pitch, -Math.PI / 2, Math.PI / 2)

        const position = vec3.copy(super.position)
        super.matrix = mat4.rotateX(mat4.rotationY(this.yaw), this.pitch)
        super.position = position

        super.view = mat4.invert(super.matrix)

        return super.view
    }
}
