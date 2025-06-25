import { IAnimation } from '../Mesh'

export interface IAnimator {
    animations: Map<string, IAnimation>
    skinBindGroupLayout: GPUBindGroupLayout

    addAnimations: (animations: IAnimation[]) => void
}
