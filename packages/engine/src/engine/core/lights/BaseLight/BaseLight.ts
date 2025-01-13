import { Mat4, mat4, vec3, Vec3, vec4, Vec4 } from 'wgpu-matrix'
import {
    EntityTypes,
    ILightSource,
    ILightSourceProps,
    ITransform,
    TLightSourceType,
} from '../../../types'
import { Component } from '../../Component'
import { Transform } from '../../Transform'

export interface IBaseLightProps extends ILightSourceProps {
    lightSourceType: TLightSourceType
    position?: Vec4
    target?: Vec3
}

const left = -2
const right = 2
const bottom = -2
const top = 2
const near = 0.1
const far = 50

export class BaseLight
    extends Component<EntityTypes.light>
    implements ILightSource
{
    public color: Vec3 = vec3.create(1, 1, 1)

    private _lightSourceType: TLightSourceType
    private _transform: ITransform
    private _viewMatrix: Mat4 = mat4.identity()
    private _projectionMatrix: Mat4 = mat4.ortho(
        left,
        right,
        bottom,
        top,
        near,
        far
    )

    private _right: Vec4
    private _up: Vec4
    private _back: Vec4
    private _position: Vec4

    private _target: Vec3

    constructor(props: IBaseLightProps) {
        super(props.parent, EntityTypes.light)
        this._lightSourceType = props.lightSourceType

        this._transform = new Transform(props.parent)

        this._right = new Float32Array(this._viewMatrix.buffer, 4 * 0, 4)
        this._up = new Float32Array(this._viewMatrix.buffer, 4 * 4, 4)
        this._back = new Float32Array(this._viewMatrix.buffer, 4 * 8, 4)
        this._position = new Float32Array(this._viewMatrix.buffer, 4 * 12, 4)

        this._target = props?.target ?? vec3.copy(this.position)
        this._back = vec3.normalize(vec3.sub(this.position, this.target))

        vec4.copy(props?.position ?? vec4.create(0, 0, 10, 1), this.position)

        this._viewMatrix = mat4.lookAt(this.position, this.target, this.up)
    }

    private _recalculateRight() {
        this._right = vec3.normalize(vec3.cross(this.up, this.back))
    }

    private _recalculateUp() {
        this._up = vec3.normalize(vec3.cross(this.back, this.right))
    }

    private _recalculateBack() {
        this._back = vec3.normalize(vec3.sub(this.position, this.target))
    }

    get transform() {
        return this._transform
    }

    get target() {
        return this._target
    }

    set target(value) {
        vec3.copy(value, this._target)
        this._recalculateBack()
    }

    get position() {
        return this._position
    }

    set position(value) {
        //FIXME: that doesnt work
        this._transform.position = value
        this._recalculateBack()
    }

    get right() {
        return this._right
    }

    get back() {
        return this._back
    }

    get up() {
        return this._up
    }

    get lightSourceType() {
        return this._lightSourceType
    }

    get viewMatrix() {
        return mat4.multiply(this._transform.matrix, this._viewMatrix)
    }

    get projectionMatrix() {
        return this._projectionMatrix
    }
}
