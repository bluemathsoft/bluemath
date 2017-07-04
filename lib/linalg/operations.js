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
var lapack = require("./lapack");
var constants_1 = require("../constants");
var __1 = require("..");
/**
 * Matrix multiplication
 *
 * At least one of the arguments has to be 2D matrix (i.e. shape mxn).
 * The other argument could be a 1D vector. It will be implicitly used
 * as 1xn matrix
 */
function matmul(A, B) {
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
    var result = new __1.NDArray({ shape: [mA.shape[0], mB.shape[1]] });
    for (var i = 0; i < mA.shape[0]; i++) {
        for (var j = 0; j < mB.shape[1]; j++) {
            var value = 0.0;
            for (var k = 0; k < mA.shape[1]; k++) {
                value += A.get(i, k) * B.get(k, j); // TODO:Complex
            }
            result.set(i, j, value);
        }
    }
    return result;
}
exports.matmul = matmul;
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
                max = Math.max(max, Math.abs(A.get(i))); // TODO:Complex
            }
            return max;
        }
        else if (p === -Infinity) {
            var min = Infinity;
            for (var i = 0; i < A.shape[0]; i++) {
                min = Math.min(min, Math.abs(A.get(i))); // TODO:Complex
            }
            return min;
        }
        else if (p === 0) {
            var nonzerocount = 0;
            for (var i = 0; i < A.shape[0]; i++) {
                if (A.get(i) !== 0) {
                    nonzerocount++;
                }
            }
            return nonzerocount;
        }
        else if (p >= 1) {
            var sum = 0;
            for (var i = 0; i < A.shape[0]; i++) {
                sum += Math.pow(Math.abs(A.get(i)), p); // TODO:complex
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
                    sum += A.get(i, j) * A.get(i, j); // TODO:Complex
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
 * @hidden
 * Perform LU decomposition
 *
 * $$ A = P L U $$
 */
function lu_custom(A) {
    // Outer product LU decomposition with partial pivoting
    // Ref: Algo 3.4.1 Golub and Van Loan
    if (A.shape.length != 2) {
        throw new Error('Input is not a Matrix (2D)');
    }
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('Input is not a Square Matrix');
    }
    var n = A.shape[0];
    var perm = new __1.NDArray({ shape: [n] });
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
            var val = Math.abs(A.get(i, k)); // TODO:Complex
            if (val > pivot) {
                pivot = val;
                ipivot = i;
            }
        }
        // Swap rows k and ipivot
        A.swaprows(k, ipivot);
        recordPermutation(k, ipivot);
        if (__1.iszero(pivot)) {
            throw new Error('Can\'t perform LU decomp. 0 on diagonal');
        }
        for (var i = k + 1; i < n; i++) {
            A.set(i, k, A.get(i, k) / pivot); // TODO:Complex
        }
        for (var i = k + 1; i < n; i++) {
            for (var j = n - 1; j > k; j--) {
                // TODO:Complex
                A.set(i, j, A.get(i, j) - A.get(i, k) * A.get(k, j));
            }
        }
    }
    return perm;
}
exports.lu_custom = lu_custom;
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
// function solveByForwardSubstitution(A:NDArray, x:NDArray) {
//   let nrows = A.shape[0];
//   for(let i=0; i<nrows; i++) {
//     let sum = 0;
//     for(let j=0; j<i; j++) {
//       sum += x.get(j) * A.get(i,j);
//     }
//     x.set(i, (x.get(i) - sum)/A.get(i,i));
//   }
// }
/**
 * @hidden
 * System of equations that forms upper triangular system can be solved by
 * backward substitution.
 *   [ u00 u01 ] [x0]  = [b0]
 *   [ 0   u11 ] [x1]    [b1]
 * Caller must ensure this matrix is Upper triangular before calling this
 * routine. Otherwise, undefined behavior
 */
// function solveByBackwardSubstitution(A:NDArray, x:NDArray) {
//   let [nrows,ncols] = A.shape;
//   for(let i=nrows-1; i>=0; i--) {
//     let sum = 0;
//     for(let j=ncols-1;j>i;j--) {
//       sum += x.get(j) * A.get(i,j);
//     }
//     x.set(i, (x.get(i) - sum)/A.get(i,i));
//   }
// }
/**
 * @hidden
 * Apply permutation to vector
 * @param V Vector to undergo permutation (changed in place)
 * @param p Permutation vector
 */
// export function permuteVector(V:NDArray, p:NDArray) {
//   if(V.shape.length !== 1 || p.shape.length !== 1) {
//     throw new Error("Arguments are not vectors");
//   }
//   if(V.shape[0] !== p.shape[0]) {
//     throw new Error("Input vectors are not same length");
//   }
//   let orig = V.clone();
//   for(let i=0; i<p.shape[0]; i++) {
//     V.set(i, orig.get(p.get(i)));
//   }
// }
/**
 * @hidden
 * Apply inverse permutation to vector
 * @param V Vector to undergo inverse permutation (changed in place)
 * @param p Permutation vector
 */
// export function ipermuteVector(V:NDArray, p:NDArray) {
//   if(V.shape.length !== 1 || p.shape.length !== 1) {
//     throw new Error("Arguments are not vectors");
//   }
//   if(V.shape[0] !== p.shape[0]) {
//     throw new Error("Input vectors are not same length");
//   }
//   let orig = V.clone();
//   for(let i=0; i<p.shape[0]; i++) {
//     V.set(p.get(i), orig.get(i));
//   }
// }
/**
 * Solves a system of linear scalar equations,
 * Ax = B
 * It computes the 'exact' solution for x. A is supposed to be well-
 * determined, i.e. full rank.
 * (Uses LAPACK routine `gesv`)
 * @param A Coefficient matrix (gets modified)
 * @param B RHS (populated with solution x upon return)
 */
function solve(A, B) {
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('A is not square');
    }
    if (A.shape[1] !== B.shape[0]) {
        throw new Error('x num rows not equal to A num colums');
    }
    // Rearrange the data because LAPACK is column major
    A.swapOrder();
    var nrhs;
    var xswapped = false;
    if (B.shape.length > 1) {
        nrhs = B.shape[1];
        xswapped = true;
        B.swapOrder();
    }
    else {
        nrhs = 1;
    }
    lapack.gesv(A.data, B.data, A.shape[0], nrhs);
    A.swapOrder();
    if (B.shape.length > 1) {
        B.swapOrder();
    }
}
exports.solve = solve;
/**
 * Computes inner product of two 1D vectors (same as dot product).
 * Both inputs are supposed to be 1 dimensional arrays of same length.
 * If they are not same length, A.data.length must be <= B.data.length
 * Only first A.data.length elements of array B are used in case it's
 * longer than A
 * @param A 1D Vector
 * @param B 1D Vector
 */
function inner(A, B) {
    if (A.data.length > B.data.length) {
        throw new Error("A.data.length should be <= B.data.length");
    }
    var dot = 0.0;
    for (var i = 0; i < A.data.length; i++) {
        dot += A.data[i] * B.data[i];
    }
    return dot;
}
exports.inner = inner;
/**
 * Compute outer product of two vectors
 * @param A Vector of shape [m] or [m,1]
 * @param B Vector of shape [n] or [1,n]
 * @returns NDArray Matrix of dimension [m,n]
 */
function outer(A, B) {
    if (A.shape.length === 1) {
        A.reshape([A.shape[0], 1]);
    }
    else if (A.shape.length === 2) {
        if (A.shape[1] !== 1) {
            throw new Error('A is not a column vector');
        }
    }
    else {
        throw new Error('A has invalid dimensions');
    }
    if (B.shape.length === 1) {
        B.reshape([1, B.shape[0]]);
    }
    else if (B.shape.length === 2) {
        if (B.shape[0] !== 1) {
            throw new Error('B is not a row vector');
        }
    }
    else {
        throw new Error('B has invalid dimensions');
    }
    if (A.shape[0] !== B.shape[1]) {
        throw new Error('Sizes of A and B are not compatible');
    }
    return matmul(A, B);
}
exports.outer = outer;
/**
 * Perform Cholesky decomposition on given Matrix
 */
function cholesky(A) {
    if (A.shape.length !== 2) {
        throw new Error('A is not a matrix');
    }
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('Input is not square matrix');
    }
    var copyA = A.clone();
    copyA.swapOrder();
    lapack.potrf(copyA.data, copyA.shape[0]);
    copyA.swapOrder();
    return tril(copyA);
}
exports.cholesky = cholesky;
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
function svd(A, full_matrices, compute_uv) {
    if (full_matrices === void 0) { full_matrices = true; }
    if (compute_uv === void 0) { compute_uv = true; }
    if (A.shape.length !== 2) {
        throw new Error('A is not a matrix');
    }
    var job;
    var _a = A.shape, m = _a[0], n = _a[1];
    var minmn = Math.min(m, n);
    if (compute_uv) {
        if (full_matrices) {
            job = 'A';
        }
        else {
            job = 'S';
        }
    }
    else {
        job = 'N';
    }
    var urows = 0, ucols = 0, vtrows = 0, vtcols = 0;
    if (job === 'N') {
        urows = 0;
        ucols = 0;
        vtrows = 0;
        vtcols = 0;
    }
    else if (job === 'A') {
        urows = m;
        vtcols = n;
        ucols = m;
        vtrows = n;
    }
    else if (job === 'S') {
        urows = minmn;
        vtcols = minmn;
        ucols = m;
        vtrows = n;
    }
    var U = new __1.NDArray({ shape: [urows, ucols] });
    var VT = new __1.NDArray({ shape: [vtrows, vtcols] });
    var S = new __1.NDArray({ shape: [minmn] });
    A.swapOrder();
    lapack.gesdd(A.data, m, n, U.data, S.data, VT.data, job);
    U.swapOrder();
    VT.swapOrder();
    if (job === 'N') {
        return [S];
    }
    else {
        return [U, S, VT];
    }
}
exports.svd = svd;
/**
 * Rank of a matrix is defined by number of singular values of the matrix that
 * are non-zero (within given tolerance)
 * @param A Matrix to determine rank of
 * @param tol Tolerance for zero-check of singular values
 */
function rank(A, tol) {
    var S = svd(A, false, false)[0];
    if (tol === undefined) {
        tol = constants_1.EPSILON; // TODO : use numpy's formula
    }
    var rank = 0;
    for (var _i = 0, _a = S.toArray(); _i < _a.length; _i++) {
        var n = _a[_i];
        if (n > tol) {
            rank++;
        }
    }
    return rank;
}
exports.rank = rank;
;
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
function lstsq(A, B, rcond) {
    if (rcond === void 0) { rcond = -1; }
    var copyA = A.clone();
    var copyB = B.clone();
    var is_1d = false;
    if (copyB.shape.length === 1) {
        copyB.reshape([copyB.shape[0], 1]);
        is_1d = true;
    }
    var m;
    var n;
    m = copyA.shape[0];
    n = copyA.shape[1];
    var nrhs = copyB.shape[1];
    copyA.swapOrder();
    copyB.swapOrder();
    var S = new __1.NDArray({ shape: [Math.min(m, n)] });
    var rank = lapack.gelsd(copyA.data, m, n, nrhs, rcond, copyB.data, S.data);
    copyB.swapOrder();
    // Residuals - TODO: test more
    var residuals = new __1.NDArray([]);
    if (rank === n && m > n) {
        var i = void 0;
        if (is_1d) {
            residuals = new __1.NDArray({ shape: [1] });
            var sum = 0;
            for (i = n; i < m; i++) {
                var K = copyB.shape[1];
                for (var j = 0; j < K; j++) {
                    // TODO:Complex
                    sum += copyB.get(i, j) * copyB.get(i, j);
                }
            }
            residuals.set(0, sum);
        }
        else {
            residuals = new __1.NDArray({ shape: [m - n] });
            for (i = n; i < m; i++) {
                var K = copyB.shape[1];
                var sum = 0;
                for (var j = 0; j < K; j++) {
                    // TODO:Complex
                    sum += copyB.get(i, j) * copyB.get(i, j);
                }
                residuals.set(i - n, sum);
            }
        }
    }
    return {
        x: copyB,
        residuals: residuals,
        rank: rank,
        singulars: S
    };
}
exports.lstsq = lstsq;
/**
 * Compute sign and natural logarithm of the determinant of given Matrix
 * If an array has a very small or very large determinant, then a call to
 * `det` may overflow or underflow. This routine is more robust against such
 * issues, because it computes the logarithm of the determinant rather than
 * the determinant itself.
 * @param A Square matrix to compute sign and log-determinant of
 */
function slogdet(A) {
    if (A.shape.length !== 2) {
        throw new Error('Input is not matrix');
    }
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('Input is not square matrix');
    }
    var m = A.shape[0];
    var copyA = A.clone();
    copyA.swapOrder();
    var ipiv = new __1.NDArray({ shape: [m], datatype: 'i32' });
    lapack.getrf(copyA.data, m, m, ipiv.data);
    copyA.swapOrder();
    // Multiply diagonal elements of Upper triangular matrix to get determinant
    // For large matrices this value could get really big, hence we add 
    // natural logarithms of the diagonal elements and save the sign
    // separately
    var sign_acc = 1;
    var log_acc = 0;
    // Note: The pivot vector affects the sign of the determinant
    // I do not understand why, but this is what numpy implementation does
    for (var i = 0; i < m; i++) {
        if (ipiv.get(i) !== i + 1) {
            sign_acc = -sign_acc;
        }
    }
    for (var i = 0; i < m; i++) {
        var e = copyA.get(i, i);
        // TODO:Complex
        var e_abs = Math.abs(e);
        var e_sign = e / e_abs;
        sign_acc *= e_sign;
        log_acc += Math.log(e_abs);
    }
    return [sign_acc, log_acc];
}
exports.slogdet = slogdet;
/**
 * Compute determinant of a matrix
 * @param A Square matrix to compute determinant
 */
function det(A) {
    var _a = slogdet(A), sign = _a[0], log = _a[1];
    return sign * Math.exp(log);
}
exports.det = det;
/**
 * Compute (multiplicative) inverse of given matrix
 * @param A Square matrix whose inverse is to be found
 */
function inv(A) {
    if (A.shape.length !== 2) {
        throw new Error('Input is not matrix');
    }
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('Input is not square matrix');
    }
    var copyA = A.clone();
    copyA.swapOrder();
    var n = A.shape[0];
    var I = __1.eye(n);
    lapack.gesv(copyA.data, I.data, n, n);
    I.swapOrder();
    return I;
}
exports.inv = inv;
/**
 * Create Lower triangular matrix from given matrix
 */
function tril(A, k) {
    if (k === void 0) { k = 0; }
    if (A.shape.length !== 2) {
        throw new Error('Input is not matrix');
    }
    var copyA = A.clone();
    for (var i = 0; i < copyA.shape[0]; i++) {
        for (var j = 0; j < copyA.shape[1]; j++) {
            if (i < j - k) {
                copyA.set(i, j, 0);
            }
        }
    }
    return copyA;
}
exports.tril = tril;
/**
 * Return Upper triangular matrix from given matrix
 */
function triu(A, k) {
    if (k === void 0) { k = 0; }
    if (A.shape.length !== 2) {
        throw new Error('Input is not matrix');
    }
    var copyA = A.clone();
    for (var i = 0; i < copyA.shape[0]; i++) {
        for (var j = 0; j < copyA.shape[1]; j++) {
            if (i > j - k) {
                copyA.set(i, j, 0);
            }
        }
    }
    return copyA;
}
exports.triu = triu;
/**
 * Compute QR decomposition of given Matrix
 */
function qr(A) {
    if (A.shape.length !== 2) {
        throw new Error('Input is not matrix');
    }
    var _a = A.shape, m = _a[0], n = _a[1];
    if (m === 0 || n === 0) {
        throw new Error('Empty matrix');
    }
    var copyA = A.clone();
    var minmn = Math.min(m, n);
    copyA.swapOrder();
    var tau = new __1.NDArray({ shape: [minmn] });
    lapack.geqrf(copyA.data, m, n, tau.data);
    var r = copyA.clone();
    r.swapOrder();
    r = triu(r.slice(':', ':' + minmn));
    var q = copyA.slice(':' + n);
    lapack.orgqr(q.data, m, n, minmn, tau.data);
    q.swapOrder();
    return [q, r];
}
exports.qr = qr;
/**
 * Compute Eigen values and left, right eigen vectors of given Matrix
 */
function eig(A) {
    if (A.shape.length !== 2) {
        throw new Error('Input is not matrix');
    }
    if (A.shape[0] !== A.shape[1]) {
        throw new Error('Input is not square matrix');
    }
    var n = A.shape[0];
    var copyA = A.clone();
    copyA.swapOrder();
    var _a = lapack.geev(copyA.data, n, true, true), WR = _a[0], WI = _a[1], VL = _a[2], VR = _a[3];
    var eigval = new __1.NDArray({ shape: [n] });
    var eigvecL = new __1.NDArray({ shape: [n, n] });
    var eigvecR = new __1.NDArray({ shape: [n, n] });
    for (var i = 0; i < n; i++) {
        if (__1.iszero(WI[i])) {
            eigval.set(i, WR[i]);
        }
        else {
            eigval.set(i, new __1.Complex(WR[i], WI[i]));
        }
    }
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n;) {
            if (__1.iszero(WI[j])) {
                // We want to extract eigen-vectors in i'th column of VL and VR
                eigvecL.set(i, j, VL[j * n + i]);
                eigvecR.set(i, j, VR[j * n + i]);
                j += 1;
            }
            else {
                // i-th eigen vector will be complex and
                // i+1-th eigen vector will be its conjugate
                // There are n eigen-vectors for i'th eigen-value
                eigvecL.set(i, j, new __1.Complex(VL[j * n + i], VL[(j + 1) * n + i]));
                eigvecL.set(i, j + 1, new __1.Complex(VL[j * n + i], -VL[(j + 1) * n + i]));
                eigvecR.set(i, j, new __1.Complex(VR[j * n + i], VR[(j + 1) * n + i]));
                eigvecR.set(i, j + 1, new __1.Complex(VR[j * n + i], -VR[(j + 1) * n + i]));
                j += 2;
            }
        }
    }
    return [eigval, eigvecL, eigvecR];
}
exports.eig = eig;
