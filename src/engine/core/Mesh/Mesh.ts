import { EntityTypes, IGameObject, IMesh } from '../../types'
import { Component } from '../Component'

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    //FIXME: use typed enum
    mode = 4 // GPU topology mode

    constructor(parent: IGameObject) {
        super(parent, EntityTypes.mesh)
    }
}
