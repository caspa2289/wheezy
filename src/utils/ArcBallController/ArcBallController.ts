import { vec3 } from 'wgpu-matrix'
import { IArcBallCamera } from '../../engine/types/core/Camera'
import { Stuff } from '../Stuff'

export interface ArcBallControllerProps {
    camera: IArcBallCamera
    canvas: HTMLCanvasElement
}

export class ArcBallController {
    rotationSpeed = 0.3
    zoomSpeed = 0.1
    frictionCoefficient = 0.999
    private _angularVelocity = 0
    private _isTouching = false

    analogX = 0
    analogY = 0

    touchX = 0
    touchY = 0

    camera: IArcBallCamera
    canvas: HTMLCanvasElement

    constructor({ camera, canvas }: ArcBallControllerProps) {
        this.camera = camera
        this.canvas = canvas

        this.canvas.addEventListener('pointerdown', () => {
            this._isTouching = true
        })

        this.canvas.addEventListener('pointerup', () => {
            this._isTouching = false
            // this.touchX = 0
            // this.touchY = 0
        })

        this.canvas.addEventListener('pointermove', (evt) => {
            const mouseDown =
                evt.pointerType == 'mouse' ? (evt.buttons & 1) !== 0 : true

            if (mouseDown) {
                this.analogX += evt.movementX
                this.analogY += evt.movementY
            }
        })

        this.canvas.addEventListener('touchstart', (evt) => {
            this.touchX = evt.changedTouches[0].clientX
            this.touchY = evt.changedTouches[0].clientY
        })

        this.canvas.addEventListener('touchmove', (evt) => {
            this.analogX += evt.changedTouches[0].clientX - this.touchX
            this.analogY += evt.changedTouches[0].clientY - this.touchY
            this.touchX = evt.changedTouches[0].clientX
            this.touchY = evt.changedTouches[0].clientY
        })
    }

    update(deltaTime: number) {
        const epsilon = 0.0000001

        if (this._isTouching) {
            this._angularVelocity = 0
        } else {
            this._angularVelocity *= Math.pow(
                1 - this.frictionCoefficient,
                deltaTime
            )
        }

        const movement = vec3.create()
        vec3.addScaled(movement, this.camera.right, this.analogX, movement)
        vec3.addScaled(movement, this.camera.up, -this.analogY, movement)

        this.analogX = 0
        this.analogY = 0

        const crossProduct = vec3.cross(movement, this.camera.back)
        const magnitude = vec3.len(crossProduct)

        if (magnitude > epsilon) {
            this.camera.axis = vec3.scale(crossProduct, 1 / magnitude)
            this._angularVelocity = magnitude * this.rotationSpeed
        }

        const rotationAngle = this._angularVelocity * deltaTime

        if (rotationAngle > epsilon) {
            this.camera.back = vec3.normalize(
                Stuff.rotate(this.camera.back, this.camera.axis, rotationAngle)
            )
            this.camera.recalculateRight()
            this.camera.recalculateUp()
        }

        //TODO
        // if (this.analogZoom !== 0) {
        //     this.distance *= 1 + analogZoom * this.zoomSpeed
        // }

        this.camera.position = vec3.scale(
            this.camera.back,
            this.camera.distance
        )
    }
}
