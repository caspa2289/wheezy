import {
    EntityID,
    EntityType,
    EntityTypes,
    IComponent,
    IGameObject,
    ITransform,
} from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    _name: string
    _components = new Map() as Map<EntityID, IComponent<EntityTypes>>
    _transform?: ITransform

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

    get transform() {
        //FIXME: find a less dumb way to do it
        if (this._transform) {
            return this._transform
        }

        return [...this.components.values()].find(
            (component) => component.type === EntityTypes.transform
        ) as ITransform
    }

    public getComponentOfType(type: EntityType) {
        let result: any = null

        this._components.forEach((component) => {
            if (!result && component.type === type) {
                result = component
            }
        })

        return result
    }

    public addComponent(component: IComponent<EntityTypes>) {
        this._components.set(component.id, component)
    }

    public removeComponent(id: EntityID) {
        this._components.delete(id)
    }
}
