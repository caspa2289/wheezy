import { IAnimation } from '../../types'
import { IAnimator } from '../../types/core/Animator'

export interface IAnimationRuntime extends IAnimation {}

export class Animator implements IAnimator {
    _animations: Map<string, IAnimation> = new Map()
    _skinBindGroupLayout!: GPUBindGroupLayout

    constructor(device: GPUDevice) {
        this._skinBindGroupLayout = device.createBindGroupLayout({
            label: 'animation skin bindGroupLayout',
            entries: [
                //initial joint matrices buffer
                {
                    binding: 0,
                    buffer: {
                        type: 'read-only-storage',
                    },
                    visibility: GPUShaderStage.VERTEX,
                },
                //inverse bind matrices buffer
                {
                    binding: 1,
                    buffer: {
                        type: 'read-only-storage',
                    },
                    visibility: GPUShaderStage.VERTEX,
                },
            ],
        })
    }

    public addAnimations(animations: IAnimation[]) {
        animations.forEach((animation) =>
            this._animations.set(
                animation.name ?? String(Math.random()),
                animation
            )
        )
    }

    get animations() {
        return this._animations
    }

    get skinBindGroupLayout() {
        return this._skinBindGroupLayout
    }
}
