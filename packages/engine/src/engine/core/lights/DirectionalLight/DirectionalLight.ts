import { Mat4, mat4, Vec3, vec3, Vec4, vec4 } from 'wgpu-matrix'
import {
    EntityTypes,
    ILightSource,
    ILightSourceProps,
    LIGHT_SOURCE_TYPES,
} from '../../../types'
import { Component } from '../../Component'

export interface IDirectionalLightProps extends ILightSourceProps {
    position?: Vec4
}

const left = -2
const right = 2
const bottom = -2
const top = 2
const near = 0.1
const far = 50

export class DirectionalLight
    extends Component<EntityTypes.light>
    implements ILightSource
{
    public color: Vec3 = vec3.create(1, 1, 1)
    public position: Vec3

    private _lightSourceType = LIGHT_SOURCE_TYPES.directional
    private _viewMatrix: Mat4 = mat4.create()
    private _projectionMatrix: Mat4 = mat4.ortho(
        left,
        right,
        bottom,
        top,
        near,
        far
    )

    constructor(props: IDirectionalLightProps) {
        super(props.parent, EntityTypes.light)

        const upVector = vec3.create(0, 1, 0)
        const origin = vec3.fromValues(0, 0, 0)

        this.position = props.position ?? vec4.create(0, 0, 2, 1)

        this._viewMatrix = mat4.lookAt(this.position, origin, upVector)
    }

    get lightSourceType() {
        return this._lightSourceType
    }

    get viewMatrix() {
        return this._viewMatrix
    }

    get projectionMatrix() {
        return this._projectionMatrix
    }
}
