
 /*

 copyright (c) 2017 jayesh salvi, blue math software inc.

 this file is part of bluemath.

 bluemath is free software: you can redistribute it and/or modify
 it under the terms of the gnu affero general public license as published by
 the free software foundation, either version 3 of the license, or
 (at your option) any later version.

 bluemath is distributed in the hope that it will be useful,
 but without any warranty; without even the implied warranty of
 merchantability or fitness for a particular purpose. see the
 gnu affero general public license for more details.

 you should have received a copy of the gnu affero general public license
 along with bluemath. if not, see <http://www.gnu.org/licenses/>.

*/

import {TypedArray} from '../..'
import Module from 'emlapack'
let em = Module;

export function asum() {

}

function sdot(vx:Float32Array, vy:Float32Array) {
  var sdot = em.cwrap('f2c_sdot',
    null,
    ['number', 'number', 'number', 'number', 'number']);
  let numberSize = 4;
  var n = 4,
    pn = em._malloc(4),
    pdx = em._malloc(n * numberSize),
    pincx = em._malloc(4),
    pdy = em._malloc(n * numberSize),
    pincy = em._malloc(4),
    sx = new Float32Array(em.HEAPF32.buffer, pdx, n),
    sy = new Float32Array(em.HEAPF32.buffer, pdy, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');

  sx.set(vx);
  sy.set(vy);

  return sdot(pn, pdx, pincx, pdy, pincy);
}

function ddot(vx:Float64Array, vy:Float64Array) {
  var ddot = em.cwrap('f2c_ddot',
    null,
    ['number', 'number', 'number', 'number', 'number']);
  let numberSize = 8;
  var n = 4,
    pn = em._malloc(4),
    pdx = em._malloc(n * numberSize),
    pincx = em._malloc(4),
    pdy = em._malloc(n * numberSize),
    pincy = em._malloc(4),
    dx = new Float64Array(em.HEAPF64.buffer, pdx, n),
    dy = new Float64Array(em.HEAPF64.buffer, pdy, n);

  em.setValue(pn, n, 'i32');
  em.setValue(pincx, 1, 'i32');
  em.setValue(pincy, 1, 'i32');
  dx.set(vx);
  dy.set(vy);

  return ddot(pn, pdx, pincx, pdy, pincy);

}

export function dot(vx:TypedArray, vy:TypedArray) {
  if(vx instanceof Float64Array || vy instanceof Float64Array) {
    return ddot(vx,vy);
  } else {
    return sdot(vx,vy);
  }
}