import { EntityTypes, IEntity } from '../Entity'
import { IGameObject } from '../GameObject'

export enum ComponentTypes {
    mesh = 'mesh',
    transform = 'transform',
}

export type ComponentType = keyof typeof ComponentTypes

export interface IComponent extends IEntity<EntityTypes.component> {
    parent: IGameObject
    componentType: ComponentType
}
