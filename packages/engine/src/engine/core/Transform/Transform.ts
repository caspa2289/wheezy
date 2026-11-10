import { mat4, vec3, type Vec3, vec4, type Vec4 } from 'wgpu-matrix'
import {
    EntityTypes,
    type IGameObject,
    type IRotateRadiansProps,
    type TransformationMatrix,
} from '../../types'
import { type ITransform } from '../../types'
import { Component } from '../Component'

export class Transform
    extends Component<EntityTypes.transform>
    implements ITransform
{
    matrix: TransformationMatrix

    #position: Float32Array

    constructor(parent: IGameObject, matrix?: TransformationMatrix) {
        super(parent, EntityTypes.transform)
        this.matrix = matrix ? mat4.copy(matrix) : mat4.identity()
        this.#position = new Float32Array(this.matrix.buffer, 4 * 12, 4)
    }

    get position() {
        return this.#position
    }

    set position(value: Vec4) {
        vec4.copy(value, this.#position)
    }

    scale(value: Vec3) {
        mat4.scale(this.matrix, value, this.matrix)
    }

    translate(value: Vec3) {
        this.#position = vec3.copy(value, this.#position)
    }

    rotateRadians({ x, y, z }: IRotateRadiansProps) {
        const newMatrix = mat4.copy(this.matrix)

        x && mat4.rotateX(newMatrix, x, newMatrix)
        y && mat4.rotateY(newMatrix, y, newMatrix)
        z && mat4.rotateZ(newMatrix, z, newMatrix)

        mat4.copy(newMatrix, this.matrix)
    }

    rotateDegreesEuler({ x, y, z }: IRotateRadiansProps) {
        const degreeToRad = 0.01745329252
        this.rotateRadians({
            x: (x ?? 0) * degreeToRad,
            y: (y ?? 0) * degreeToRad,
            z: (z ?? 0) * degreeToRad,
        })
    }
}
