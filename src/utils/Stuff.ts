import { vec3, Vec3 } from 'wgpu-matrix'

export class Stuff {
    static clamp(x: number, min: number, max: number): number {
        return Math.min(Math.max(x, min), max)
    }

    static mod(x: number, div: number): number {
        return x - Math.floor(Math.abs(x) / div) * div * Math.sign(x)
    }

    static lerp(a: Vec3, b: Vec3, s: number): Vec3 {
        return vec3.addScaled(a, vec3.sub(b, a), s)
    }
}
