import {
    AnimationDebugger,
    EntityTypes,
    GameObject,
    type IGameObject,
    type IMesh,
    type IScene,
    Scene,
    SpotLight,
    type TSkyboxBitmaps,
    WheezyGLBLoader,
    renderer,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

const WALL_SCALE = 6
// raw POSITION max.z, which the node rotation turns into world +Y
const WALL_HEIGHT = 2.158
const WALL_X = 5
const HELMET_POSITION = vec3.create(3, 0, 0)
const LIGHT_X = -4
// the colored spots ride a wider orbit, 90° apart from each other
const COLORED_ORBIT_RADIUS = 2.8
// the PBR diffuse term divides by π, so intensities need roughly π× the value
// that looked right under the old Phong shading
const SPOT_INTENSITY = 3
// wide enough that each lit pool on the wall is larger than the helmet's
// shadow, so shadow edges and the colored overlaps stay readable
const SPOT_CUTOFF_POOL = 40
// past the widest cone the shadow frustum can represent (~83°, see
// SPOT_MAX_CONE_HALF_ANGLE) — the toggle shows the cutoff being clamped, so
// the lit cone and its shadowed cone stay the same width

// --- skinned animation test subjects ---
// All three stand on the wall's lower half; scales/heights derive from the
// models' POSITION accessor bounds (Shrek is authored in centimeters).
const CHARACTER_BASE_Y = -3.2
// Shrek.glb — 226.67 tall, 112 joints, ~100 clips; geometry dips 0.47 below
// its origin, so the origin sits that much (scaled) above the base plane
const SHREK_SCALE = 1.8
const SHREK_POSITION = vec3.create(3, CHARACTER_BASE_Y, -3.5)
// BabyShrek.glb — 0.82 tall, 50 joints, one mixamo clip; small enough to sit
// in the helmet's column without reaching it (top ends ~1.2 above the base)
const BABY_SHREK_SCALE = 1
const BABY_SHREK_POSITION = vec3.create(0, CHARACTER_BASE_Y, 0)
// SkibidiToilet.glb — 2.58 tall, 5 joints, one clip; dips 0.04 below origin
const SKIBIDI_TOILET_SCALE = 2.4 / 2.58
const SKIBIDI_TOILET_POSITION = vec3.create(3, CHARACTER_BASE_Y, 3.5)

export class Demo1 extends Scene implements IScene {
    #controller: ArcBallController

    #testHook!: IGameObject
    #coloredSpots: SpotLight[] = []
    #orbitAngle = 0

    // #helmet!: IGameObject

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: renderer.context.canvas.height,
            canvasWidth: renderer.context.canvas.width,
            position: vec3.create(-8, 0, 0),
        })

        this.#controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: renderer.context.canvas as HTMLCanvasElement,
        })
    }

    public override async init() {
        await super.init()

        const modelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/Wall.glb'
        )

        // const modelData1 = await WheezyGLBLoader.loadFromUrl(
        //     'static/models/DamagedHelmet.glb'
        // )

        const modelGO0 = await this.uploadModel({
            modelData: modelData,
        })

        // this.#helmet = await this.uploadModel({
        //     modelData: modelData1,
        // })

        this.#testHook = new GameObject()
        this.objectManager.addObject(this.#testHook, this.root)
        this.objectManager.reparentObject(modelGO0, this.#testHook)

        // this.#helmet.transform.translate(HELMET_POSITION)
        // this.#helmet.transform.rotateDegreesEuler({ x: 90, z: 90 })

        modelGO0.transform.rotateDegreesEuler({ y: -90 })
        modelGO0.transform.translate(
            vec3.create(WALL_X, (-WALL_HEIGHT * WALL_SCALE) / 3, 0)
        )
        modelGO0.transform.scale(
            vec3.create(WALL_SCALE, WALL_SCALE, WALL_SCALE)
        )

        await this.#setupSkinnedModels()

        this.#setupLights()
        await this.#setupSkyBox()
    }

    /**
     * Skinned-animation subjects: Shrek, BabyShrek and the SkibidiToilet —
     * playback (including the default clips) is owned entirely by the
     * AnimationDebugger panel. Placement follows the wall pattern:
     * rotate → translate → scale.
     */
    async #setupSkinnedModels() {
        const shrekData = await WheezyGLBLoader.loadFromUrl(
            'static/models/Shrek.glb'
        )
        const shrek = await this.uploadModel({ modelData: shrekData })
        shrek.name = 'Shrek'
        shrek.transform.rotateDegreesEuler({ y: 90 })
        shrek.transform.translate(SHREK_POSITION)
        shrek.transform.scale(
            vec3.create(SHREK_SCALE, SHREK_SCALE, SHREK_SCALE)
        )

        const babyShrekData = await WheezyGLBLoader.loadFromUrl(
            'static/models/BabyShrek.glb'
        )
        const babyShrek = await this.uploadModel({ modelData: babyShrekData })
        babyShrek.name = 'BabyShrek'
        babyShrek.transform.rotateDegreesEuler({ y: -90 })
        babyShrek.transform.translate(BABY_SHREK_POSITION)
        babyShrek.transform.scale(
            vec3.create(BABY_SHREK_SCALE, BABY_SHREK_SCALE, BABY_SHREK_SCALE)
        )

        const skibidiData = await WheezyGLBLoader.loadFromUrl(
            'static/models/SkibidiToilet.glb'
        )
        const skibidi = await this.uploadModel({ modelData: skibidiData })
        skibidi.name = 'SkibidiToilet'
        skibidi.transform.rotateDegreesEuler({ y: -90 })
        skibidi.transform.translate(SKIBIDI_TOILET_POSITION)
        skibidi.transform.scale(
            vec3.create(
                SKIBIDI_TOILET_SCALE,
                SKIBIDI_TOILET_SCALE,
                SKIBIDI_TOILET_SCALE
            )
        )

        // live playback controls; defaultClip starts each subject, and
        // entries without one would stay idle until a clip is picked
        new AnimationDebugger([
            { animator: shrek.animator!, defaultClip: 'm_Shrek_int_footTap2' },
            { animator: babyShrek.animator!, defaultClip: 'mixamo.com' },
            { animator: skibidi.animator!, defaultClip: 'Animation' },
        ])
    }

    async #setupSkyBox() {
        const imgSrcs = [
            'static/cubemaps/bridge/posx.jpg',
            'static/cubemaps/bridge/negx.jpg',
            'static/cubemaps/bridge/posy.jpg',
            'static/cubemaps/bridge/negy.jpg',
            'static/cubemaps/bridge/posz.jpg',
            'static/cubemaps/bridge/negz.jpg',
        ]

        const promises = imgSrcs.map(async (source) => {
            const response = await fetch(source)
            return createImageBitmap(await response.blob())
        })
        const imageBitmaps = (await Promise.all(promises)) as TSkyboxBitmaps

        renderer.setSkyBoxTexture(imageBitmaps)
    }

    #setupLights() {
        const coloredSpots = [
            vec3.create(1, 0, 0), // red
            vec3.create(0, 1, 0), // green
            // vec3.create(0, 0, 1), // blue
            // vec3.create(1, 0.4, 0.9), // magenta
        ].map((color, index) => {
            const phase = index * Math.PI
            const spot = new SpotLight({
                parent: this.root,
                position: vec3.create(
                    LIGHT_X,
                    Math.cos(phase) * COLORED_ORBIT_RADIUS,
                    Math.sin(phase) * COLORED_ORBIT_RADIUS
                ),
                color,
                cutoff: SPOT_CUTOFF_POOL,
                intensity: SPOT_INTENSITY,
            })
            spot.pointAt(HELMET_POSITION)
            return spot
        })
        this.#coloredSpots = coloredSpots

        this.spotLights.push(...coloredSpots)
    }

    public override onRender(dt: number): void {
        this.#controller.update(dt)

        // this.#helmet.transform.rotateDegreesEuler({ z: 0.5 })
        // dt is frameDelta / 100, not seconds — the engine-wide contract
        this.#orbitAngle += dt * 0.05

        this.#coloredSpots.forEach((spot, index) => {
            const angle = this.#orbitAngle + index * Math.PI
            spot.position[1] = Math.cos(angle) * COLORED_ORBIT_RADIUS
            spot.position[2] = Math.sin(angle) * COLORED_ORBIT_RADIUS
            spot.pointAt(HELMET_POSITION)
        })
    }
}
