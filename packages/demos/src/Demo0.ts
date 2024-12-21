import shaderCode from '../shaders/testShader.wgsl'
import { EntityTypes, ITransform, WheezyGLBLoader, Scene } from '@wheezy/engine'
import { vec3 } from 'wgpu-matrix'

export class Demo0 extends Scene {
    private _shaderModule: GPUShaderModule

    private _duckTransforms!: ITransform[]

    private _helmetTransform!: ITransform

    constructor() {
        super()
        this._shaderModule = this.engine.device.createShaderModule({
            code: shaderCode,
        })
    }

    public async init() {
        const helmetModelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )

        const duckModelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/Duck.glb'
        )

        const helmetGameObject = await this.uploadModel({
            modelData: helmetModelData,
            shaderModule: this._shaderModule,
        })

        this._helmetTransform = [...helmetGameObject.components.values()].find(
            (component) => {
                return component.type === EntityTypes.transform
            }
        ) as ITransform

        const duckAmount = 20

        this._duckTransforms = await Promise.all(
            new Array(duckAmount).fill(1).map(() => {
                return this.uploadModel({
                    modelData: duckModelData,
                    shaderModule: this._shaderModule,
                }).then((duckGameObject) => {
                    const duckTransform = [
                        ...duckGameObject.components.values(),
                    ].find((component) => {
                        return component.type === EntityTypes.transform
                    }) as ITransform

                    this.objectManager.reparentObject(
                        duckGameObject,
                        helmetGameObject
                    )

                    const radius = Math.random() * 1.7 + 1.25
                    const angle = Math.random() * Math.PI * 2
                    const x = Math.sin(angle) * radius
                    const y = (Math.random() - 0.5) * 0.015
                    const z = Math.cos(angle) * radius

                    duckTransform.translate(vec3.create(x, y, z))
                    duckTransform.rotateRadians({
                        x: Math.random() * Math.PI,
                        y: Math.random() * Math.PI,
                    })
                    duckTransform.scale(vec3.create(0.2, 0.2, 0.2))

                    return duckTransform
                })
            })
        )

        this._helmetTransform.rotateRadians({ x: 1.1 })
    }

    protected onRender(deltaTime: number): void {
        this._helmetTransform.rotateRadians({ z: 0.1 * deltaTime })
        this._duckTransforms.forEach((duckTransform) => {
            duckTransform.rotateRadians({
                z: 0.2 * deltaTime,
                y: 0.2 * deltaTime,
                x: 0.2 * deltaTime,
            })
        })
    }
}
