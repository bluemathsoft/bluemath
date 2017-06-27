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
  defineEmVariable, defineEmArrayVariable,
  sorgqr_wrap, dorgqr_wrap
} from './common'

/**
 * @hidden
 */
function orgqr_internal(
  mA:TypedArray,m:number,n:number,k:number,mtau:TypedArray,
  numtype:'f32'|'f64')
{
  let fn = numtype === 'f32' ? sorgqr_wrap : dorgqr_wrap;

  let lda = Math.max(1,m);
  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let pk = defineEmVariable('i32',k);
  let plda = defineEmVariable('i32',lda);
  let plwork = defineEmVariable('i32',-1);
  let pinfo = defineEmVariable('i32');

  let [pA,A] = defineEmArrayVariable(numtype,lda*n,mA);
  let [ptau] = defineEmArrayVariable(numtype,k,mtau);
  let [pwork] = defineEmArrayVariable(numtype,1);

  // work size query
  fn(pm,pn,pk,pA,plda,ptau,pwork,plwork,pinfo);

  let worksize = em.getValue(pwork, numtype==='f32'?'float':'double');
  pwork = defineEmArrayVariable(numtype, worksize)[0];
  em.setValue(plwork,worksize,'i32');

  fn(pm,pn,pk,pA,plda,ptau,pwork,plwork,pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    throw new Error('Invalid argument ('+(-info)+')');
  }
  mA.set(A);
}

/**
 * @hidden
 */
export function orgqr(
  mA:TypedArray,m:number,n:number,k:number,
  mtau:TypedArray)
{
  if(mA instanceof Float64Array) {
    orgqr_internal(mA,m,n,k,mtau,'f64');
  } else {
    orgqr_internal(mA,m,n,k,mtau,'f32');
  }
}