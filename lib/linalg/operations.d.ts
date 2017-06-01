import { NDArray } from '../basic';
/**
 * Matrix multiplication
 *
 * At least one of the arguments has to be 2D matrix (i.e. shape mxn).
 * The other argument could be a 1D vector. It will be implicitly used
 * as 1xn matrix
 */
export declare function mmultiply(A: NDArray, B: NDArray): NDArray;
/**
 * Computes p-norm of given Matrix or Vector
 * `A` must be a Vector (1D) or Matrix (2D)
 * Norm is defined for certain values of `p`
 *
 * If `A` is a Vector
 *
 * $$ \left\Vert A \right\Vert = \max_{0 \leq i < n}  \lvert a_i \rvert, p = \infty  $$
 *
 * $$ \left\Vert A \right\Vert = \min_{0 \leq i < n}  \lvert a_i \rvert, p = -\infty  $$
 *
 * $$ \left\Vert A \right\Vert = \( \lvert a_0 \rvert^p + \ldots + \lvert a_n \rvert^p \)^{1/p}, p>=1 $$
 *
 * If `A` is a Matrix
 *
 * p = 'fro' will return Frobenius norm
 *
 * $$ \left\Vert A \right\Vert\_F = \sqrt { \sum\_{i=0}^m \sum\_{j=0}^n \lvert a\_{ij} \rvert ^2 } $$
 *
 */
export declare function norm(A: NDArray, p?: number | 'fro'): number;
/**
 * Perform LU decomposition
 *
 * $$ A = P L U $$
 */
export declare function lu(A: NDArray): NDArray;
/**
 * @hidden
 * Apply permutation to vector
 * @param V Vector to undergo permutation (changed in place)
 * @param p Permutation vector
 */
export declare function permuteVector(V: NDArray, p: NDArray): void;
/**
 * @hidden
 * Apply inverse permutation to vector
 * @param V Vector to undergo inverse permutation (changed in place)
 * @param p Permutation vector
 */
export declare function ipermuteVector(V: NDArray, p: NDArray): void;
export interface SolveOptions {
    /**
     * Kind of matrix A (coefficient matrix in system of linear equations)
     */
    kind: 'lt' | 'ut' | 'sym' | 'posdef';
}
/**
 * @param A Coefficient matrix (gets modified)
 * @param x RHS b (filled with solution x)
 * @param opt
 */
export declare function solve(A: NDArray, x: NDArray, opt?: SolveOptions): void;
