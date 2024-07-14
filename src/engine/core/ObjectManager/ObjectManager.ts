import { EntityID, IGameObject, IObjectManager } from '../../types'

export class ObjectManager implements IObjectManager {
    _objects: Map<EntityID, IGameObject> = new Map()

    get objects() {
        return this._objects
    }

    //FIXME: should always be a child of smth
    public add(object: IGameObject) {
        this._objects.set(object.id, object)
    }

    public remove(id: EntityID) {
        //FIXME: clear up scene tree
        //FIXME: remove children as well
        this._objects.delete(id)
    }
}
