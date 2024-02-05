import * as THREE from 'three';

export function lerp(
    object: any,
    prop: string,
    goal: number,
    speed: number = 0.1
): void {
    object[prop] = THREE.MathUtils.lerp(object[prop], goal, speed);
}

const color = new THREE.Color();
export function lerpC(
    value: THREE.Color,
    goal: THREE.ColorRepresentation,
    speed: number = 0.1
): void {
    value.lerp(color.set(goal), speed);
}

const vector = new THREE.Vector3();
export function lerpV3(
    value: THREE.Vector3,
    goal: [number, number, number],
    speed: number = 0.1
): void {
    value.lerp(vector.set(...goal), speed);
}

export function calculateRefractionAngle(
    incidentAngle: number,
    glassIor: number = 2.5,
    airIor: number = 1.000293
): number {
    return Math.asin((airIor * Math.sin(incidentAngle)) / glassIor) || 0;
}
