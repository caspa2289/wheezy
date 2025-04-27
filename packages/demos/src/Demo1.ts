import {
    DirectionalLightV2,
    GameObject,
    IGameObject,
    IScene,
    PointLight,
    Scene,
    SpotLight,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

export class Demo1 extends Scene implements IScene {
    private _controller: ArcBallController

    private _testHook!: IGameObject

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: this.engine.renderer.context.canvas.height,
            canvasWidth: this.engine.renderer.context.canvas.width,
            position: vec3.create(-8, 0, 0),
        })

        this._controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: this.engine.renderer.context.canvas as HTMLCanvasElement,
        })
    }

    public async init() {
        await super.init()

        const modelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/Wall.glb'
        )

        const modelData1 = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )

        const modelGO0 = await this.uploadModel({
            modelData: modelData,
        })

        const modelGO1 = await this.uploadModel({
            modelData: modelData1,
        })

        this._testHook = new GameObject()
        this.objectManager.addObject(this._testHook, this.root)
        this.objectManager.reparentObject(modelGO0, this._testHook)

        modelGO1.transform.translate(vec3.create(1, 0, 0))

        modelGO0.transform.rotateDegreesEuler({ x: -90, z: -90 })
        modelGO0.transform.translate(vec3.create(13, 0, 0))
        modelGO0.transform.scale(vec3.create(0.5, 0.5, 0.5))
        // this.directionalLights.push(
        //     new DirectionalLightV2({
        //         parent: this.root,
        //         direction: vec3.create(1, 0, 0),
        //     })
        // )

        this.spotLights.push(
            new SpotLight({
                parent: this.root,
                position: vec3.create(-2, 0, 0),
                direction: vec3.create(1, 0, 0),
            })
        )

        // this.pointLights.push(
        //     new PointLight({
        //         parent: this.root,
        //         position: vec3.create(-0.5, 0, 0),
        //         attenuationConstant: 1,
        //         attenuationExponential: 0.005,
        //         attenuationLinear: 0.005,
        //     })
        // )
    }

    public onRender(dt: number): void {
        this._controller.update(dt)
    }
}
