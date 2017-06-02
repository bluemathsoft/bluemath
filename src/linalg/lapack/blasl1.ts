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
import Module from 'emlapack'
let em = Module;

const SIZE_INT = 4;
const SIZE_DOUBLE = 8;
const SIZE_SINGLE = 4;

const sdot_wrap = em.cwrap('f2c_sdot',
  null,
  ['number', 'number', 'number', 'number', 'number']);
const ddot_wrap = em.cwrap('f2c_ddot',
  null,
  ['number', 'number', 'number', 'number', 'number']);

const sasum_wrap = em.cwrap('f2c_sasum',
  null,
  ['number', 'number', 'number']);
const dasum_wrap = em.cwrap('f2c_dasum',
  null,
  ['number', 'number', 'number']);

/**
 * @hidden
 */
function sasum(vx:Float32Array) {
  let n = vx.length;
  let pn = em._malloc(SIZE_INT);
  let psx = em._malloc(n * SIZE_SINGLE);
  let pinc = em._malloc(SIZE_INT);
  let sx = new Float32Array(em.HEAPF32.buffer, psx, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pinc, 1, 'i32');

  sx.set(vx);

  return sasum_wrap(pn, psx, pinc);
}

/**
 * @hidden
 */
function dasum(vx:Float64Array) {
  let n = vx.length;
  let pn = em._malloc(SIZE_INT);
  let pdx = em._malloc(n * SIZE_DOUBLE);
  let pinc = em._malloc(SIZE_INT);
  let dx = new Float64Array(em.HEAPF64.buffer, pdx, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pinc, 1, 'i32');

  dx.set(vx);

  return dasum_wrap(pn, pdx, pinc);
}

export function asum(v:TypedArray) {
  if(v instanceof Float64Array) {
    return dasum(v);
  } else {
    return sasum(v);
  }
}

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