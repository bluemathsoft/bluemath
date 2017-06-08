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

import {TypedArray} from '../..'
import * as lapacklite from '../../../ext/lapacklite'
let em = lapacklite.Module;

import {
  SIZE_CHAR, SIZE_INT, SIZE_SINGLE, SIZE_DOUBLE,
  spotrf_wrap, dpotrf_wrap
} from './common'


/**
 * @hidden
 */
function spotrf(mA:TypedArray, n:number) {
  let puplo = em._malloc(SIZE_CHAR);
  let pn = em._malloc(SIZE_INT);
  let pA = em._malloc(n*n*SIZE_SINGLE)
  let plda = em._malloc(SIZE_INT);
  let pinfo = em._malloc(SIZE_INT);

  em.setValue(puplo, 'L'.charCodeAt(0), 'i8');
  em.setValue(pn, n, 'i32');
  em.setValue(plda, n, 'i32');

  let A = new Float32Array(em.HEAPF32.buffer, pA, n*n);
  A.set(mA);

  spotrf_wrap(puplo, pn, pA, plda, pinfo);
  mA.set(A);
}

/**
 * @hidden
 */
function dpotrf(mA:TypedArray, n:number) {
  let puplo = em._malloc(SIZE_CHAR);
  let pn = em._malloc(SIZE_INT);
  let pA = em._malloc(n*n*SIZE_DOUBLE)
  let plda = em._malloc(SIZE_INT);
  let pinfo = em._malloc(SIZE_INT);

  em.setValue(puplo, 'L'.charCodeAt(0), 'i8');
  em.setValue(pn, n, 'i32');
  em.setValue(plda, n, 'i32');

  let A = new Float64Array(em.HEAPF64.buffer, pA, n*n);
  A.set(mA);

  dpotrf_wrap(puplo, pn, pA, plda, pinfo);
  mA.set(A);
}

/**
 * @hidden
 */
export function potrf(mA:TypedArray, n:number) {
  if(mA instanceof Float64Array) {
    return dpotrf(mA,n);
  } else {
    return spotrf(mA,n);
  }
}