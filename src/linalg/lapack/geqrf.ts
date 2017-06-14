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

/*
import {TypedArray} from '../..'
import * as lapacklite from '../../../ext/lapacklite'
let em = lapacklite.Module;

import {
  SIZE_CHAR, SIZE_INT, SIZE_SINGLE, SIZE_DOUBLE,
  sgeqrf_wrap, dgeqrf_wrap
} from './common'

function geqrf_internal(
  mA:TypedArray, m:number, n:number, numtype:'f32'|'f64')
{
  let NUMSIZE, NUMBUF, NUMDESC, fn, TYPARR;
  if(numtype === 'f32') {
    NUMSIZE = SIZE_SINGLE;
    NUMBUF = em.HEAPF32.buffer;
    NUMDESC = 'float';
    fn = sgeqrf_wrap;
    TYPARR = Float32Array;
  } else {
    NUMSIZE = SIZE_DOUBLE;
    NUMBUF = em.HEAPF64.buffer;
    NUMDESC = 'double';
    fn = dgeqrf_wrap;
    TYPARR = Float64Array;
  }

  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);
  let pA = em._malloc(m*n*NUMSIZE);
  let plda = em._malloc(SIZE_INT);

}

export function geqrf(mA:TypedArray,m:number,n:number) {
  if(mA instanceof Float64Array) {
    geqrf_internal(mA, m, n, 'f64');
  } else {
    geqrf_internal(mA, m, n, 'f32');
  }
}*/