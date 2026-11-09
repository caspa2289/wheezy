import {
    DirectionalLightV2,
    PointLight,
    type IScene,
    Scene,
    SpotLight,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { vec3 } from 'wgpu-matrix'

/**
 * Shadow/lighting test scene (default):
 * - Wall.glb as a ground slab, using Demo1's proven placement verbatim
 *   (the wall's local origin sits ~12 units off its face — the x:13 translate
 *   compensates; after it, the walkable face spans roughly x ∈ [-50, 6], y ≈ 0)
 * - two DamagedHelmets (measured bbox: y ∈ [-1.19, 0.81], ~2 units tall) stacked
 *   with a gap, so the orbiting "sun" throws the upper helmet's shadow ONTO the
 *   lower one and the ground — geometry casting onto other geometry
 * - the directional light orbits slowly: moving shadows are easy to spot
 * - two point lights of the SAME type (dim blue + orange fill) — proves the
 *   multi-light stride fix works (this used to RangeError) without washing out
 *   the directional shadows
 */
export class DemoShadows extends Scene implements IScene {
    private _controller: ArcBallController
    private _sunAngle = 0

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: this.engine.renderer.context.canvas.height,
            canvasWidth: this.engine.renderer.context.canvas.width,
            position: vec3.create(-5.5, 3.5, 0),
        })

        this._controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: this.engine.renderer.context.canvas as HTMLCanvasElement,
        })
    }

    public override async init() {
        await super.init()

        // ground slab — Demo1's exact wall transform (proven orientation)
        const wallData = await WheezyGLBLoader.loadFromUrl(
            'static/models/Wall.glb'
        )
        const ground = await this.uploadModel({ modelData: wallData })
        ground.transform.rotateDegreesEuler({ x: -90, z: -90 })
        ground.transform.translate(vec3.create(13, 0, 0))
        ground.transform.scale(vec3.create(0.5, 0.5, 0.5))

        // lower helmet — rests on the wall face, receives the upper one's shadow
        const helmetData = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )
        const lowerHelmet = await this.uploadModel({ modelData: helmetData })
        lowerHelmet.transform.rotateDegreesEuler({ y: 90 })
        lowerHelmet.transform.translate(vec3.create(0.5, 1.25, 0))

        // upper helmet — the shadow caster, ~0.15 units of daylight below it
        const upperHelmet = await this.uploadModel({ modelData: helmetData })
        upperHelmet.transform.translate(vec3.create(0.5, 3.4, 0))

        // the "sun" — direction animated in onRender
        this.directionalLights.push(
            new DirectionalLightV2({
                parent: this.root,
                direction: vec3.create(-0.6, -1, 0),
                color: vec3.create(1, 0.95, 0.85),
                intensity: 1.2,
            })
        )

        // two point lights of the same type — multi-light proof, and (Phase 2)
        // cube-face shadow casters under the atlas budget.
        // dim on purpose: they must not wash out the directional shadows
        this.pointLights.push(
            new PointLight({
                parent: this.root,
                position: vec3.create(-3, 3, 0),
                color: vec3.create(0.3, 0.5, 1),
                intensity: 0.25,
                attenuationConstant: 1,
                attenuationLinear: 0.005,
                attenuationExponential: 0.005,
            })
        )
        this.pointLights.push(
            new PointLight({
                parent: this.root,
                position: vec3.create(3, 3, 0),
                color: vec3.create(1, 0.5, 0.2),
                intensity: 0.25,
                attenuationConstant: 1,
                attenuationLinear: 0.005,
                attenuationExponential: 0.005,
            })
        )

        // spot light aimed at the lower helmet — perspective-tile shadow caster
        const spotPosition = vec3.create(-3, 4, 0)
        const spotTarget = vec3.create(0.5, 1.25, 0)
        this.spotLights.push(
            new SpotLight({
                parent: this.root,
                position: spotPosition,
                direction: vec3.normalize(vec3.sub(spotTarget, spotPosition)),
                cutoff: 25, // degrees — stored pre-cosined by the setter
                color: vec3.create(0.9, 1, 0.9),
                intensity: 1.5,
            })
        )
    }

    public override onRender(dt: number): void {
        this._controller.update(dt)

        // slowly orbit the sun so the directional shadow visibly sweeps across
        // the lower helmet and the ground
        this._sunAngle += dt * 0.05
        const sun = this.directionalLights[0]!
        sun.direction = vec3.create(
            Math.cos(this._sunAngle) * 0.6,
            -1,
            Math.sin(this._sunAngle) * 0.6
        )
    }
}
