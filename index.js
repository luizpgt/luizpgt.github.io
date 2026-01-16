// -- Author: tsoding
// -- Copied by luizpgt in january 8th 2026
// -- Source: https://youtu.be/qjWkNZ0SXfo

const BACKGROUND = "#FFFFFF"
const FOREGROUND = "#10FF10"

console.log(game)

game.width = 400
game.height = 400

const ctx = game.getContext("2d")
console.log(ctx)

function clear() {
    ctx.fillStyle = BACKGROUND
    ctx.fillRect(0, 0, game.width, game.height)
}

function point({ x, y }) {
    const s = 20
    ctx.fillStyle = FOREGROUND
    ctx.fillRect(x - s / 2, y - s / 2, s, s)
}

function line(p1, p2) {
    // using html | path
    ctx.lineWidth = 3
    ctx.strokeStyle = FOREGROUND
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
}

function screen(p) {
    /* transform from 0..w/h to -1..1
     * 
     * -1..1 = 
     *  p.x 
     * 
     * => 0..2
     *  px + 1
     * 
     * => 0..1
     *  (px + 1) /2
     * 
     * => 0..w
     *  (px + 1) /2*game.width
     *  (py + 1) /2*game.height
     * 
     * !note we still have to flip the y axis.
     * (1 - (p.y + 1) / 2) * game.height
     * 
     */
    return {
        x: (p.x + 1) / 2 * game.width,
        y: (1 - (p.y + 1) / 2) * game.height,
    }
}

function project({ x, y, z }) {
    return {
        x: x / z,
        y: y / z,
    }

}

const FPS = 60
let dz = 1 // z offset 
const dt = 1 / FPS // syncronize frames with the time
let angle = 0

function translate_z({ x, y, z }, dz) {
    return { x, y, z: z + dz }
}

function rotate_xz({ x, y, z }, angle) {
    const c = Math.cos(angle)
    const s = Math.sin(angle)
    return {
        x: x * c - z * s,
        y: y,
        z: x * s + z * c,
    }
}

// vertices
const vs = [
    { x: 0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: 0.25, z: 0.25 },
    { x: -0.25, y: -0.25, z: 0.25 },
    { x: 0.25, y: -0.25, z: 0.25 },

    // another plane behind:
    { x: 0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: 0.25, z: -0.25 },
    { x: -0.25, y: -0.25, z: -0.25 },
    { x: 0.25, y: -0.25, z: -0.25 },
]

// conect vertices index to get faces
const fs = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
]

function frame() {
    // increment offset (animation)
    // dz += 1 * dt // translate
    angle += Math.PI * dt
    clear()
    // print vertices: 
    /*
    for (const v of vs) {
        point(screen(project(translate_z(rotate_xz(v, angle), dz))))
    }
    */ 
    // print faces: 
    for (const f of fs) {
        // conect vertices 0-1 1-2 2-3 3-0
        for (let i = 0; i < f.length; ++i) {
            const a = vs[f[i]]
            const b = vs[f[(i + 1) % f.length]]
            line(
                screen(project(translate_z(rotate_xz(a, angle), dz))),
                screen(project(translate_z(rotate_xz(b, angle), dz)))
            )
        }
    }
    setTimeout(frame, 1000 / FPS)
}

setTimeout(frame, 1000 / FPS)