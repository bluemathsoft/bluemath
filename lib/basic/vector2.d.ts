import Vector from './vector';
/**
 * 2D Vector
 */
export default class Vector2 extends Vector {
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    /**
     * Cross product with other vector
     */
    cross(other: Vector2): number;
    /**
     * Vector orthogonal to this vector
     */
    orthogonal(): Vector2;
}
