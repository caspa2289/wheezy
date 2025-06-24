import {
    EntityTypes,
    GLTFAccessor,
    IGameObject,
    IMaterial,
    IMesh,
    IMeshAnimationSkin,
} from '../../types'
import { Component } from '../Component'

export class Mesh extends Component<EntityTypes.mesh> implements IMesh {
    mode = 4 // GPU topology mode
    positions: GLTFAccessor
    indices: GLTFAccessor
    textureCoordinates: GLTFAccessor
    tangents: GLTFAccessor
    normals: GLTFAccessor
    material: IMaterial
    isPipelineBuilt: boolean = false
    skin?: IMeshAnimationSkin

    constructor(
        parent: IGameObject,
        positions: GLTFAccessor,
        indices: GLTFAccessor,
        normals: GLTFAccessor,
        textureCoordinates: GLTFAccessor,
        tangents: GLTFAccessor,
        material: IMaterial,
        skin?: IMeshAnimationSkin
    ) {
        super(parent, EntityTypes.mesh)

        this.positions = positions
        this.indices = indices
        this.textureCoordinates = textureCoordinates
        this.material = material
        this.normals = normals
        this.tangents = tangents
        this.skin = skin
    }
}
