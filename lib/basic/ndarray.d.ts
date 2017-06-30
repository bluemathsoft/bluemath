import { NumberType, TypedArray } from '..';
import Complex from './complex';
export interface NDArrayOptions {
    shape?: number[];
    datatype?: NumberType;
    fill?: number;
}
/**
 * N-Dimensional array class
 * It can store real as well as complex numbers in n-dimensions
 * It can be used to store Vectors (1D) or Matrices (2D).
 * This class stores the data internally in flat typed arrays
 */
export default class NDArray {
    /**
     * Array of array dimensions. First being the outermost dimension.
     */
    shape: number[];
    /**
     * Size of the data (i.e. number of real/complex numbers stored
     * in this array)
     */
    size: number;
    /**
     * Data type of each number, specified by a string code
     */
    datatype: NumberType;
    /**
     * Real part of number elements is stored in this array
     */
    private _data;
    /**
     * If any number element of this array is Complex then its
     * imaginary part is stored in _idata sparse array object
     * indexed against its address.
     * Note that _idata is not a TypedArray as _data. This way
     * the storage is optimized for the use cases where real number
     * data is common, but in some fringe cases the number could be
     * complex.
     */
    private _idata;
    constructor(arg0: TypedArray | Array<any> | NDArrayOptions, arg1?: NDArrayOptions);
    readonly data: TypedArray;
    /**
     * Set new shape for the data stored in the array
     * The old data remains intact. If the total size with the new shape
     * is larger than the old size, then excess elements of the data are
     * fill with zero.
     * @param shape New shape
     */
    reshape(shape: number[]): void;
    /**
     * Create deep copy of the array
     */
    clone(): NDArray;
    private _calcSize();
    private _alloc(size, data?, datatype?);
    private _indexToAddress(...indices);
    /**
     * @hidden
     */
    _addressToIndex(di: number): any[];
    /**
     * Create nested array
     */
    toArray(): any;
    /**
     * Set all members of this array to given value
     */
    fill(value: number): void;
    /**
     * Access member at given index
     */
    get(...index: number[]): number | Complex;
    /**
     * Set member at given index
     * All but the last argument should specify the index.
     * The last argument is the value to set.
     */
    set(...args: (number | Complex)[]): void;
    /**
     * Swaps matrix rows (this must be a 2D array)
     */
    swaprows(i: number, j: number): void;
    /**
     * @hidden
     */
    datacompare(otherdata: TypedArray, otheridata: number[], tolerance?: number): boolean;
    /**
     * Does equality test for each element of the array as well as the
     * shape of the arrays
     * @param other Other NDArray to compare with
     * @param tolerance
     */
    isEqual(other: NDArray, tolerance?: number): boolean;
    /**
     * Change between Row-major and Column-major layout
     */
    swapOrder(): void;
    /**
     * TBD
     * @param slices
     */
    slice(...slices: (string | number | undefined | null)[]): NDArray;
    toString(precision?: number): string;
}
