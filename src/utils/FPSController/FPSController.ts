import { vec3 } from 'wgpu-matrix'
import { IPerspectiveCamera } from '../../engine/types/core/Camera'
import { Stuff } from '../Stuff'

export interface FPSControllerProps {
    canvas: HTMLCanvasElement
    camera: IPerspectiveCamera
}

//FIXME: refactor when input controller is in place

export class FPSController {
    moveLeft = false
    moveRight = false
    moveForward = false
    moveBack = false
    moveUp = false
    moveDown = false

    analogX = 0
    analogY = 0

    velocity = vec3.create()

    movementSpeed = 8
    frictionCoefficient = 0.99
    rotationSpeed = 0.05

    canvas: HTMLCanvasElement
    camera: IPerspectiveCamera

    constructor(props: FPSControllerProps) {
        this.canvas = props.canvas
        this.camera = props.camera

        window.addEventListener('keydown', (evt: any) => {
            switch (evt.code) {
                case 'KeyA':
                    this.moveLeft = true
                    break
                case 'KeyD':
                    this.moveRight = true
                    break
                case 'KeyS':
                    this.moveBack = true
                    break
                case 'KeyW':
                    this.moveForward = true
                    break
                case 'Space':
                    this.moveUp = true
                    break
                case 'ControlLeft':
                    this.moveDown = true
                    break
                default:
                    break
            }
        })

        window.addEventListener('keyup', (evt: any) => {
            switch (evt.code) {
                case 'KeyA':
                    this.moveLeft = false
                    break
                case 'KeyD':
                    this.moveRight = false
                    break
                case 'KeyS':
                    this.moveBack = false
                    break
                case 'KeyW':
                    this.moveForward = false
                    break
                case 'Space':
                    this.moveUp = false
                    break
                case 'ControlLeft':
                    this.moveDown = false
                    break
                default:
                    break
            }
        })

        this.canvas.addEventListener('pointermove', (evt) => {
            const mouseDown =
                evt.pointerType == 'mouse' ? (evt.buttons & 1) !== 0 : true

            if (mouseDown) {
                this.analogX += evt.movementX
                this.analogY += evt.movementY
            }
        })
    }

    private getSign = (positive: boolean, negative: boolean) =>
        (positive ? 1 : 0) - (negative ? 1 : 0)

    update(deltaTime: number) {
        const targetVelocity = vec3.create()
        const deltaRight = this.getSign(this.moveRight, this.moveLeft)
        const deltaBack = this.getSign(this.moveBack, this.moveForward)
        const deltaUp = this.getSign(this.moveUp, this.moveDown)
        this.camera.yaw -= this.rotationSpeed * this.analogX * deltaTime
        this.camera.pitch -= this.rotationSpeed * this.analogY * deltaTime
        this.analogX = 0
        this.analogY = 0
        vec3.addScaled(
            targetVelocity,
            this.camera.right,
            deltaRight,
            targetVelocity
        )
        vec3.addScaled(
            targetVelocity,
            this.camera.back,
            deltaBack,
            targetVelocity
        )
        vec3.addScaled(targetVelocity, this.camera.up, deltaUp, targetVelocity)
        vec3.normalize(targetVelocity, targetVelocity)
        vec3.mulScalar(targetVelocity, this.movementSpeed, targetVelocity)

        this.velocity = Stuff.lerp(
            targetVelocity,
            this.velocity,
            Math.pow(1 - this.frictionCoefficient, deltaTime)
        )

        this.camera.position = vec3.addScaled(
            this.camera.position,
            this.velocity,
            deltaTime
        )
    }
}
