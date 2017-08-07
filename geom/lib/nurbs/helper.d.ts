import { NDArray, TypedArray } from '@bluemath/common';
/**
 * @hidden
 * Compute all n'th degree bernstein polynomials at given parameter value
 */
declare function bernstein(n: number, u: number): Array<number>;
/**
 * @hidden
 * Find the index of the knot span in which `u` lies
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} u Parameter
 * @returns {number}
 */
declare function findSpan(p: number, U: Array<number> | TypedArray, u: number): number;
/**
 * @hidden
 * Evaluate basis function values
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} i Knot span index
 * @param {number} u Parameter
 * @returns {Array} Basis function values at i,u
 */
declare function getBasisFunction(p: number, U: Array<number> | TypedArray, i: number, u: number): Array<number>;
/**
 * @hidden
 * Compute non-zero basis functions and their derivatives, upto and including
 * n'th derivative (n <= p). Output is 2-dimensional array `ders`
 * @param {number} p Degree
 * @param {number} u Parameter
 * @param {number} i Knot span
 * @param {NDArray} knots Knot vector
 * @param {number} n nth derivative
 * @returns {NDArray} ders ders[k][j] is k'th derivative of
 *            basic function N(i-p+j,p), where 0<=k<=n and 0<=j<=p
 */
declare function getBasisFunctionDerivatives(p: number, u: number, ki: number, knots: NDArray, n: number): NDArray;
export { bernstein, findSpan, getBasisFunction, getBasisFunctionDerivatives };
