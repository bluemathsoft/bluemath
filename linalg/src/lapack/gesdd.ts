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

import {TypedArray} from '@bluemath/common'
import * as lapacklite from '../../ext/lapacklite'
let em = lapacklite.Module;

import {
  defineEmVariable, defineEmArrayVariable,
  sgesdd_wrap, dgesdd_wrap 
} from './common'

/**
 * @hidden
 */
function gesdd_internal(
  mA:TypedArray, m:number, n:number,
  mU:TypedArray, mS:TypedArray, mVT:TypedArray,
  job:'A'|'N'|'S', numtype:'f32'|'f64')
{
  let fn = (numtype === 'f32') ? sgesdd_wrap : dgesdd_wrap;

  let pjobz = defineEmVariable('i8', job.charCodeAt(0));
  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let plda = defineEmVariable('i32',Math.max(m,1));
  let pldu = defineEmVariable('i32',Math.max(m,1));
  let pldvt = defineEmVariable('i32',n);
  let plwork = defineEmVariable('i32',-1);

  let [pA,A] = defineEmArrayVariable(numtype, m*n, mA);
  let [pS,S] = defineEmArrayVariable(numtype, Math.min(m,n)); 
  let [pU,U] = defineEmArrayVariable(numtype, m*n);
  let [pVT,VT] = defineEmArrayVariable(numtype, n*n);
  let [piwork] = defineEmArrayVariable('i32', 8*Math.min(m,n));
  let [pwork] = defineEmArrayVariable(numtype,1);
  let pinfo = defineEmVariable('i32');

  // work size query
  fn(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt,
    pwork, plwork, piwork, pinfo);

  let worksize = em.getValue(pwork, numtype==='f32'?'float':'double');
  pwork = defineEmArrayVariable(numtype, worksize)[0];
  em.setValue(plwork,worksize,'i32');

  fn(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt,
    pwork, plwork, piwork, pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    throw new Error('Invalid argument ('+(-info)+')');
  }
  if(info > 0) {
    throw new Error('DBDSDC did not converge ('+info+')');
  }

  mA.set(A);
  mS.set(S);
  if(job !== 'N') {
    mU.set(U);
    mVT.set(VT);
  }
}

/**
 * @hidden
 */
export function gesdd(
  mA:TypedArray, m:number, n:number,
  mU:TypedArray, mS:TypedArray, mVT:TypedArray,
  job:'A'|'N'|'S'
)
{
  if(mA instanceof Float64Array ||
    mU instanceof Float64Array ||
    mVT instanceof Float64Array)
  {
    return gesdd_internal(mA,m,n,mU,mS,mVT,job,'f64');
  } else {
    return gesdd_internal(mA,m,n,mU,mS,mVT,job,'f32');
  }
}