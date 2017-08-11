import { NDArray } from './ndarray';
import { TypedArray } from '../src';
export declare class AABB {
    private _min;
    private _max;
    constructor(arg0: number | number[] | TypedArray, arg1?: number[] | TypedArray);
    readonly min: NDArray;
    readonly max: NDArray;
    /**
     * Update this AABB to include given coordinate
     */
    update(coord: number[] | NDArray): void;
    merge(other: AABB): void;
}
