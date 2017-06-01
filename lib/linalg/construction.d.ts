import { NumberType } from '../';
import NDArray from '../basic/ndarray';
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
/**
 * Creates NDArray of filled with zeros
 *
 * ```
 * zeros(2) // Creates 2x2 matrix of zeros
 * zeros([2,2,2]) // Create 2x2x2 matrix of zeros
 * zeros(2,'i16') // Creates 2x2 matrix of 16-bit integers filled with zeros
 * ```
 */
export declare function zeros(arg0: number | number[], datatype?: NumberType): NDArray;
