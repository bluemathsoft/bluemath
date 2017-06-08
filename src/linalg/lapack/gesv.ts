
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
  SIZE_INT, SIZE_SINGLE, SIZE_DOUBLE,
  sgesv_wrap, dgesv_wrap 
} from './common'

/**
 * @hidden
 */
function sgesv(
  mA:TypedArray,
  mB:TypedArray,
  n:number,
  nrhs:number)
{
  let pn = em._malloc(SIZE_INT);
  let pnrhs = em._malloc(SIZE_INT);
  let pinfo = em._malloc(SIZE_INT);
  let plda = em._malloc(SIZE_INT);
  let pldb = em._malloc(SIZE_INT);

  let pA = em._malloc(n*n*SIZE_SINGLE);
  let pB = em._malloc(n*nrhs*SIZE_SINGLE);
  let pIPIV = em._malloc(n*SIZE_INT);

  em.setValue(pn, n, 'i32');
  em.setValue(pnrhs, nrhs, 'i32');
  em.setValue(plda, n, 'i32');
  em.setValue(pldb, n, 'i32');

  let A = new Float32Array(em.HEAPF32.buffer, pA, n*n);
  let B = new Float32Array(em.HEAPF32.buffer, pB, n*nrhs);
  let IPIV = new Int32Array(em.HEAP32.buffer, pIPIV, n);

  A.set(mA);
  B.set(mB);

  sgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);

  mA.set(A);
  mB.set(B);

  return IPIV;
}

/**
 * @hidden
 */
function dgesv(
  mA:TypedArray,
  mB:TypedArray,
  n:number,
  nrhs:number)
{
  let pn = em._malloc(SIZE_INT);
  let pnrhs = em._malloc(SIZE_INT);
  let pinfo = em._malloc(SIZE_INT);
  let plda = em._malloc(SIZE_INT);
  let pldb = em._malloc(SIZE_INT);

  let pA = em._malloc(n*n*SIZE_DOUBLE);
  let pB = em._malloc(n*nrhs*SIZE_DOUBLE);
  let pIPIV = em._malloc(n*SIZE_INT);

  em.setValue(pn, n, 'i32');
  em.setValue(pnrhs, nrhs, 'i32');
  em.setValue(plda, n, 'i32');
  em.setValue(pldb, n, 'i32');

  let A = new Float64Array(em.HEAPF64.buffer, pA, n*n);
  let B = new Float64Array(em.HEAPF64.buffer, pB, n*nrhs);
  let IPIV = new Int32Array(em.HEAP32.buffer, pIPIV, n);

  A.set(mA);
  B.set(mB);

  dgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);

  mA.set(A);
  mB.set(B);

  return IPIV;
}

/**
 * @hidden
 */
export function gesv(
  mA:TypedArray,
  mB:TypedArray,
  n:number,
  nrhs:number)
{
  if(mA instanceof Float64Array || mB instanceof Float64Array) {
    return dgesv(mA,mB,n,nrhs);
  } else {
    return sgesv(mA,mB,n,nrhs);
  }
}