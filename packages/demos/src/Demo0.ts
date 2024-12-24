import { vec3 } from 'wgpu-matrix'
import shaderCode from '../shaders/testShader.wgsl'
import { WheezyGLBLoader, Scene, IGameObject } from '@wheezy/engine'

const stuffNames = [
    'sun',
    'earth',
    'uranus',
    'jupiter',
    'mercury',
    'venus',
    'mars',
    'saturn',
    'neptune',
]

export class Demo0 extends Scene {
    private _shaderModule: GPUShaderModule

    //FIXME: The vertex count on these fuckers is insane
    private sun!: IGameObject //==> OK, needs optimization

    private earth!: IGameObject //==> OK, but unnecessary transforms present
    private uranus!: IGameObject //==> OK, but unnecessary transforms present
    private jupiter!: IGameObject //==> OK, needs optimization
    private mercury!: IGameObject //==> OK, but missing slobs of stuff, MODEL ISSUE, unnecessary transforms present
    private venus!: IGameObject //==> OK, but unnecessary transforms present
    private mars!: IGameObject //==> OK, but unnecessary transforms present (it`s off center for whatever reason)
    private saturn!: IGameObject //==> OK, but the model is huge
    private neptune!: IGameObject //==> OK, needs optimization

    constructor() {
        super()
        this._shaderModule = this.engine.device.createShaderModule({
            code: shaderCode,
        })
    }

    public async init() {
        // await Promise.all(
        //     stuffNames.map((name) => {
        //         WheezyGLBLoader.loadFromUrl(`static/models/planets/${name}.glb`)
        //             .then((modelData) => {
        //                 this.uploadModel({
        //                     modelData,
        //                     shaderModule: this._shaderModule,
        //                 }).then((gameObject) => {
        //                     ;(this as any)[name] = gameObject
        //                 })
        //             })
        //             .catch(console.error)
        //     })
        // )
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/neptune.glb'
        )
        this.sun = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })
        this.sun.transform.rotateDegreesEuler({ x: 90 })
    }

    protected onRender(deltaTime: number): void {
        this.sun.transform.rotateDegreesEuler({ z: 3 * deltaTime })
    }
}
