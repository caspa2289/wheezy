import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'

export type TRS = {
    rotation: [number, number, number, number]
    scale: [number, number, number]
    translation: [number, number, number]
}

export type TransformationMatrix = number[]

export interface ITransform extends IComponent<EntityTypes.transform> {
    //FIXME: type this according to mat4 library of choice
    rotation?: TRS['rotation']
    scale?: TRS['scale']
    translation?: TRS['translation']
    matrix?: TransformationMatrix
}
