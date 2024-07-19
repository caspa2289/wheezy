import { ObjectManager } from './engine/core'
import { WheezyGLBLoader } from './utils'
;(async () => {
    const objectManager = new ObjectManager()

    const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
    const device = await adapter.requestDevice()

    const ass = await WheezyGLBLoader.loadFromUrl(
        'static/models/Duck.glb',
        objectManager,
        device
    )

    // console.log(ass)
})()
