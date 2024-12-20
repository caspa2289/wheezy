import { mat4, vec3, Vec3 } from 'wgpu-matrix'
import {
    EntityTypes,
    IGameObject,
    IRotateRadiansProps,
    TransformationMatrix,
} from '../../types'
import { ITransform } from '../../types'
import { Component } from '../Component'

export class Transform
    extends Component<EntityTypes.transform>
    implements ITransform
{
    matrix: TransformationMatrix

    private _position: Float32Array

    constructor(parent: IGameObject, matrix: TransformationMatrix) {
        super(parent, EntityTypes.transform)
        this.matrix = matrix
        this._position = new Float32Array(this.matrix.buffer, 4 * 12, 4)
    }

    scale(value: Vec3) {
        mat4.scale(this.matrix, value, this.matrix)
    }

    translate(value: Vec3) {
        this._position = vec3.copy(value, this._position)
    }

    rotateRadians({ x, y, z }: IRotateRadiansProps) {
        const newMatrix = mat4.copy(this.matrix)

        x && mat4.rotateX(newMatrix, x, newMatrix)
        y && mat4.rotateY(newMatrix, y, newMatrix)
        z && mat4.rotateZ(newMatrix, z, newMatrix)

        mat4.copy(newMatrix, this.matrix)
    }
}
