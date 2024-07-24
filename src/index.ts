import { Mesh, ObjectManager } from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import { EntityTypes, IMesh } from './engine/types'
import { mat4, vec3 } from 'wgpu-matrix'
import { PerspectiveCamera } from './engine/core/cameras'
import { Stuff } from './utils/Stuff'
;(async () => {
    const objectManager = new ObjectManager()

    const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
    const device = await adapter.requestDevice()

    const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement
    const context = canvas.getContext('webgpu') as GPUCanvasContext

    const shaderModule = device.createShaderModule({ code: shaderCode })
    const compilationInfo = await shaderModule.getCompilationInfo()
    console.log(compilationInfo)

    const swapChainFormat = 'bgra8unorm' as GPUTextureFormat
    context.configure({
        device: device,
        format: swapChainFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })

    const depthFormat = 'depth24plus-stencil8' as GPUTextureFormat
    const depthTexture = device.createTexture({
        size: {
            width: canvas.width,
            height: canvas.height,
            depthOrArrayLayers: 1,
        },
        format: depthFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })

    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: { type: 'uniform' },
            },
        ],
    })

    const viewParamsBuffer = device.createBuffer({
        size: 16 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const viewParamBG = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: viewParamsBuffer } }],
    })

    const ass = await WheezyGLBLoader.loadFromUrl(
        'static/models/Duck.glb',
        objectManager,
        device
    )

    const iterateNode = (node: any) => {
        node?.gameObject?.components?.forEach((component: any) => {
            if (component.type === EntityTypes.mesh) {
                ;(component as Mesh).buildRenderPipeline(
                    device,
                    shaderModule,
                    swapChainFormat,
                    depthFormat,
                    bindGroupLayout
                )

                console.log(component)
            }
        })
        node?.children?.forEach((child: any) => {
            iterateNode(child)
        })
    }

    objectManager.sceneTree.nodes.forEach((node) => {
        iterateNode(node)
    })

    const renderPassDesc = {
        colorAttachments: [
            {
                view: null as unknown as GPUTextureView,
                loadOp: 'clear' as GPULoadOp,
                clearValue: [0.3, 0.3, 0.3, 1],
                storeOp: 'store' as GPUStoreOp,
            },
        ],
        depthStencilAttachment: {
            view: depthTexture.createView(),
            depthLoadOp: 'clear' as GPULoadOp,
            depthClearValue: 1.0,
            depthStoreOp: 'store' as GPUStoreOp,
            stencilLoadOp: 'clear' as GPULoadOp,
            stencilClearValue: 0,
            stencilStoreOp: 'store' as GPUStoreOp,
        },
    }

    const camera = new PerspectiveCamera({
        zFar: 1000,
        zNear: 0.0001,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        position: vec3.create(),
    })

    //camera controller setup
    let moveLeft = false
    let moveRight = false
    let moveForward = false
    let moveBack = false
    let moveUp = false
    let moveDown = false
    let rotateLeft = false
    let rotateRight = false

    window.addEventListener('keydown', (evt: any) => {
        switch (evt.code) {
            case 'KeyA':
                moveLeft = true
                break
            case 'KeyD':
                moveRight = true
                break
            case 'KeyS':
                moveBack = true
                break
            case 'KeyW':
                moveForward = true
                break
            case 'KeyQ':
                rotateLeft = true
                break
            case 'KeyE':
                rotateRight = true
                break
            case 'Space':
                moveUp = true
                break
            case 'ControlLeft':
                moveDown = true
                break
            default:
                break
        }
    })

    window.addEventListener('keyup', (evt: any) => {
        switch (evt.code) {
            case 'KeyA':
                moveLeft = false
                break
            case 'KeyD':
                moveRight = false
                break
            case 'KeyS':
                moveBack = false
                break
            case 'KeyW':
                moveForward = false
                break
            case 'KeyQ':
                rotateLeft = false
                break
            case 'KeyE':
                rotateRight = false
                break
            case 'Space':
                moveUp = false
                break
            case 'ControlLeft':
                moveDown = false
                break
            default:
                break
        }
    })

    let velocity = vec3.create()

    const sign = (positive: boolean, negative: boolean) =>
        (positive ? 1 : 0) - (negative ? 1 : 0)

    const movementSpeed = 5
    const frictionCoefficient = 0.99
    const rotationSpeed = 0.05

    let prevTime = 0

    let gameObjectPosition = vec3.create(0, -2, -5)
    let gameObjectRotation = vec3.create(0, -1.2, 0)
    const gameObjectScale = vec3.create(0.02, 0.02, 0.02)

    const render = (time: number) => {
        const deltaTime = (time - prevTime) / 1000
        prevTime = time
        /****Placeholder camera controller */
        const targetVelocity = vec3.create()
        const deltaRight = sign(moveLeft, moveRight)
        const deltaBack = sign(moveForward, moveBack)
        const deltaUp = sign(moveDown, moveUp)
        camera.yaw += sign(rotateLeft, rotateRight) * rotationSpeed
        vec3.addScaled(targetVelocity, camera.right, deltaRight, targetVelocity)
        vec3.addScaled(targetVelocity, camera.back, deltaBack, targetVelocity)
        vec3.addScaled(targetVelocity, camera.up, deltaUp, targetVelocity)
        vec3.normalize(targetVelocity, targetVelocity)
        vec3.mulScalar(targetVelocity, movementSpeed, targetVelocity)

        velocity = Stuff.lerp(
            targetVelocity,
            velocity,
            Math.pow(1 - frictionCoefficient, deltaTime)
        )

        gameObjectPosition = vec3.addScaled(
            gameObjectPosition,
            velocity,
            deltaTime
        )

        /**************/
        camera.update()
        const viewMatrix = mat4.create()

        mat4.copy(camera.view, viewMatrix)
        mat4.translate(viewMatrix, gameObjectPosition, viewMatrix)
        mat4.rotate(
            viewMatrix,
            vec3.fromValues(1, 0, 0),
            gameObjectRotation[0],
            viewMatrix
        )
        mat4.rotate(
            viewMatrix,
            vec3.fromValues(0, 1, 0),
            gameObjectRotation[1],
            viewMatrix
        )
        mat4.rotate(
            viewMatrix,
            vec3.fromValues(0, 0, 1),
            gameObjectRotation[2],
            viewMatrix
        )

        mat4.scale(viewMatrix, gameObjectScale, viewMatrix)

        const modelViewProjection = mat4.multiply(
            camera.projectionMatrix,
            viewMatrix
        ) as Float32Array

        const upload = device.createBuffer({
            size: 16 * 4,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const map = new Float32Array(upload.getMappedRange())
        map.set(modelViewProjection)
        upload.unmap()

        renderPassDesc.colorAttachments[0].view = context
            .getCurrentTexture()
            .createView()

        const commandEncoder = device.createCommandEncoder()
        commandEncoder.copyBufferToBuffer(
            upload,
            0,
            viewParamsBuffer,
            0,
            16 * 4
        )

        const renderPass = commandEncoder.beginRenderPass(renderPassDesc)

        const iterateNode = (node: any) => {
            node?.gameObject?.components?.forEach((component: any) => {
                if (component.type === EntityTypes.mesh) {
                    renderPass.setBindGroup(0, viewParamBG) // renderPass.setBindGroup(1, this.nodeParamsBG);
                    ;(component as Mesh).render(renderPass)
                }
            })
            node?.children?.forEach((child: any) => {
                iterateNode(child)
            })
        }

        objectManager.sceneTree.nodes.forEach((node) => {
            iterateNode(node)
        })

        renderPass.end()
        device.queue.submit([commandEncoder.finish()])
        upload.destroy()
        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
    // render()
})()
