import {
    DirectionalLightV2,
    GameObject,
    type IGameObject,
    type IScene,
    Scene,
    SpotLight,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

/**
 * Lighting test scene. Placements derive from the models' real bounds (parsed
 * from the GLB POSITION accessors), not from guesses:
 *
 * - `Wall.glb` — 5.00 x 2.16 x 0.13 once its node chain's net +90° X rotation
 *   is applied, i.e. a wall standing in the XY plane. Scaled x3 and dropped by
 *   half its height it becomes a 15 x 6.5 backdrop centered on the view axis.
 * - `DamagedHelmet.glb` — 1.89 x 2.00 x 1.80, centered near its own origin.
 *
 * Every light sits on the x = LIGHT_X plane between the camera and the helmet,
 * so all of them throw the helmet's shadow onto the wall and those shadows
 * overlap around the middle of it.
 */
const WALL_SCALE = 3
// raw POSITION max.z, which the node rotation turns into world +Y
const WALL_HEIGHT = 2.158
const WALL_X = 5
const HELMET_POSITION = vec3.create(3, 0, 0)
const LIGHT_X = -4
// radius of the moving spot's orbit around the view axis
const ORBIT_RADIUS = 1.5
// the colored spots ride a wider orbit, 90° apart from each other
const COLORED_ORBIT_RADIUS = 2.8
const SPOT_CUTOFF = 15
// wide enough that each lit pool on the wall is larger than the helmet's
// shadow, so shadow edges and the colored overlaps stay readable
const SPOT_CUTOFF_POOL = 25
// past the widest cone the shadow frustum can represent (~83°, see
// SPOT_MAX_CONE_HALF_ANGLE) — the toggle shows the cutoff being clamped, so
// the lit cone and its shadowed cone stay the same width
const SPOT_CUTOFF_WIDE = 85

export class Demo1 extends Scene implements IScene {
    private _controller: ArcBallController

    private _testHook!: IGameObject
    private _orbitingLight!: SpotLight
    private _coloredSpots: SpotLight[] = []
    private _wideSpot!: SpotLight
    private _orbitAngle = 0
    private _ambientRaised = false
    private _coneWide = false

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

    public override async init() {
        await super.init()

        const modelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/Wall.glb'
        )

        const modelData1 = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )

        // material factors are baked into the GPU params buffer on the first
        // draw (Renderer.buildRenderPipeline), so they have to be set on the
        // preload data before uploadModel. Non-default values make them
        // observable in the Metallic/Roughness debug views.
        modelData.materials.forEach((material) => {
            material.metallicFactor = 0
            material.roughnessFactor = 0.95
        })
        modelData1.materials.forEach((material) => {
            material.metallicFactor = 1
            material.roughnessFactor = 0.25
        })

        const modelGO0 = await this.uploadModel({
            modelData: modelData,
        })

        const modelGO1 = await this.uploadModel({
            modelData: modelData1,
        })

        this._testHook = new GameObject()
        this.objectManager.addObject(this._testHook, this.root)
        this.objectManager.reparentObject(modelGO0, this._testHook)

        modelGO1.transform.translate(HELMET_POSITION)

        modelGO0.transform.rotateDegreesEuler({ y: -90 })
        modelGO0.transform.translate(
            vec3.create(WALL_X, (-WALL_HEIGHT * WALL_SCALE) / 2, 0)
        )
        modelGO0.transform.scale(
            vec3.create(WALL_SCALE, WALL_SCALE, WALL_SCALE)
        )

        this._setupLights()
        this._setupToggles()
    }

    private _setupLights() {
        const spotUpper = new SpotLight({
            parent: this.root,
            position: vec3.create(LIGHT_X, 1, 0),
        })
        const spotLower = new SpotLight({
            parent: this.root,
            position: vec3.create(LIGHT_X, -1, 0),
        })
        spotUpper.pointAt(HELMET_POSITION)
        spotLower.pointAt(HELMET_POSITION)
        this._wideSpot = spotUpper

        // four colored spots 90° apart on a shared orbit around the view axis
        // (moved in onRender), all aimed at the helmet: their shadows sweep
        // across the wall and through each other, and the mixed colors make the
        // overlaps easy to read
        const coloredSpots = [
            vec3.create(1, 0.25, 0.2), // red
            vec3.create(0.3, 1, 0.45), // green
            vec3.create(0.3, 0.55, 1), // blue
            vec3.create(1, 0.4, 0.9), // magenta
        ].map((color, index) => {
            const phase = (index * Math.PI) / 2
            const spot = new SpotLight({
                parent: this.root,
                position: vec3.create(
                    LIGHT_X,
                    Math.cos(phase) * COLORED_ORBIT_RADIUS,
                    Math.sin(phase) * COLORED_ORBIT_RADIUS
                ),
                color,
                cutoff: SPOT_CUTOFF_POOL,
            })
            spot.pointAt(HELMET_POSITION)
            return spot
        })
        this._coloredSpots = coloredSpots

        // tilted off the view axis so its shadow lands apart from the spots' —
        // the overlap region stays identifiable
        const sun = new DirectionalLightV2({
            parent: this.root,
            direction: vec3.create(1, -0.2, 0.15),
            intensity: 0.01,
        })

        this.spotLights.push(
            // spotUpper,
            // spotLower,
            ...coloredSpots
        )
        // this.directionalLights.push(sun)
    }

    private _setupToggles() {
        const wrapper = document.createElement('div')
        wrapper.style.position = 'absolute'
        wrapper.style.top = '0'
        wrapper.style.zIndex = '10'
        wrapper.style.padding = '10px'

        const ambientButton = document.createElement('button')
        const coneButton = document.createElement('button')

        const labelAmbient = () =>
            `ambient floor: ${this._ambientRaised ? 'on' : 'off'}`
        const labelCone = () =>
            `spot cone: ${this._coneWide ? `${SPOT_CUTOFF_WIDE}°` : `${SPOT_CUTOFF}°`}`

        ambientButton.addEventListener('click', () => {
            this._ambientRaised = !this._ambientRaised
            // ambient is re-read into the view params every frame. Kept small:
            // it now adds to every pixel (not just unlit ones) and the lighting
            // pass gamma-expands darks, so even 0.04 reads as a visible lift.
            this.engine.renderer.ambientLightColor = this._ambientRaised
                ? vec3.create(0.04, 0.044, 0.055)
                : vec3.create(0.01, 0.01, 0.01)
            ambientButton.textContent = labelAmbient()
        })

        coneButton.addEventListener('click', () => {
            this._coneWide = !this._coneWide
            this._wideSpot.cutoff = this._coneWide
                ? SPOT_CUTOFF_WIDE
                : SPOT_CUTOFF
            coneButton.textContent = labelCone()
        })

        ambientButton.textContent = labelAmbient()
        coneButton.textContent = labelCone()
        wrapper.appendChild(ambientButton)
        wrapper.appendChild(coneButton)

        document.body.appendChild(wrapper)
    }

    public override onRender(dt: number): void {
        this._controller.update(dt)

        // dt is frameDelta / 100, not seconds — the engine-wide contract
        this._orbitAngle += dt * 0.05

        // the colored spots ride the same angle on a wider orbit, 90° apart, so
        // their shadows sweep across the wall and through each other
        this._coloredSpots.forEach((spot, index) => {
            const angle = this._orbitAngle + (index * Math.PI) / 2
            spot.position[1] = Math.cos(angle) * COLORED_ORBIT_RADIUS
            spot.position[2] = Math.sin(angle) * COLORED_ORBIT_RADIUS
            spot.pointAt(HELMET_POSITION)
        })
    }
}
