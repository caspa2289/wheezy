import {
    GameObject,
    Mesh,
    ObjectManager,
    SamplerStorage,
    TextureStorage,
    Transform,
} from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import {
    EntityTypes,
    GLTFAccessor,
    IGameObject,
    IModelPreloadData,
    IObjectManager,
    IPreloadEntity,
    ISamplerStorage,
    ITextureStorage,
    ITransform,
    SceneNodeContent,
} from './engine/types'
import { Mat4, mat4, vec3 } from 'wgpu-matrix'
import { PerspectiveCamera } from './engine/core/cameras'
import { Stuff } from './utils/Stuff'
import { BufferStorage } from './engine/core/BufferStorage'
import { IBufferStorage } from './engine/types/core/BufferStorage'
import { ImageStorage } from './engine/core/ImageStorage'
import { IImageStorage } from './engine/types/core/ImageStorage'

const objectManager = new ObjectManager()
const bufferStorage = new BufferStorage()
const imageStorage = new ImageStorage()
const samplerStorage = new SamplerStorage()
const textureStorage = new TextureStorage()

export enum GLTFTextureFilter {
    NEAREST = 9728,
    LINEAR = 9729,
    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987,
}

export enum GLTFTextureWrap {
    REPEAT = 10497,
    CLAMP_TO_EDGE = 33071,
    MIRRORED_REPEAT = 33648,
}

export const getTextureFilterMode = (filter?: GLTFTextureFilter) => {
    switch (filter) {
        case GLTFTextureFilter.NEAREST_MIPMAP_NEAREST:
        case GLTFTextureFilter.NEAREST_MIPMAP_LINEAR:
        case GLTFTextureFilter.NEAREST:
            return 'nearest' as GPUFilterMode
        case GLTFTextureFilter.LINEAR_MIPMAP_NEAREST:
        case GLTFTextureFilter.LINEAR_MIPMAP_LINEAR:
        case GLTFTextureFilter.LINEAR:
            return 'linear' as GPUFilterMode
        default:
            return 'linear'
    }
}

export const getTextureMipMapMode = (filter: GLTFTextureFilter) => {
    switch (filter) {
        case GLTFTextureFilter.NEAREST_MIPMAP_NEAREST:
        case GLTFTextureFilter.LINEAR_MIPMAP_NEAREST:
        case GLTFTextureFilter.NEAREST:
            return 'nearest' as GPUMipmapFilterMode
        case GLTFTextureFilter.LINEAR_MIPMAP_LINEAR:
        case GLTFTextureFilter.NEAREST_MIPMAP_LINEAR:
        case GLTFTextureFilter.LINEAR:
            return 'linear' as GPUMipmapFilterMode
    }
}

export const getTextureAddressMode = (mode?: GLTFTextureWrap) => {
    switch (mode) {
        case GLTFTextureWrap.REPEAT:
            return 'repeat' as GPUAddressMode
        case GLTFTextureWrap.CLAMP_TO_EDGE:
            return 'clamp-to-edge' as GPUAddressMode
        case GLTFTextureWrap.MIRRORED_REPEAT:
            return 'mirror-repeat' as GPUAddressMode
        default:
            return 'repeat'
    }
}

const traversePreloadNode = (
    node: IPreloadEntity,
    parentGameObject: IGameObject,
    objectManager: IObjectManager,
    pipelineParams: {
        device: GPUDevice
        shaderModule: GPUShaderModule
        colorFormat: GPUTextureFormat
        depthFormat: GPUTextureFormat
        uniformsBGLayout: GPUBindGroupLayout
        nodeParamsBGLayout: GPUBindGroupLayout
    },
    bufferStorage: IBufferStorage
) => {
    const { trsMatrix, meshes, children } = node

    const gameObject = new GameObject()

    objectManager.addObject(gameObject, parentGameObject)

    new Transform(gameObject, trsMatrix)

    const {
        device,
        shaderModule,
        colorFormat: swapChainFormat,
        depthFormat,
        uniformsBGLayout: viewParamsBindGroupLayout,
        nodeParamsBGLayout: nodeParamsBindGroupLayout,
    } = pipelineParams

    meshes.forEach((meshData) => {
        const mesh = new Mesh(
            gameObject,
            meshData.positions as GLTFAccessor,
            meshData.indices
        )

        mesh.buildRenderPipeline(
            device,
            shaderModule,
            swapChainFormat,
            depthFormat,
            viewParamsBindGroupLayout,
            nodeParamsBindGroupLayout,
            bufferStorage
        )
    })

    children.forEach((child) => {
        traversePreloadNode(
            child,
            gameObject,
            objectManager,
            pipelineParams,
            bufferStorage
        )
    })
}

const uploadImages = async (
    modelData: IModelPreloadData,
    bufferStorage: IBufferStorage,
    imageStorage: IImageStorage
) => {
    //FIXME: use Promise.all
    modelData.images.forEach(async (value, key) => {
        const {
            bufferView: {
                buffer,
                byteLength,
                byteOffset,
                //   byteStride
            },
            mimeType,
        } = value

        const imageView = new Uint8Array(
            bufferStorage.buffers.get(buffer) as ArrayBuffer,
            byteOffset,
            byteLength
        )

        const blob = new Blob([imageView], { type: mimeType })
        const bitmap = await createImageBitmap(blob)
        imageStorage.images.set(key, bitmap)
    })
}

const uploadBuffers = (
    modelData: IModelPreloadData,
    bufferStorage: IBufferStorage
) => {
    modelData.buffers.forEach((value, key) => {
        bufferStorage.buffers.set(key, value)
    })
}

const uploadSamplers = (
    modelData: IModelPreloadData,
    samplerStorage: ISamplerStorage,
    device: GPUDevice
) => {
    modelData.samplers.forEach((value, key) => {
        const gpuSampler = device.createSampler({
            magFilter: getTextureFilterMode(value?.magFilter),
            minFilter: getTextureFilterMode(value?.minFilter),
            addressModeU: getTextureAddressMode(value?.wrapS),
            addressModeV: getTextureAddressMode(value?.wrapT),
            //FIXME: use mipmap filtration
            mipmapFilter: 'nearest',
        })
        samplerStorage.samplers.set(key, gpuSampler)
    })
}

const uploadTextures = (
    modelData: IModelPreloadData,
    textureStorage: ITextureStorage
) => {
    modelData.textures.forEach((value, key) => {
        textureStorage.textures.set(key, value)
    })
}

const uploadModel = async (
    modelData: IModelPreloadData,
    objectManager: IObjectManager,
    pipelineParams: {
        device: GPUDevice
        shaderModule: GPUShaderModule
        colorFormat: GPUTextureFormat
        depthFormat: GPUTextureFormat
        uniformsBGLayout: GPUBindGroupLayout
        nodeParamsBGLayout: GPUBindGroupLayout
    },
    bufferStorage: IBufferStorage,
    imageStorage: IImageStorage,
    samplerStorage: ISamplerStorage
) => {
    //TODO: upload textures, create samplers, etc. here.
    uploadBuffers(modelData, bufferStorage)
    await uploadImages(modelData, bufferStorage, imageStorage)
    uploadSamplers(modelData, samplerStorage, pipelineParams.device)
    uploadTextures(modelData, textureStorage)

    const { trsMatrix, meshes, children } = modelData.model

    const sceneObject = new GameObject()

    objectManager.addObject(sceneObject)

    new Transform(sceneObject, trsMatrix)

    const {
        device,
        shaderModule,
        colorFormat: swapChainFormat,
        depthFormat,
        uniformsBGLayout: viewParamsBindGroupLayout,
        nodeParamsBGLayout: nodeParamsBindGroupLayout,
    } = pipelineParams

    meshes.forEach((meshData) => {
        const mesh = new Mesh(
            sceneObject,
            meshData.positions as GLTFAccessor,
            meshData.indices
        )

        mesh.buildRenderPipeline(
            device,
            shaderModule,
            swapChainFormat,
            depthFormat,
            viewParamsBindGroupLayout,
            nodeParamsBindGroupLayout,
            bufferStorage
        )
    })

    children.forEach((child) => {
        traversePreloadNode(
            child,
            sceneObject,
            objectManager,
            pipelineParams,
            bufferStorage
        )
    })

    return sceneObject
}

;(async () => {
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
        size: 16 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const viewParamBG = device.createBindGroup({
        layout: viewParamsBindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: viewParamsBuffer } }],
    })

    const modelData = await WheezyGLBLoader.loadFromUrl(
        'static/models/Duck.glb'
    )

    console.log(modelData)

    const model = await uploadModel(
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
        samplerStorage
    )

    console.log(imageStorage)
    console.log(samplerStorage)
    console.log(textureStorage)

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
        zNear: 0.1,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        // position: vec3.create(-30, 55, 700),
        position: vec3.create(0, 0.8, 3),
        // position: vec3.create(50, -20, 120),
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

    let analogX = 0
    let analogY = 0
    canvas.addEventListener('pointermove', (evt) => {
        const mouseDown =
            evt.pointerType == 'mouse' ? (evt.buttons & 1) !== 0 : true

        if (mouseDown) {
            analogX += evt.movementX
            analogY += evt.movementY
        }
    })

    let velocity = vec3.create()

    const sign = (positive: boolean, negative: boolean) =>
        (positive ? 1 : 0) - (negative ? 1 : 0)

    const movementSpeed = 8
    const frictionCoefficient = 0.99
    const rotationSpeed = 0.05

    let prevTime = 0

    const render = (time: number) => {
        const deltaTime = (time - prevTime) / 1000
        prevTime = time
        /****Placeholder camera controller */
        const targetVelocity = vec3.create()
        const deltaRight = sign(moveRight, moveLeft)
        const deltaBack = sign(moveBack, moveForward)
        const deltaUp = sign(moveUp, moveDown)
        camera.yaw -= rotationSpeed * analogX * deltaTime
        camera.pitch -= rotationSpeed * analogY * deltaTime
        analogX = 0
        analogY = 0
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

        camera.position = vec3.addScaled(camera.position, velocity, deltaTime)

        /**************/
        camera.update()

        const meshesToRender: Mesh[] = []

        const viewParamsUploadBuffer = device.createBuffer({
            size: 16 * 4,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })

        const viewMap = new Float32Array(
            viewParamsUploadBuffer.getMappedRange()
        )
        viewMap.set(camera.projectionMatrix)
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

        // console.log(objectManager)

        const commandEncoder = device.createCommandEncoder()

        commandEncoder.copyBufferToBuffer(
            viewParamsUploadBuffer,
            0,
            viewParamsBuffer,
            0,
            16 * 4
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
    // render(1)
})()
