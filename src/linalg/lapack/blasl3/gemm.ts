
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

import {TypedArray} from '../../..'

import {
  defineEmArrayVariable, defineEmVariable,
  sgemm_wrap, dgemm_wrap 
} from '../common'

function gemm_internal(
  mA:TypedArray, mB:TypedArray, mC:TypedArray,
  m:number, n:number, k:number,
  alpha:number, beta:number, numtype:'f32'|'f64')
{
  let ptransa = defineEmVariable('i8', 'N'.charCodeAt(0));
  let ptransb = defineEmVariable('i8', 'N'.charCodeAt(0));

  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let pk = defineEmVariable('i32',k);

  let palpha = defineEmVariable(numtype, alpha);
  let pbeta = defineEmVariable(numtype, beta);

  let [pA] = defineEmArrayVariable(numtype, m*k, mA);
  let [pB] = defineEmArrayVariable(numtype, k*n, mB);
  let [pC,C] = defineEmArrayVariable(numtype, m*n, mC);

  let plda = defineEmVariable('i32', m);
  let pldb = defineEmVariable('i32', k);
  let pldc = defineEmVariable('i32', m);

  if(numtype === 'f32') {
    sgemm_wrap(ptransa, ptransb, pm, pn, pk,
      palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
  } else {
    dgemm_wrap(ptransa, ptransb, pm, pn, pk,
      palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
  }
  mC.set(C);
}

/**
 * @hidden
 */
export function gemm(
  mA:TypedArray, mB:TypedArray, mC:TypedArray,
  m:number, n:number, k:number,
  alpha:number, beta:number)
{
  if(mA instanceof Float64Array ||
    mB instanceof Float64Array ||
    mC instanceof Float64Array)
  {
    gemm_internal(mA,mB,mC,m,n,k,alpha,beta,'f64');
  } else {
    gemm_internal(mA,mB,mC,m,n,k,alpha,beta,'f32');
  }
}