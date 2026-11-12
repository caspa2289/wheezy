import { type Mat4, mat4 } from 'wgpu-matrix'
import {
    type EntityID,
    type IGameObject,
    type IObjectManager,
    type ISceneTree,
    type SceneNode,
    type SceneNodeContent,
    type SceneTreePosition,
} from '../../types'
import { SceneTree } from '../SceneTree'

type ObjectPositions = Map<EntityID, SceneTreePosition | null>

export class ObjectManager implements IObjectManager {
    #objectPositions: ObjectPositions = new Map()
    #sceneTree: ISceneTree = new SceneTree()

    public get sceneTree() {
        return this.#sceneTree
    }

    #getObjectPosition(gameObject?: IGameObject | null) {
        return gameObject
            ? (this.#objectPositions.get(gameObject.id) ?? null)
            : null
    }

    public getObjectPath(gameObject: IGameObject): SceneTreePosition | null {
        return this.#objectPositions.get(gameObject.id) ?? null
    }

    /**
     * The object's world matrix: its scene-tree ancestors' transforms composed
     * with its own, written into `dst`. Objects not registered in the tree (or
     * with a stale path record) resolve to their own transform matrix — or
     * identity when they have no transform.
     */
    public resolveWorldMatrix(gameObject: IGameObject, dst: Mat4): Mat4 {
        const path = this.#objectPositions.get(gameObject.id)
        if (!path) {
            return this.#ownMatrix(gameObject, dst)
        }

        mat4.identity(dst)
        let siblings: SceneNode | null = this.#sceneTree.nodes
        for (const id of path) {
            const node: SceneNodeContent | undefined = siblings?.get(id)
            if (!node) {
                return this.#ownMatrix(gameObject, dst)
            }
            const transform = node.gameObject.transform
            if (transform) {
                mat4.mul(dst, transform.matrix, dst)
            }
            siblings = node.children
        }
        return dst
    }

    #ownMatrix(gameObject: IGameObject, dst: Mat4): Mat4 {
        const transform = gameObject.transform
        return transform ? mat4.copy(transform.matrix, dst) : mat4.identity(dst)
    }

    public addObject(child: IGameObject, target?: IGameObject) {
        const position = this.#sceneTree.addNodeAt(
            this.#getObjectPosition(target),
            {
                gameObject: child,
                children: new Map(),
            }
        )

        this.#objectPositions.set(child.id, position)
    }

    public reparentObject(child: IGameObject, target?: IGameObject) {
        const childPosition = this.#objectPositions.get(child.id)

        if (!childPosition) {
            throw new Error(`Position record not found for ${child.id}`)
        }

        const newPosition = this.#sceneTree.reparentNode(
            this.#getObjectPosition(target),
            childPosition
        )

        this.#objectPositions.set(child.id, newPosition)
    }

    public destroyObject(gameObject: IGameObject) {
        const childPosition = this.#objectPositions.get(gameObject.id)

        if (!childPosition) {
            throw new Error(`Position record not found for ${gameObject.id}`)
        }

        const idsToRemove = this.#sceneTree.removeNode(childPosition)

        idsToRemove.forEach((id) => {
            this.#objectPositions.delete(id)
        })
    }
}
