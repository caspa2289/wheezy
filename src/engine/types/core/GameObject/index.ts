import { IComponent } from '../Component'
import { EntityTypes, IEntity } from '../Entity'
import { SceneTreePosition } from '../SceneTree'

export interface IGameObject extends IEntity<EntityTypes.gameObject> {
    onUpdate?: (dt: number) => void
    children: IGameObject[]
    parent: IGameObject | null
    components: IComponent[]
    sceneTreePosition: SceneTreePosition
}
