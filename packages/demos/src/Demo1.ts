import {
    DirectionalLight,
    ITransform,
    Scene,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

export class Demo1 extends Scene {
    private _controller: ArcBallController

    private _helmet!: ITransform

    constructor() {
        super()

        this._controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: this.engine.renderer.context.canvas as HTMLCanvasElement,
        })

        this.light = new DirectionalLight({ parent: this.root })
    }

    public onRender(dt: number): void {
        this._controller.update(dt)

        this._helmet.rotateDegreesEuler({ z: 5 * dt })
    }

    public async init() {
        const modelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )
        const modelGO0 = await this.uploadModel({
            modelData: modelData,
        })

        const modelGO1 = await this.uploadModel({
            modelData: modelData,
        })

        modelGO0.transform.rotateDegreesEuler({ x: 90 })
        modelGO1.transform.rotateDegreesEuler({ x: 90 })
        modelGO1.transform.scale(vec3.create(3, 3, 3))
        modelGO1.transform.translate(vec3.create(0, 0, -10))

        this._helmet = modelGO0.transform
    }
}
