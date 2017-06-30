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
import {NumberType} from '../'
import NDArray from '../basic/ndarray'

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
export function eye(arg0:number|number[], datatype?:NumberType) {
  let n,m;
  if(Array.isArray(arg0)) {
    n = arg0[0];
    if(arg0.length > 1) {
      m = arg0[1];
    } else {
      m = n;
    }
  } else {
    n = m = arg0;
  }
  let A = new NDArray({shape:[n,m],datatype:datatype,fill:0});
  let ndiag = Math.min(n,m);
  for(let i=0; i<ndiag; i++) {
    A.set(i,i,1);
  }
  return A;
}

/**
 * Creates NDArray filled with zeros
 * 
 * ```
 * zeros(2) // Creates 2x2 matrix of zeros  
 * zeros([2,2,2]) // Create 2x2x2 matrix of zeros
 * zeros(2,'i16') // Creates 2x2 matrix of 16-bit integers filled with zeros
 * ```
 */
export function zeros(arg0:number|number[], datatype?:NumberType) {
  let A;
  if(Array.isArray(arg0)) {
    A = new NDArray({shape:arg0, datatype:datatype});
  } else {
    A = new NDArray({shape:[arg0,arg0], datatype:datatype})
  }
  A.fill(0);
  return A;
}