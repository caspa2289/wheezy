import { Engine } from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import { ArcBallCamera } from './engine/core/cameras/ArcBallCamera'
import { ArcBallController } from './utils/ArcBallController'
import { Scene } from './engine/core/Scene'

const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement

const engine = new Engine({ canvas })

setTimeout(() => {
    const scene = new Scene({})

    const controller = new ArcBallController({
        camera: scene.camera as ArcBallCamera,
        canvas: engine.context.canvas as HTMLCanvasElement,
    })

    const shaderModule = engine.device.createShaderModule({ code: shaderCode })

    engine.scene = scene

    WheezyGLBLoader.loadFromUrl('static/models/DamagedHelmet.glb').then(
        (modelData) => {
            scene.uploadModel({ modelData, shaderModule }).then(() => {
                setInterval(() => {
                    controller.update(1 / 60)
                    scene.render()
                }, 1000 / 60)
            })
        }
    )
}, 500)
