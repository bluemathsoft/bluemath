import { NDArray } from './ndarray';
export declare class AABB {
    private _min;
    private _max;
    constructor(minarr: number[], maxarr: number[]);
    readonly min: NDArray;
    readonly max: NDArray;
    merge(other: AABB): void;
}
