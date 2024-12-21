import { Engine } from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import { ArcBallCamera } from './engine/core/cameras/ArcBallCamera'
import { ArcBallController } from './utils/ArcBallController'
import { Scene } from './engine/core/Scene'
import { EntityTypes, ITransform } from './engine/types'
import { vec3 } from 'wgpu-matrix'

const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement

const run = async () => {
    const engine = (await Engine.getOrInit({ canvas })) as Engine

    const scene = new Scene()

    // const controller = new ArcBallController({
    //     camera: scene.camera as ArcBallCamera,
    //     canvas: engine.context.canvas as HTMLCanvasElement,
    // })

    //FIXME: create shader module per pipeline (per mesh for now)
    const shaderModule = engine.device.createShaderModule({ code: shaderCode })

    engine.scene = scene

    const helmetModelData = await WheezyGLBLoader.loadFromUrl(
        'static/models/DamagedHelmet.glb'
    )

    const duckModelData = await WheezyGLBLoader.loadFromUrl(
        'static/models/Duck.glb'
    )

    const helmetGameObject = await scene.uploadModel({
        modelData: helmetModelData,
        shaderModule,
    })

    //FIXME: add component type getter to gameobject
    const helmetTransform = [...helmetGameObject.components.values()].find(
        (component) => {
            return component.type === EntityTypes.transform
        }
    ) as ITransform

    const duckAmount = 20

    const duckTransforms: ITransform[] = await Promise.all(
        new Array(duckAmount).fill(1).map(() => {
            return scene
                .uploadModel({
                    modelData: duckModelData,
                    shaderModule,
                })
                .then((duckGameObject) => {
                    const duckTransform = [
                        ...duckGameObject.components.values(),
                    ].find((component) => {
                        return component.type === EntityTypes.transform
                    }) as ITransform

                    scene.objectManager.reparentObject(
                        duckGameObject,
                        helmetGameObject
                    )

                    const radius = Math.random() * 1.7 + 1.25
                    const angle = Math.random() * Math.PI * 2
                    const x = Math.sin(angle) * radius
                    const y = (Math.random() - 0.5) * 0.015
                    const z = Math.cos(angle) * radius

                    duckTransform.translate(vec3.create(x, y, z))
                    duckTransform.rotateRadians({
                        x: Math.random() * Math.PI,
                        y: Math.random() * Math.PI,
                    })
                    duckTransform.scale(vec3.create(0.2, 0.2, 0.2))

                    return duckTransform
                })
        })
    )

    helmetTransform.rotateRadians({ x: 1.1 })

    engine.render((dt: number) => {
        // controller.update(1 / 60)
        helmetTransform.rotateRadians({ z: 0.1 * dt })
        duckTransforms.forEach((duckTransform) => {
            duckTransform.rotateRadians({
                z: 0.2 * dt,
                y: 0.2 * dt,
                x: 0.2 * dt,
            })
        })
    }, 1)
}

run()
