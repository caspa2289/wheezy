import {
    GameObject,
    type GLTFAccessor,
    type IMaterial,
    type IScene,
    Mesh,
    PointLight,
    Scene,
    Transform,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { ArcBallController } from '@wheezy/engine/src/utils/ArcBallController'
import { mat4, vec3, type Vec3, vec4 } from 'wgpu-matrix'

// small emissive sphere marking each point light's position. The engine's
// only primitive (primitives/cube.ts) feeds the skybox pipeline, so the demo
// generates its own geometry and registers it through the same
// BufferStorage/GLTFAccessor contract the GLB loader fills.
const SUN_RADIUS = 0.12
const SUN_SEGMENTS = 16
const SUN_RINGS = 10
// rad per engine dt unit — dt is frameDelta/100, so this is ~0.5 rad/s
// (~13 s per revolution) at 60 fps
const GRID_ROTATION_SPEED = 0.05
// rotation pivot of the light grid — must match the `+ 0.5` x offset in the
// grid placement loop below
const GRID_CENTER = vec3.create(0.5, 0, 0)

function createSunSphere() {
    const positions: number[] = []
    const normals: number[] = []
    const tangents: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    for (let ring = 0; ring <= SUN_RINGS; ring++) {
        const phi = (ring / SUN_RINGS) * Math.PI
        for (let segment = 0; segment <= SUN_SEGMENTS; segment++) {
            const theta = (segment / SUN_SEGMENTS) * Math.PI * 2
            const x = Math.sin(phi) * Math.cos(theta)
            const y = Math.cos(phi)
            const z = Math.sin(phi) * Math.sin(theta)
            positions.push(x, y, z)
            normals.push(x, y, z)
            tangents.push(-Math.sin(theta), 0, Math.cos(theta))
            uvs.push(segment / SUN_SEGMENTS, ring / SUN_RINGS)
        }
    }
    for (let ring = 0; ring < SUN_RINGS; ring++) {
        for (let segment = 0; segment < SUN_SEGMENTS; segment++) {
            const a = ring * (SUN_SEGMENTS + 1) + segment
            const b = a + SUN_SEGMENTS + 1
            // CCW winding seen from outside (the geometry pipeline culls back faces)
            indices.push(a, a + 1, b, a + 1, b + 1, b)
        }
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        tangents: new Float32Array(tangents),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices),
        vertexCount: (SUN_RINGS + 1) * (SUN_SEGMENTS + 1),
    }
}

/**
 * Many-dynamic-lights test scene for the clustered (froxel) light culling
 * pass (Phase 3) and the shadow-tile budget (Phase 2):
 * - Wall.glb ground + a DamagedHelmet sitting on it (measured placements,
 *   same as DemoShadows)
 * - an 8×8 grid of 64 colored point lights hovering above the ground — far
 *   beyond what a per-pixel loop over all lights should handle smoothly.
 *   Each pixel only iterates the lights in its froxel (check the profiler's
 *   `gpu culling` / `gpu lighting` rows). Every light carries a small
 *   emissive "sun" sphere in its color so light positions are visible.
 * - every point light WANTS to cast cube-face shadows, but the per-frame texel
 *   budget only grants tiles to the few most relevant lights — orbit the
 *   camera and watch shadow casters swap (with hysteresis, no flicker).
 */
export class DemoCluster extends Scene implements IScene {
    private _controller: ArcBallController
    private _gridAngle = 0
    private _gridLights: {
        light: PointLight
        marker: Transform
        basePosition: Vec3
    }[] = []

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: this.engine.renderer.context.canvas.height,
            canvasWidth: this.engine.renderer.context.canvas.width,
            position: vec3.create(-6, 4, 0),
        })

        this._controller = new ArcBallController({
            camera: this.camera as ArcBallCamera,
            canvas: this.engine.renderer.context.canvas as HTMLCanvasElement,
        })
    }

    public override async init() {
        await super.init()

        // ground slab — Demo1's proven wall placement (same as DemoShadows)
        // const wallData = await WheezyGLBLoader.loadFromUrl(
        //     'static/models/Wall.glb'
        // )
        // const ground = await this.uploadModel({ modelData: wallData })
        // ground.transform.rotateDegreesEuler({ x: -90, z: -90 })
        // ground.transform.translate(vec3.create(13, 0, 0))
        // ground.transform.scale(vec3.create(0.5, 0.5, 0.5))

        const modelData = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )
        const helmet1 = await this.uploadModel({ modelData })

        const helmet2 = await this.uploadModel({ modelData })

        helmet2.transform.translate(vec3.create(0, 2, 0))

        // shared sun-marker geometry → BufferStorage + one accessor per attribute
        const sphere = createSunSphere()
        const registerSunAccessor = (
            id: string,
            data: Float32Array | Uint16Array,
            byteStride: number,
            elementType: GLTFAccessor['elementType'],
            componentType: number,
            count: number,
            usage: GPUBufferUsageFlags
        ): GLTFAccessor => {
            this.bufferStorage.buffers.set(id, data.buffer as ArrayBuffer)
            return {
                byteStride,
                count,
                componentType,
                elementType,
                byteOffset: 0,
                byteLength: data.byteLength,
                bufferId: id,
                usage,
            }
        }
        const sunPositions = registerSunAccessor(
            'demo-sun-positions',
            sphere.positions,
            12,
            'float32x3',
            5126,
            sphere.vertexCount,
            GPUBufferUsage.VERTEX
        )
        const sunNormals = registerSunAccessor(
            'demo-sun-normals',
            sphere.normals,
            12,
            'float32x3',
            5126,
            sphere.vertexCount,
            GPUBufferUsage.VERTEX
        )
        const sunTangents = registerSunAccessor(
            'demo-sun-tangents',
            sphere.tangents,
            12,
            'float32x3',
            5126,
            sphere.vertexCount,
            GPUBufferUsage.VERTEX
        )
        const sunUvs = registerSunAccessor(
            'demo-sun-uvs',
            sphere.uvs,
            8,
            'float32x2',
            5126,
            sphere.vertexCount,
            GPUBufferUsage.VERTEX
        )
        const sunIndices = registerSunAccessor(
            'demo-sun-indices',
            sphere.indices,
            2,
            'uint16',
            5123,
            sphere.indices.length,
            GPUBufferUsage.INDEX
        )

        // the default material (created by the GLB upload above) provides the
        // fallback textures + samplers for every non-emissive slot
        const defaultMaterial = this.materialStorage.materials.get(
            'default'
        ) as IMaterial
        const device = this.engine.renderer.device

        // 8×8 grid of point lights, deterministic pseudo-random colors
        const gridSize = 2
        const spread = 4
        for (let ix = 0; ix < gridSize; ix++) {
            for (let iz = 0; iz < gridSize; iz++) {
                const x = ((ix + 0.5) / gridSize) * 2 * spread - spread + 0.5
                const z = ((iz + 0.5) / gridSize) * 2 * spread - spread
                // cycle hues without a color library
                const hue = (ix * gridSize + iz) / (gridSize * gridSize)
                const color = vec3.create(
                    0.5 + 0.5 * Math.cos(2 * Math.PI * hue),
                    0.5 + 0.5 * Math.cos(2 * Math.PI * (hue + 1 / 3)),
                    0.5 + 0.5 * Math.cos(2 * Math.PI * (hue + 2 / 3))
                )
                const position = vec3.create(x, 4.6 + (ix % 3) * 0.5, z)
                const light = new PointLight({
                    parent: this.root,
                    position,
                    color,
                    intensity: 0.6,
                    attenuationConstant: 1,
                    attenuationLinear: 0.1,
                    attenuationExponential: 0.05,
                })
                this.pointLights.push(light)

                // emissive sun marker: 1×1 texture in the light's color; black
                // albedo so the marker shows pure emission in the lighting pass
                const emissiveTexture = device.createTexture({
                    label: 'sun marker emissive texture',
                    size: [1, 1, 1],
                    format: 'rgba8unorm',
                    usage:
                        GPUTextureUsage.TEXTURE_BINDING |
                        GPUTextureUsage.COPY_DST |
                        GPUTextureUsage.RENDER_ATTACHMENT,
                })
                device.queue.writeTexture(
                    { texture: emissiveTexture },
                    new Uint8Array([
                        Math.round((color[0] ?? 0) * 255),
                        Math.round((color[1] ?? 0) * 255),
                        Math.round((color[2] ?? 0) * 255),
                        255,
                    ]),
                    { bytesPerRow: 4 },
                    [1, 1, 1]
                )

                const sun = new GameObject()
                this.objectManager.addObject(sun, this.root)
                const marker = new Transform(sun)
                sun.transform.translate(position)
                sun.transform.scale(
                    vec3.create(SUN_RADIUS, SUN_RADIUS, SUN_RADIUS)
                )
                new Mesh(
                    sun,
                    sunPositions,
                    sunIndices,
                    sunNormals,
                    sunUvs,
                    sunTangents,
                    {
                        ...defaultMaterial,
                        name: 'sun marker material',
                        baseColorFactor: vec4.create(0, 0, 0, 1),
                        emissiveFactor: color,
                        emissiveTexture: {
                            view: emissiveTexture.createView(),
                            sampler: defaultMaterial.emissiveTexture.sampler,
                        },
                    }
                )

                this._gridLights.push({
                    light,
                    marker,
                    basePosition: vec3.clone(position),
                })
            }
        }
    }

    public override onRender(dt: number): void {
        this._controller.update(dt)

        // rotate the light grid in place — light transforms are ignored
        // (positions are plain properties), so rotate the stored base
        // positions around the grid center and sync each light + sun marker
        this._gridAngle += GRID_ROTATION_SPEED * dt
        const rotation = mat4.rotationY(this._gridAngle)
        for (const { light, marker, basePosition } of this._gridLights) {
            const rotated = vec3.transformMat4(
                vec3.sub(basePosition, GRID_CENTER),
                rotation
            )
            vec3.add(rotated, GRID_CENTER, rotated)
            light.position = rotated
            marker.translate(rotated)
        }
    }
}
