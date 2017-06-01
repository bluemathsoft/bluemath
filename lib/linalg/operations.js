"use strict";
/*

Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

This file is part of bluemath.

bluemath is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

bluemath is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with bluemath. If not, see <http://www.gnu.org/licenses/>.

*/
Object.defineProperty(exports, "__esModule", { value: true });
var basic_1 = require("../basic");
var utils_1 = require("../utils");
/**
 * Matrix multiplication
 *
 * At least one of the arguments has to be 2D matrix (i.e. shape mxn).
 * The other argument could be a 1D vector. It will be implicitly used
 * as 1xn matrix
 */
function mmultiply(A, B) {
    var shapeA = A.shape;
    var shapeB = B.shape;
    if (shapeA.length > 2 || shapeB.length > 2) {
        throw new Error('Array shape is > 2D, not suitable for ' +
            'matrix multiplication');
    }
    // Treat a flat n-item array as 1xn matrix
    if (shapeA.length === 1) {
        shapeA = [1, shapeA[0]];
    }
    if (shapeB.length === 1) {
        shapeB = [1, shapeB[0]];
    }
    if (shapeA[1] !== shapeB[0]) {
        throw new Error('Matrix shapes ' + shapeA.join('x') + ' and ' +
            shapeB.join('x') + ' not compatible for multiplication');
    }
    // If one of the matrices is flat n-item array clone them into 1xn NDArray
    var mA, mB;
    if (A.shape.length === 1) {
        mA = A.clone();
        mA.reshape([1, A.shape[0]]);
    }
    else {
        mA = A;
    }
    if (B.shape.length === 1) {
        mB = B.clone();
        mB.reshape([1, B.shape[0]]);
    }
    else {
        mB = B;
    }
    var result = new basic_1.NDArray({ shape: [mA.shape[0], mB.shape[1]] });
    for (var i = 0; i < mA.shape[0]; i++) {
        for (var j = 0; j < mB.shape[1]; j++) {
            var value = 0.0;
            for (var k = 0; k < mA.shape[1]; k++) {
                value += A.get(i, k) * B.get(k, j);
            }
            result.set(i, j, value);
        }
    }
    return result;
}
exports.mmultiply = mmultiply;
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
function norm(A, p) {
    if (A.shape.length === 1) {
        if (p === undefined) {
            p = 2;
        }
        if (typeof p !== 'number') {
            throw new Error('Vector ' + p + '-norm is not defined');
        }
        if (p === Infinity) {
            var max = -Infinity;
            for (var i = 0; i < A.shape[0]; i++) {
                max = Math.max(max, Math.abs(A.get(i)));
            }
            return max;
        }
        else if (p === -Infinity) {
            var min = Infinity;
            for (var i = 0; i < A.shape[0]; i++) {
                min = Math.min(min, Math.abs(A.get(i)));
            }
            return min;
        }
        else if (p >= 1) {
            var sum = 0;
            for (var i = 0; i < A.shape[0]; i++) {
                sum += Math.pow(Math.abs(A.get(i)), p);
            }
            return Math.pow(sum, 1 / p);
        }
        else {
            throw new Error('Vector ' + p + '-norm is not defined');
        }
    }
    else if (A.shape.length === 2) {
        if (p === 'fro') {
            var sum = 0;
            for (var i = 0; i < A.shape[0]; i++) {
                for (var j = 0; j < A.shape[1]; j++) {
                    sum += A.get(i, j) * A.get(i, j);
                }
            }
            return Math.sqrt(sum);
        }
        else {
            throw new Error('TODO');
        }
    }
    else {
        throw new Error('Norm is not defined for given NDArray');
    }
}
exports.norm = norm;
/**
 * Perform LU decomposition
 *
 * $$ A = P L U $$
 */
function lu(A) {
    // Outer product LU decomposition with partial pivoting
    // Ref: Algo 3.4.1 Golub and Van Loan
    if (A.shape.length != 2) {
        throw new Error('Input is not a Matrix (2D)');
    }
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('Input is not a Square Matrix');
    }
    var n = A.shape[0];
    var perm = new basic_1.NDArray({ shape: [n] });
    for (var i = 0; i < n; i++) {
        perm.set(i, i);
    }
    function recordPermutation(ri, rj) {
        var tmp = perm.get(ri);
        perm.set(ri, perm.get(rj));
        perm.set(rj, tmp);
    }
    for (var k = 0; k < n - 1; k++) {
        // Find the maximum absolute entry in k'th column
        var ipivot = 0;
        var pivot = -Infinity;
        for (var i = k; i < n; i++) {
            var val = Math.abs(A.get(i, k));
            if (val > pivot) {
                pivot = val;
                ipivot = i;
            }
        }
        // Swap rows k and ipivot
        A.swaprows(k, ipivot);
        recordPermutation(k, ipivot);
        if (utils_1.isZero(pivot)) {
            throw new Error('Can\'t perform LU decomp. 0 on diagonal');
        }
        for (var i = k + 1; i < n; i++) {
            A.set(i, k, A.get(i, k) / pivot);
        }
        for (var i = k + 1; i < n; i++) {
            for (var j = n - 1; j > k; j--) {
                A.set(i, j, A.get(i, j) - A.get(i, k) * A.get(k, j));
            }
        }
    }
    return perm;
}
exports.lu = lu;
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
function solveByForwardSubstitution(A, x) {
    var nrows = A.shape[0];
    for (var i = 0; i < nrows; i++) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += x.get(j) * A.get(i, j);
        }
        x.set(i, (x.get(i) - sum) / A.get(i, i));
    }
}
/**
 * @hidden
 * System of equations that forms upper triangular system can be solved by
 * backward substitution.
 *   [ u00 u01 ] [x0]  = [b0]
 *   [ 0   u11 ] [x1]    [b1]
 * Caller must ensure this matrix is Upper triangular before calling this
 * routine. Otherwise, undefined behavior
 */
function solveByBackwardSubstitution(A, x) {
    var _a = A.shape, nrows = _a[0], ncols = _a[1];
    for (var i = nrows - 1; i >= 0; i--) {
        var sum = 0;
        for (var j = ncols - 1; j > i; j--) {
            sum += x.get(j) * A.get(i, j);
        }
        x.set(i, (x.get(i) - sum) / A.get(i, i));
    }
}
/**
 * @hidden
 * Apply permutation to vector
 * @param V Vector to undergo permutation (changed in place)
 * @param p Permutation vector
 */
function permuteVector(V, p) {
    if (V.shape.length !== 1 || p.shape.length !== 1) {
        throw new Error("Arguments are not vectors");
    }
    if (V.shape[0] !== p.shape[0]) {
        throw new Error("Input vectors are not same length");
    }
    var orig = V.clone();
    for (var i = 0; i < p.shape[0]; i++) {
        V.set(i, orig.get(p.get(i)));
    }
}
exports.permuteVector = permuteVector;
/**
 * @hidden
 * Apply inverse permutation to vector
 * @param V Vector to undergo inverse permutation (changed in place)
 * @param p Permutation vector
 */
function ipermuteVector(V, p) {
    if (V.shape.length !== 1 || p.shape.length !== 1) {
        throw new Error("Arguments are not vectors");
    }
    if (V.shape[0] !== p.shape[0]) {
        throw new Error("Input vectors are not same length");
    }
    var orig = V.clone();
    for (var i = 0; i < p.shape[0]; i++) {
        V.set(p.get(i), orig.get(i));
    }
}
exports.ipermuteVector = ipermuteVector;
/**
 * @param A Coefficient matrix (gets modified)
 * @param x RHS b (filled with solution x)
 * @param opt
 */
function solve(A, x, opt) {
    if (opt && opt.kind === 'lt') {
        solveByForwardSubstitution(A, x);
    }
    else if (opt && opt.kind === 'ut') {
        solveByBackwardSubstitution(A, x);
    }
    else if (opt && opt.kind === 'sym') {
        throw new Error("Not implemented");
    }
    else if (opt && opt.kind === 'posdef') {
        throw new Error("Not implemented");
    }
    else {
        // Ax = b
        // LUx = Pb
        // Ly = Pb
        var perm = lu(A);
        // Comput Pb
        permuteVector(x, perm);
        // Compute y, by forward substituion
        // The lower triangular matrix is in A, except for diagonal which is 1
        // The following code is same as solveByForwardSubstitution, with (i,i)
        // replaced by 1
        var n = A.shape[0];
        for (var i = 0; i < n; i++) {
            var sum = 0;
            for (var j = 0; j < i; j++) {
                sum += x.get(j) * A.get(i, j);
            }
            x.set(i, x.get(i) - sum);
        }
        // Compute x, by backward substituion
        for (var i = n - 1; i >= 0; i--) {
            var sum = 0;
            for (var j = n - 1; j > i; j--) {
                sum += x.get(j) * A.get(i, j);
            }
            x.set(i, (x.get(i) - sum) / A.get(i, i));
        }
    }
}
exports.solve = solve;
