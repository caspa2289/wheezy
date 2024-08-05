import { Mat4, vec3, Vec3 } from 'wgpu-matrix'

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

    static extractEulerRotation(mat: Mat4): Vec3 {
        // [
        //     x1, x2, x3, x4,  // <- column 0
        //     y1, y2, y3, y4,  // <- column 1
        //     z1, z2, z3, z4,  // <- column 2
        //     w1, w2, w3, w4,  // <- column 3
        //   ]
        const rotXangle = Math.atan2(-mat[9], mat[10])
        const cosYangle = Math.sqrt(Math.pow(mat[0], 2) + Math.pow(mat[4], 2))
        const rotYangle = Math.atan2(mat[8], cosYangle)
        const sinXangle = Math.sin(rotXangle)
        const cosXangle = Math.cos(rotXangle)
        const rotZangle = Math.atan2(
            cosXangle * mat[1] + sinXangle * mat[2],
            cosXangle * mat[5] + sinXangle * mat[6]
        )

        return vec3.create(rotXangle, rotYangle, rotZangle)
    }
}
