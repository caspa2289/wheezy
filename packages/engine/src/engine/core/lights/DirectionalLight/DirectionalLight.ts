import { LIGHT_SOURCE_TYPES } from '../../../types'
import { BaseLight, IBaseLightProps } from '../BaseLight'

export interface IDirectionalLightProps
    extends Omit<IBaseLightProps, 'lightSourceType'> {}

export class DirectionalLight extends BaseLight {
    constructor(props: IDirectionalLightProps) {
        super({ ...props, lightSourceType: LIGHT_SOURCE_TYPES.directional })
    }
}
