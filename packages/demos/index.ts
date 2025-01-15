import { Engine, IEngine } from '@wheezy/engine'
import { Demo1 } from './src/Demo1'
// import { Demo0 } from './src/Demo0'

const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement

const initDebugControls = (engine: IEngine) => {
    const defaultOutputSource = 0
    const defaultRenderingMode = 1

    const debugContainer = document.getElementById(
        'debug-container'
    ) as HTMLDivElement

    const outputSourceDropDown = document.createElement('select')
    outputSourceDropDown.addEventListener('change', (event) => {
        engine.renderer.outputSource = Number(
            (event.target as HTMLSelectElement).value
        )
    })

    const renderingModeDropDown = document.createElement('select')
    renderingModeDropDown.addEventListener('change', (event) => {
        engine.renderer.renderingMode = Number(
            (event.target as HTMLSelectElement).value
        )
    })

    const outputOptions = [
        { label: 'Color', value: 0 },
        { label: 'Ambient color', value: 2 },
        { label: 'Diffuse color', value: 3 },
        { label: 'Metallic component', value: 4 },
        { label: 'Roughness component', value: 5 },
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

    const renderModes = [
        { label: 'Use Surface Normals (No bump mapping)', value: 0 },
        { label: 'Use Fragment Normals (With bump mapping)', value: 1 },
    ]

    renderModes.forEach((item) => {
        const option = document.createElement('option')
        if (item.value === defaultRenderingMode) {
            option.selected = true
        }
        option.textContent = item.label
        option.value = String(item.value)
        renderingModeDropDown.appendChild(option)
    })

    engine.renderer.outputSource = defaultOutputSource
    engine.renderer.renderingMode = defaultRenderingMode

    debugContainer.appendChild(outputSourceDropDown)
    debugContainer.appendChild(renderingModeDropDown)
}

const run = async () => {
    const engine = (await Engine.getOrInit({ canvas })) as Engine

    initDebugControls(engine)

    const scene = new Demo1()
    // const scene = new Demo0()
    await scene.init()

    engine.scene = scene

    engine.render()
}

run()
