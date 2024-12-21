import { vec3, Vec3 } from 'wgpu-matrix'
import { Component } from '../../engine/core'
import { EntityTypes, IGameObject } from '../../engine/types'
import { IPhysicsObject } from '../../engine/types/physics/PhysicsObject'

export class PhysicsObject
    extends Component<EntityTypes.physicsObject>
    implements IPhysicsObject
{
    velocity: Vec3 = vec3.create(0)

    constructor(parent: IGameObject) {
        super(parent, EntityTypes.physicsObject)
    }
}
