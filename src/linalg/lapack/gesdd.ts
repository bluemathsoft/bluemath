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
import Module from '../../../ext/lapacklite'
let em = Module;

const SIZE_CHAR = 1;
const SIZE_INT = 4;
const SIZE_DOUBLE = 8;
const SIZE_SINGLE = 4;

const dgesdd_wrap = em.cwrap('dgesdd_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);
const sgesdd_wrap = em.cwrap('sgesdd_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

function sgesdd(mA:TypedArray, m:number, n:number) {

}

function dgesdd(mA:TypedArray, m:number, n:number) {

  let pjobz = em._malloc(SIZE_CHAR);
  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);

  let pA = em._malloc(m*n*SIZE_DOUBLE);
  let plda = em._malloc(SIZE_INT);

  let pS = em._malloc(Math.min(m,n)*SIZE_DOUBLE);
  let pldu = em._malloc(SIZE_INT);

  let pldvt = em._malloc(SIZE_INT);
  let piwork = em._malloc(8*Math.min(m,n)*SIZE_DOUBLE);
  let pinfo = em._malloc(SIZE_INT);

}

export function gesdd(mA:TypedArray, m:number, n:number) {
  if(mA instanceof Float64Array) {
    return dgesdd(mA,m,n);
  } else {
    return sgesdd(mA,m,n);
  }
}