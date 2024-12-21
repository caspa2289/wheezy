import { Vec3 } from 'wgpu-matrix'
import { Component } from '../../../core'
import { EntityTypes } from '../../core/Entity'

export interface IPhysicsObject extends Component<EntityTypes.physicsObject> {
    velocity: Vec3
}
