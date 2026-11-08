import { type IGameObject } from '../GameObject'
import { type ISceneTree } from '../SceneTree'

export interface IObjectManager {
    addObject: (child: IGameObject, target?: IGameObject) => void
    reparentObject: (child: IGameObject, target?: IGameObject) => void
    destroyObject: (gameObject: IGameObject) => void
    sceneTree: ISceneTree
}
