import { type EntityType, type IEntity } from '../Entity'
import { type IGameObject } from '../GameObject'

export interface IComponent<T extends EntityType> extends IEntity<T> {
    parent: IGameObject
}
