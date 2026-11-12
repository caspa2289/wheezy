import { mat4, vec3, type Vec3 } from 'wgpu-matrix'
import {
    type EntityID,
    EntityTypes,
    type IAnimator,
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

    get animator(): IAnimator | undefined {
        for (const component of this.components.values()) {
            if (component.type === EntityTypes.animator) {
                return component as IAnimator
            }
        }
        return undefined
    }

    public addComponent(component: IComponent<EntityTypes>) {
        this.#components.set(component.id, component)
    }

    public removeComponent(id: EntityID) {
        this.#components.delete(id)
    }

    /**
     * Rotates the object so its forward axis (−Z, the direction a camera
     * attached here looks) points at the target. Translation is preserved,
     * roll resets to zero and the matrix's rotation is replaced wholesale
     * (any scale in it is lost).
     */
    public pointAt(target: Vec3) {
        const transform = this.transform
        if (!transform) {
            return
        }

        const position = vec3.copy(transform.position)
        const back = vec3.normalize(vec3.sub(position, target))
        // yaw/pitch decomposition of the back axis — the PerspectiveCamera
        // convention; the recomposed matrix has its column 2 along `back`
        const yaw = Math.atan2(back[0]!, back[2]!)
        const pitch = -Math.asin(back[1]!)
        mat4.copy(mat4.rotateX(mat4.rotationY(yaw), pitch), transform.matrix)
        vec3.copy(position, transform.position)
    }
}
