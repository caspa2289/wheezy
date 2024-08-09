import { EntityID, EntityTypes, IComponent, IGameObject } from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    _name: string
    _components = new Map() as Map<EntityID, IComponent<EntityTypes>>

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

    public addComponent(component: IComponent<EntityTypes>) {
        this._components.set(component.id, component)
    }

    public removeComponent(id: EntityID) {
        this._components.delete(id)
    }
}
