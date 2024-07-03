import { EntityTypes, IComponent } from '../../types'
import { Entity } from '../Entity'

export class Component
    extends Entity<EntityTypes.component>
    implements IComponent
{
    _componentType: IComponent['componentType']
    _parent: IComponent['parent']

    constructor(
        parent: IComponent['parent'],
        componentType: IComponent['componentType']
    ) {
        super(EntityTypes.component)
        this._parent = parent
        this._componentType = componentType
    }

    get componentType() {
        return this._componentType
    }

    get parent() {
        return this._parent
    }
}
