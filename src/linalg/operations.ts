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

import {NDArray} from '../basic'
import * as lapack from './lapack'

/**
 * Matrix multiplication
 * 
 * At least one of the arguments has to be 2D matrix (i.e. shape mxn).
 * The other argument could be a 1D vector. It will be implicitly used
 * as 1xn matrix
 */
export function matmul(A:NDArray, B:NDArray) {
  let shapeA = A.shape;
  let shapeB = B.shape;

  if(shapeA.length > 2 || shapeB.length > 2) {
    throw new Error('Array shape is > 2D, not suitable for '+
      'matrix multiplication');
  }

  // Treat a flat n-item array as 1xn matrix
  if(shapeA.length === 1) {
    shapeA = [1,shapeA[0]];
  }
  if(shapeB.length === 1) {
    shapeB = [1,shapeB[0]];
  }

  if(shapeA[1] !== shapeB[0]) {
    throw new Error('Matrix shapes '+shapeA.join('x')+' and '+
      shapeB.join('x')+' not compatible for multiplication');
  }

  // If one of the matrices is flat n-item array clone them into 1xn NDArray
  let mA:NDArray, mB:NDArray;
  if(A.shape.length === 1) {
    mA = A.clone();
    mA.reshape([1,A.shape[0]]);
  } else {
    mA = A;
  }

  if(B.shape.length === 1) {
    mB = B.clone();
    mB.reshape([1,B.shape[0]]);
  } else {
    mB = B;
  }

  let result = new NDArray({shape:[mA.shape[0],mB.shape[1]]});

  for(let i=0; i<mA.shape[0]; i++) {
    for(let j=0; j<mB.shape[1]; j++) {
      let value = 0.0;
      for(let k=0; k<mA.shape[1]; k++) {
        value += A.get(i,k)*B.get(k,j);
      }
      result.set(i,j,value);
    }
  }
  return result;
}

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
export function norm(A:NDArray, p?:number|'fro') {
  if(A.shape.length === 1) { // A is vector
    if(p === undefined) {
      p = 2;
    }
    if(typeof p !== 'number') {
      throw new Error('Vector '+p+'-norm is not defined');
    }
    if(p === Infinity) {
      let max = -Infinity;
      for(let i=0; i<A.shape[0]; i++) {
        max = Math.max(max, Math.abs(A.get(i)));
      }
      return max;
    } else if(p === -Infinity) { // As defined in Matlab docs
      let min = Infinity;
      for(let i=0; i<A.shape[0]; i++) {
        min = Math.min(min, Math.abs(A.get(i)));
      }
      return min;
    } else if(p === 0) {
      let nonzerocount = 0;
      for(let i=0; i<A.shape[0]; i++) {
        if(A.get(i) !== 0) {
          nonzerocount++;
        }
      }
      return nonzerocount;
    } else if(p >= 1) {

      let sum = 0;
      for(let i=0; i<A.shape[0]; i++) {
        sum += Math.pow(Math.abs(A.get(i)), p);
      }
      return Math.pow(sum, 1/p);

    } else {
      throw new Error('Vector '+p+'-norm is not defined');
    }
  } else if(A.shape.length === 2) { // A is matrix
    if(p === 'fro') {
      let sum = 0;
      for(let i=0; i<A.shape[0]; i++) {
        for(let j=0; j<A.shape[1]; j++) {
          sum += A.get(i,j)*A.get(i,j);
        }
      }
      return Math.sqrt(sum);
    } else {
      throw new Error('TODO');
    }
  } else {
    throw new Error('Norm is not defined for given NDArray');
  }
}

/**
 * @hidden
 * Perform LU decomposition
 * 
 * $$ A = P L U $$
 */
/*
export function lu(A:NDArray) {

  // Outer product LU decomposition with partial pivoting
  // Ref: Algo 3.4.1 Golub and Van Loan

  if(A.shape.length != 2) {
    throw new Error('Input is not a Matrix (2D)');
  }
  if(A.shape[0] !== A.shape[1]) {
    throw new Error('Input is not a Square Matrix');
  }

  let n = A.shape[0];

  let perm = new NDArray({shape:[n]});
  for(let i=0; i<n; i++) { perm.set(i,i); }

  function recordPermutation(ri:number,rj:number) {
    let tmp = perm.get(ri);
    perm.set(ri, perm.get(rj));
    perm.set(rj, tmp);
  }

  for(let k=0; k<n-1; k++) {

    // Find the maximum absolute entry in k'th column
    let ipivot:number = 0;
    let pivot = -Infinity;
    for(let i=k; i<n; i++) {
      let val = Math.abs(A.get(i,k));
      if(val > pivot) {
        pivot = val;
        ipivot = i;
      }
    }

    // Swap rows k and ipivot
    A.swaprows(k, ipivot);
    recordPermutation(k, ipivot);

    if(isZero(pivot)) {
      throw new Error('Can\'t perform LU decomp. 0 on diagonal');
    }

    for(let i=k+1; i<n; i++) {
      A.set(i,k, A.get(i,k)/pivot);
    }
    for(let i=k+1; i<n; i++) {
      for(let j=n-1; j>k; j--) {
        A.set(i,j, A.get(i,j)-A.get(i,k)*A.get(k,j));
      }
    }

  }
  return perm;
}
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
export function solve(A:NDArray, B:NDArray) {
  if(A.shape[0] !== A.shape[1]) {
    throw new Error('A is not square');
  }
  if(A.shape[1] !== B.shape[0]) {
    throw new Error('x num rows not equal to A num colums');
  }

  // Rearrange the data because LAPACK is column major
  A.swapOrder();

  let nrhs;
  let xswapped = false;
  if(B.shape.length > 1) {
    nrhs = B.shape[1];
    // x.swapOrder();
    xswapped = true;
  } else {
    nrhs = 1;
  }

  lapack.gesv(A.data, B.data, A.shape[0], nrhs);
  A.swapOrder();
  if(xswapped) {
    // x.swapOrder();
  }
}

/**
 * Computes inner product of two 1D vectors (same as dot product).
 * Both inputs are supposed to be 1 dimensional arrays of same length.
 * If they are not same length, A.data.length must be <= B.data.length
 * Only first A.data.length elements of array B are used in case it's 
 * longer than A 
 * @param A 1D Vector
 * @param B 1D Vector
 */
export function inner(A:NDArray, B:NDArray) {
  if(A.data.length > B.data.length) {
    throw new Error("A.data.length should be <= B.data.length");
  }
  let dot = 0.0;
  for(let i=0; i<A.data.length; i++) {
    dot += A.data[i] * B.data[i];
  }
  return dot;
}

/**
 * Compute outer product of two vectors
 * @param A Vector of shape [m] or [m,1]
 * @param B Vector of shape [n] or [1,n]
 * @returns NDArray Matrix of dimension [m,n]
 */
export function outer(A:NDArray, B:NDArray) {

  if(A.shape.length === 1) {
    A.reshape([A.shape[0],1]);
  } else if(A.shape.length === 2) {
    if(A.shape[1] !== 1) {
      throw new Error('A is not a column vector');
    }
  } else {
    throw new Error('A has invalid dimensions');
  }

  if(B.shape.length === 1) {
    B.reshape([1,B.shape[0]]);
  } else if(B.shape.length === 2) {
    if(B.shape[0] !== 1) {
      throw new Error('B is not a row vector');
    }
  } else {
    throw new Error('B has invalid dimensions');
  }

  if(A.shape[0] !== B.shape[1]) {
    throw new Error('Sizes of A and B are not compatible');
  }

  return matmul(A,B);
}

/**
 * @hidden
 */
export function cholesky(A:NDArray) {
  // TODO : do checks on A before calling lapack
  lapack.potrf(A.data,A.shape[0]);
}

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
export function svd(A:NDArray, full_matrices=true, compute_uv=true) {
  if(A.shape.length !== 2) {
    throw new Error('A is not a matrix');
  }
  let job:'A'|'N'|'S';
  let [m,n] = A.shape;
  let minmn = Math.min(m,n);
  if(compute_uv) {
    if(full_matrices) {
      job = 'A';
    } else {
      job = 'S';
    }
  } else {
    job = 'N';
  }

  let urows=0,ucols=0,vtrows=0,vtcols=0;

  if(job === 'N') {
    urows = 0;
    ucols = 0;
    vtrows = 0;
    vtcols = 0;
  } else if(job === 'A') {
    urows = m;
    vtcols = n;
    ucols = m;
    vtrows = n;
  } else if(job === 'S') {
    urows = minmn;
    vtcols = minmn;
    ucols = m;
    vtrows = n;
  }

  let U = new NDArray({shape:[urows,ucols]});
  let VT = new NDArray({shape:[vtrows,vtcols]});
  let S = new NDArray({shape:[minmn]});

  A.swapOrder();

  lapack.gesdd(A.data,m,n,U.data,S.data,VT.data,job);

  U.swapOrder();
  VT.swapOrder();

  if(job === 'N') {
    return [S];
  } else {
    return [U,S,VT];
  }
}