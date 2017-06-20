import { NDArray } from '../basic';
/**
 * Matrix multiplication
 *
 * At least one of the arguments has to be 2D matrix (i.e. shape mxn).
 * The other argument could be a 1D vector. It will be implicitly used
 * as 1xn matrix
 */
export declare function matmul(A: NDArray, B: NDArray): NDArray;
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
 * @hidden
 * Perform LU decomposition
 *
 * $$ A = P L U $$
 */
/**
 * @hidden
 * Ref: Golub-Loan 3.1.1
 * System of equations that forms lower triangular system can be solved by
 * forward substitution.
 *   [ l00  0  ] [x0]  = [b0]
 *   [ l10 l11 ] [x1]    [b1]
 * Caller must ensure this matrix is Lower triangular before calling this
 * routine. Otherwise, undefined behavior
 */
/**
 * @hidden
 * System of equations that forms upper triangular system can be solved by
 * backward substitution.
 *   [ u00 u01 ] [x0]  = [b0]
 *   [ 0   u11 ] [x1]    [b1]
 * Caller must ensure this matrix is Upper triangular before calling this
 * routine. Otherwise, undefined behavior
 */
/**
 * @hidden
 * Apply permutation to vector
 * @param V Vector to undergo permutation (changed in place)
 * @param p Permutation vector
 */
/**
 * @hidden
 * Apply inverse permutation to vector
 * @param V Vector to undergo inverse permutation (changed in place)
 * @param p Permutation vector
 */
/**
 * Solves a system of linear scalar equations,
 * Ax = B
 * It computes the 'exact' solution for x. A is supposed to be well-
 * determined, i.e. full rank.
 * (Uses LAPACK routine `gesv`)
 * @param A Coefficient matrix (gets modified)
 * @param B RHS (populated with solution x upon return)
 */
export declare function solve(A: NDArray, B: NDArray): void;
/**
 * Computes inner product of two 1D vectors (same as dot product).
 * Both inputs are supposed to be 1 dimensional arrays of same length.
 * If they are not same length, A.data.length must be <= B.data.length
 * Only first A.data.length elements of array B are used in case it's
 * longer than A
 * @param A 1D Vector
 * @param B 1D Vector
 */
export declare function inner(A: NDArray, B: NDArray): number;
/**
 * Compute outer product of two vectors
 * @param A Vector of shape [m] or [m,1]
 * @param B Vector of shape [n] or [1,n]
 * @returns NDArray Matrix of dimension [m,n]
 */
export declare function outer(A: NDArray, B: NDArray): NDArray;
/**
 * @hidden
 */
export declare function cholesky(A: NDArray): void;
/**
 * Singular Value Decomposition
 * Factors the given matrix A, into U,S,VT such that
 * A = U * diag(S) * VT
 * U and VT are Unitary matrices, S is 1D array of singular values of A
 * @param A Matrix to decompose Shape (m,n)
 * @param full_matrices If true, U and VT have shapes (m,m) and (n,n) resp.
 *  Otherwise the shapes are (m,k) and (k,n), resp. where k = min(m,n)
 * @param compute_uv Whether or not to compute U,VT in addition to S
 * @return [NDArray] [U,S,VT] if compute_uv = true, [S] otherwise
 */
export declare function svd(A: NDArray, full_matrices?: boolean, compute_uv?: boolean): NDArray[];
/**
 * Rank of a matrix is defined by number of singular values of the matrix that
 * are non-zero (within given tolerance)
 * @param A Matrix to determine rank of
 * @param tol Tolerance for zero-check of singular values
 */
export declare function rank(A: NDArray, tol?: number): number;
export interface lstsq_return {
    /**
     * Least-squares solution. If `b` is two-dimensional,
     * the solutions are in the `K` columns of `x`.
     */
    x: NDArray;
    /**
     * Sums of residuals; squared Euclidean 2-norm for each column in
     * ``b - a*x``.
     * If the rank of `a` is < N or m <= n, this is an empty array.
     * If `b` is 1-dimensional, this is a (1,) shape array.
     * Otherwise the shape is (k,).
     * TODO: WIP
     */
    residuals: NDArray;
    /**
     * Rank of coefficient matrix A
     */
    rank: number;
    /**
     * Singular values of coefficient matrix A
     */
    singulars: NDArray;
}
/**
 * Return the least-squares solution to a linear matrix equation.
 *
 * Solves the equation `a x = b` by computing a vector `x` that
 * minimizes the Euclidean 2-norm `|| b - a x ||^2`.  The equation may
 * be under-, well-, or over- determined (i.e., the number of
 * linearly independent rows of `a` can be less than, equal to, or
 * greater than its number of linearly independent columns).  If `a`
 * is square and of full rank, then `x` (but for round-off error) is
 * the "exact" solution of the equation.
 *
 * @param A Coefficient matrix (m-by-n)
 * @param B Values on RHS of equation system. Could be array of length
 *          m or it could be 2D with dimensions m-by-k
 * @param rcond Cut-off ratio for small singular values of `a`
 */
export declare function lstsq(A: NDArray, B: NDArray, rcond?: number): lstsq_return;
