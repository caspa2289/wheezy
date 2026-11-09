export const PROFILER_METRICS = [
    'fps',
    'frame',
    'sceneUpdate',
    'uploads',
    'traverse',
    'encode',
    'submit',
    'gpu geometry',
    'gpu shadow',
    'gpu culling',
    'gpu lighting',
    'gpu skybox',
] as const

export type ProfilerMetric = (typeof PROFILER_METRICS)[number]

interface Sample {
    t: number
    v: number
}

const AVERAGE_WINDOW_MS = 10_000
const HUD_UPDATE_INTERVAL_MS = 500
const STORAGE_KEY = 'wheezy-profiler'
const GIZMOS_STORAGE_KEY = 'wheezy-profiler-gizmos'

const isProduction = (): boolean => {
    try {
        return process.env.NODE_ENV === 'production'
    } catch {
        return false
    }
}

const resolveEnabled = (): boolean => {
    if (isProduction()) return false

    try {
        const param = new URLSearchParams(window.location.search).get(
            'profiler'
        )
        if (param === 'off' || param === 'on') {
            localStorage.setItem(STORAGE_KEY, param)
            return param === 'on'
        }
        return localStorage.getItem(STORAGE_KEY) !== 'off'
    } catch {
        return true
    }
}

// light gizmos default to on in dev (like the HUD itself)
const resolveGizmosEnabled = (): boolean => {
    if (isProduction()) return false

    try {
        return localStorage.getItem(GIZMOS_STORAGE_KEY) !== 'off'
    } catch {
        return true
    }
}

class ProfilerImpl {
    public enabled: boolean
    /** toggles the per-light debug gizmos (see LightGizmo); HUD checkbox below */
    public gizmosEnabled: boolean

    private _samples = new Map<ProfilerMetric, Sample[]>()
    private _hud?: HTMLDivElement
    private _cells = new Map<
        ProfilerMetric,
        { last: HTMLTableCellElement; avg: HTMLTableCellElement }
    >()
    private _updateTimer?: ReturnType<typeof setInterval>

    constructor() {
        this.enabled = resolveEnabled()
        this.gizmosEnabled = resolveGizmosEnabled()
        if (this.enabled) {
            ;(window as any).WheezyProfiler = this
        }
    }

    public setGizmosEnabled(enabled: boolean) {
        this.gizmosEnabled = enabled

        try {
            localStorage.setItem(GIZMOS_STORAGE_KEY, enabled ? 'on' : 'off')
        } catch {
            // storage unavailable (private mode etc.), toggle stays session-only
        }
    }

    public sample(metric: ProfilerMetric, value: number) {
        if (!this.enabled) return

        const sample = { t: performance.now(), v: value }
        const samples = this._samples.get(metric)
        if (samples) {
            samples.push(sample)
        } else {
            this._samples.set(metric, [sample])
        }
    }

    public start() {
        if (!this.enabled || this._hud) return
        this._createHud()
    }

    public setEnabled(enabled: boolean) {
        this.enabled = enabled

        try {
            localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
        } catch {
            // storage unavailable (private mode etc.), toggle stays session-only
        }

        if (enabled) {
            this.start()
        } else {
            this._destroyHud()
        }
    }

    public toggle() {
        this.setEnabled(!this.enabled)
    }

    private _prune(metric: ProfilerMetric, now: number): Sample[] {
        const samples = this._samples.get(metric)
        if (!samples) return []

        const cutoff = now - AVERAGE_WINDOW_MS
        while (samples.length && samples[0]!.t < cutoff) {
            samples.shift()
        }
        return samples
    }

    private _createHud() {
        const container = document.createElement('div')
        container.style.cssText = [
            'position:fixed',
            'top:8px',
            'right:8px',
            'z-index:9999',
            'pointer-events:auto',
            'font:12px/1.5 monospace',
            'color:#0f0',
            'background:rgba(0,0,0,0.7)',
            'border:1px solid rgba(0,255,0,0.3)',
            'border-radius:4px',
            'padding:4px 8px',
        ].join(';')

        // title bar: drag handle (everywhere except the button) + collapse toggle
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
        title.textContent = 'wheezy profiler'
        title.style.fontWeight = 'bold'
        titleBar.appendChild(title)

        const collapseBtn = document.createElement('button')
        collapseBtn.type = 'button'
        collapseBtn.textContent = '-'
        collapseBtn.title = 'collapse / expand (drag the title bar to move)'
        collapseBtn.style.cssText = [
            'cursor:pointer',
            'background:transparent',
            'border:1px solid rgba(0,255,0,0.4)',
            'color:#0f0',
            'font:inherit',
            'line-height:1',
            'padding:0 5px',
            'border-radius:3px',
        ].join(';')
        titleBar.appendChild(collapseBtn)

        const table = document.createElement('table')
        table.style.borderCollapse = 'collapse'

        const headRow = table.insertRow()
        for (const text of ['metric', 'last', 'avg 10s']) {
            const cell = headRow.insertCell()
            cell.textContent = text
            cell.style.cssText = 'text-align:right;padding:0 6px'
        }
        headRow.cells[0]!.style.textAlign = 'left'

        for (const metric of PROFILER_METRICS) {
            const row = table.insertRow()
            const label = row.insertCell()
            label.textContent = metric
            label.style.cssText = 'text-align:left;padding:0 6px'

            const last = row.insertCell()
            const avg = row.insertCell()
            for (const cell of [last, avg]) {
                cell.textContent = 'n/a'
                cell.style.cssText = 'text-align:right;padding:0 6px'
            }

            this._cells.set(metric, { last, avg })
        }

        collapseBtn.addEventListener('click', () => {
            const collapsed = table.style.display === 'none'
            table.style.display = collapsed ? '' : 'none'
            collapseBtn.textContent = collapsed ? '-' : '+'
        })

        this._makeDraggable(container, titleBar, collapseBtn)

        // light gizmos toggle (drives LightGizmo.sync via Renderer.render)
        const gizmoRow = document.createElement('label')
        gizmoRow.style.cssText =
            'display:flex;align-items:center;gap:6px;cursor:pointer;user-select:none;margin-top:2px'
        const gizmoCheckbox = document.createElement('input')
        gizmoCheckbox.type = 'checkbox'
        gizmoCheckbox.checked = this.gizmosEnabled
        gizmoCheckbox.style.cursor = 'pointer'
        gizmoCheckbox.addEventListener('change', () => {
            this.setGizmosEnabled(gizmoCheckbox.checked)
        })
        gizmoRow.appendChild(gizmoCheckbox)
        gizmoRow.appendChild(document.createTextNode('light gizmos'))

        container.appendChild(titleBar)
        container.appendChild(table)
        container.appendChild(gizmoRow)
        document.body.appendChild(container)

        this._hud = container
        this._updateTimer = setInterval(
            () => this._updateHud(),
            HUD_UPDATE_INTERVAL_MS
        )
        this._updateHud()
    }

    private _makeDraggable(
        container: HTMLDivElement,
        handle: HTMLElement,
        ignore: HTMLElement
    ) {
        handle.addEventListener('pointerdown', (down: PointerEvent) => {
            // let clicks on the collapse button through without starting a drag
            if (ignore.contains(down.target as Node)) return
            down.preventDefault()

            const rect = container.getBoundingClientRect()
            // switch from top/right anchoring to left/top so dragging is stable
            container.style.left = `${rect.left}px`
            container.style.top = `${rect.top}px`
            container.style.right = 'auto'

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

    private _destroyHud() {
        if (this._updateTimer !== undefined) {
            clearInterval(this._updateTimer)
            this._updateTimer = undefined
        }
        this._hud?.remove()
        this._hud = undefined
        this._cells.clear()
        this._samples.clear()
    }

    private _format(metric: ProfilerMetric, value: number): string {
        return metric === 'fps'
            ? `${value.toFixed(1)} fps`
            : `${value.toFixed(2)} ms`
    }

    private _updateHud() {
        const now = performance.now()

        for (const metric of PROFILER_METRICS) {
            const cells = this._cells.get(metric)
            if (!cells) continue

            const samples = this._prune(metric, now)
            if (!samples.length) {
                cells.last.textContent = 'n/a'
                cells.avg.textContent = 'n/a'
                continue
            }

            const last = samples[samples.length - 1]!.v
            const avg =
                samples.reduce((sum, sample) => sum + sample.v, 0) /
                samples.length

            cells.last.textContent = this._format(metric, last)
            cells.avg.textContent = this._format(metric, avg)
        }
    }
}

export const Profiler = new ProfilerImpl()
