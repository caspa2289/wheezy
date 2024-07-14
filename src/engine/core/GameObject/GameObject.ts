import { EntityTypes, IGameObject } from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    _components = [] as IGameObject['components']

    constructor() {
        super(EntityTypes.gameObject)
    }

    get components() {
        return this._components
    }

    set components(value) {
        this._components = value
    }
}
