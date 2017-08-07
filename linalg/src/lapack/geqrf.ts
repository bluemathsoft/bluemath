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
import * as lapacklite from '../../../ext/lapacklite'
let em = lapacklite.Module;

import {
  defineEmVariable, defineEmArrayVariable,
  sgeqrf_wrap, dgeqrf_wrap
} from './common'

/**
 * @hidden 
 */
function geqrf_internal(
  mA:TypedArray, m:number, n:number,
  mTau:TypedArray, numtype:'f32'|'f64')
{
  let fn = numtype === 'f32' ? sgeqrf_wrap : dgeqrf_wrap;

  let lda = Math.max(1,m);

  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let plda = defineEmVariable('i32',lda);
  let plwork = defineEmVariable('i32',-1);
  let pinfo = defineEmVariable('i32');

  let [pA,A] = defineEmArrayVariable(numtype,m*n,mA);
  let [ptau,tau] = defineEmArrayVariable(numtype,Math.min(m,n));
  let [pwork] = defineEmArrayVariable(numtype,1);

  // work size query
  fn(pm,pn,pA,plda,ptau,pwork,plwork,pinfo);

  let worksize = em.getValue(pwork, numtype==='f32'?'float':'double');
  pwork = defineEmArrayVariable(numtype, worksize)[0];
  em.setValue(plwork,worksize,'i32');

  fn(pm,pn,pA,plda,ptau,pwork,plwork,pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    throw new Error('Invalid argument ('+(-info)+')');
  }

  mA.set(A);
  mTau.set(tau);
}

/**
 * @hidden 
 */
export function geqrf(
  mA:TypedArray,m:number,n:number,mTau:TypedArray)
{
  if(mA instanceof Float64Array) {
    geqrf_internal(mA, m, n, mTau, 'f64');
  } else {
    geqrf_internal(mA, m, n, mTau, 'f32');
  }
}