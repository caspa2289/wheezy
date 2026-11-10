import { Profiler } from '../Profiler'

// 7 passes (geometry, shadow, culling compute, lighting, skybox, tonemap,
// fxaa) × begin/end; the fxaa pass is skipped when anti-aliasing is off, so
// only the first 12 timestamps are written then
export const GPU_QUERY_COUNT_FULL = 14
export const GPU_QUERY_COUNT_NO_FXAA = 12

/**
 * GPU pass timing via timestamp queries: the query set, the resolve/readback
 * buffers and the one-frame-in-flight guard. FramePlan wires `timestampWrites`
 * into the pass descriptors from `querySet`.
 */
export class GpuTimer {
    readonly supported: boolean
    querySet?: GPUQuerySet

    #resolveBuffer?: GPUBuffer
    #readbackBuffer?: GPUBuffer
    #readbackPending = false

    constructor(device: GPUDevice, supported: boolean) {
        this.supported = supported
        if (!supported) {
            return
        }

        this.querySet = device.createQuerySet({
            label: 'profiler timestamp query set',
            type: 'timestamp',
            count: GPU_QUERY_COUNT_FULL,
        })

        this.#resolveBuffer = device.createBuffer({
            label: 'profiler timestamp resolve buffer',
            size: GPU_QUERY_COUNT_FULL * 8,
            usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC,
        })

        this.#readbackBuffer = device.createBuffer({
            label: 'profiler timestamp readback buffer',
            size: GPU_QUERY_COUNT_FULL * 8,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        })
    }

    get canResolveThisFrame() {
        return this.supported && !this.#readbackPending
    }

    /**
     * Resolves the timestamps this frame produced; `queryCount` comes from the
     * frame plan (12 without the fxaa pass, 14 with it).
     */
    resolve(encoder: GPUCommandEncoder, queryCount: number) {
        encoder.resolveQuerySet(
            this.querySet!,
            0,
            queryCount,
            this.#resolveBuffer!,
            0
        )
        encoder.copyBufferToBuffer(
            this.#resolveBuffer!,
            0,
            this.#readbackBuffer!,
            0,
            queryCount * 8
        )
        this.#readbackPending = true
    }

    readTimestamps(fxaaTimed: boolean) {
        const readbackBuffer = this.#readbackBuffer!

        readbackBuffer
            .mapAsync(GPUMapMode.READ)
            .then(() => {
                const timestamps = new BigUint64Array(
                    readbackBuffer.getMappedRange()
                )

                const durationMs = (begin: number, end: number) =>
                    Number(timestamps[end]! - timestamps[begin]!) / 1e6

                Profiler.sample('gpu geometry', durationMs(0, 1))
                Profiler.sample('gpu shadow', durationMs(2, 3))
                Profiler.sample('gpu culling', durationMs(4, 5))
                Profiler.sample('gpu lighting', durationMs(6, 7))
                Profiler.sample('gpu skybox', durationMs(8, 9))
                Profiler.sample('gpu tonemap', durationMs(10, 11))
                // indices 12/13 are only written when the fxaa pass ran
                if (fxaaTimed) {
                    Profiler.sample('gpu fxaa', durationMs(12, 13))
                }

                readbackBuffer.unmap()
                this.#readbackPending = false
            })
            .catch(() => {
                this.#readbackPending = false
            })
    }
}
