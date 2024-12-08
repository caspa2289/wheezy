import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'

export type TransformationMatrix = Float32Array

export interface IRotateRadiansProps {
    x?: number
    y?: number
    z?: number
}

export interface ITransform extends IComponent<EntityTypes.transform> {
    matrix: TransformationMatrix
    rotateRadians: (props: IRotateRadiansProps) => void
}
