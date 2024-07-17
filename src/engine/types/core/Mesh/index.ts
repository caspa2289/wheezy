import { IComponent } from '../Component'
import { EntityTypes } from '../Entity'

export interface IMesh extends IComponent<EntityTypes.mesh> {
    // materialId: EntityID
    // geometry: any
}
