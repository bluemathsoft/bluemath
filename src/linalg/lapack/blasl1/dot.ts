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
import Module from '../../../../ext/lapacklite'
let em = Module;

import {
  SIZE_INT, SIZE_SINGLE, SIZE_DOUBLE,
  sdot_wrap, ddot_wrap 
} from '../common'

/**
 * @hidden
 */
function sdot(vx:Float32Array, vy:Float32Array) {
  let n = vx.length,
    pn = em._malloc(SIZE_INT),
    psx = em._malloc(n * SIZE_SINGLE),
    pincx = em._malloc(SIZE_INT),
    psy = em._malloc(n * SIZE_SINGLE),
    pincy = em._malloc(SIZE_INT),
    sx = new Float32Array(em.HEAPF32.buffer, psx, n),
    sy = new Float32Array(em.HEAPF32.buffer, psy, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');

  sx.set(vx);
  sy.set(vy);

  return sdot_wrap(pn, psx, pincx, psy, pincy);
}

/**
 * @hidden
 */
function ddot(vx:Float64Array, vy:Float64Array) {
  let n = vx.length,
    pn = em._malloc(SIZE_INT),
    pdx = em._malloc(n * SIZE_DOUBLE),
    pincx = em._malloc(SIZE_INT),
    pdy = em._malloc(n * SIZE_DOUBLE),
    pincy = em._malloc(SIZE_INT),
    dx = new Float64Array(em.HEAPF64.buffer, pdx, n),
    dy = new Float64Array(em.HEAPF64.buffer, pdy, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');
  dx.set(vx);
  dy.set(vy);

  return ddot_wrap(pn, pdx, pincx, pdy, pincy);
}

/**
 * @hidden
 */
export function dot(vx:TypedArray, vy:TypedArray) {
  if(vx.length !== vy.length) {
    throw new Error('Input vectors of different size');
  }
  if(vx instanceof Float64Array || vy instanceof Float64Array) {
    return ddot(vx,vy);
  } else {
    return sdot(vx,vy);
  }
}