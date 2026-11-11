import { type EntityID, EntityTypes } from '../Entity'
import { type IComponent } from '../Component'
import { type IGameObject } from '../GameObject'
import { type IMesh } from '../Mesh'

export type TAnimationInterpolation = 'STEP' | 'LINEAR' | 'CUBICSPLINE'

export type TAnimationTargetPath =
    'translation' | 'rotation' | 'scale' | 'weights'

export type TAnimationBlendMode = 'override' | 'additive'

/** node set a layer applies to; undefined = every animated node */
export type TAnimationMask =
    Set<EntityID> | ((gameObject: IGameObject) => boolean)

/** one animated property of one target; times ascend, values are flat SoA */
export interface IAnimationTrack {
    /** node target of a translation/rotation/scale track */
    target?: IGameObject
    /** mesh target of a weights (morph) track */
    mesh?: IMesh
    path: TAnimationTargetPath
    interpolation: TAnimationInterpolation
    /** keyframe times in seconds */
    times: Float32Array
    /**
     * componentsPerKey floats per key; CUBICSPLINE stores triples of
     * (in-tangent, value, out-tangent) per key
     */
    values: Float32Array
    componentsPerKey: number
}

export interface IAnimationTrackDescriptor {
    target?: IGameObject
    mesh?: IMesh
    path: TAnimationTargetPath
    interpolation?: TAnimationInterpolation
    times: Float32Array | number[]
    values: Float32Array | number[]
}

export interface IAnimationClipProps {
    name: string
    tracks: IAnimationTrackDescriptor[]
}

export interface IAnimationClip {
    name: string
    /** last keyframe time, seconds */
    duration: number
    tracks: IAnimationTrack[]
}

/** live playback handle of one clip inside a layer — fields are mutable */
export interface IAnimationState {
    clip: IAnimationClip
    /** playhead position in seconds */
    time: number
    speed: number
    loop: boolean
    /** blend weight, animated by fades */
    weight: number
}

export interface IPlayAnimationOptions {
    /** crossfade duration in seconds (0/undefined = hard switch) */
    fade?: number
    /** default true */
    loop?: boolean
    /** default 1 */
    speed?: number
    /** start playhead, seconds; default 0 */
    time?: number
    /** default 1 */
    weight?: number
    /** layer index, default 0 — layers are created on demand */
    layer?: number
    /** layer node mask (applied when the layer is created or a mask is given) */
    mask?: TAnimationMask
    /** layer blend mode (applied like mask) */
    blend?: TAnimationBlendMode
    /**
     * additive layers only: pose sample time of the clip that is subtracted
     * from the sampled pose, seconds; default 0
     */
    referenceTime?: number
}

export interface IAnimationLayer {
    weight: number
    blend: TAnimationBlendMode
    mask?: TAnimationMask
    states: IAnimationState[]
}

export interface IAnimator extends IComponent<EntityTypes.animator> {
    /** clip library by name */
    clips: Map<string, IAnimationClip>
    addClip: (clip: IAnimationClip) => void
    /**
     * starts (or restarts) a clip; other clips on the same layer fade out
     * when `fade` is given. Returns the playback state, or undefined when
     * the clip name is unknown.
     */
    play: (
        name: string,
        options?: IPlayAnimationOptions
    ) => IAnimationState | undefined
    /** stops one clip (by name) or every clip; fades out when `fade` is given */
    stop: (name?: string, options?: { fade?: number }) => void
    pause: () => void
    resume: () => void
    /** sets a clip's playhead, seconds */
    seek: (name: string, time: number) => void
    /** live state of a playing clip (first match across layers) */
    state: (name: string) => IAnimationState | undefined
    /** every contributing playback state across all layers (fading included) */
    readonly activeStates: IAnimationState[]
    /** live layer object (created on demand) — mutate weight/mask/blend freely */
    layer: (index: number) => IAnimationLayer
    readonly playing: boolean
    readonly paused: boolean
    /** internal: driven by the AnimationSystem, dt in seconds */
    update: (dtSeconds: number) => void
}

export interface IAnimationSystem {
    /** internal: called once per frame by the renderer, dt in engine units */
    update: (dt: number) => void
    register: (animator: IAnimator) => void
    unregister: (animator: IAnimator) => void
}
