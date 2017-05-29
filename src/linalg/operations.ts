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
import {isZero} from '../utils'

/**
 * Matrix multiplication
 * 
 * At least one of the arguments has to be 2D matrix (i.e. shape mxn).
 * The other argument could be a 1D vector. It will be implicitly used
 * as 1xn matrix
 */
export function mmultiply(A:NDArray, B:NDArray) {
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
 * Perform LU decomposition
 * 
 * $$ A = P L U $$
 */
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
}