
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

import {
  defineEmArrayVariable, defineEmVariable,
  sgesv_wrap, dgesv_wrap 
} from './common'

function gesv_internal(
  mA:TypedArray,
  mB:TypedArray,
  n:number,
  nrhs:number,
  numtype:'f32'|'f64'
)
{
  let pn = defineEmVariable('i32',n);
  let pnrhs = defineEmVariable('i32', nrhs);
  let pinfo = defineEmVariable('i32');
  let plda = defineEmVariable('i32',n);
  let pldb = defineEmVariable('i32',n);

  let [pA,A] = defineEmArrayVariable(numtype, n*n, mA);
  let [pB,B] = defineEmArrayVariable(numtype, n*nrhs, mB);
  let [pIPIV,IPIV] = defineEmArrayVariable('i32', n);

  if(numtype === 'f32') {
    sgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);
  } else {
    dgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);
  }
  mA.set(A);
  mB.set(B);
  return IPIV;
}

/**
 * @hidden
 */
export function gesv(
  mA:TypedArray,
  mB:TypedArray,
  n:number,
  nrhs:number)
{
  if(mA instanceof Float64Array || mB instanceof Float64Array) {
    return gesv_internal(mA,mB,n,nrhs,'f64');
  } else {
    return gesv_internal(mA,mB,n,nrhs,'f32');
  }
}