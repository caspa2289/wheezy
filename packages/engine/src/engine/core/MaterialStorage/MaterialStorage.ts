import { type IMaterial } from '../../types'
import { type IMaterialStorage } from '../../types/core/MaterialStorage'

export class MaterialStorage implements IMaterialStorage {
    #materials: Map<string, IMaterial> = new Map()

    get materials() {
        return this.#materials
    }
}
