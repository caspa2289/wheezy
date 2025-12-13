import {
    IGameObject,
    IScene,
    Scene,
    SpotLight,
    WheezyGLBLoader,
} from '@wheezy/engine'
import { ArcBallCamera } from '@wheezy/engine/src/engine/core/cameras/ArcBallCamera'
import { vec3 } from 'wgpu-matrix'

export class DemoRTC extends Scene implements IScene {
    private _gameObject!: IGameObject
    private _connection: RTCPeerConnection = new RTCPeerConnection()
    private _dataChannel!: RTCDataChannel
    private _candidateDescription!: string

    constructor() {
        super()

        this.camera = new ArcBallCamera({
            canvasHeight: this.engine.renderer.context.canvas.height,
            canvasWidth: this.engine.renderer.context.canvas.width,
            position: vec3.create(-4, 0, 0),
        })
    }

    public async init() {
        await super.init()

        const modelData1 = await WheezyGLBLoader.loadFromUrl(
            'static/models/DamagedHelmet.glb'
        )

        this._gameObject = await this.uploadModel({
            modelData: modelData1,
        })

        this._gameObject.transform.rotateDegreesEuler({ x: 90, z: 90 })

        this.spotLights.push(
            new SpotLight({
                parent: this.root,
                position: vec3.create(-2, 0, 0),
                direction: vec3.create(1, 0, 0),
            })
        )

        this._dataChannel =
            await this._connection.createDataChannel('test channel')

        this._dataChannel.onmessage = this._handleMessage

        const offer = await this._connection.createOffer({
            offerToReceiveAudio: false,
            offerToReceiveVideo: false,
        })

        await this._connection.setLocalDescription(offer)

        this._connection.onconnectionstatechange = async (event: any) => {
            console.log(event?.currentTarget?.connectionState)
        }

        this._connection.onicecandidate = (event) => {
            console.log(event.candidate)
            if (event.candidate && !this._candidateDescription) {
                if (this._connection.remoteDescription) {
                    this._connection.addIceCandidate(event.candidate)
                }
                this._candidateDescription = event.candidate.candidate

                console.log(
                    JSON.stringify(this._connection.localDescription) +
                        'POOPY_BALLS' +
                        this._candidateDescription
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

        button.addEventListener('click', this._handleInput)

        wrapper.appendChild(input)
        wrapper.appendChild(button)

        document.body.appendChild(wrapper)
    }

    public onRender(dt: number): void {}

    private _handleMessage = (event: MessageEvent) => {
        console.log(new Float64Array(event.data))
    }

    private _handleInput = async () => {
        const peerData = (document.getElementById('input') as HTMLInputElement)
            .value

        const [jsonString, candidate] = peerData.split('POOPY_BALLS')
        const desc = JSON.parse(jsonString)

        await this._connection.setRemoteDescription(desc)

        await this._connection.addIceCandidate({
            candidate,
            sdpMLineIndex: 0,
            sdpMid: '0',
        })
    }
}
