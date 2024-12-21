import {
    EntityID,
    IGameObject,
    IObjectManager,
    ISceneTree,
    SceneTreePosition,
} from '../../types'
import { SceneTree } from '../SceneTree'

type ObjectPositions = Map<EntityID, SceneTreePosition | null>

export class ObjectManager implements IObjectManager {
    private _objectPositions: ObjectPositions = new Map()
    private _sceneTree: ISceneTree = new SceneTree()

    public get sceneTree() {
        return this._sceneTree
    }

    private getObjectPosition(gameObject?: IGameObject | null) {
        return gameObject
            ? this._objectPositions.get(gameObject.id) ?? null
            : null
    }

    public addObject(child: IGameObject, target?: IGameObject) {
        const position = this._sceneTree.addNodeAt(
            this.getObjectPosition(target),
            {
                gameObject: child,
                children: new Map(),
            }
        )

        this._objectPositions.set(child.id, position)
    }

    public reparentObject(child: IGameObject, target?: IGameObject) {
        const childPosition = this._objectPositions.get(child.id)

        if (!childPosition) {
            throw new Error(`Position record not found for ${child.id}`)
        }

        const newPosition = this._sceneTree.reparentNode(
            this.getObjectPosition(target),
            childPosition
        )

        this._objectPositions.set(child.id, newPosition)
    }

    public destroyObject(gameObject: IGameObject) {
        const childPosition = this._objectPositions.get(gameObject.id)

        if (!childPosition) {
            throw new Error(`Position record not found for ${gameObject.id}`)
        }

        const idsToRemove = this._sceneTree.removeNode(childPosition)

        idsToRemove.forEach((id) => {
            this._objectPositions.delete(id)
        })
    }
}
