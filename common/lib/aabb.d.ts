import { NDArray } from './ndarray';
export declare class AABB {
    private _min;
    private _max;
    constructor(arg0: number | number[], arg1?: number[]);
    readonly min: NDArray;
    readonly max: NDArray;
    merge(other: AABB): void;
}
