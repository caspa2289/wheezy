import {
    IMeshRenderData,
    IMeshRenderDataStorage,
} from '../../types/core/MeshRenderDataStorage'

export class MeshRenderDataStorage implements IMeshRenderDataStorage {
    _data: Map<string, IMeshRenderData> = new Map()

    get data() {
        return this._data
    }
}
