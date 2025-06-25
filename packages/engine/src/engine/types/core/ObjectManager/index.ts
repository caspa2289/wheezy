import { EntityType } from '../Entity'
import { IGameObject } from '../GameObject'
import { ISceneTree } from '../SceneTree'

export interface IObjectManager {
    addObject: (child: IGameObject, target?: IGameObject) => void
    reparentObject: (child: IGameObject, target?: IGameObject) => void
    destroyObject: (gameObject: IGameObject) => void
    //FIXME: that`s really bad
    getFirstChildOfType: (gameObject: IGameObject, type: EntityType) => any
    sceneTree: ISceneTree
}
