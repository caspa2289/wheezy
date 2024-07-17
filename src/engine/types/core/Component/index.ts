import { EntityType, IEntity } from '../Entity'
import { IGameObject } from '../GameObject'

export interface IComponent<T extends EntityType> extends IEntity<T> {
    parent: IGameObject
}
