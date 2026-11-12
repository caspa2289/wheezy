import { mat4, vec3 } from 'wgpu-matrix'
import { type IGameObject } from '../../engine/types'
import { Stuff } from '../Stuff'

export interface FPSControllerProps {
    canvas: HTMLCanvasElement
    gameObject: IGameObject
}

// per-frame scratch: the yaw/pitch rotation and one axis vector reused for
// all three basis columns
const scratchRotation = mat4.create()
const scratchAxis = vec3.create()

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

    yaw = 0
    pitch = 0

    movementSpeed = 8
    frictionCoefficient = 0.99
    rotationSpeed = 0.05

    canvas: HTMLCanvasElement
    gameObject: IGameObject

    constructor(props: FPSControllerProps) {
        this.canvas = props.canvas
        this.gameObject = props.gameObject

        // adopt the object's current orientation (e.g. from pointAt) so the
        // first update() doesn't snap it back to yaw/pitch zero
        const matrix = this.gameObject.transform?.matrix
        if (matrix) {
            this.yaw = Math.atan2(matrix[8]!, matrix[10]!)
            this.pitch = -Math.asin(matrix[9]!)
        }

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

    #getSign = (positive: boolean, negative: boolean) =>
        (positive ? 1 : 0) - (negative ? 1 : 0)

    update(deltaTime: number) {
        this.yaw = Stuff.mod(
            this.yaw - this.rotationSpeed * this.analogX * deltaTime,
            Math.PI * 2
        )
        this.pitch = Stuff.clamp(
            this.pitch - this.rotationSpeed * this.analogY * deltaTime,
            -Math.PI / 2,
            Math.PI / 2
        )
        this.analogX = 0
        this.analogY = 0

        const transform = this.gameObject.transform
        if (!transform) {
            return
        }

        // yaw around Y, then pitch around X (roll stays zero) — the same
        // composition PerspectiveCamera.update and GameObject.pointAt use
        mat4.rotateX(
            mat4.rotationY(this.yaw, scratchRotation),
            this.pitch,
            scratchRotation
        )

        const targetVelocity = vec3.create()
        const deltaRight = this.#getSign(this.moveRight, this.moveLeft)
        const deltaBack = this.#getSign(this.moveBack, this.moveForward)
        const deltaUp = this.#getSign(this.moveUp, this.moveDown)
        mat4.getAxis(scratchRotation, 0, scratchAxis)
        vec3.addScaled(targetVelocity, scratchAxis, deltaRight, targetVelocity)
        mat4.getAxis(scratchRotation, 2, scratchAxis)
        vec3.addScaled(targetVelocity, scratchAxis, deltaBack, targetVelocity)
        mat4.getAxis(scratchRotation, 1, scratchAxis)
        vec3.addScaled(targetVelocity, scratchAxis, deltaUp, targetVelocity)
        vec3.normalize(targetVelocity, targetVelocity)
        vec3.mulScalar(targetVelocity, this.movementSpeed, targetVelocity)

        this.velocity = Stuff.lerp(
            targetVelocity,
            this.velocity,
            Math.pow(1 - this.frictionCoefficient, deltaTime)
        )

        // write the pose into the transform: the rotation in place (the
        // matrix buffer is aliased by the camera column views), then the
        // integrated position — vec3 ops on the 4-float position view leave
        // its w untouched
        const position = vec3.copy(transform.position)
        mat4.copy(scratchRotation, transform.matrix)
        vec3.addScaled(position, this.velocity, deltaTime, position)
        vec3.copy(position, transform.position)
    }
}
