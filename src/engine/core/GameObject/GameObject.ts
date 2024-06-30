import { EntityTypes, IGameObject } from '../../types'
import { Entity } from '../Entity'

export class GameObject
    extends Entity<EntityTypes.gameObject>
    implements IGameObject
{
    constructor() {
        super(EntityTypes.gameObject)
    }
}
