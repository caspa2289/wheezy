import { EntityTypes, IGameObject, TransformationMatrix } from '../../types'
import { ITransform } from '../../types'
import { Component } from '../Component'

export class Transform
    extends Component<EntityTypes.transform>
    implements ITransform
{
    matrix: TransformationMatrix

    constructor(parent: IGameObject, matrix: TransformationMatrix) {
        super(parent, EntityTypes.transform)
        this.matrix = matrix
    }
}
