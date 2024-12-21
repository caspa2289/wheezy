import { IComponent } from '../../core/Component'
import { EntityTypes } from '../../core/Entity'

export type TColliderType = 'sphere' | 'cube' | 'cylinder'

export interface ISphereDimensions {
    radius: number
}

export type TColliderDimensions = ISphereDimensions

export interface ICollider extends IComponent<EntityTypes.collider> {
    colliderType: TColliderType
    dimensions: TColliderDimensions
}
