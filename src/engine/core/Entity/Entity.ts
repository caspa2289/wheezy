import { EntityTypes, IEntity } from '../../types'

export class Entity<T extends EntityTypes> implements IEntity<T> {
    private _id: string
    private _type: T

    constructor(type: T) {
        this._id = this._generateId()
        this._type = type
    }

    private _generateId() {
        return String(Math.random())
    }

    get id() {
        return this._id
    }

    get type() {
        return this._type
    }
}
