import {
    DirectionalLightV2,
    type IGameObject,
    type IScene,
    Scene,
    SpotLight,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { mat4, vec3 } from 'wgpu-matrix'

export class DemoRTC extends Scene implements IScene {
    #gameObject!: IGameObject
    #connection: RTCPeerConnection = new RTCPeerConnection()
    #dataChannel!: RTCDataChannel
    #candidateDescription!: string

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: this.engine.renderer.context.canvas.height,
            canvasWidth: this.engine.renderer.context.canvas.width,
            position: vec3.create(0, 4, 1),
        })
    }

    public override async init() {
        await super.init()

        const modelData1 = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )

        this.#gameObject = await this.uploadModel({
            modelData: modelData1,
        })

        this.directionalLights.push(
            new DirectionalLightV2({
                parent: this.root,
                direction: vec3.create(0, -1, 0),
            })
        )

        this.#dataChannel =
            await this.#connection.createDataChannel('test channel')

        this.#dataChannel.onmessage = this.#handleMessage

        const offer = await this.#connection.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        })

        await this.#connection.setLocalDescription(offer)

        this.#connection.onconnectionstatechange = async (event: any) => {
            console.log(event?.currentTarget?.connectionState)
        }

        this.#connection.onicecandidate = (event) => {
            if (event.candidate && !this.#candidateDescription) {
                if (this.#connection.remoteDescription) {
                    this.#connection.addIceCandidate(event.candidate)
                }
                this.#candidateDescription = event.candidate.candidate

                console.log(
                    JSON.stringify(this.#connection.localDescription) +
                        'POOPY_BALLS' +
                        this.#candidateDescription
                )
            }
        }

        const wrapper = document.createElement('div')
        wrapper.style.position = 'absolute'
        wrapper.style.top = '0'
        wrapper.style.zIndex = '10'
        wrapper.style.padding = '10px'

        const input = document.createElement('input')
        input.id = 'input'

        const button = document.createElement('button')
        button.textContent = 'ok'

        button.addEventListener('click', this.#handleInput)

        wrapper.appendChild(input)
        wrapper.appendChild(button)

        document.body.appendChild(wrapper)
    }

    public override onRender(dt: number): void {}

    #handleMessage = (event: MessageEvent<ArrayBuffer>) => {
        const quaternion = new Float32Array(event.data)
        const rotationMatrix = new Float32Array(
            16 * Float32Array.BYTES_PER_ELEMENT
        )
        mat4.fromQuat(
            [quaternion[0]!, quaternion[1]!, quaternion[2]!, quaternion[3]!],
            rotationMatrix
        )

        this.#gameObject.transform.matrix = rotationMatrix
    }

    #handleInput = async () => {
        const peerData = (document.getElementById('input') as HTMLInputElement)
            .value

        const [jsonString, candidate] = peerData.split('POOPY_BALLS')
        const desc = JSON.parse(jsonString!)

        await this.#connection.setRemoteDescription(desc)

        await this.#connection.addIceCandidate({
            candidate,
            sdpMLineIndex: 0,
            sdpMid: '0',
        })
    }
}
