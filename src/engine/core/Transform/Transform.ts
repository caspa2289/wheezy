import {
    EntityTypes,
    IGameObject,
    TransformationMatrix,
    TRS,
} from '../../types'
import { ITransform } from '../../types'
import { Component } from '../Component'

export class Transform
    extends Component<EntityTypes.transform>
    implements ITransform
{
    matrix?: TransformationMatrix
    scale?: TRS['scale']
    rotation?: TRS['rotation']
    translation?: TRS['translation']

    constructor(
        parent: IGameObject,
        trs?: Partial<TRS>,
        matrix?: TransformationMatrix
    ) {
        super(parent, EntityTypes.transform)
        if (matrix) {
            this.matrix = matrix
        } else {
            this.scale = trs?.scale ?? [1, 1, 1]
            this.rotation = trs?.rotation ?? [0, 0, 0, 1]
            this.translation = trs?.translation ?? [0, 0, 0]
        }
    }
}
