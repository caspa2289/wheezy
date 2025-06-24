import { IAnimation } from '../../types'
import { IAnimator } from '../../types/core/Animator'

export class Animator implements IAnimator {
    animations: Map<string, IAnimation> = new Map()
}
