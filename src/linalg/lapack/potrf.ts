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
  spotrf_wrap, dpotrf_wrap
} from './common'

/**
 * @hidden
 */
function potrf_internal(
  mA:TypedArray, n:number, numtype:'f32'|'f64')
{
  let puplo = defineEmVariable('i8', 'L'.charCodeAt(0));
  let pn = defineEmVariable('i32', n);
  let plda = defineEmVariable('i32',n);
  let pinfo = defineEmVariable('i32');
  let [pA,A] = defineEmArrayVariable(numtype, n*n, mA);

  let fn = numtype === 'f32' ? spotrf_wrap : dpotrf_wrap;
  fn(puplo, pn, pA, plda, pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    // Fortran has 1-based indexing
    throw new Error('Invalid argument ('+(-info)+')');
  }
  if(info > 0) {
    throw new Error('Matrix is not positive definite');
  }
  mA.set(A);
}

/**
 * @hidden
 */
export function potrf(mA:TypedArray, n:number) {
  if(mA instanceof Float64Array) {
    return potrf_internal(mA,n,'f64');
  } else {
    return potrf_internal(mA,n,'f32');
  }
}