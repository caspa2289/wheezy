import { Vec3, Vec4 } from 'wgpu-matrix'
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
    position: Vec4
    rotateRadians: (props: IRotateRadiansProps) => void
    rotateDegreesEuler: (props: IRotateRadiansProps) => void
    translate: (vec: Vec3) => void
    scale: (vec: Vec3) => void
}
