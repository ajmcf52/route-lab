import type { Rectangle, Circle } from "../types/geometry"

export function createRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
): Rectangle {
    return {
        id: crypto.randomUUID(),
        type: 'rectangle',
        x,
        y,
        width,
        height
    }
}

export function createCircle(
    cx: number,
    cy: number,
    radius: number,
): Circle {
    return {
        id: crypto.randomUUID(),
        type: 'circle',
        cx,
        cy,
        radius
    }
}