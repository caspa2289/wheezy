import {
    type EntityID,
    EntityTypes,
    type IComponent,
    type IGameObject,
    type ITransform,
} from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    #name: string
    #components = new Map() as Map<EntityID, IComponent<EntityTypes>>
    #transform?: ITransform

    constructor() {
        super(EntityTypes.gameObject)
        this.#name = `GameObject ${super.id}`
    }

    get name() {
        return this.#name
    }

    set name(value: string) {
        this.#name = value
    }

    get components() {
        return this.#components
    }

    get transform() {
        //FIXME: find a less dumb way to do it
        if (this.#transform) {
            return this.#transform
        }

        // for-of, not spread+find: the renderer traversal reads this per node
        // per frame and must not allocate
        for (const component of this.components.values()) {
            if (component.type === EntityTypes.transform) {
                return component as ITransform
            }
        }
        return undefined as unknown as ITransform
    }

    public addComponent(component: IComponent<EntityTypes>) {
        this.#components.set(component.id, component)
    }

    public removeComponent(id: EntityID) {
        this.#components.delete(id)
    }
}
