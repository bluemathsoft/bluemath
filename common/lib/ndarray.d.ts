import { NumberType, TypedArray } from '.';
import { Complex } from './complex';
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
export declare class NDArray {
    /**
     * Array of array dimensions. First being the outermost dimension.
     */
    private _shape;
    /**
     * Size of the data (i.e. number of real/complex numbers stored
     * in this array)
     */
    private _size;
    /**
     * Data type of each number, specified by a string code
     */
    private _datatype;
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
    readonly shape: number[];
    readonly size: number;
    is1D(): boolean;
    is2D(): boolean;
    /**
     * Number of elements in outermost (i.e. 0th) dimension
     */
    readonly length: number;
    readonly data: TypedArray;
    readonly datatype: NumberType;
    /**
     * Set new shape for the data stored in the array
     * The old data remains intact. If the total size with the new shape
     * is larger than the old size, then excess elements of the data are
     * fill with zero.
     * @param shape New shape
     */
    reshape(shape: number[]): this;
    /**
     * Create deep copy of the array
     */
    clone(): NDArray;
    private _calcSize();
    private _alloc(size, data?, datatype?);
    _indexToAddress(...indices: number[]): number;
    /**
     * @hidden
     */
    private static mapAddressToIndex(addr, shape);
    /**
     * @hidden
     */
    _addressToIndex(addr: number): any[];
    /**
     * Create nested array
     */
    toArray(): any;
    /**
     * Set all members of this array to given value
     */
    fill(value: number): void;
    private isSliceIndex(index);
    /**
     * Set member at given index
     * All but the last argument should specify the index.
     * The last argument is the value to set.
     */
    set(...args: (number | Complex | string | undefined | null | NDArray)[]): void;
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
     * @hidden
     */
    private static areShapesEqual(shape1, shape2);
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
    private createSliceRecipe(slices);
    private computeSliceShapeAndSize(slice_recipe);
    /**
     * Shorthand for get(...) method to avoid casting to <number>
     */
    getN(...slices: (string | number | undefined | null)[]): number;
    /**
     * Shorthand for get(...) method to avoid casting to <NDArray>
     */
    getA(...slices: (string | number | undefined | null)[]): NDArray;
    /**
     * Shorthand for get(...) method to avoid casting to <Complex>
     */
    getC(...slices: (string | number | undefined | null)[]): Complex;
    /**
     * Returns a specific element or a new NDArray that's a subset of
     * this array as defined by the slicing recipe.
     * Each element of the slicing recipe (i.e. any argument) can be
     * * A number specifying a specific element or slice of the array
     * in given dimension.
     * * A string of the form '<start>:<stop>', specifying the range of
     * slices in the given dimension. Both '<start>' and '<stop>' are
     * optional
     *
     * Caveats
     * ---
     * * Negative indices not supported yet
     * * No support for `<start>:<stop>:<step>` format yet
     */
    get(...slices: (string | number | undefined | null)[]): NDArray | number | Complex;
    /**
     * @hidden
     */
    take(indices: number[], axis: number): NDArray;
    /**
     * @hidden
     */
    max(axis?: number | number[]): number | NDArray;
    /**
     * @hidden
     */
    min(): void;
    /**
     * @hidden
     */
    mean(): void;
    /**
     * @hidden
     */
    all(): void;
    /**
     * @hidden
     */
    any(): void;
    /**
     * @hidden
     */
    sort(): void;
    /**
     * @hidden
     */
    argsort(): void;
    copyfrom(other: NDArray): void;
    copyto(other: NDArray): void;
    toString(precision?: number): any;
    toHTML(precision?: number): any;
}
export declare class Vec2 extends NDArray {
    constructor(x: number, y: number);
}
export declare class Vec3 extends NDArray {
    constructor(x: number, y: number, z: number);
}
