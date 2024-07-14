import { EntityID } from '../Entity'
import { IGameObject } from '../GameObject'

export interface IObjectManager {
    objects: Map<EntityID, IGameObject>
    add: (object: IGameObject) => void
    remove: (id: EntityID) => void
}
