import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'

export type TransformationMatrix = Float32Array

export interface ITransform extends IComponent<EntityTypes.transform> {
    matrix: TransformationMatrix
}
