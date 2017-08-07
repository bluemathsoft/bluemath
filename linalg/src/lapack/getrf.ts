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
  dgetrf_wrap, sgetrf_wrap
} from './common'

/**
 * @hidden
 */
function getrf_internal(
  mA:TypedArray,m:number,n:number,mipiv:TypedArray,
  numtype:'f32'|'f64')
{
  let fn = numtype === 'f32' ? sgetrf_wrap : dgetrf_wrap;

  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let plda = defineEmVariable('i32',Math.max(1,m));

  console.assert(mipiv.length === Math.min(m,n));

  let [pA,A] = defineEmArrayVariable(numtype, m*n, mA);
  let [pipiv,ipiv] = defineEmArrayVariable('i32',Math.min(m,n),mipiv);
  let pinfo = defineEmVariable('i32');

  fn(pm,pn,pA,plda,pipiv,pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    throw new Error('Invalid argument ('+(-info)+')');
  }
  if(info > 0) {
    // Fortran has 1-based indexing
    console.error(`U(${info-1},${info-1}) is zero`);
  }

  mA.set(A);
  mipiv.set(ipiv);
}

/**
 * @hidden
 */
export function getrf(mA:TypedArray,m:number,n:number,mipiv:TypedArray)
{
  if(mA instanceof Float64Array) {
    getrf_internal(mA,m,n,mipiv,'f64');
  } else {
    getrf_internal(mA,m,n,mipiv,'f32');
  }
}