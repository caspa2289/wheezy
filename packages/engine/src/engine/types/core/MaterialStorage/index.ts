import { IMaterial } from '../Mesh'

export interface IMaterialStorage {
    materials: Map<string, IMaterial>
}
