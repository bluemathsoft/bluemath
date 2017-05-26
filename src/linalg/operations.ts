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

export function norm(A:NDArray, p?:number|'fro') {
  if(A.shape.length === 1) { // A is vector
    if(p === undefined) {
      p = 2;
    }
    if(typeof p !== 'number') {
      throw new Error('Vector norm for '+p+' not defined');
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
      throw new Error('Vector norm for '+p+' not defined');
    }
  } else if(A.shape.length === 2) { // A is matrix
    throw new Error('TODO');

  } else {
    throw new Error('Norm is not defined for given NDArray');
  }
}