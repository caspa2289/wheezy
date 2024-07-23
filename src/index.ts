import { Mesh, ObjectManager } from './engine/core'
import { WheezyGLBLoader } from './utils'
import shaderCode from './testShader.wgsl'
import { EntityTypes, IMesh } from './engine/types'
;(async () => {
    const objectManager = new ObjectManager()

    const adapter = (await navigator.gpu.requestAdapter()) as GPUAdapter
    const device = await adapter.requestDevice()

    // Get a context to display our rendered image on the canvas
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

    // Create bind group layout
    const bindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: { type: 'uniform' },
            },
        ],
    })

    // Create a buffer to store the view parameters
    const viewParamsBuffer = device.createBuffer({
        size: 16 * 4,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const viewParamBG = device.createBindGroup({
        layout: bindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: viewParamsBuffer } }],
    })

    const ass = await WheezyGLBLoader.loadFromUrl(
        'static/models/Avocado.glb',
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

    const render = () => {
        const upload = device.createBuffer({
            size: 16 * 4,
            usage: GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true,
        })
        {
            const map = new Float32Array(upload.getMappedRange())
            // map.set(mat4.create(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1))
            upload.unmap()
        }

        renderPassDesc.colorAttachments[0].view = context
            .getCurrentTexture()
            .createView()

        const commandEncoder = device.createCommandEncoder()
        // commandEncoder.copyBufferToBuffer(
        //     upload,
        //     0,
        //     viewParamsBuffer,
        //     0,
        //     16 * 4
        // )

        //FIXME: переделать по типу элементарного рендерера

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
        // requestAnimationFrame(render)
    }
    // requestAnimationFrame(render)
    render()

    // console.log(ass)
})()
