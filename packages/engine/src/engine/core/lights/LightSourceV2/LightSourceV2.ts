import { mat4, type Mat4, vec3, type Vec3 } from 'wgpu-matrix'
import { Component } from '../../Component'
import { EntityTypes, type IGameObject } from '../../../types'

export enum LIGHT_SOURCE_TYPES {
    directional = 'directional',
    point = 'point',
    spot = 'spot',
}

export type TLightSourceType = keyof typeof LIGHT_SOURCE_TYPES

export interface ILightSourceV2 {
    color: Vec3
    intensity: number
    lightType: TLightSourceType
    parent: IGameObject
    /** debug marker managed by LightGizmo.sync — do not set manually */
    gizmo?: IGameObject
    /**
     * world position the debug gizmo pins to; null means no gizmo. Point/spot
     * return their resolved world position, directional the world origin
     * (their pointAt anchor).
     */
    gizmoPosition: Vec3 | null

    /**
     * Refreshes the light's resolved world pose from its parent's world
     * matrix. Called once per light per frame by LightUploader.resolvePoses
     * before any consumer (GPU upload, shadows, gizmos) reads the world
     * position/direction.
     */
    updateWorldPose: (parentWorld: Mat4) => void

    /**
     * Writes the flat float layout uploaded to the GPU into `dst` at `offset`
     * (elementCount floats — see the light byte strides in
     * Renderer/constants.ts). Called once per light per frame by the
     * LightUploader; the shadow-caster and range pad slots are patched after.
     */
    fillLightData: (dst: Float32Array, offset: number) => void
}

export interface ILightSourceV2Props {
    color?: Vec3
    intensity?: number
    lightType: TLightSourceType
    parent: IGameObject
}

export abstract class LightSourceV2
    extends Component<EntityTypes.light>
    implements ILightSourceV2
{
    //color and intensity
    color: Vec3
    intensity: number
    gizmo?: IGameObject
    /** the parent's resolved world matrix — refreshed by updateWorldPose */
    readonly parentWorld = mat4.identity()
    #lightType: TLightSourceType

    constructor(props: ILightSourceV2Props) {
        super(props.parent, EntityTypes.light)

        this.#lightType = props.lightType
        this.color = props.color ?? vec3.create(1, 1, 1)
        this.intensity = props.intensity ?? 1
    }

    get lightType() {
        return this.#lightType
    }

    get gizmoPosition(): Vec3 | null {
        return null
    }

    updateWorldPose(parentWorld: Mat4) {
        mat4.copy(parentWorld, this.parentWorld)
    }

    abstract fillLightData(dst: Float32Array, offset: number): void
}
