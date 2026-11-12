import { type Vec3 } from 'wgpu-matrix'
import { type IComponent } from '../Component'
import { type EntityID, EntityTypes, type IEntity } from '../Entity'
import { type ITransform } from '../Transform'
import { type IAnimator } from '../animation'

export interface IGameObject extends IEntity<EntityTypes.gameObject> {
    name: string
    transform: ITransform
    /** animation playback component, when the model has one attached */
    animator?: IAnimator
    onUpdate?: (dt: number) => void
    //FIXME: type includes gameObject
    components: Map<EntityID, IComponent<EntityTypes>>
    addComponent: (component: IComponent<EntityTypes>) => void
    removeComponent: (id: EntityID) => void
    /** rotates the forward axis (−Z) toward the target; roll resets to zero */
    pointAt: (target: Vec3) => void
}
