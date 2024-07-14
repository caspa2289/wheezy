import { EntityID } from '../Entity'
import { IGameObject } from '../GameObject'

export type SceneNode = [EntityID, SceneNode[]]
export type SceneTreePosition = number[]

export interface ISceneTree {
    nodes: SceneNode[]
    addNodeAt: (
        position: SceneTreePosition | null,
        node: SceneNode
    ) => SceneTreePosition
    addNodeAsChild: (parent: IGameObject, child: IGameObject) => void
    reparentNode: (target: IGameObject, child: IGameObject) => void
    removeNode: (object: IGameObject) => void
}
