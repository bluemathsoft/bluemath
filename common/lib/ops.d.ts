import { NDArray } from './ndarray';
import { Complex } from './complex';
import { NumberType } from '.';
/**
 * Convert angle to degrees
 */
export declare function todeg(angleInRadians: number): number;
/**
 * Convert angle to radians
 */
export declare function torad(angleInDegrees: number): number;
/**
 * Check if input equals zero within given tolerance
 */
export declare function iszero(x: number, tolerance?: number): boolean;
/**
 * Check if two input numbers are equal within given tolerance
 */
export declare function isequal(a: number, b: number, tolerance?: number): boolean;
/**
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
export declare function cuberoot(x: number): number;
/**
 * Generate array of integers within given range.
 * If both a and b are specified then return [a,b)
 * if only a is specifed then return [0,a)
 */
export declare function range(a: number, b?: number): NDArray;
/**
 * Creates m-by-n Identity matrix
 *
 * ```
 * eye(2) // Creates 2x2 Identity matrix
 * eye([2,2]) // Creates 2x2 Identity matrix
 * eye([2,3]) // Create 2x3 Identity matrix with main diagonal set to 1
 * eye(2,'i32') // Creates 2x2 Identity matrix of 32-bit integers
 * ```
 */
export declare function eye(arg0: number | number[], datatype?: NumberType): NDArray;
export declare function count(arr: NDArray, item: number, tolerance?: number): number;
/**
 * Creates NDArray filled with zeros
 *
 * ```
 * zeros(2) // Creates array of zeros of length 2
 * zeros([2,2,2]) // Create 2x2x2 matrix of zeros
 * zeros(2,'i16') // Creates array of 2 16-bit integers filled with zeros
 * ```
 */
export declare function zeros(arg0: number | number[], datatype?: NumberType): NDArray;
/**
 * Creates empty NDArray of given shape or of given length if argument is
 * a number
 */
export declare function empty(arg0: number | number[], datatype?: NumberType): NDArray;
/**
 * Add all arguments in accordance to their types
 * The arguments could be NDArray or numbers (real/complex).
 * If some of them are NDArray's, then their shapes have to match,
 * otherwise exception is thrown
 * The order of addition starts from left to right
 */
export declare function add(...args: (NDArray | number | Complex)[]): number | NDArray | Complex;
/**
 * Multiply all arguments in accordance with their data types
 * Each argument can be a number (real or complex) or NDArray.
 * If some of the arguments are NDArrays, then their shapes should
 * be compatible with the other operand of multiplication operation,
 * otherwise an exception is thrown
 * The order of multiplication starts from left to right
 */
export declare function mul(...args: (NDArray | number | Complex)[]): number | NDArray | Complex;
/**
 * Subtract second argument from first
 * The arguments could be a number (real or complex) or NDArray.
 * If some of the arguments are NDArrays, then their shapes should
 * be compatible with the other operand of subtraction operation,
 * otherwise an exception is thrown
 */
export declare function sub(a: number | Complex | NDArray, b: number | Complex | NDArray): number | NDArray | Complex;
/**
 * Divide first argument by second
 * The first argument can be a number (real or complex) or NDArray.
 * The second argument can be a number (real or complex)
 */
export declare function div(a: number | Complex | NDArray, b: number | Complex): number | NDArray | Complex;
