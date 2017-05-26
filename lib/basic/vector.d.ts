import { NumberArray1D, NumberType, TypedArray } from '..';
export default class Vector {
    protected _data: TypedArray | NumberArray1D;
    datatype: NumberType;
    constructor(data: TypedArray | NumberArray1D | number, datatype?: NumberType);
    get(i: number): number;
    set(i: number, value: number): void;
    size(): number;
    clone(): Vector;
    /**
     * Add other vector to this
     */
    add(other: Vector): Vector;
    /**
     * Subtract other vector from this
     */
    sub(other: Vector): Vector;
    /**
     * Multiply by a constant
     */
    mul(k: number): Vector;
    /**
     * Square length of this vector
     */
    lenSq(): number;
    /**
     * Length of this vector
     */
    len(): number;
    /**
     * Unit vector of this vector
     */
    unit(): Vector;
    /**
     * Is this vector non-zero within given tolerance
     * (i.e. either of its members are greater than tolerance in magnitude)
     */
    isNonZero(tolerance?: number): boolean;
    /**
     * Is this vector zero within given tolerance
     * (i.e. All members are less than tolerance in magnitude)
     */
    isZero(tolerance?: number): boolean;
    /**
     * Square distance to other vector
     */
    distSq(other: Vector): number;
    /**
     * Distance to other vector
     */
    dist(other: Vector): number;
    /**
     * Dot product with other vector
     */
    dot(other: Vector): number;
    /**
     * Round to nearest integer, same rules as Math.round
     */
    round(): Vector;
    /**
     * Is equal to other vector, within given tolerance
     */
    isEqual(other: Vector, tolerance?: number): boolean;
    swap(i: number, j: number): void;
    /**
     * A[i] <- A[permutation[i]]
     */
    permute(permutation: Vector): void;
    /**
     */
    permuteInverse(permutation: Vector): void;
    /**
     * Return the min values for variable number of input point vectors
     * All points should be vectors of same size
     */
    static low(points: Array<Vector>): Vector;
    /**
     * Return the max values for variable number of input point vectors
     * All points should be vectors of same size
     */
    static high(points: Array<Vector>): Vector;
    /**
     * String representation
     */
    toString(precision?: number): string;
    toArray(): Array<number>;
}
