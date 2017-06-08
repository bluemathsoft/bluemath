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
  SIZE_CHAR, SIZE_INT, SIZE_DOUBLE,
  dgesdd_wrap 
} from './common'



// function sgesdd(mA:TypedArray, m:number, n:number) {

// }

/**
 * @hidden
 */
function dgesdd(mA:TypedArray, m:number, n:number) {

  let pjobz = em._malloc(SIZE_CHAR);
  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);

  let pA = em._malloc(m*n*SIZE_DOUBLE);
  let plda = em._malloc(SIZE_INT);

  let pS = em._malloc(Math.min(m,n)*SIZE_DOUBLE);
  let pU = em._malloc(m*n*SIZE_DOUBLE);
  let pldu = em._malloc(SIZE_INT);

  let pVT = em._malloc(n*n*SIZE_DOUBLE);
  let pldvt = em._malloc(SIZE_INT);
  let piwork = em._malloc(8*Math.min(m,n)*SIZE_INT);
  let pwork = em._malloc(1*SIZE_DOUBLE);
  let pinfo = em._malloc(SIZE_INT);

  let plwork = em._malloc(SIZE_INT);

  em.setValue(pjobz,'A'.charCodeAt(0), 'i8');
  em.setValue(pm, m, 'i32');
  em.setValue(pn, n, 'i32');

  em.setValue(plda, m, 'i32');
  em.setValue(pldu, n, 'i32');
  em.setValue(pldvt, n, 'i32');

  em.setValue(plwork, -1, 'i32');

  let A = new Float64Array(em.HEAPF64.buffer, pA, m*n);
  let U = new Float64Array(em.HEAPF64.buffer, pU, m*n);
  let VT = new Float64Array(em.HEAPF64.buffer, pVT, n*n);
  A.set(mA);

  dgesdd_wrap(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt,
    pwork, plwork, piwork, pinfo);

  let worksize = em.getValue(pwork, 'double');
  pwork = em._malloc(worksize * SIZE_DOUBLE);
  let WORK = new Float64Array(em.HEAPF64.buffer, pwork, worksize);
  em.setValue(plwork,worksize,'i32');

  dgesdd_wrap(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt,
    pwork, plwork, piwork, pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    console.error('Invalid argument',-info);
  }
  if(info > 0) {
    console.error('DBDSDC did not converge', info);
  }
  console.log(A);
  console.log(U);
  console.log(VT);
  console.log(WORK);

  mA.set(A);
}

/**
 * @hidden
 */
export function gesdd(mA:TypedArray, m:number, n:number) {
  if(mA instanceof Float64Array) {
    return dgesdd(mA,m,n);
  } else {
    //return sgesdd(mA,m,n);
  }
}