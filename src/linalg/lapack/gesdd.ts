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
  sgesdd_wrap, dgesdd_wrap 
} from './common'

type NUMTYPE = 'f32'|'f64';



/**
 * @hidden
 */
function gesdd_internal(
  mA:TypedArray, m:number, n:number,
  mU:TypedArray, mVT:TypedArray,
  job:'A'|'N'|'S', numtype:NUMTYPE)
{
  let NUMSIZE, NUMBUF, NUMDESC, fn, TYPARR;
  if(numtype === 'f32') {
    NUMSIZE = SIZE_SINGLE;
    NUMBUF = em.HEAPF32.buffer;
    NUMDESC = 'float';
    fn = sgesdd_wrap;
    TYPARR = Float32Array;
  } else {
    NUMSIZE = SIZE_DOUBLE;
    NUMBUF = em.HEAPF64.buffer;
    NUMDESC = 'double';
    fn = dgesdd_wrap;
    TYPARR = Float64Array;
  }
  let pjobz = em._malloc(SIZE_CHAR);
  let pm = em._malloc(SIZE_INT);
  let pn = em._malloc(SIZE_INT);

  let pA = em._malloc(m*n*NUMSIZE);
  let plda = em._malloc(SIZE_INT);

  let pS = em._malloc(Math.min(m,n)*NUMSIZE);
  let pU = em._malloc(m*n*NUMSIZE);
  let pldu = em._malloc(SIZE_INT);

  let pVT = em._malloc(n*n*NUMSIZE);
  let pldvt = em._malloc(SIZE_INT);
  let piwork = em._malloc(8*Math.min(m,n)*SIZE_INT);
  let pwork = em._malloc(1*NUMSIZE);
  let pinfo = em._malloc(SIZE_INT);

  let plwork = em._malloc(SIZE_INT);

  em.setValue(pjobz,job.charCodeAt(0), 'i8');
  em.setValue(pm, m, 'i32');
  em.setValue(pn, n, 'i32');
  em.setValue(plda, m, 'i32');
  em.setValue(pldu, n, 'i32');
  em.setValue(pldvt, n, 'i32');
  em.setValue(plwork, -1, 'i32');

  let A = new TYPARR(NUMBUF, pA, m*n);
  let U = new TYPARR(NUMBUF, pU, m*n);
  let VT = new TYPARR(NUMBUF, pVT, n*n);
  A.set(mA);

  fn(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt,
    pwork, plwork, piwork, pinfo);

  let worksize = em.getValue(pwork, NUMDESC);
  pwork = em._malloc(worksize * NUMSIZE);
  new TYPARR(NUMBUF, pwork, worksize);
  em.setValue(plwork,worksize,'i32');

  fn(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt,
    pwork, plwork, piwork, pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    console.error('Invalid argument',-info);
  }
  if(info > 0) {
    console.error('DBDSDC did not converge',info);
  }

  mA.set(A);
  mU.set(U);
  mVT.set(VT);
}

/**
 * @hidden
 */
export function gesdd(
  mA:TypedArray, m:number, n:number,
  mU:TypedArray, mVT:TypedArray,
  job:'A'|'N'|'S'
)
{
  if(mA instanceof Float64Array ||
    mU instanceof Float64Array ||
    mVT instanceof Float64Array)
  {
    return gesdd_internal(mA,m,n,mU,mVT,job,'f64');
  } else {
    return gesdd_internal(mA,m,n,mU,mVT,job,'f32');
  }
}