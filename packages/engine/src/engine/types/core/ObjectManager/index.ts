import { type Mat4 } from 'wgpu-matrix'
import { type IGameObject } from '../GameObject'
import { type ISceneTree, type SceneTreePosition } from '../SceneTree'

export interface IObjectManager {
    addObject: (child: IGameObject, target?: IGameObject) => void
    reparentObject: (child: IGameObject, target?: IGameObject) => void
    destroyObject: (gameObject: IGameObject) => void
    /** root→node id path of a registered object, null when not in the tree */
    getObjectPath: (gameObject: IGameObject) => SceneTreePosition | null
    /** ancestors' transforms × the object's own, written into dst */
    resolveWorldMatrix: (gameObject: IGameObject, dst: Mat4) => Mat4
    sceneTree: ISceneTree
}
