import {
    type EntityID,
    type IAnimationClip,
    type IAnimationClipProps,
    type IAnimationTrack,
} from '../../../types'

/** per-node translation/rotation/scale tracks of one clip */
export interface ClipNodeTracks {
    translation?: IAnimationTrack
    rotation?: IAnimationTrack
    scale?: IAnimationTrack
}

const toFloat32Array = (data: Float32Array | number[]) =>
    data instanceof Float32Array ? data : Float32Array.from(data)

/**
 * Immutable animation clip: a flat list of tracks plus the indexes the mixer
 * evaluates through (per-node TRS tracks, per-mesh morph-weight tracks).
 * Built from glTF `animations` by the model uploader, or programmatically
 * for code-authored node tracks. Keyframe data is SoA Float32Arrays;
 * sampling writes into caller-provided arrays and never allocates.
 */
export class AnimationClip implements IAnimationClip {
    readonly name: string
    readonly duration: number
    readonly tracks: IAnimationTrack[] = []
    /** node id → the TRS tracks of that node in this clip */
    readonly nodeTracks = new Map<EntityID, ClipNodeTracks>()
    /** mesh id → morph-weight tracks of that mesh in this clip */
    readonly meshTracks = new Map<EntityID, IAnimationTrack[]>()

    constructor({ name, tracks }: IAnimationClipProps) {
        this.name = name

        let duration = 0

        for (const descriptor of tracks) {
            const times = toFloat32Array(descriptor.times)
            const values = toFloat32Array(descriptor.values)
            const interpolation = descriptor.interpolation ?? 'LINEAR'
            const isWeights = descriptor.path === 'weights'

            if (isWeights ? !descriptor.mesh : !descriptor.target) {
                throw new Error(
                    `wheezy: animation track of clip "${name}" (${descriptor.path}) is missing its target`
                )
            }

            const tangentStride = interpolation === 'CUBICSPLINE' ? 3 : 1
            const componentsPerKey =
                times.length > 0
                    ? values.length / (times.length * tangentStride)
                    : 0

            const track: IAnimationTrack = {
                target: descriptor.target,
                mesh: descriptor.mesh,
                path: descriptor.path,
                interpolation,
                times,
                values,
                componentsPerKey,
            }
            this.tracks.push(track)

            if (times.length > 0) {
                duration = Math.max(duration, times[times.length - 1]!)
            }

            if (isWeights) {
                const meshId = descriptor.mesh!.id
                const list = this.meshTracks.get(meshId)
                if (list) {
                    list.push(track)
                } else {
                    this.meshTracks.set(meshId, [track])
                }
            } else {
                const nodeId = descriptor.target!.id
                let nodeTracks = this.nodeTracks.get(nodeId)
                if (!nodeTracks) {
                    nodeTracks = {}
                    this.nodeTracks.set(nodeId, nodeTracks)
                }
                nodeTracks[descriptor.path as 'translation'] = track
            }
        }

        this.duration = duration
    }

    /**
     * Samples a track at `time` (seconds) into `out` (componentsPerKey
     * floats). With `period` > 0 (looping playback) sampling is cyclic: the
     * time wraps into [firstKey, firstKey + period) and the leftover cycle
     * time interpolates the wrap segment lastKey → firstKey of the next
     * cycle, so open loops (keys not starting at 0, or ending one step before
     * closure) play seamlessly instead of freezing on the first key. With
     * `period` 0 the sample clamps outside the key range. Rotations lerp on
     * the sphere.
     */
    static sample(
        track: IAnimationTrack,
        time: number,
        out: Float32Array,
        period = 0
    ) {
        const { times, values, componentsPerKey, interpolation } = track
        const keyCount = times.length
        if (keyCount === 0 || componentsPerKey === 0) {
            return
        }

        const valueStride =
            componentsPerKey * (interpolation === 'CUBICSPLINE' ? 3 : 1)

        if (period > 0 && keyCount > 1) {
            const first = times[0]!
            const last = times[keyCount - 1]!
            const wrapped = first + AnimationClip.#mod(time - first, period)
            if (wrapped >= last) {
                // wrap segment: last key of this cycle → first key of the next
                const span = first + period - last
                const f = span > 0 ? (wrapped - last) / span : 0
                AnimationClip.#blendKeys(
                    track,
                    values,
                    valueStride,
                    keyCount - 1,
                    0,
                    span,
                    f,
                    out
                )
                return
            }
            time = wrapped
        }

        if (keyCount === 1 || time <= times[0]!) {
            AnimationClip.#copyKey(
                values,
                valueStride,
                0,
                componentsPerKey,
                out
            )
            return
        }
        if (time >= times[keyCount - 1]!) {
            AnimationClip.#copyKey(
                values,
                valueStride,
                keyCount - 1,
                componentsPerKey,
                out
            )
            return
        }

        // binary search: k is the segment start with times[k] <= time < times[k+1]
        let lo = 0
        let hi = keyCount - 1
        while (lo + 1 < hi) {
            const mid = (lo + hi) >> 1
            if (times[mid]! <= time) {
                lo = mid
            } else {
                hi = mid
            }
        }

        const t0 = times[lo]!
        const span = times[lo + 1]! - t0
        const f = span > 0 ? (time - t0) / span : 0
        AnimationClip.#blendKeys(
            track,
            values,
            valueStride,
            lo,
            lo + 1,
            span,
            f,
            out
        )
    }

    static #mod(value: number, period: number) {
        return ((value % period) + period) % period
    }

    /** evaluates one segment (keyA → keyB) at fraction f into out */
    static #blendKeys(
        track: IAnimationTrack,
        values: Float32Array,
        valueStride: number,
        keyA: number,
        keyB: number,
        span: number,
        f: number,
        out: Float32Array
    ) {
        const { componentsPerKey, interpolation } = track
        const offA = keyA * valueStride
        const offB = keyB * valueStride

        switch (interpolation) {
            case 'STEP': {
                AnimationClip.#copyKey(
                    values,
                    valueStride,
                    keyA,
                    componentsPerKey,
                    out
                )
                return
            }
            case 'CUBICSPLINE': {
                // glTF cubic spline: value sits between the in/out tangents of each key
                const cpk = componentsPerKey
                for (let i = 0; i < cpk; i++) {
                    const p0 = values[offA + cpk + i]!
                    const m0 = values[offA + 2 * cpk + i]!
                    const p1 = values[offB + cpk + i]!
                    const m1 = values[offB + i]!
                    const f2 = f * f
                    const f3 = f2 * f
                    out[i] =
                        (2 * f3 - 3 * f2 + 1) * p0 +
                        span * (f3 - 2 * f2 + f) * m0 +
                        (-2 * f3 + 3 * f2) * p1 +
                        span * (f3 - f2) * m1
                }
                if (track.path === 'rotation') {
                    AnimationClip.#normalizeQuatInPlace(out)
                }
                return
            }
            default: {
                // LINEAR — slerp for rotation quaternions (glTF spec), lerp otherwise
                if (track.path === 'rotation') {
                    AnimationClip.#slerpKeyRange(values, offA, offB, f, out)
                } else {
                    for (let i = 0; i < componentsPerKey; i++) {
                        const va = values[offA + i]!
                        out[i] = va + (values[offB + i]! - va) * f
                    }
                }
            }
        }
    }

    static #copyKey(
        values: Float32Array,
        valueStride: number,
        key: number,
        componentsPerKey: number,
        out: Float32Array
    ) {
        // CUBICSPLINE keys store (in-tangent, value, out-tangent) — take the value
        const offset =
            key * valueStride +
            (valueStride === componentsPerKey * 3 ? componentsPerKey : 0)
        for (let i = 0; i < componentsPerKey; i++) {
            out[i] = values[offset + i]!
        }
    }

    static #slerpKeyRange(
        values: Float32Array,
        offA: number,
        offB: number,
        f: number,
        out: Float32Array
    ) {
        let bx = values[offB]!
        let by = values[offB + 1]!
        let bz = values[offB + 2]!
        let bw = values[offB + 3]!

        const ax = values[offA]!
        const ay = values[offA + 1]!
        const az = values[offA + 2]!
        const aw = values[offA + 3]!

        let cosTheta = ax * bx + ay * by + az * bz + aw * bw
        if (cosTheta < 0) {
            bx = -bx
            by = -by
            bz = -bz
            bw = -bw
            cosTheta = -cosTheta
        }

        if (cosTheta > 0.9999) {
            out[0] = ax + (bx - ax) * f
            out[1] = ay + (by - ay) * f
            out[2] = az + (bz - az) * f
            out[3] = aw + (bw - aw) * f
            AnimationClip.#normalizeQuatInPlace(out)
            return
        }

        const theta = Math.acos(cosTheta)
        const sinTheta = Math.sqrt(1 - cosTheta * cosTheta)
        const wa = Math.sin((1 - f) * theta) / sinTheta
        const wb = Math.sin(f * theta) / sinTheta

        out[0] = ax * wa + bx * wb
        out[1] = ay * wa + by * wb
        out[2] = az * wa + bz * wb
        out[3] = aw * wa + bw * wb
    }

    static #normalizeQuatInPlace(q: Float32Array) {
        const len = Math.hypot(q[0]!, q[1]!, q[2]!, q[3]!)
        if (len === 0) {
            q[3] = 1
            return
        }
        const inv = 1 / len
        q[0] = q[0]! * inv
        q[1] = q[1]! * inv
        q[2] = q[2]! * inv
        q[3] = q[3]! * inv
    }
}
