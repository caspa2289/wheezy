import { vec3 } from 'wgpu-matrix'
import shaderCode from '../shaders/testShader.wgsl'
import { WheezyGLBLoader, Scene, IGameObject } from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'

export class Demo0 extends Scene {
    private _shaderModule: GPUShaderModule

    //FYI: Always remember to reset orientation in blender :/
    private sun!: IGameObject //==> OK, needs optimization

    private earth!: IGameObject //==> DONE
    private uranus!: IGameObject //==> DONE
    private jupiter!: IGameObject //==> DONE
    private mercury!: IGameObject //==> DONE
    private venus!: IGameObject //==> DONE
    private mars!: IGameObject //==> DONE
    private saturn!: IGameObject //==> DONE
    private neptune!: IGameObject //==> OK, needs optimization

    constructor() {
        super()
        this.camera = new ArcBallCamera({
            zFar: 1000,
            zNear: 0.1,
            canvasWidth: this._engine!.context.canvas.width,
            canvasHeight: this._engine!.context.canvas.height,
            position: vec3.create(0, 0, 5),
        })
        this._shaderModule = this.engine.device.createShaderModule({
            code: shaderCode,
        })
    }

    private async _setupSun() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/sun.glb'
        )
        this.sun = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        console.log(this.objectManager)

        this.sun.transform.scale(vec3.create(0.1, 0.1, 0.1))
    }

    private async _setupMercury() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/mercury.glb'
        )
        this.mercury = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        console.log(`sun ${this.sun.id}`)
        console.log(`mercury ${this.mercury.id}`)

        this.objectManager.reparentObject(this.mercury, this.sun)

        console.log(this.objectManager)
    }

    // private async _setupVenus() {
    //     const planetMD = await WheezyGLBLoader.loadFromUrl(
    //         'static/models/planets/venus.glb'
    //     )
    //     this.venus = await this.uploadModel({
    //         modelData: planetMD,
    //         shaderModule: this._shaderModule,
    //     })
    // }

    public async init() {
        await this._setupSun()
        await this._setupMercury()
        // await this._setupVenus()
    }

    protected onRender(deltaTime: number): void {}
}
