import { Engine, IEngine } from '@wheezy/engine'
import { Demo0 } from './src/Demo0'
import { Demo1 } from './src/Demo1'

const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement

const initDebugControls = (engine: IEngine) => {
    const defaultOutputSource = 0
    const defaultScene = 1

    const debugContainer = document.getElementById(
        'debug-container'
    ) as HTMLDivElement

    const sceneSelector = document.getElementById(
        'scene-selector'
    ) as HTMLSelectElement

    const sceneOptions = [
        { label: 'Scene 1', value: 0 },
        { label: 'Scene 2', value: 1 },
    ]

    sceneOptions.forEach((item) => {
        const option = document.createElement('option')
        if (item.value === defaultScene) {
            option.selected = true
        }
        option.textContent = item.label
        option.value = String(item.value)
        sceneSelector.appendChild(option)
    })

    sceneSelector.addEventListener('change', (event) => {
        setScene(engine, Number((event.target as HTMLSelectElement).value))
    })

    const outputSourceDropDown = document.createElement('select')
    outputSourceDropDown.addEventListener('change', (event) => {
        engine.renderer.outputSource = Number(
            (event.target as HTMLSelectElement).value
        )
    })

    const outputOptions = [
        { label: 'Color', value: 0 },
        { label: 'Ambient color', value: 2 },
        { label: 'Diffuse color', value: 3 },
        { label: 'Metallic component', value: 4 },
        { label: 'Roughness component', value: 5 },
        { label: 'Occlusion component', value: 8 },
        { label: 'Surface normal', value: 1 },
        { label: 'Fragment normal', value: 6 },
        { label: 'Vertex tangent', value: 7 },
    ]

    outputOptions.forEach((item) => {
        const option = document.createElement('option')
        if (item.value === defaultOutputSource) {
            option.selected = true
        }
        option.textContent = item.label
        option.value = String(item.value)
        outputSourceDropDown.appendChild(option)
    })

    engine.renderer.outputSource = defaultOutputSource
    setScene(engine, defaultScene)

    debugContainer.appendChild(outputSourceDropDown)
}

const setScene = async (engine: IEngine, index: number) => {
    const loader = document.getElementById('loader') as HTMLDivElement

    switch (index) {
        case 0: {
            loader.style.display = 'block'
            engine.scene = undefined
            const scene = new Demo0()
            await scene.init()

            engine.scene = scene
            loader.style.display = 'none'
            engine.render()

            break
        }
        case 1: {
            loader.style.display = 'block'
            engine.scene = undefined
            const scene = new Demo1()
            await scene.init()

            engine.scene = scene
            loader.style.display = 'none'
            engine.render()
            break
        }
    }
}

const run = async () => {
    const engine = (await Engine.getOrInit({ canvas })) as Engine

    initDebugControls(engine)
}

run()
