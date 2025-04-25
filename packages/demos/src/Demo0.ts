import { vec3 } from 'wgpu-matrix'
import {
    WheezyGLBLoader,
    Scene,
    IGameObject,
    GameObject,
    Transform,
    TSkyboxBitmaps,
    IScene,
    DirectionalLightV2,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'

//This is supposed to demonstrate basic workflow
export class Demo0 extends Scene implements IScene {
    private sun!: IGameObject

    private mercury!: IGameObject
    private mercuryHook: IGameObject = this._createTransformObject()
    private venus!: IGameObject
    private venusHook: IGameObject = this._createTransformObject()
    private earth!: IGameObject
    private earthHook: IGameObject = this._createTransformObject()
    private mars!: IGameObject
    private marsHook: IGameObject = this._createTransformObject()
    private jupiter!: IGameObject
    private jupiterHook: IGameObject = this._createTransformObject()
    private saturn!: IGameObject
    private saturnHook: IGameObject = this._createTransformObject()
    private uranus!: IGameObject
    private uranusHook: IGameObject = this._createTransformObject()
    private neptune!: IGameObject
    private neptuneHook: IGameObject = this._createTransformObject()

    public yearsPerMinute = 1

    private controller: ArcBallController

    constructor() {
        super()
        this.camera = new ArcBallCamera({
            zFar: 1000,
            zNear: 0.1,
            canvasWidth: this._engine!.renderer.context.canvas.width,
            canvasHeight: this._engine!.renderer.context.canvas.height,
            position: vec3.create(0, 4, 5),
        })

        this.controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: this._engine?.renderer.context.canvas as HTMLCanvasElement,
        })

        this.directionalLights.push(
            new DirectionalLightV2({
                parent: this.root,
            })
        )

        this._setupSkyBox()
    }

    private async _setupSkyBox() {
        const imgSrcs = [
            'static/cubemaps/space/posx.png',
            'static/cubemaps/space/negx.png',
            'static/cubemaps/space/posy.png',
            'static/cubemaps/space/negy.png',
            'static/cubemaps/space/posz.png',
            'static/cubemaps/space/negz.png',
        ]

        const promises = imgSrcs.map(async (source) => {
            const response = await fetch(source)
            return createImageBitmap(await response.blob())
        })
        const imageBitmaps = (await Promise.all(promises)) as TSkyboxBitmaps

        this._engine?.renderer.setSkyBoxTexture(imageBitmaps)
    }

    private _createTransformObject(): GameObject {
        const gameObject = new GameObject()

        this.objectManager.addObject(gameObject, this.root)

        new Transform(gameObject)

        return gameObject
    }

    private async _setupSun() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/sun.glb'
        )
        this.sun = await this.uploadModel({
            modelData: planetMD,
        })

        this.sun.transform.scale(vec3.create(0.12, 0.12, 0.12))
    }

    private async _setupMercury() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/mercury.glb'
        )
        this.mercury = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.mercury, this.mercuryHook)

        this.mercuryHook.transform.rotateDegreesEuler({ y: 80 })

        this.mercury.transform.scale(vec3.create(0.08, 0.08, 0.08))
        this.mercury.transform.translate(vec3.create(1.4))
    }

    private async _setupVenus() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/venus.glb'
        )
        this.venus = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.venus, this.venusHook)

        this.venusHook.transform.rotateDegreesEuler({ y: 160 })

        this.venus.transform.scale(vec3.create(0.12, 0.12, 0.12))
        this.venus.transform.translate(vec3.create(1.7, 0, 0))
    }

    private async _setupEarth() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/earth.glb'
        )
        this.earth = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.earth, this.earthHook)

        this.earthHook.transform.rotateDegreesEuler({ y: 10 })

        this.earth.transform.rotateDegreesEuler({ x: -90 })

        this.earth.transform.scale(vec3.create(0.16, 0.16, 0.16))
        this.earth.transform.translate(vec3.create(2.2, 0, 0))
    }

    private async _setupMars() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/mars.glb'
        )
        this.mars = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.mars, this.marsHook)

        this.marsHook.transform.rotateDegreesEuler({ y: 50 })

        this.mars.transform.scale(vec3.create(0.14, 0.14, 0.14))
        this.mars.transform.translate(vec3.create(2.7, 0, 0))
    }

    private async _setupJupiter() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/jupiter.glb'
        )
        this.jupiter = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.jupiter, this.jupiterHook)

        this.jupiterHook.transform.rotateDegreesEuler({ y: 150 })

        this.jupiter.transform.scale(vec3.create(0.15, 0.15, 0.15))
        this.jupiter.transform.rotateDegreesEuler({ x: 90 })
        this.jupiter.transform.translate(vec3.create(3.4, 0, 0))
    }

    private async _setupSaturn() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/saturn.glb'
        )
        this.saturn = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.saturn, this.saturnHook)

        this.saturnHook.transform.rotateDegreesEuler({ y: 210 })

        this.saturn.transform.scale(vec3.create(0.0012, 0.0012, 0.0012))
        this.saturn.transform.rotateDegreesEuler({ x: 76 })
        this.saturn.transform.translate(vec3.create(4.3, 0, 0))
    }

    private async _setupUranus() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/uranus.glb'
        )
        this.uranus = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.uranus, this.uranusHook)

        this.uranusHook.transform.rotateDegreesEuler({ y: 270 })

        this.uranus.transform.scale(vec3.create(0.2, 0.2, 0.2))
        this.uranus.transform.rotateDegreesEuler({ x: 90 })
        this.uranus.transform.translate(vec3.create(5.2, 0, 0))
    }

    private async _setupNeptune() {
        const planetMD = await WheezyGLBLoader.loadFromUrl(
            'static/models/planets/neptune.glb'
        )
        this.neptune = await this.uploadModel({
            modelData: planetMD,
        })

        this.objectManager.reparentObject(this.neptune, this.neptuneHook)

        this.neptuneHook.transform.rotateDegreesEuler({ y: 100 })

        this.neptune.transform.scale(vec3.create(0.2, 0.2, 0.2))
        this.neptune.transform.rotateDegreesEuler({ x: 90 })
        this.neptune.transform.translate(vec3.create(5.8, 0, 0))
    }

    public async init() {
        await super.init()

        await this._setupSun()
        await this._setupMercury()
        await this._setupVenus()
        await this._setupEarth()
        await this._setupMars()
        await this._setupJupiter()
        await this._setupSaturn()
        await this._setupUranus()
        await this._setupNeptune()

        const wrapper = document.createElement('div')
        wrapper.style.position = 'absolute'
        wrapper.style.top = '0'
        wrapper.style.zIndex = '10'
        wrapper.style.padding = '10px'

        const button0 = document.createElement('button')
        button0.textContent = '1 год в минуту'

        button0.addEventListener('click', () => {
            this.yearsPerMinute = 1
        })

        const button1 = document.createElement('button')
        button1.textContent = '100 лет в минуту'

        button1.addEventListener('click', () => {
            this.yearsPerMinute = 100
        })

        wrapper.appendChild(button0)
        wrapper.appendChild(button1)

        document.body.appendChild(wrapper)
    }

    private getOrbitRotationPerFrame(name: string) {
        const commonDivider = 3600 / this.yearsPerMinute

        switch (name) {
            case 'mercury':
                return (360 * 4.17) / commonDivider
            case 'venus':
                return (360 * 1.63) / commonDivider
            case 'earth':
                return (360 * 1) / commonDivider
            case 'mars':
                return (360 * 0.53) / commonDivider
            case 'jupiter':
                return (360 * 0.084) / commonDivider
            case 'saturn':
                return (360 * 0.034) / commonDivider
            case 'uranus':
                return (360 * 0.012) / commonDivider
            case 'neptune':
                return (360 * 0.006) / commonDivider
            default:
                return 0
        }
    }

    private getSelfRotationPerFrame(name: string) {
        const commonDivider = 3600 / this.yearsPerMinute

        switch (name) {
            case 'sun':
                return (360 * 0.04 * 365) / commonDivider
            case 'mercury':
                return (360 * 1.5 * 365) / commonDivider
            case 'venus':
                return (360 * 1.502 * 365) / commonDivider
            case 'earth':
                return (360 * 1 * 365) / commonDivider
            case 'mars':
                return (360 * 1.03 * 365) / commonDivider
            case 'jupiter':
                return (360 * 0.41 * 365) / commonDivider
            case 'saturn':
                return (360 * 0.45 * 365) / commonDivider
            case 'uranus':
                return (360 * 0.666 * 365) / commonDivider
            case 'neptune':
                return (360 * 0.708 * 365) / commonDivider
            default:
                return 0
        }
    }

    public onRender(deltaTime: number): void {
        this.controller.update(deltaTime)
        //FYI: Always remember to reset orientation in blender :/
        this.sun.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('sun'),
        })
        this.mercury.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('mercury'),
        })
        this.mercuryHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('mercury'),
        })
        this.venus.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('venus'),
        })
        this.venusHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('venus'),
        })
        this.earth.transform.rotateDegreesEuler({
            z: this.getSelfRotationPerFrame('earth'),
        })
        this.earthHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('earth'),
        })
        this.mars.transform.rotateDegreesEuler({
            y: this.getSelfRotationPerFrame('mars'),
        })
        this.marsHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('mars'),
        })
        this.jupiter.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('jupiter'),
        })
        this.jupiterHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('jupiter'),
        })
        this.saturn.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('saturn'),
        })
        this.saturnHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('saturn'),
        })
        this.uranus.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('uranus'),
        })
        this.uranusHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('uranus'),
        })
        this.neptune.transform.rotateDegreesEuler({
            z: -this.getSelfRotationPerFrame('neptune'),
        })
        this.neptuneHook.transform.rotateDegreesEuler({
            y: this.getOrbitRotationPerFrame('neptune'),
        })
    }
}
