import { vec3 } from 'wgpu-matrix'
import shaderCode from '../shaders/testShader.wgsl'
import { WheezyGLBLoader, Scene, IGameObject } from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'

//This is supposed to demonstrate basic workflow
export class Demo0 extends Scene {
    private _shaderModule: GPUShaderModule

    private sun!: IGameObject

    private mercury!: IGameObject
    private venus!: IGameObject
    private earth!: IGameObject
    private mars!: IGameObject
    private jupiter!: IGameObject
    private saturn!: IGameObject
    private uranus!: IGameObject
    private neptune!: IGameObject

    constructor() {
        super()
        this.camera = new ArcBallCamera({
            zFar: 1000,
            zNear: 0.1,
            canvasWidth: this._engine!.context.canvas.width,
            canvasHeight: this._engine!.context.canvas.height,
            position: vec3.create(0, 6, 7),
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

        this.objectManager.reparentObject(this.mercury, this.sun)

        this.mercury.transform.scale(vec3.create(2, 2, 2))
        this.mercury.transform.translate(vec3.create(18))
    }

    private async _setupVenus() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/venus.glb'
        )
        this.venus = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.venus, this.sun)

        this.venus.transform.scale(vec3.create(2, 2, 2))
        this.venus.transform.translate(vec3.create(26, 0, 0))
    }

    private async _setupEarth() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/earth.glb'
        )
        this.earth = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.earth, this.sun)

        this.earth.transform.scale(vec3.create(2, 2, 2))
        this.earth.transform.translate(vec3.create(38, 0, 0))
    }

    private async _setupMars() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/mars.glb'
        )
        this.mars = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.mars, this.sun)

        this.mars.transform.scale(vec3.create(2, 2, 2))
        this.mars.transform.translate(vec3.create(47, 0, 0))
    }

    private async _setupJupiter() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/jupiter.glb'
        )
        this.jupiter = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.jupiter, this.sun)

        this.jupiter.transform.scale(vec3.create(2, 2, 2))
        this.jupiter.transform.rotateDegreesEuler({ x: 90 })
        this.jupiter.transform.translate(vec3.create(60, 0, 0))
    }

    private async _setupSaturn() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/saturn.glb'
        )
        this.saturn = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.saturn, this.sun)

        this.saturn.transform.scale(vec3.create(0.02, 0.02, 0.02))
        this.saturn.transform.rotateDegreesEuler({ x: 56 })
        this.saturn.transform.translate(vec3.create(80, 0, 0))
    }

    private async _setupUranus() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/uranus.glb'
        )
        this.uranus = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.uranus, this.sun)

        this.uranus.transform.scale(vec3.create(2, 2, 2))
        this.uranus.transform.rotateDegreesEuler({ x: 90 })
        this.uranus.transform.translate(vec3.create(100, 0, 0))
    }

    private async _setupNeptune() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/neptune.glb'
        )
        this.neptune = await this.uploadModel({
            modelData: planetMD,
            shaderModule: this._shaderModule,
        })

        this.objectManager.reparentObject(this.neptune, this.sun)

        this.neptune.transform.scale(vec3.create(2, 2, 2))
        this.neptune.transform.rotateDegreesEuler({ x: 90 })
        this.neptune.transform.translate(vec3.create(113, 0, 0))
    }

    public async init() {
        await this._setupSun()
        await this._setupMercury()
        await this._setupVenus()
        await this._setupEarth()
        await this._setupMars()
        await this._setupJupiter()
        await this._setupSaturn()
        await this._setupNeptune()
        await this._setupUranus()
    }

    protected onRender(deltaTime: number): void {
        //FYI: Always remember to reset orientation in blender :/
        this.sun.transform.rotateDegreesEuler({ y: 1 * deltaTime })
        this.mercury.transform.rotateDegreesEuler({ y: 10 * deltaTime })
        this.venus.transform.rotateDegreesEuler({ y: 8 * deltaTime })
        this.earth.transform.rotateDegreesEuler({ y: 6 * deltaTime })
        this.mars.transform.rotateDegreesEuler({ y: 4 * deltaTime })
        this.jupiter.transform.rotateDegreesEuler({ z: -2 * deltaTime })
        this.saturn.transform.rotateDegreesEuler({ z: -4 * deltaTime })
        this.uranus.transform.rotateDegreesEuler({ z: -12 * deltaTime })
        this.neptune.transform.rotateDegreesEuler({ z: -6 * deltaTime })
    }
}
