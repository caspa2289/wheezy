import { EntityTypes, type IEntity } from '../../types'

export class Entity<T extends EntityTypes> implements IEntity<T> {
    #id: string
    #type: T

    constructor(type: T) {
        this.#id = this.#generateId()
        this.#type = type
    }

    #generateId() {
        return String(Math.random())
    }

    get id() {
        return this.#id
    }

    get type() {
        return this.#type
    }
}
