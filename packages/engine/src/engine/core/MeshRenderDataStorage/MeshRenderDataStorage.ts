import {
    type IMeshRenderData,
    type IMeshRenderDataStorage,
} from '../../types/core/MeshRenderDataStorage'

export class MeshRenderDataStorage implements IMeshRenderDataStorage {
    #data: Map<string, IMeshRenderData> = new Map()

    get data() {
        return this.#data
    }
}
