
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

import {TypedArray} from '../../..'
import * as lapacklite from '../../../../ext/lapacklite'
let em = lapacklite.Module;

import {
  SIZE_CHAR, SIZE_INT, SIZE_SINGLE, SIZE_DOUBLE,
  sgemm_wrap, dgemm_wrap 
} from '../common'


/**
 * @hidden
 */
function sgemm(
  mA:TypedArray, mB:TypedArray, mC:TypedArray,
  m:number, n:number, k:number,
  alpha:number, beta:number)
{
  let ptransa = em._malloc(SIZE_CHAR);
  let ptransb = em._malloc(SIZE_CHAR);

  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);
  let pk = em._malloc(SIZE_INT);

  let palpha = em._malloc(SIZE_SINGLE);
  let pbeta = em._malloc(SIZE_SINGLE);

  let pA = em._malloc(m*k*SIZE_SINGLE);
  let pB = em._malloc(k*n*SIZE_SINGLE);
  let pC = em._malloc(m*n*SIZE_SINGLE);

  let plda = em._malloc(SIZE_INT);
  let pldb = em._malloc(SIZE_INT);
  let pldc = em._malloc(SIZE_INT);

  em.setValue(ptransa, 'N'.charCodeAt(0), 'i8');
  em.setValue(ptransb, 'N'.charCodeAt(0), 'i8');
  em.setValue(pm, m, 'i32');
  em.setValue(pn, n, 'i32');
  em.setValue(pk, k, 'i32');
  em.setValue(palpha, alpha, 'float');
  em.setValue(pbeta, beta, 'float');
  em.setValue(plda, m, 'i32');
  em.setValue(pldb, k, 'i32');
  em.setValue(pldc, m, 'i32');

  let a = new Float32Array(em.HEAPF32.buffer, pA, m*k);
  let b = new Float32Array(em.HEAPF32.buffer, pB, k*n);
  let c = new Float32Array(em.HEAPF32.buffer, pC, m*n);

  a.set(mA);
  b.set(mB);
  c.set(mC);

  sgemm_wrap(ptransa, ptransb, pm, pn, pk,
    palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
  mC.set(c);
}

/**
 * @hidden
 */
function dgemm(
  mA:TypedArray, mB:TypedArray, mC:TypedArray,
  m:number, n:number, k:number,
  alpha:number, beta:number)
{
  let ptransa = em._malloc(SIZE_CHAR);
  let ptransb = em._malloc(SIZE_CHAR);

  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);
  let pk = em._malloc(SIZE_INT);

  let palpha = em._malloc(SIZE_DOUBLE);
  let pbeta = em._malloc(SIZE_DOUBLE);

  let pA = em._malloc(m*k*SIZE_DOUBLE);
  let pB = em._malloc(k*n*SIZE_DOUBLE);
  let pC = em._malloc(m*n*SIZE_DOUBLE);

  let plda = em._malloc(SIZE_INT);
  let pldb = em._malloc(SIZE_INT);
  let pldc = em._malloc(SIZE_INT);

  em.setValue(ptransa, 'N'.charCodeAt(0), 'i8');
  em.setValue(ptransb, 'N'.charCodeAt(0), 'i8');
  em.setValue(pm, m, 'i32');
  em.setValue(pn, n, 'i32');
  em.setValue(pk, k, 'i32');
  em.setValue(palpha, alpha, 'double');
  em.setValue(pbeta, beta, 'double');
  em.setValue(plda, m, 'i32');
  em.setValue(pldb, k, 'i32');
  em.setValue(pldc, m, 'i32');

  let a = new Float64Array(em.HEAPF64.buffer, pA, m*k);
  let b = new Float64Array(em.HEAPF64.buffer, pB, k*n);
  let c = new Float64Array(em.HEAPF64.buffer, pC, m*n);

  a.set(mA);
  b.set(mB);
  c.set(mC);

  dgemm_wrap(ptransa, ptransb, pm, pn, pk,
    palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
  mC.set(c);
}

/**
 * @hidden
 */
export function gemm(
  mA:TypedArray, mB:TypedArray, mC:TypedArray,
  m:number, n:number, k:number,
  alpha:number, beta:number)
{
  if(mA instanceof Float64Array ||
    mB instanceof Float64Array ||
    mC instanceof Float64Array)
  {
    dgemm(mA,mB,mC,m,n,k,alpha,beta);
  } else {
    sgemm(mA,mB,mC,m,n,k,alpha,beta);
  }

}