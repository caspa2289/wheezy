import { EntityTypes, IComponent } from '../../types'
import { Entity } from '../Entity'

export class Component<T extends EntityTypes>
    extends Entity<T>
    implements IComponent<T>
{
    _parent: IComponent<T>['parent']

    constructor(parent: IComponent<T>['parent'], componentType: T) {
        super(componentType)
        this._parent = parent
        this._parent.addComponent(this)
    }

    get parent() {
        return this._parent
    }
}
