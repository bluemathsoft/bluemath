import { NumberType, TypedArray } from '..';
import Complex from './complex';
export interface NDArrayOptions {
    shape?: number[];
    datatype?: NumberType;
    fill?: number;
    idata?: number[];
}
/**
 * N-Dimensional Array
 * ===
 *
 * It can store real as well as complex numbers in n-dimensions
 * It can be used to store Vectors (1D) or Matrices (2D).
 * This class stores the data internally in flat typed arrays
 *
 * NDArray is the central class of Bluemath library.
 * It's used to input and output data to/from most of the APIs of this library.
 *
 * Construction
 * ---
 *
 * You can create an NDArray
 *
 * * With shape and/or data type
 * ```javascript
 * // 3-dimensional array with 32-bit integer storage
 * new NDArray({shape:[3,4,3],datatype:'i32'});
 * ```
 *
 * * Initializing it with array data
 * ```javascript
 * // 2x3 Matrix with 64-bit floating point (double) storage
 * new NDArray([[1,1,1],[4,4,4]],{datatype:'f64'});
 * ```
 *
 * * Using standard functions
 * ```javascript
 * zeros([2,2,2]); // Returns 2x2x2 NDArray of zeros
 * eye([4,4]); // Creates 4x4 Identity matrix
 * ```
 *
 * Basic math operations
 * ---
 *
 * Bluemath provides functions that allow basic math operations
 * on NDArrays
 *
 * [[add]]
 *
 * [[sub]]
 *
 * [[mul]]
 *
 * [[div]]
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
     * Iterate over each element, invoke a callback with each index and value
     */
    forEach(callback: (value: number | Complex, ...index: number[]) => void): void;
    /**
     * Checks if the shape of this ndarray matches the shape of other
     */
    isShapeEqual(other: NDArray): boolean;
    /**
     * Does equality test for each element of the array as well as the
     * shape of the arrays
     * @param other Other NDArray to compare with
     * @param tolerance
     */
    isEqual(other: NDArray, tolerance?: number): boolean;
    /**
     * Return 1D copy of this array
     */
    flatten(): NDArray;
    /**
     * Change between Row-major and Column-major layout
     */
    swapOrder(): void;
    /**
     * Bluemath supports extracting of NDArray slices using a syntax similar
     * to numpy. Slicing is supported by NDArray.slice function.
     *
     * The function accepts number of arguments not greater than the dimensions
     * of the NDArray.
     * Each argument could be a `number`, a `string` in format `<start>:<stop>`
     * or `undefined` or `null`.
     *
     * If the argument is a number then it represents a single slice,
     * i.e. all the elements in the lower dimension
     * are returned for this index in given dimension.
     * ```javascript
     * let A = new NDArray([
     *   [2,4,6],
     *   [1,0,9],
     *   [0,2,3]
     * ]);
     * A.slice(0); // [[2,4,6]]
     * ```
     *
     * If the argument is `undefined` or `null`, then that's interpreted as
     * all items in the given dimension.
     * ```javascript
     * A.slice(null); // [[2,4,6],[1,0,9],[0,2,3]]
     * A.slice(1,null); // [[1,0,9]]
     * ```
     *
     * A string argument of format `<start>:<stop>` is used to specify range of
     * slices in the given dimension.
     * Both `<start>` and `<stop>` are optional.
     * ```javascript
     * A.slice('1:2'); // [[1,0,9]]
     * A.slice(':1'); // [[2,4,6]]
     * A.slice(':'); // [[2,4,6],[1,0,9],[0,2,3]]
     * A.slice(':',2); // [[6],[9],[3]]
     * ```
     *
     * The argument order is interpreted as going from outermost dimension to
     * innermost.
     *
     * Caveats
     * ---
     * * Negative indices not supported yet
     * * No support for `<start>:<stop>:<step>` format yet
     */
    slice(...slices: (string | number | undefined | null)[]): NDArray;
    take(indices: number[], axis: number): NDArray;
    max(): void;
    min(): void;
    mean(): void;
    all(): void;
    any(): void;
    sort(): void;
    argsort(): void;
    toString(precision?: number): any;
    toHTML(precision?: number): any;
}
