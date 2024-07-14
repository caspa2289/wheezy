export enum EntityTypes {
    gameObject = 'gameObject',
    component = 'component',
}

export type EntityType = keyof typeof EntityTypes

export type EntityID = string

export interface IEntity<T extends Partial<EntityType>> {
    id: EntityID
    type: T
}
