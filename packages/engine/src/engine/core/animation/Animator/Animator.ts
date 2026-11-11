import {
    type EntityID,
    EntityTypes,
    type IAnimationClip,
    type IAnimationLayer,
    type IAnimationState,
    type IAnimationSystem,
    type IAnimator,
    type IGameObject,
    type IMesh,
    type IPlayAnimationOptions,
    type ITransform,
    type TAnimationMask,
} from '../../../types'
import { Component } from '../../Component'
import { AnimationClip } from '../AnimationClip'
import {
    composeTRS,
    conjugateQuat,
    decomposeTRS,
    lerpFloats,
    mulQuat,
    normalizeQuat,
    slerpQuat,
} from '../trs'

const IDENTITY_QUAT = new Float32Array([0, 0, 0, 1])

/** everything the mixer needs per animated node, preallocated at bind time */
interface NodeRecord {
    gameObject: IGameObject
    transform: ITransform
    /** bind pose, captured lazily before the first evaluation */
    baseT: Float32Array
    baseQ: Float32Array
    baseS: Float32Array
    /** accumulator: the pose composed into Transform.matrix */
    accT: Float32Array
    accQ: Float32Array
    accS: Float32Array
    /** running blend of the current layer */
    layerT: Float32Array
    layerQ: Float32Array
    layerS: Float32Array
    /** per-state sample scratch */
    sampleT: Float32Array
    sampleQ: Float32Array
    sampleS: Float32Array
    /** additive reference-pose scratch */
    refT: Float32Array
    refQ: Float32Array
    refS: Float32Array
    /** additive delta scratch */
    deltaT: Float32Array
    deltaQ: Float32Array
    deltaS: Float32Array
    tmpQ: Float32Array
}

interface MorphRecord {
    mesh: IMesh
    base: Float32Array
    acc: Float32Array
    layerAcc: Float32Array
    sample: Float32Array
    ref: Float32Array
    count: number
}

class AnimationState implements IAnimationState {
    clip: IAnimationClip
    time = 0
    speed = 1
    loop = true
    weight = 1
    /** internal: fade target and rate (weight units per second) */
    targetWeight = 1
    fadeSpeed = 0
    /** internal: additive reference pose time, seconds */
    referenceTime = 0

    constructor(clip: IAnimationClip) {
        this.clip = clip
    }
}

class AnimationLayer implements IAnimationLayer {
    weight = 1
    blend: IAnimationLayer['blend'] = 'override'
    mask?: TAnimationMask
    states: AnimationState[] = []
}

const maskPasses = (
    mask: TAnimationMask | undefined,
    gameObject: IGameObject
) => {
    if (!mask) {
        return true
    }
    if (mask instanceof Set) {
        return mask.has(gameObject.id)
    }
    return mask(gameObject)
}

/**
 * Animation playback component, attached to a model's root GameObject by the
 * model uploader (or manually). Plays clips from its library on a stack of
 * layers with per-layer weight, node mask and override/additive blending;
 * clips crossfade with timed weight transitions. Every method is safe to
 * call from anywhere, including `Scene.onRender` — the AnimationSystem
 * evaluates right after it, so tweaks apply in the same frame.
 *
 * All per-frame work runs on preallocated typed arrays (no allocation in
 * `update`). The evaluator owns the transforms of every node any registered
 * clip animates: while the animator is active those nodes are reset to
 * their captured bind pose before layers are applied, so manual edits to
 * animated nodes are overwritten.
 */
export class Animator
    extends Component<EntityTypes.animator>
    implements IAnimator
{
    readonly clips = new Map<string, AnimationClip>()

    #system: IAnimationSystem
    #layers: AnimationLayer[] = []
    #nodeRecords = new Map<EntityID, NodeRecord>()
    #morphRecords = new Map<EntityID, MorphRecord>()
    #baseCaptured = false
    #paused = false
    #registered = false

    constructor(
        parent: IGameObject,
        system: IAnimationSystem,
        clips?: Iterable<IAnimationClip>
    ) {
        super(parent, EntityTypes.animator)
        this.#system = system
        if (clips) {
            for (const clip of clips) {
                this.addClip(clip)
            }
        }
    }

    addClip(clip: IAnimationClip) {
        this.clips.set(clip.name, clip as AnimationClip)
        this.#indexClip(clip as AnimationClip)
    }

    get playing() {
        for (const layer of this.#layers) {
            for (const state of layer.states) {
                if (state.weight > 0) {
                    return true
                }
            }
        }
        return false
    }

    get paused() {
        return this.#paused
    }

    layer(index: number) {
        while (this.#layers.length <= index) {
            this.#layers.push(new AnimationLayer())
        }
        return this.#layers[index]!
    }

    play(name: string, options?: IPlayAnimationOptions) {
        const clip = this.clips.get(name)
        if (!clip) {
            console.warn(`wheezy: animator has no clip named "${name}"`)
            return undefined
        }

        const layer = this.layer(options?.layer ?? 0)
        if (options?.mask !== undefined) {
            layer.mask = options.mask
        }
        if (options?.blend !== undefined) {
            layer.blend = options.blend
        }

        const fade = Math.max(options?.fade ?? 0, 0)
        const targetWeight = options?.weight ?? 1

        let state = layer.states.find((candidate) => candidate.clip === clip)
        if (state) {
            state.time = options?.time ?? 0
            state.speed = options?.speed ?? 1
            state.loop = options?.loop ?? true
            state.referenceTime = options?.referenceTime ?? 0
        } else {
            state = new AnimationState(clip)
            state.time = options?.time ?? 0
            state.speed = options?.speed ?? 1
            state.loop = options?.loop ?? true
            state.referenceTime = options?.referenceTime ?? 0
            state.weight = fade > 0 ? 0 : targetWeight
            layer.states.push(state)
        }

        state.targetWeight = targetWeight
        state.fadeSpeed =
            fade > 0 ? Math.abs(targetWeight - state.weight) / fade : 0
        if (state.fadeSpeed === 0) {
            state.weight = targetWeight
        }

        // every other clip on the layer yields — with a crossfade when asked
        for (const other of layer.states) {
            if (other === state) {
                continue
            }
            if (fade > 0 && other.weight > 0) {
                other.targetWeight = 0
                other.fadeSpeed = other.weight / fade
            } else {
                other.weight = 0
                other.targetWeight = 0
                other.fadeSpeed = 0
            }
        }

        this.#setRegistered(true)
        return state
    }

    stop(name?: string, options?: { fade?: number }) {
        const fade = Math.max(options?.fade ?? 0, 0)
        for (const layer of this.#layers) {
            for (const state of layer.states) {
                if (name !== undefined && state.clip.name !== name) {
                    continue
                }
                if (fade > 0 && state.weight > 0) {
                    state.targetWeight = 0
                    state.fadeSpeed = state.weight / fade
                } else {
                    state.weight = 0
                    state.targetWeight = 0
                    state.fadeSpeed = 0
                }
            }
        }
        // the (still registered) next update evaluates the fade/removal and
        // unregisters once nothing contributes anymore
    }

    pause() {
        this.#paused = true
    }

    resume() {
        this.#paused = false
    }

    seek(name: string, time: number) {
        const state = this.state(name)
        if (state) {
            state.time = time
        }
    }

    state(name: string) {
        for (const layer of this.#layers) {
            for (const state of layer.states) {
                if (state.clip.name === name) {
                    return state
                }
            }
        }
        return undefined
    }

    get activeStates() {
        const states: IAnimationState[] = []
        for (const layer of this.#layers) {
            for (const state of layer.states) {
                if (state.weight > 0 || state.fadeSpeed > 0) {
                    states.push(state)
                }
            }
        }
        return states
    }

    /** internal: one evaluation step, dt in real seconds */
    update(dtSeconds: number) {
        if (this.#paused) {
            return
        }

        let anyStates = false
        for (const layer of this.#layers) {
            if (layer.states.length > 0) {
                anyStates = true
                break
            }
        }

        const alive = this.#advance(dtSeconds)

        if (anyStates) {
            if (!this.#baseCaptured) {
                this.#captureBase()
            }
            this.#evaluateNodes()
            this.#evaluateMorphs()
        }

        if (!alive) {
            this.#setRegistered(false)
        }
    }

    // --- internals ---

    /** advances playheads and fade weights; returns whether any state contributes */
    #advance(dtSeconds: number) {
        let alive = false

        for (const layer of this.#layers) {
            const states = layer.states
            for (let i = states.length - 1; i >= 0; i--) {
                const state = states[i]!

                if (state.fadeSpeed > 0) {
                    const direction = Math.sign(
                        state.targetWeight - state.weight
                    )
                    state.weight += direction * state.fadeSpeed * dtSeconds
                    if (
                        (direction > 0 && state.weight >= state.targetWeight) ||
                        (direction < 0 && state.weight <= state.targetWeight)
                    ) {
                        state.weight = state.targetWeight
                        state.fadeSpeed = 0
                    }
                }

                if (
                    state.weight <= 0 &&
                    state.fadeSpeed <= 0 &&
                    state.targetWeight <= 0
                ) {
                    states.splice(i, 1)
                    continue
                }

                if (state.weight <= 0) {
                    // mid fade-in (weight still 0): the state will contribute
                    // on a later frame, so the animator must stay registered —
                    // otherwise a dt = 0 frame (the engine's first render call)
                    // drops it before the fade ever advances
                    if (state.fadeSpeed > 0 && state.targetWeight > 0) {
                        alive = true
                    }
                    continue
                }

                const duration = state.clip.duration
                if (duration > 0) {
                    state.time += dtSeconds * state.speed
                    if (state.time >= duration) {
                        state.time = state.loop
                            ? state.time % duration
                            : duration
                    } else if (state.time < 0) {
                        state.time = state.loop
                            ? duration + (state.time % duration)
                            : 0
                    }
                }

                alive = true
            }
        }

        return alive
    }

    #captureBase() {
        for (const record of this.#nodeRecords.values()) {
            decomposeTRS(
                record.transform.matrix,
                record.baseT,
                record.baseQ,
                record.baseS
            )
        }
        for (const record of this.#morphRecords.values()) {
            record.base.set(record.mesh.morphWeights!)
        }
        this.#baseCaptured = true
    }

    #evaluateNodes() {
        for (const record of this.#nodeRecords.values()) {
            const { accT, accQ, accS, baseT, baseQ, baseS } = record
            accT.set(baseT)
            accQ.set(baseQ)
            accS.set(baseS)

            const nodeId = record.gameObject.id

            for (const layer of this.#layers) {
                if (layer.weight <= 0 || layer.states.length === 0) {
                    continue
                }
                if (!maskPasses(layer.mask, record.gameObject)) {
                    continue
                }

                let total = 0
                for (const state of layer.states) {
                    if (
                        state.weight > 0 &&
                        (state.clip as AnimationClip).nodeTracks.has(nodeId)
                    ) {
                        total += state.weight
                    }
                }
                if (total === 0) {
                    continue
                }

                if (layer.blend === 'additive') {
                    this.#accumulateAdditiveNodeLayer(layer, record)
                } else {
                    this.#accumulateOverrideNodeLayer(layer, record)
                }
            }

            composeTRS(accT, accQ, accS, record.transform.matrix)
        }
    }

    #accumulateOverrideNodeLayer(layer: AnimationLayer, record: NodeRecord) {
        const { layerT, layerQ, layerS, sampleT, sampleQ, sampleS } = record
        const nodeId = record.gameObject.id
        let running = 0
        let first = true

        for (const state of layer.states) {
            if (state.weight <= 0) {
                continue
            }
            const clip = state.clip as AnimationClip
            if (!clip.nodeTracks.has(nodeId)) {
                continue
            }
            this.#sampleNodePose(
                clip,
                record,
                state.time,
                state.loop ? clip.duration : 0
            )
            running += state.weight
            if (first) {
                layerT.set(sampleT)
                layerQ.set(sampleQ)
                layerS.set(sampleS)
                first = false
            } else {
                const f = state.weight / running
                lerpFloats(layerT, layerT, sampleT, f, 3)
                slerpQuat(layerQ, layerQ, sampleQ, f)
                lerpFloats(layerS, layerS, sampleS, f, 3)
            }
        }

        const lw = Math.min(Math.max(layer.weight, 0), 1)
        lerpFloats(record.accT, record.accT, layerT, lw, 3)
        slerpQuat(record.accQ, record.accQ, layerQ, lw)
        lerpFloats(record.accS, record.accS, layerS, lw, 3)
    }

    #accumulateAdditiveNodeLayer(layer: AnimationLayer, record: NodeRecord) {
        const { layerT, layerQ, layerS, deltaT, deltaQ, deltaS } = record
        const nodeId = record.gameObject.id
        let running = 0
        let first = true

        for (const state of layer.states) {
            if (state.weight <= 0) {
                continue
            }
            const clip = state.clip as AnimationClip
            if (!clip.nodeTracks.has(nodeId)) {
                continue
            }
            // pose at the playhead minus pose at the reference time = the
            // additive delta this state contributes
            const period = state.loop ? clip.duration : 0
            this.#sampleNodePose(clip, record, state.referenceTime, period)
            record.refT.set(record.sampleT)
            record.refQ.set(record.sampleQ)
            record.refS.set(record.sampleS)
            this.#sampleNodePose(clip, record, state.time, period)

            for (let i = 0; i < 3; i++) {
                deltaT[i] = record.sampleT[i]! - record.refT[i]!
                deltaS[i] =
                    record.refS[i] !== 0
                        ? record.sampleS[i]! / record.refS[i]! - 1
                        : 0
            }
            conjugateQuat(record.tmpQ, record.refQ)
            mulQuat(deltaQ, record.tmpQ, record.sampleQ)
            normalizeQuat(deltaQ)

            running += state.weight
            if (first) {
                layerT.set(deltaT)
                layerQ.set(deltaQ)
                layerS.set(deltaS)
                first = false
            } else {
                const f = state.weight / running
                lerpFloats(layerT, layerT, deltaT, f, 3)
                slerpQuat(layerQ, layerQ, deltaQ, f)
                lerpFloats(layerS, layerS, deltaS, f, 3)
            }
        }

        // apply: translation/scale offsets, rotation scaled toward identity
        const lw = layer.weight
        for (let i = 0; i < 3; i++) {
            record.accT[i] = record.accT[i]! + layerT[i]! * lw
            record.accS[i] = record.accS[i]! * (1 + layerS[i]! * lw)
        }
        slerpQuat(record.tmpQ, IDENTITY_QUAT, layerQ, lw)
        mulQuat(record.accQ, record.accQ, record.tmpQ)
        normalizeQuat(record.accQ)
    }

    /** samples the state's clip for this node into the record's sample slots */
    #sampleNodePose(
        clip: AnimationClip,
        record: NodeRecord,
        time: number,
        period: number
    ) {
        const tracks = clip.nodeTracks.get(record.gameObject.id)
        if (tracks?.translation) {
            AnimationClip.sample(
                tracks.translation,
                time,
                record.sampleT as Float32Array,
                period
            )
        } else {
            record.sampleT.set(record.baseT)
        }
        if (tracks?.rotation) {
            AnimationClip.sample(
                tracks.rotation,
                time,
                record.sampleQ as Float32Array,
                period
            )
        } else {
            record.sampleQ.set(record.baseQ)
        }
        if (tracks?.scale) {
            AnimationClip.sample(
                tracks.scale,
                time,
                record.sampleS as Float32Array,
                period
            )
        } else {
            record.sampleS.set(record.baseS)
        }
    }

    #evaluateMorphs() {
        for (const record of this.#morphRecords.values()) {
            const { acc, base, layerAcc, sample, ref, count, mesh } = record
            acc.set(base)

            const meshId = mesh.id
            const owner = mesh.parent

            for (const layer of this.#layers) {
                if (layer.weight <= 0 || layer.states.length === 0) {
                    continue
                }
                if (!maskPasses(layer.mask, owner)) {
                    continue
                }

                let total = 0
                for (const state of layer.states) {
                    if (
                        state.weight > 0 &&
                        (state.clip as AnimationClip).meshTracks.has(meshId)
                    ) {
                        total += state.weight
                    }
                }
                if (total === 0) {
                    continue
                }

                layerAcc.set(base)
                let running = 0
                let first = true

                for (const state of layer.states) {
                    if (state.weight <= 0) {
                        continue
                    }
                    const clip = state.clip as AnimationClip
                    const tracks = clip.meshTracks.get(meshId)
                    if (!tracks) {
                        continue
                    }
                    const track = tracks[0]!
                    const components = Math.min(track.componentsPerKey, count)
                    const period = state.loop ? clip.duration : 0

                    if (layer.blend === 'additive') {
                        AnimationClip.sample(track, state.time, sample, period)
                        AnimationClip.sample(
                            track,
                            state.referenceTime,
                            ref,
                            period
                        )
                        for (let i = 0; i < components; i++) {
                            sample[i] = sample[i]! - ref[i]!
                        }
                    } else {
                        AnimationClip.sample(track, state.time, sample, period)
                    }

                    running += state.weight
                    if (first) {
                        for (let i = 0; i < components; i++) {
                            layerAcc[i] = sample[i]!
                        }
                        first = false
                    } else {
                        const f = state.weight / running
                        for (let i = 0; i < components; i++) {
                            layerAcc[i] =
                                layerAcc[i]! + (sample[i]! - layerAcc[i]!) * f
                        }
                    }
                }

                const lw = Math.min(Math.max(layer.weight, 0), 1)
                for (let i = 0; i < count; i++) {
                    acc[i] = acc[i]! + (layerAcc[i]! - acc[i]!) * lw
                }
            }

            mesh.morphWeights!.set(acc)
        }
    }

    #indexClip(clip: AnimationClip) {
        for (const [nodeId, tracks] of clip.nodeTracks) {
            if (this.#nodeRecords.has(nodeId)) {
                continue
            }
            const gameObject =
                tracks.translation?.target ??
                tracks.rotation?.target ??
                tracks.scale?.target
            if (!gameObject) {
                continue
            }
            this.#nodeRecords.set(nodeId, {
                gameObject,
                transform: gameObject.transform,
                baseT: new Float32Array(3),
                baseQ: new Float32Array(IDENTITY_QUAT),
                baseS: new Float32Array([1, 1, 1]),
                accT: new Float32Array(3),
                accQ: new Float32Array(IDENTITY_QUAT),
                accS: new Float32Array([1, 1, 1]),
                layerT: new Float32Array(3),
                layerQ: new Float32Array(IDENTITY_QUAT),
                layerS: new Float32Array([1, 1, 1]),
                sampleT: new Float32Array(3),
                sampleQ: new Float32Array(IDENTITY_QUAT),
                sampleS: new Float32Array([1, 1, 1]),
                refT: new Float32Array(3),
                refQ: new Float32Array(IDENTITY_QUAT),
                refS: new Float32Array([1, 1, 1]),
                deltaT: new Float32Array(3),
                deltaQ: new Float32Array(IDENTITY_QUAT),
                deltaS: new Float32Array([1, 1, 1]),
                tmpQ: new Float32Array(IDENTITY_QUAT),
            })
        }

        for (const [meshId, tracks] of clip.meshTracks) {
            if (this.#morphRecords.has(meshId)) {
                continue
            }
            const mesh = tracks[0]?.mesh
            if (!mesh?.morphWeights || mesh.morphWeights.length === 0) {
                continue
            }
            const count = mesh.morphWeights.length
            this.#morphRecords.set(meshId, {
                mesh,
                base: Float32Array.from(mesh.morphWeights),
                acc: new Float32Array(count),
                layerAcc: new Float32Array(count),
                sample: new Float32Array(count),
                ref: new Float32Array(count),
                count,
            })
        }
    }

    #setRegistered(value: boolean) {
        if (value === this.#registered) {
            return
        }
        this.#registered = value
        if (value) {
            this.#system.register(this)
        } else {
            this.#system.unregister(this)
        }
    }
}
