import {
    EntityTypes,
    type GLTFAccessor,
    type IGameObject,
    type IMaterial,
    type IMesh,
    type IMorphTargets,
    type ISkin,
} from '../../types'
import { Component } from '../Component'

/** optional skinning/morph data passed by the model uploader */
export interface MeshExtras {
    joints?: GLTFAccessor
    weights?: GLTFAccessor
    skin?: ISkin
    morphTargets?: IMorphTargets
    morphWeights?: Float32Array
}

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    mode = 4 // GPU topology mode
    positions: GLTFAccessor
    indices: GLTFAccessor
    textureCoordinates: GLTFAccessor
    tangents: GLTFAccessor
    normals: GLTFAccessor
    material: IMaterial
    isPipelineBuilt: boolean = false
    castShadow: boolean = true
    joints?: GLTFAccessor
    weights?: GLTFAccessor
    skin?: ISkin
    morphTargets?: IMorphTargets
    morphWeights?: Float32Array

    constructor(
        parent: IGameObject,
        positions: GLTFAccessor,
        indices: GLTFAccessor,
        normals: GLTFAccessor,
        textureCoordinates: GLTFAccessor,
        tangents: GLTFAccessor,
        material: IMaterial,
        extras?: MeshExtras
    ) {
        super(parent, EntityTypes.mesh)

        this.positions = positions
        this.indices = indices
        this.textureCoordinates = textureCoordinates
        this.material = material
        this.normals = normals
        this.tangents = tangents

        if (extras) {
            this.joints = extras.joints
            this.weights = extras.weights
            this.skin = extras.skin
            this.morphTargets = extras.morphTargets
            this.morphWeights = extras.morphWeights
        }
    }
}
