import { IComponent } from '../Component'
import { EntityTypes, IEntity } from '../Entity'

export interface IGameObject extends IEntity<EntityTypes.gameObject> {
    name: string
    onUpdate?: (dt: number) => void
    //FIXME: type includes gameObject
    components: IComponent<EntityTypes>[]
}
