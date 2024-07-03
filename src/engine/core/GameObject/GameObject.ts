import { EntityTypes, IGameObject } from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    _children = [] as IGameObject[]
    _parent = null as IGameObject['parent']
    _components = [] as IGameObject['components']

    constructor() {
        super(EntityTypes.gameObject)
    }

    get children() {
        return this._children
    }

    set children(value) {
        this._children = value
    }

    get parent() {
        return this._parent
    }

    set parent(value) {
        this._parent = value
    }

    get components() {
        return this._components
    }

    set components(value) {
        this._components = value
    }
}
