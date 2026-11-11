import { type IAnimationSystem, type IAnimator } from '../../../types'

/** engine dt (frameDelta / 100) to real seconds */
const DT_TO_SECONDS = 0.1

/**
 * Scene-owned animation director. Animators register themselves while they
 * have contributing playback states, so idle animators cost nothing — the
 * per-frame work is one pass over the active set. `update` is called by the
 * renderer right after `scene.onRender`, before the traversal, so playback
 * tweaks made in the game loop land in the same frame.
 */
export class AnimationSystem implements IAnimationSystem {
    #active: IAnimator[] = []

    register(animator: IAnimator) {
        if (this.#active.indexOf(animator) === -1) {
            this.#active.push(animator)
        }
    }

    unregister(animator: IAnimator) {
        const index = this.#active.indexOf(animator)
        if (index !== -1) {
            // swap-remove: order is irrelevant and this keeps the array dense
            const last = this.#active.pop()!
            if (index < this.#active.length) {
                this.#active[index] = last
            }
        }
    }

    /** dt in engine units (frameDelta / 100), converted to clip seconds here */
    update(dt: number) {
        const dtSeconds = dt * DT_TO_SECONDS
        const active = this.#active
        // backwards: an animator that finishes this frame unregisters itself
        // (swap-remove), which only touches slots already visited
        for (let i = active.length - 1; i >= 0; i--) {
            active[i]!.update(dtSeconds)
        }
    }
}
