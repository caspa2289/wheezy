import {
    MaterialStorage,
    Mesh,
    ObjectManager,
    SamplerStorage,
    TextureStorage,
} from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import { EntityTypes, ITransform, SceneNodeContent } from './engine/types'
import { Mat4, mat4, vec3 } from 'wgpu-matrix'
import { Stuff } from './utils/Stuff'
import { BufferStorage } from './engine/core/BufferStorage'
import { ImageStorage } from './engine/core/ImageStorage'
import { ArcBallCamera } from './engine/core/cameras/ArcBallCamera'
import { ArcBallController } from './utils/ArcBallController'
import { ModelUploader } from './engine/core/ModelUploader'

const objectManager = new ObjectManager()
const bufferStorage = new BufferStorage()
const imageStorage = new ImageStorage()
const samplerStorage = new SamplerStorage()
const textureStorage = new TextureStorage()
const materialStorage = new MaterialStorage()

;(async () => {
    const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
    const device = await adapter.requestDevice()

    const canvas = document.getElementById('webgpu-canvas') as HTMLCanvasElement
    canvas.width = document.body.clientWidth * window.devicePixelRatio
    canvas.height = document.body.clientHeight * window.devicePixelRatio

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

    const viewParamsBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: { type: 'uniform' },
            },
        ],
    })

    const nodeParamsBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: { type: 'uniform' },
            },
        ],
    })

    const viewParamsBuffer = device.createBuffer({
        size: 16 * 4 + 16 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const viewParamBG = device.createBindGroup({
        layout: viewParamsBindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: viewParamsBuffer } }],
    })

    const modelData = await WheezyGLBLoader.loadFromUrl(
        'static/models/DamagedHelmet.glb'
    )

    const model = await ModelUploader.uploadModel(
        modelData,
        objectManager,
        {
            device,
            shaderModule,
            colorFormat: swapChainFormat,
            depthFormat,
            uniformsBGLayout: viewParamsBindGroupLayout,
            nodeParamsBGLayout: nodeParamsBindGroupLayout,
        },
        bufferStorage,
        imageStorage,
        samplerStorage,
        materialStorage,
        textureStorage
    )

    const renderPassDesc = {
        colorAttachments: [
            {
                view: null as unknown as GPUTextureView,
                loadOp: 'clear' as GPULoadOp,
                clearValue: [0.4, 0.4, 0.4, 1],
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

    const camera = new ArcBallCamera({
        zFar: 1000,
        zNear: 0.1,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        position: vec3.create(0, 0, 5),
    })

    const controller = new ArcBallController({ camera, canvas })

    let prevTime = 0

    const render = (time: number) => {
        const deltaTime = (time - prevTime) / 1000
        prevTime = time

        controller.update(deltaTime)
        camera.update()

        const meshesToRender: Mesh[] = []

        const viewParamsUploadBuffer = device.createBuffer({
            size: 16 * 4 + 16,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const viewMap = new Float32Array(
            viewParamsUploadBuffer.getMappedRange()
        )
        viewMap.set(camera.projectionMatrix)
        viewMap.set(camera.position, 16)

        viewParamsUploadBuffer.unmap()

        const iterateNode = (node: SceneNodeContent, worldMatrix: Mat4) => {
            const nodeTransform = [...node.gameObject.components.values()].find(
                (component) => component.type === EntityTypes.transform
            ) as ITransform | undefined

            const meshMatrix = nodeTransform
                ? mat4.mul(worldMatrix, nodeTransform.matrix)
                : worldMatrix

            node?.gameObject?.components?.forEach((component: any) => {
                if (component.type === EntityTypes.mesh) {
                    //FIXME: this can be done once per node, and only if node contains meshes
                    const viewMatrix = mat4.copy(camera.view)

                    mat4.translate(
                        viewMatrix,
                        mat4.getTranslation(meshMatrix),
                        viewMatrix
                    )

                    mat4.scale(
                        viewMatrix,
                        mat4.getScaling(meshMatrix),
                        viewMatrix
                    )

                    //FIXME: Do this once on load
                    const meshRotation = Stuff.extractEulerRotation(meshMatrix)

                    mat4.rotateX(viewMatrix, meshRotation[0], viewMatrix)
                    mat4.rotateY(viewMatrix, meshRotation[1], viewMatrix)
                    mat4.rotateZ(viewMatrix, meshRotation[2], viewMatrix)

                    const nodeParamsUploadBuffer = device.createBuffer({
                        size: 16 * 4,
                        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                        mappedAtCreation: true,
                    })
                    const nodeParamsMap = new Float32Array(
                        nodeParamsUploadBuffer.getMappedRange()
                    )
                    nodeParamsMap.set(viewMatrix)
                    nodeParamsUploadBuffer.unmap()

                    component.nodeParamsBindGroup = device.createBindGroup({
                        layout: nodeParamsBindGroupLayout,
                        entries: [
                            {
                                binding: 0,
                                resource: { buffer: nodeParamsUploadBuffer },
                            },
                        ],
                    })

                    meshesToRender.push(component)
                }
            })

            node?.children?.forEach((child: any) => {
                iterateNode(child, meshMatrix)
            })
        }

        objectManager.sceneTree.nodes.forEach((node) => {
            iterateNode(node, mat4.identity())
        })

        const commandEncoder = device.createCommandEncoder()

        commandEncoder.copyBufferToBuffer(
            viewParamsUploadBuffer,
            0,
            viewParamsBuffer,
            0,
            16 * 4 + 16
        )

        renderPassDesc.colorAttachments[0].view = context
            .getCurrentTexture()
            .createView()
        const renderPass = commandEncoder.beginRenderPass(renderPassDesc)

        renderPass.setBindGroup(0, viewParamBG)

        meshesToRender.forEach((mesh) => {
            renderPass.setBindGroup(1, mesh.nodeParamsBindGroup as GPUBindGroup)
            mesh.render(renderPass)
        })

        renderPass.end()
        device.queue.submit([commandEncoder.finish()])
        viewParamsUploadBuffer.destroy()

        requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
})()
