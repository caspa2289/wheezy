import { IGameObject } from '../GameObject'

export interface IObjectManager {
    addObject: (child: IGameObject, target?: IGameObject) => void
    reparentObject: (child: IGameObject, target?: IGameObject) => void
    destroyObject: (gameObject: IGameObject) => void
}
