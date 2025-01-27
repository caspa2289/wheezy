import {
    DirectionalLight,
    GameObject,
    IGameObject,
    ITransform,
    Scene,
    Transform,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

export class Demo1 extends Scene {
    private _controller: ArcBallController

    private _helmet!: ITransform

    private _helmet1!: ITransform

    private _testHook!: IGameObject

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: this.engine.renderer.context.canvas.height,
            canvasWidth: this.engine.renderer.context.canvas.width,
            position: vec3.create(7, 0, -7),
        })

        this._controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: this.engine.renderer.context.canvas as HTMLCanvasElement,
        })
    }

    public async init() {
        const modelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )

        //FIXME: when the model is at origin, lighting shits itself
        const modelGO0 = await this.uploadModel({
            modelData: modelData,
        })

        const modelGO1 = await this.uploadModel({
            modelData: modelData,
        })

        this._testHook = new GameObject()
        this.objectManager.addObject(this._testHook, this.root)
        this.objectManager.reparentObject(modelGO0, this._testHook)
        this.objectManager.reparentObject(modelGO1, this._testHook)
        new Transform(this._testHook)

        this.light = new DirectionalLight({
            parent: this.root,
            position: vec3.create(10, 0, -10),
        })

        modelGO0.transform.rotateDegreesEuler({ x: 90 })
        modelGO0.transform.translate(vec3.create(0, 0, -4))
        modelGO0.transform.scale(vec3.create(1.5, 1.5, 1.5))

        modelGO1.transform.rotateDegreesEuler({ x: 90, z: 130 })
        modelGO1.transform.scale(vec3.create(3, 3, 3))
        modelGO1.transform.translate(vec3.create(10, 0, 7))

        this._helmet = modelGO0.transform
        this._helmet1 = modelGO1.transform

        this._testHook.transform.rotateDegreesEuler({ y: -40 })
    }

    public onRender(dt: number): void {
        this._controller.update(dt)

        this._helmet.rotateDegreesEuler({ z: -5 * dt })
        // this._helmet1.rotateDegreesEuler({ z: 5 * dt })
    }
}
