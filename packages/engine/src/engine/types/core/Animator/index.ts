import { IAnimation, IMesh } from '../Mesh'

export interface IAnimator {
    animations: Map<string, IAnimation>
    skinBindGroupLayout: GPUBindGroupLayout

    addAnimations: (animations: IAnimation[]) => void
    animate: (mesh: IMesh, deltaTime: number) => void
}
