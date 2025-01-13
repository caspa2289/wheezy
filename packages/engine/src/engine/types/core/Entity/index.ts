export enum EntityTypes {
    gameObject = 'gameObject',
    mesh = 'mesh',
    material = 'material',
    transform = 'transform',
    camera = 'camera',
    collider = 'collider',
    physicsObject = 'physicsObject',
    light = 'light',
}

export type EntityType = keyof typeof EntityTypes

export type EntityID = string

export interface IEntity<T extends Partial<EntityType>> {
    id: EntityID
    type: T
}
