import { type IAnimator } from '../../../types'

const PANEL_ID = 'wheezy-animation-debugger'
const SPEED_MIN = 0.25
const SPEED_MAX = 4
const SPEED_STEP = 0.25
const SYNC_INTERVAL_MS = 250
const SWITCH_FADE_SECONDS = 0.25

export interface IAnimationDebuggerEntry {
    animator: IAnimator
    /** clip started at construction time; omitted entries stay idle */
    defaultClip?: string
}

interface AnimatorPanel {
    animator: IAnimator
    name: string
    clipNames: string[]
    lastClip?: string
    tabButton: HTMLButtonElement
    controls: HTMLDivElement
    clipSelect: HTMLSelectElement
    playPauseButton: HTMLButtonElement
    loopCheckbox: HTMLInputElement
    speedSlider: HTMLInputElement
    speedReadout: HTMLSpanElement
}

const formatSpeed = (value: number) => `×${value.toFixed(2)}`

const CONTROL_STYLE = [
    'cursor:pointer',
    'background:transparent',
    'border:1px solid rgba(0,255,0,0.4)',
    'color:#0f0',
    'font:inherit',
    'line-height:1.4',
    'padding:0 5px',
    'border-radius:3px',
].join(';')

/**
 * Dev-time HUD for inspecting and driving animators live, styled and behaved
 * like the profiler HUD: draggable by its title bar, foldable with the
 * title-bar button, green-on-black monospace.
 *
 * Each tracked model is a **tab**; the active tab shows its controls:
 * - a **dropdown** of every clip in the library, with **◀ / ▶ buttons**
 *   cycling through them one at a time (wrapping) — picking or cycling
 *   switches playback with a short crossfade,
 * - a **play / pause** toggle button — reads "pause" while the animation
 *   plays (click freezes the pose in place) and "play" while it is paused or
 *   nothing plays (click continues, or replays the last picked clip when
 *   nothing is playing, e.g. after an external `stop`),
 * - a **loop** checkbox and a 0.25-stepped **speed** slider (0.25×–4×),
 *   applied to whatever is playing and to clips started from the panel.
 *
 * Entries may carry a `defaultClip` to start at construction; without one
 * the animator stays idle until a clip is picked. A 4 Hz sync reflects
 * external changes (code-driven play/stop/speed edits) back into the
 * controls, skipping any control the user is currently interacting with.
 *
 * Constructing a new debugger destroys the previous one, so scene switches
 * never stack panels. `destroy()` detaches the panel and its sync timer.
 */
export class AnimationDebugger {
    static #current: AnimationDebugger | undefined

    #root: HTMLDivElement
    #panels: AnimatorPanel[] = []
    #syncTimer: number

    constructor(entries: IAnimationDebuggerEntry[]) {
        AnimationDebugger.#current?.destroy()
        AnimationDebugger.#current = this

        const root = document.createElement('div')
        root.id = PANEL_ID
        root.style.cssText = [
            'position:fixed',
            'left:12px',
            'bottom:12px',
            'z-index:9999',
            'pointer-events:auto',
            'font:12px/1.5 monospace',
            'color:#0f0',
            'background:rgba(0,0,0,0.7)',
            'border:1px solid rgba(0,255,0,0.3)',
            'border-radius:4px',
            'padding:4px 8px',
            'width:300px',
            'max-width:calc(100vw - 24px)',
        ].join(';')

        // title bar: drag handle (everywhere except the collapse button)
        const titleBar = document.createElement('div')
        titleBar.style.cssText = [
            'display:flex',
            'align-items:center',
            'justify-content:space-between',
            'gap:8px',
            'cursor:move',
            'touch-action:none',
            'user-select:none',
            'margin-bottom:2px',
        ].join(';')

        const title = document.createElement('span')
        title.textContent = 'animation debugger'
        title.style.fontWeight = 'bold'
        titleBar.appendChild(title)

        const collapseBtn = document.createElement('button')
        collapseBtn.type = 'button'
        collapseBtn.textContent = '-'
        collapseBtn.title = 'collapse / expand (drag the title bar to move)'
        collapseBtn.style.cssText = CONTROL_STYLE
        titleBar.appendChild(collapseBtn)

        const body = document.createElement('div')
        body.style.cssText = 'display:flex;flex-direction:column;gap:6px;'

        collapseBtn.addEventListener('click', () => {
            const collapsed = body.style.display === 'none'
            body.style.display = collapsed ? 'flex' : 'none'
            collapseBtn.textContent = collapsed ? '-' : '+'
        })

        const tabRow = document.createElement('div')
        tabRow.style.cssText =
            'display:flex;flex-wrap:wrap;gap:4px;border-bottom:1px solid rgba(0,255,0,0.3);padding-bottom:4px;'
        body.appendChild(tabRow)

        for (const entry of entries) {
            const panel = this.#buildPanel(body, entry.animator)
            panel.tabButton.addEventListener('click', () => {
                this.#showPanel(panel)
            })
            tabRow.appendChild(panel.tabButton)
            this.#panels.push(panel)
            if (entry.defaultClip !== undefined) {
                this.#play(panel, entry.defaultClip)
            }
        }
        if (this.#panels.length > 0) {
            this.#showPanel(this.#panels[0]!)
        }

        root.appendChild(titleBar)
        root.appendChild(body)
        document.body.appendChild(root)

        this.#root = root
        this.#makeDraggable(root, titleBar, collapseBtn)
        this.#syncTimer = window.setInterval(
            () => this.#sync(),
            SYNC_INTERVAL_MS
        )
        this.#sync()
    }

    destroy() {
        window.clearInterval(this.#syncTimer)
        this.#root.remove()
        if (AnimationDebugger.#current === this) {
            AnimationDebugger.#current = undefined
        }
    }

    #buildPanel(body: HTMLDivElement, animator: IAnimator): AnimatorPanel {
        const clipNames = [...animator.clips.keys()]

        const tabButton = document.createElement('button')
        tabButton.type = 'button'
        tabButton.textContent = animator.parent.name
        tabButton.style.cssText = CONTROL_STYLE

        const controls = document.createElement('div')
        controls.style.cssText = 'display:flex;flex-direction:column;gap:6px;'

        const panel: AnimatorPanel = {
            animator,
            name: animator.parent.name,
            clipNames,
            tabButton,
            controls,
            clipSelect: document.createElement('select'),
            playPauseButton: document.createElement('button'),
            loopCheckbox: document.createElement('input'),
            speedSlider: document.createElement('input'),
            speedReadout: document.createElement('span'),
        }

        // clip row: cycle back / dropdown / cycle forward
        const clipRow = document.createElement('div')
        clipRow.style.cssText = 'display:flex;align-items:center;gap:4px;'

        const makeCycleButton = (label: string, direction: 1 | -1) => {
            const button = document.createElement('button')
            button.type = 'button'
            button.textContent = label
            button.title = direction === 1 ? 'next clip' : 'previous clip'
            button.style.cssText = CONTROL_STYLE
            button.addEventListener('click', () => {
                this.#cycle(panel, direction)
            })
            return button
        }

        panel.clipSelect.style.cssText = `${CONTROL_STYLE};flex:1;min-width:0;`
        panel.clipSelect.title = 'clip'
        for (const name of clipNames) {
            const option = document.createElement('option')
            option.value = name
            option.textContent = name
            panel.clipSelect.appendChild(option)
        }
        panel.clipSelect.addEventListener('change', () => {
            this.#play(panel, panel.clipSelect.value)
        })

        clipRow.appendChild(makeCycleButton('◀', -1))
        clipRow.appendChild(panel.clipSelect)
        clipRow.appendChild(makeCycleButton('▶', 1))
        controls.appendChild(clipRow)

        // transport row: single play/pause toggle (label mirrors the state)
        const transportRow = document.createElement('div')
        transportRow.style.cssText = 'display:flex;align-items:center;gap:4px;'

        panel.playPauseButton.type = 'button'
        panel.playPauseButton.style.cssText = `${CONTROL_STYLE};flex:1;`
        panel.playPauseButton.addEventListener('click', () => {
            if (panel.animator.paused) {
                panel.animator.resume()
            } else if (panel.animator.activeStates.length === 0) {
                if (panel.lastClip) {
                    this.#play(panel, panel.lastClip)
                }
            } else {
                panel.animator.pause()
            }
            this.#updatePlayPauseButton(panel)
        })
        this.#updatePlayPauseButton(panel)

        transportRow.appendChild(panel.playPauseButton)
        controls.appendChild(transportRow)

        // loop checkbox
        const loopRow = document.createElement('label')
        loopRow.style.cssText =
            'display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;'
        panel.loopCheckbox.type = 'checkbox'
        panel.loopCheckbox.checked = true
        panel.loopCheckbox.style.cursor = 'pointer'
        panel.loopCheckbox.addEventListener('change', () => {
            for (const state of panel.animator.activeStates) {
                state.loop = panel.loopCheckbox.checked
            }
        })
        loopRow.appendChild(panel.loopCheckbox)
        loopRow.appendChild(document.createTextNode('loop'))
        controls.appendChild(loopRow)

        // speed slider + readout
        const speedRow = document.createElement('div')
        speedRow.style.cssText = 'display:flex;align-items:center;gap:6px;'
        const speedLabel = document.createElement('span')
        speedLabel.textContent = 'speed'
        panel.speedSlider.type = 'range'
        panel.speedSlider.min = String(SPEED_MIN)
        panel.speedSlider.max = String(SPEED_MAX)
        panel.speedSlider.step = String(SPEED_STEP)
        panel.speedSlider.value = '1'
        panel.speedSlider.style.cssText = 'flex:1;min-width:0;cursor:pointer;'
        panel.speedSlider.addEventListener('input', () => {
            const value = Number(panel.speedSlider.value)
            for (const state of panel.animator.activeStates) {
                state.speed = value
            }
            panel.speedReadout.textContent = formatSpeed(value)
        })
        panel.speedReadout.textContent = formatSpeed(1)
        speedRow.appendChild(speedLabel)
        speedRow.appendChild(panel.speedSlider)
        speedRow.appendChild(panel.speedReadout)
        controls.appendChild(speedRow)

        body.appendChild(controls)
        return panel
    }

    #showPanel(panel: AnimatorPanel) {
        for (const candidate of this.#panels) {
            candidate.controls.style.display =
                candidate === panel ? 'flex' : 'none'
            const active = candidate === panel
            candidate.tabButton.style.background = active
                ? 'rgba(0,255,0,0.25)'
                : 'transparent'
        }
    }

    #play(panel: AnimatorPanel, name: string) {
        const state = panel.animator.play(name, {
            fade: SWITCH_FADE_SECONDS,
        })
        if (state) {
            panel.lastClip = name
            state.loop = panel.loopCheckbox.checked
            state.speed = Number(panel.speedSlider.value)
        }
        this.#updatePlayPauseButton(panel)
        this.#sync()
    }

    /** "play" while paused or idle, "pause" while something is playing */
    #updatePlayPauseButton(panel: AnimatorPanel) {
        const showPlay =
            panel.animator.paused || panel.animator.activeStates.length === 0
        panel.playPauseButton.textContent = showPlay ? 'play' : 'pause'
        panel.playPauseButton.title = showPlay
            ? 'start / continue playback'
            : 'freeze the pose in place'
    }

    #cycle(panel: AnimatorPanel, direction: 1 | -1) {
        if (panel.clipNames.length === 0) {
            return
        }
        const current = panel.clipSelect.value
        const index = panel.clipNames.indexOf(current)
        const next =
            (index === -1 ? 0 : index + direction) % panel.clipNames.length
        const wrapped = (next + panel.clipNames.length) % panel.clipNames.length
        panel.clipSelect.value = panel.clipNames[wrapped]!
        this.#play(panel, panel.clipNames[wrapped]!)
    }

    /** reflects the live animator state into the controls */
    #sync() {
        for (const panel of this.#panels) {
            const states = panel.animator.activeStates

            let activeName: string | undefined
            let activeWeight = 0
            for (const state of states) {
                if (state.weight > activeWeight) {
                    activeWeight = state.weight
                    activeName = state.clip.name
                }
            }
            if (activeName) {
                panel.lastClip = activeName
            }

            // mirror external changes, but never fight an in-flight interaction
            const primary = states.find(
                (state) => state.clip.name === activeName
            )
            if (
                activeName &&
                document.activeElement !== panel.clipSelect &&
                panel.clipSelect.value !== activeName
            ) {
                panel.clipSelect.value = activeName
            }
            if (
                primary &&
                document.activeElement !== panel.loopCheckbox &&
                panel.loopCheckbox.checked !== primary.loop
            ) {
                panel.loopCheckbox.checked = primary.loop
            }
            if (
                primary &&
                document.activeElement !== panel.speedSlider &&
                Number(panel.speedSlider.value) !== primary.speed
            ) {
                panel.speedSlider.value = String(primary.speed)
            }
            panel.speedReadout.textContent = formatSpeed(
                Number(panel.speedSlider.value)
            )
            this.#updatePlayPauseButton(panel)
        }
    }

    #makeDraggable(
        container: HTMLDivElement,
        handle: HTMLElement,
        ignore: HTMLElement
    ) {
        handle.addEventListener('pointerdown', (down: PointerEvent) => {
            // let clicks on the collapse button through without starting a drag
            if (ignore.contains(down.target as Node)) return
            down.preventDefault()

            const rect = container.getBoundingClientRect()
            // switch from bottom/left anchoring to left/top so dragging is stable
            container.style.left = `${rect.left}px`
            container.style.top = `${rect.top}px`
            container.style.bottom = 'auto'

            const startX = down.clientX
            const startY = down.clientY
            const originLeft = rect.left
            const originTop = rect.top

            handle.setPointerCapture(down.pointerId)

            const onMove = (move: PointerEvent) => {
                const maxLeft = Math.max(
                    0,
                    window.innerWidth - container.offsetWidth
                )
                const maxTop = Math.max(
                    0,
                    window.innerHeight - container.offsetHeight
                )
                const nextLeft = Math.min(
                    Math.max(0, originLeft + (move.clientX - startX)),
                    maxLeft
                )
                const nextTop = Math.min(
                    Math.max(0, originTop + (move.clientY - startY)),
                    maxTop
                )
                container.style.left = `${nextLeft}px`
                container.style.top = `${nextTop}px`
            }

            const onUp = (up: PointerEvent) => {
                handle.releasePointerCapture(up.pointerId)
                handle.removeEventListener('pointermove', onMove)
                handle.removeEventListener('pointerup', onUp)
                handle.removeEventListener('pointercancel', onUp)
            }

            handle.addEventListener('pointermove', onMove)
            handle.addEventListener('pointerup', onUp)
            handle.addEventListener('pointercancel', onUp)
        })
    }
}
