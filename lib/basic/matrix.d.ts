import { TypedArray, NumberType } from '..';
import Vector from './vector';
/**
 * @hidden
 */
export default class Matrix {
    private _data;
    private datatype;
    private _rows;
    private _cols;
    /**
     * If arg0 is 2D array, all its rows should be the same length.
     * Let length of first row is assumed to be the number of columns.
     * `data` is assigned to the internal _data variable by reference,
     * i.e. it's not deep copied
     */
    constructor(arg0: number[][] | {
        rows: number;
        cols: number;
        data?: TypedArray;
    }, datatype?: NumberType);
    readonly rows: number;
    readonly cols: number;
    readonly size: number;
    readonly data: TypedArray;
    static identity(size: number, datatype?: NumberType): Matrix;
    private _alloc(data?);
    swaprows(i: number, j: number): void;
    clone(): Matrix;
    /**
     * Assign value to all items in the matrix
     */
    fill(value: number): void;
    private _getAddress(row, col);
    get(row: number, col: number): number;
    row(idx: number): Vector;
    col(idx: number): Vector;
    set(row: number, col: number, value: number): void;
    scale(k: number): void;
    mul(other: Matrix | Vector): Matrix | number;
    /**
     * This matrix remains unchanged
     */
    transpose(): Matrix;
    isEqual(other: Matrix, tolerance?: number): boolean;
    toArray(): number[][];
    toString(): string;
    solveByForwardSubstitution(x: Vector): void;
    solveByBackwardSubstitution(x: Vector): void;
    /**
     * Algo 3.2.1 Golub and Loan
     */
    LUDecompose(): void;
}
