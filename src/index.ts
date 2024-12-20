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

    const duckModelData1 = await WheezyGLBLoader.loadFromUrl(
        'static/models/Duck.glb'
    )

    const helmetGameObject = await scene.uploadModel({
        modelData: helmetModelData,
        shaderModule,
    })

    const duckGameObject = await scene.uploadModel({
        modelData: duckModelData,
        shaderModule,
    })

    const duckGameObject1 = await scene.uploadModel({
        modelData: duckModelData1,
        shaderModule,
    })

    scene.objectManager.reparentObject(duckGameObject, helmetGameObject)
    scene.objectManager.reparentObject(duckGameObject1, helmetGameObject)

    //FIXME: add component type getter to gameobject
    const helmetTransform = [...helmetGameObject.components.values()].find(
        (component) => {
            return component.type === EntityTypes.transform
        }
    ) as ITransform

    const duckTransform = [...duckGameObject.components.values()].find(
        (component) => {
            return component.type === EntityTypes.transform
        }
    ) as ITransform

    const duckTransform1 = [...duckGameObject1.components.values()].find(
        (component) => {
            return component.type === EntityTypes.transform
        }
    ) as ITransform

    //FIXME: changing either transform changes the other
    //they reuse buffers, so its basically instanced but not intentionally

    helmetTransform.rotateRadians({ x: 1.1 })
    duckTransform.translate(vec3.create(0, 2, 0))
    duckTransform.scale(vec3.create(0.5, 0.5, 0.5))
    duckTransform1.translate(vec3.create(0, -2.5, 0))
    duckTransform1.scale(vec3.create(0.8, 0.8, 0.8))

    engine.render((dt: number) => {
        // controller.update(1 / 60)
        helmetTransform.rotateRadians({ z: 0.1 * dt })
        duckTransform.rotateRadians({ z: 0.1 * dt, y: 0.1 * dt, x: 0.1 * dt })
        duckTransform1.rotateRadians({ z: 0.05 * dt })
    }, 1)
}

run()
