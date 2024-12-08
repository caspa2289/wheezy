import { Engine } from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import { ArcBallCamera } from './engine/core/cameras/ArcBallCamera'
import { ArcBallController } from './utils/ArcBallController'
import { Scene } from './engine/core/Scene'
import { EntityTypes, ITransform } from './engine/types'

const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement

const run = async () => {
    const engine = (await Engine.getOrInit({ canvas })) as Engine

    const scene = new Scene()

    // const controller = new ArcBallController({
    //     camera: scene.camera as ArcBallCamera,
    //     canvas: engine.context.canvas as HTMLCanvasElement,
    // })

    const shaderModule = engine.device.createShaderModule({ code: shaderCode })

    engine.scene = scene

    const modelData = await WheezyGLBLoader.loadFromUrl(
        'static/models/DamagedHelmet.glb'
    )

    const modelGameObject = await scene.uploadModel({ modelData, shaderModule })

    //FIXME: add component type getter to gameobject
    const transform = [...modelGameObject.components.values()].find(
        (component) => {
            return component.type === EntityTypes.transform
        }
    ) as ITransform

    transform.rotateRadians({ x: 1.1 })

    setInterval(() => {
        // controller.update(1 / 60)
        transform.rotateRadians({ z: 0.015 })
        scene.render()
    }, 1000 / 60)
}

run()
