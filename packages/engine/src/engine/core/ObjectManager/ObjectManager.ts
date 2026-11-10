import {
    type EntityID,
    type IGameObject,
    type IObjectManager,
    type ISceneTree,
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
