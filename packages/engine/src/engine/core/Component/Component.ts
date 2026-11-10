import { EntityTypes, type IComponent } from '../../types'
import { Entity } from '../Entity'

export class Component<T extends EntityTypes>
    extends Entity<T>
    implements IComponent<T>
{
    #parent: IComponent<T>['parent']

    constructor(parent: IComponent<T>['parent'], componentType: T) {
        super(componentType)
        this.#parent = parent
        this.#parent.addComponent(this)
    }

    get parent() {
        return this.#parent
    }
}
