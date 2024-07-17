import { EntityTypes, IGameObject } from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    _name: string
    _components = [] as IGameObject['components']

    constructor() {
        super(EntityTypes.gameObject)
        this._name = `GameObject ${super.id}`
    }

    get name() {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get components() {
        return this._components
    }

    set components(value) {
        this._components = value
    }
}
