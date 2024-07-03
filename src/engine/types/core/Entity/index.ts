export enum EntityTypes {
    gameObject = 'gameObject',
    component = 'component',
}

export type EntityType = keyof typeof EntityTypes

export interface IEntity<T extends Partial<EntityType>> {
    id: string
    type: T
}
