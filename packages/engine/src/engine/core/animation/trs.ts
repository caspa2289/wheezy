/**
 * Allocation-free TRS math for the animation mixer. All quaternions are
 * [x, y, z, w] (wgpu-matrix / glTF order), all matrices column-major mat4
 * (16 floats) — the layout of Transform.matrix.
 */

/** out = T · R(q) · S */
export const composeTRS = (
    t: Float32Array,
    q: Float32Array,
    s: Float32Array,
    out: Float32Array
) => {
    const x = q[0]!
    const y = q[1]!
    const z = q[2]!
    const w = q[3]!

    const x2 = x * x
    const y2 = y * y
    const z2 = z * z
    const xy = x * y
    const xz = x * z
    const yz = y * z
    const wx = w * x
    const wy = w * y
    const wz = w * z

    const sx = s[0]!
    const sy = s[1]!
    const sz = s[2]!

    out[0] = (1 - 2 * (y2 + z2)) * sx
    out[1] = 2 * (xy + wz) * sx
    out[2] = 2 * (xz - wy) * sx
    out[3] = 0
    out[4] = 2 * (xy - wz) * sy
    out[5] = (1 - 2 * (x2 + z2)) * sy
    out[6] = 2 * (yz + wx) * sy
    out[7] = 0
    out[8] = 2 * (xz + wy) * sz
    out[9] = 2 * (yz - wx) * sz
    out[10] = (1 - 2 * (x2 + y2)) * sz
    out[11] = 0
    out[12] = t[0]!
    out[13] = t[1]!
    out[14] = t[2]!
    out[15] = 1
}

/**
 * Splits a mat4 into translation / rotation quaternion / scale. Assumes an
 * orthogonal rotation with per-axis scaling (glTF node transforms); a
 * negative determinant flips the X scale (mirrored nodes).
 */
export const decomposeTRS = (
    m: Float32Array,
    t: Float32Array,
    q: Float32Array,
    s: Float32Array
) => {
    const m00r = m[0]!
    const m10r = m[1]!
    const m20r = m[2]!
    const m01r = m[4]!
    const m11r = m[5]!
    const m21r = m[6]!
    const m02r = m[8]!
    const m12r = m[9]!
    const m22r = m[10]!

    let sx = Math.hypot(m00r, m10r, m20r)
    const sy = Math.hypot(m01r, m11r, m21r)
    const sz = Math.hypot(m02r, m12r, m22r)

    const det =
        m00r * (m11r * m22r - m12r * m21r) -
        m01r * (m10r * m22r - m12r * m20r) +
        m02r * (m10r * m21r - m11r * m20r)
    if (det < 0) {
        sx = -sx
    }

    t[0] = m[12]!
    t[1] = m[13]!
    t[2] = m[14]!
    s[0] = sx
    s[1] = sy
    s[2] = sz

    // normalized rotation matrix elements (row, column)
    const isx = sx !== 0 ? 1 / sx : 0
    const isy = sy !== 0 ? 1 / sy : 0
    const isz = sz !== 0 ? 1 / sz : 0
    const m00 = m00r * isx
    const m10 = m10r * isx
    const m20 = m20r * isx
    const m01 = m01r * isy
    const m11 = m11r * isy
    const m21 = m21r * isy
    const m02 = m02r * isz
    const m12 = m12r * isz
    const m22 = m22r * isz

    const trace = m00 + m11 + m22
    if (trace > 0) {
        const d = Math.sqrt(trace + 1) * 2
        q[3] = 0.25 * d
        q[0] = (m21 - m12) / d
        q[1] = (m02 - m20) / d
        q[2] = (m10 - m01) / d
    } else if (m00 > m11 && m00 > m22) {
        const d = Math.sqrt(1 + m00 - m11 - m22) * 2
        q[3] = (m21 - m12) / d
        q[0] = 0.25 * d
        q[1] = (m01 + m10) / d
        q[2] = (m02 + m20) / d
    } else if (m11 > m22) {
        const d = Math.sqrt(1 + m11 - m00 - m22) * 2
        q[3] = (m02 - m20) / d
        q[0] = (m01 + m10) / d
        q[1] = 0.25 * d
        q[2] = (m12 + m21) / d
    } else {
        const d = Math.sqrt(1 + m22 - m00 - m11) * 2
        q[3] = (m10 - m01) / d
        q[0] = (m02 + m20) / d
        q[1] = (m12 + m21) / d
        q[2] = 0.25 * d
    }
}

/** out = a · b (Hamilton product) */
export const mulQuat = (
    out: Float32Array,
    a: Float32Array,
    b: Float32Array
) => {
    const ax = a[0]!
    const ay = a[1]!
    const az = a[2]!
    const aw = a[3]!
    const bx = b[0]!
    const by = b[1]!
    const bz = b[2]!
    const bw = b[3]!

    out[0] = aw * bx + ax * bw + ay * bz - az * by
    out[1] = aw * by - ax * bz + ay * bw + az * bx
    out[2] = aw * bz + ax * by - ay * bx + az * bw
    out[3] = aw * bw - ax * bx - ay * by - az * bz
}

export const conjugateQuat = (out: Float32Array, q: Float32Array) => {
    out[0] = -q[0]!
    out[1] = -q[1]!
    out[2] = -q[2]!
    out[3] = q[3]!
}

export const normalizeQuat = (q: Float32Array) => {
    const len = Math.hypot(q[0]!, q[1]!, q[2]!, q[3]!)
    if (len === 0) {
        q[0] = 0
        q[1] = 0
        q[2] = 0
        q[3] = 1
        return
    }
    const inv = 1 / len
    q[0] = q[0]! * inv
    q[1] = q[1]! * inv
    q[2] = q[2]! * inv
    q[3] = q[3]! * inv
}

/** shortest-arc spherical lerp; falls back to nlerp near the poles */
export const slerpQuat = (
    out: Float32Array,
    a: Float32Array,
    b: Float32Array,
    f: number
) => {
    let bx = b[0]!
    let by = b[1]!
    let bz = b[2]!
    let bw = b[3]!

    let cosTheta = a[0]! * bx + a[1]! * by + a[2]! * bz + a[3]! * bw
    if (cosTheta < 0) {
        bx = -bx
        by = -by
        bz = -bz
        bw = -bw
        cosTheta = -cosTheta
    }

    if (cosTheta > 0.9999) {
        out[0] = a[0]! + (bx - a[0]!) * f
        out[1] = a[1]! + (by - a[1]!) * f
        out[2] = a[2]! + (bz - a[2]!) * f
        out[3] = a[3]! + (bw - a[3]!) * f
        normalizeQuat(out)
        return
    }

    const theta = Math.acos(cosTheta)
    const sinTheta = Math.sqrt(1 - cosTheta * cosTheta)
    const wa = Math.sin((1 - f) * theta) / sinTheta
    const wb = Math.sin(f * theta) / sinTheta

    out[0] = a[0]! * wa + bx * wb
    out[1] = a[1]! * wa + by * wb
    out[2] = a[2]! * wa + bz * wb
    out[3] = a[3]! * wa + bw * wb
}

/** component-wise lerp of equal-length float arrays into out */
export const lerpFloats = (
    out: Float32Array,
    a: Float32Array,
    b: Float32Array,
    f: number,
    count: number
) => {
    for (let i = 0; i < count; i++) {
        out[i] = a[i]! + (b[i]! - a[i]!) * f
    }
}
