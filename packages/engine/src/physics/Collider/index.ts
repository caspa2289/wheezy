import { Component } from '../../engine/core'
import { EntityTypes, type IGameObject } from '../../engine/types'

export class Collider extends Component<EntityTypes.collider> {
    constructor(parent: IGameObject) {
        super(parent, EntityTypes.collider)
    }
}
