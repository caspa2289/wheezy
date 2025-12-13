import {
    IAnimation,
    IAnimationChannel,
    IAnimationSampler,
    IMesh,
    IMeshAnimationJoint,
} from '../../types'
import { IAnimator } from '../../types/core/Animator'

export interface IAnimationRuntime extends IAnimation {
    name: string
    channels: IAnimationChannel[]
    samplers: (IAnimationSampler & { elapsedTime: number })[]
    inverseBindMatrices: Float32Array
    joints: IMeshAnimationJoint[]
}

export class Animator implements IAnimator {
    _animations: Map<string, IAnimation> = new Map()
    _skinBindGroupLayout!: GPUBindGroupLayout
    _runningAnimations: Map<string, IAnimationRuntime> = new Map()

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

    public animate = (mesh: IMesh, deltaTime: number) => {
        mesh.animations.forEach(({ name, isPlaying, speed }) => {
            if (!isPlaying) return

            const animationName = mesh.id + name

            let animationRuntimeData = this._runningAnimations.get(
                animationName
            ) as IAnimationRuntime

            if (!animationRuntimeData) {
                const { channels, samplers } = this._animations.get(name) ?? {}
                const { inverseBindMatrices, joints } = mesh.skin ?? {}

                if (!channels || !samplers || !inverseBindMatrices || !joints) {
                    return
                }

                const data = {
                    name: animationName,
                    channels,
                    samplers: samplers.map((item) => ({
                        ...item,
                        elapsedTime: 0,
                    })),
                    inverseBindMatrices,
                    joints,
                }

                this._runningAnimations.set(animationName, data)

                return
            }

            animationRuntimeData.channels.forEach((channel) => {
                const sampler = animationRuntimeData.samplers[channel.sampler]
                const node = animationRuntimeData.joints[channel.target.node]
                const path = channel.target.path

                const { elapsedTime } = sampler
                const {
                    min,
                    max,
                    componentType: inputComponentType,
                    data: inputData,
                    type: inputType,
                } = sampler.input

                const {
                    componentType: outputComponentType,
                    data: outputData,
                    type: outputType,
                } = sampler.output

                let newElapsedTime = elapsedTime + deltaTime
                if (newElapsedTime > max[0]) {
                    newElapsedTime = 0
                }

                sampler.elapsedTime = newElapsedTime

                if (!inputData.includes(elapsedTime)) {
                    const inputPairValues: number[] = [0, 0]
                    const inputPairIndexes: number[] = [0, 0]

                    //FIXME: this is super inefficient
                    //and doesn`t work
                    // inputData.forEach((value, index) => {
                    //     if (value > inputPairValues[0] && value < elapsedTime) {
                    //         inputPairValues[0] = value
                    //         inputPairIndexes[0] = index
                    //     } else if (
                    //         value < inputPairValues[1] &&
                    //         value > elapsedTime
                    //     ) {
                    //         inputPairValues[1] = value
                    //         inputPairIndexes[1] = index
                    //     }

                    //     if (index === inputData.length - 1) {
                    //         if (!inputPairValues[0]) {
                    //             inputPairValues[0] = min[0]
                    //             inputPairIndexes[0] = 0
                    //         }

                    //         if (!inputPairValues[1]) {
                    //             inputPairValues[1] = max[0]
                    //             inputPairIndexes[1] = inputData.length - 1
                    //         }
                    //     }
                    // })

                    console.log(sampler)
                    console.log(inputPairValues)
                    console.log(inputPairIndexes)
                    console.log('-----------')
                }
                // console.log(sampler)
                // console.log(node)
                // console.log(path)
            })
        })
    }
}
