import { NumberType, TypedArray } from '..';
export interface NDArrayOptions {
    shape?: number[];
    datatype?: NumberType;
    fill?: number;
}
export default class NDArray {
    shape: number[];
    size: number;
    datatype: NumberType;
    private _data;
    constructor(arg0: TypedArray | Array<any> | NDArrayOptions, arg1?: NDArrayOptions);
    readonly data: TypedArray;
    reshape(shape: number[]): void;
    clone(): NDArray;
    private _calcSize();
    private _alloc(size, data?, datatype?);
    private _getAddress(...indices);
    dataIndexToIndex(di: number): any[];
    toArray(): any;
    fill(value: number): void;
    get(...indices: number[]): number;
    set(...args: number[]): void;
    swaprows(i: number, j: number): void;
    /**
     * @hidden
     */
    datacompare(otherdata: TypedArray, tolerance?: number): boolean;
    isEqual(other: NDArray, tolerance?: number): boolean;
    swapOrder(): void;
    toString(): string;
}
