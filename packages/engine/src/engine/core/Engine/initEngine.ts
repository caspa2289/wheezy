import { type IEngine, type IEngineProps } from '../../types'
import { engine, isEngineReady, setEngineGlobals } from '../globals'
import { Engine } from './Engine'

/**
 * Creates the Engine singleton (Renderer included) and publishes it through
 * the `engine` / `renderer` globals. The main entry point — call it once with
 * the target canvas before constructing any Scene.
 */
export const initEngine = async ({
    canvas,
}: IEngineProps): Promise<IEngine> => {
    if (isEngineReady()) {
        console.warn('Engine has already been instanced')
        return engine
    }

    try {
        const engineInstance = new Engine()
        await engineInstance.initRenderer(canvas)
        setEngineGlobals(engineInstance)
        //FIXME: types
        ;(window as any).WheezyEngine = engineInstance

        return engine
    } catch (err) {
        alert(err)
        throw err
    }
}
