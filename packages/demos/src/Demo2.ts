import {
    DirectionalLightV2,
    EntityTypes,
    IMesh,
    IScene,
    Scene,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

export class Demo2 extends Scene implements IScene {
    private _controller: ArcBallController

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

        const modelData1 = await WheezyGLBLoader.loadFromUrl(
            'static/models/Whale.glb'
        )

        const modelGO1 = await this.uploadModel({
            modelData: modelData1,
        })

        const sharkMesh = this.objectManager.getFirstChildOfType(
            modelGO1,
            EntityTypes.mesh
        ) as IMesh

        const swimAnimationState = sharkMesh.attachAnimation('swim')

        swimAnimationState.isPlaying = true

        modelGO1.transform.translate(vec3.create(0, 0, 0))
        modelGO1.transform.rotateDegreesEuler({ y: -100 })

        this.directionalLights.push(
            new DirectionalLightV2({
                parent: this.root,
                direction: vec3.create(1, 0, 0),
            })
        )
    }

    public onRender(dt: number): void {
        this._controller.update(dt)
    }
}
