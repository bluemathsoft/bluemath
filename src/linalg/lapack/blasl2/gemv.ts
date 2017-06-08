
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
  sgemv_wrap, dgemv_wrap 
} from '../common'

/**
 * @hidden
 */
function sgemv(
  alpha:number,
  mA:Float32Array, m:number,n:number,
  vx:Float32Array,
  vy:Float32Array,
  beta:number) : void
{
  if(vx.length !== n) {
    throw new Error('Length of x doesn\'t match num columns of A');
  }
  if(vy.length !== m) {
    throw new Error('Length of y doesn\'t match num rows of A');
  }

  let ptrans = em._malloc(SIZE_CHAR);

  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);

  let plda = em._malloc(SIZE_INT);
  let pincx = em._malloc(SIZE_INT);
  let pincy = em._malloc(SIZE_INT);

  let palpha = em._malloc(SIZE_SINGLE);
  let pbeta = em._malloc(SIZE_SINGLE);

  let pA = em._malloc(m * n * SIZE_SINGLE);
  let px = em._malloc(n * SIZE_SINGLE);
  let py = em._malloc(m * SIZE_SINGLE);

  em.setValue(ptrans, 'N'.charCodeAt(0), 'i8');

  em.setValue(pm, m, 'i32');
  em.setValue(pn, n, 'i32');

  em.setValue(plda, m, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');

  em.setValue(palpha, alpha, 'float');
  em.setValue(pbeta, beta, 'float');

  let A = new Float32Array(em.HEAPF32.buffer, pA, m*n);
  let x = new Float32Array(em.HEAPF32.buffer, px, n);
  let y = new Float32Array(em.HEAPF32.buffer, py, m);

  A.set(mA);
  x.set(vx);
  y.set(vy);

  sgemv_wrap(
    ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy);
  vy.set(y);
}

/**
 * @hidden
 */
function dgemv(
  alpha:number,
  mA:Float64Array, m:number,n:number,
  vx:Float64Array,
  vy:Float64Array,
  beta:number)
{
  if(vx.length !== n) {
    throw new Error('Length of x doesn\'t match num columns of A');
  }
  if(vy.length !== m) {
    throw new Error('Length of y doesn\'t match num rows of A');
  }

  let ptrans = em._malloc(SIZE_CHAR);

  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);

  let plda = em._malloc(SIZE_INT);
  let pincx = em._malloc(SIZE_INT);
  let pincy = em._malloc(SIZE_INT);

  let palpha = em._malloc(SIZE_DOUBLE);
  let pbeta = em._malloc(SIZE_DOUBLE);

  let pA = em._malloc(m * n * SIZE_DOUBLE);
  let px = em._malloc(n * SIZE_DOUBLE);
  let py = em._malloc(m * SIZE_DOUBLE);

  em.setValue(ptrans, 'N'.charCodeAt(0), 'i8');

  em.setValue(pm, m, 'i32');
  em.setValue(pn, n, 'i32');

  em.setValue(plda, m, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');

  em.setValue(palpha, alpha, 'double');
  em.setValue(pbeta, beta, 'double');

  let A = new Float64Array(em.HEAPF64.buffer, pA, m*n);
  let x = new Float64Array(em.HEAPF64.buffer, px, n);
  let y = new Float64Array(em.HEAPF64.buffer, py, m);

  A.set(mA);
  x.set(vx);
  y.set(vy);

  dgemv_wrap(
    ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy);
  vy.set(y);
}

/**
 * @hidden
 */
export function gemv(
  alpha:number,
  mA:TypedArray, m:number,n:number,
  vx:TypedArray,
  vy:TypedArray,
  beta:number) : void
{
  if(mA instanceof Float64Array ||
    vx instanceof Float64Array || vy instanceof Float64Array)
  {
    dgemv(alpha, mA, m, n, vx, vy, beta);
  } else {
    sgemv(alpha, mA, m, n, vx, vy, beta);
  }
}