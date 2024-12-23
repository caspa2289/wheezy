import { Engine } from '@wheezy/engine'
import { Demo0 } from './src/Demo0'

const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement

const run = async () => {
    const engine = (await Engine.getOrInit({ canvas })) as Engine

    const scene = new Demo0()
    await scene.init()

    engine.scene = scene

    engine.render()
}

run()
