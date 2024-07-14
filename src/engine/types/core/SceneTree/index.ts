import { EntityID } from '../Entity'
import { IGameObject } from '../GameObject'

export type SceneNode = Map<EntityID, SceneNodeContent>

export type SceneNodeContent = {
    gameObject: IGameObject
    children: SceneNode | null
}

export type SceneTreePosition = EntityID[]

export interface ISceneTree {
    nodes: SceneNode
    addNodeAt: (
        position: SceneTreePosition | null,
        node: SceneNodeContent
    ) => SceneTreePosition
    reparentNode: (
        target: SceneTreePosition | null,
        child: SceneTreePosition
    ) => SceneTreePosition
    //returns an array of gameObject ids to be cleared from ObjectManager
    removeNode: (targetPosition: SceneTreePosition) => EntityID[]
    getNodeContentAt: (position: SceneTreePosition) => SceneNodeContent | null
}
