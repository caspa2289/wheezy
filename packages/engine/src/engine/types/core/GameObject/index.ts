import { IComponent } from '../Component'
import { EntityID, EntityTypes, IEntity } from '../Entity'
import { ITransform } from '../Transform'

export interface IGameObject extends IEntity<EntityTypes.gameObject> {
    name: string
    transform: ITransform
    onUpdate?: (dt: number) => void
    //FIXME: type includes gameObject
    components: Map<EntityID, IComponent<EntityTypes>>
    addComponent: (component: IComponent<EntityTypes>) => void
    removeComponent: (id: EntityID) => void
}
