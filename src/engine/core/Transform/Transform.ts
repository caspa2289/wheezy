import { mat4 } from 'wgpu-matrix'
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

    constructor(parent: IGameObject, matrix: TransformationMatrix) {
        super(parent, EntityTypes.transform)
        this.matrix = matrix
    }

    rotateRadians({ x, y, z }: IRotateRadiansProps) {
        const newMatrix = mat4.copy(this.matrix)

        x && mat4.rotateX(newMatrix, x, newMatrix)
        y && mat4.rotateY(newMatrix, y, newMatrix)
        z && mat4.rotateZ(newMatrix, z, newMatrix)

        this.matrix = newMatrix
    }
}
