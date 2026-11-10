import { type IEngine, type IRenderer, type IScene } from '../../types'

// The singletons live in module-local variables; the exported `engine` /
// `renderer` / `scene` are const proxies forwarding to them, so
// `import { engine, renderer, scene } from '@wheezy/engine'` gives a valid
// instance anywhere without storing references.
//
// Why proxies and not `export let` live bindings: Bun's dev-server HMR
// runtime compiles `export *` barrels into object spreads, which snapshot
// mutable bindings at module-eval time (they'd stay `undefined` forever).
// A const object identity survives any number of barrel re-exports, in both
// the dev server and prod builds.
let engineInstance: IEngine | undefined
let rendererInstance: IRenderer | undefined
let sceneInstance: IScene | undefined

export const isEngineReady = () => engineInstance !== undefined

export const setEngineGlobals = (instance: IEngine) => {
    engineInstance = instance
    rendererInstance = instance.renderer
}

export const setSceneGlobal = (activeScene: IScene | undefined) => {
    sceneInstance = activeScene
}

const singletonProxy = <T extends object>(
    get: () => T | undefined,
    missingMessage: string
): T =>
    new Proxy({} as T, {
        get(_target, prop) {
            const instance = get()
            if (!instance) {
                throw new Error(missingMessage)
            }
            const value = Reflect.get(instance, prop, instance)
            // methods must be bound to the real instance: class methods
            // reading #private fields throw when called with the proxy as
            // their `this`
            return typeof value === 'function' ? value.bind(instance) : value
        },
        set(_target, prop, value) {
            const instance = get()
            if (!instance) {
                throw new Error(missingMessage)
            }
            return Reflect.set(instance, prop, value, instance)
        },
        has(_target, prop) {
            const instance = get()
            return instance ? Reflect.has(instance, prop) : false
        },
    })

export const engine: IEngine = singletonProxy(
    () => engineInstance,
    'Wheezy: `engine` accessed before initialization — call initEngine({ canvas }) first'
)

export const renderer: IRenderer = singletonProxy(
    () => rendererInstance,
    'Wheezy: `renderer` accessed before initialization — call initEngine({ canvas }) first'
)

// `undefined` between scene switches, so accessing it then throws
export const scene: IScene = singletonProxy(
    () => sceneInstance,
    'Wheezy: `scene` accessed while no scene is active'
)
