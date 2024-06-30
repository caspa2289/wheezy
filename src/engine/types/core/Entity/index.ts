export enum EntityTypes {
    gameObject = 'gameObject',
    component = 'component',
    mesh = 'mesh',
}

export type EntityType = keyof typeof EntityTypes

export interface IEntity<T extends EntityType> {
    id: string
    type: T
}
