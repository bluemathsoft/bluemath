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
  dgelsd_wrap 
} from './common'

/**
 * @hidden 
 */
function gelsd_internal(
  mA:TypedArray, m:number, n:number, nrhs:number, rcond:number,
  mB:TypedArray, mS:TypedArray
)
{
  let fn = dgelsd_wrap;

  let lda = Math.max(1,m);
  let ldb = Math.max(1,m,n);
  let nlvl = Math.max(0,Math.round(Math.log(Math.min(m,n)/2.))+1);
  let iworksize = 3*Math.min(m,n)*nlvl + 11*Math.min(m,n);

  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let pnrhs = defineEmVariable('i32',nrhs);
  let plda = defineEmVariable('i32',lda);
  let pldb = defineEmVariable('i32',ldb);
  let prank = defineEmVariable('i32');
  let plwork = defineEmVariable('i32',-1);
  let prcond = defineEmVariable('f64',rcond);

  console.assert(mB.length === ldb*nrhs);

  let [pA,A] = defineEmArrayVariable('f64', m*n, mA);
  let [pB,B] = defineEmArrayVariable('f64', ldb*nrhs, mB);
  let [pS,S] = defineEmArrayVariable('f64', Math.min(m,n));
  let [piwork] = defineEmArrayVariable('i32',iworksize);

  let [pwork] = defineEmArrayVariable('f64',1);
  let pinfo = defineEmVariable('i32');

  // work size query
  fn(pm,pn,pnrhs,pA,plda,
    pB,pldb,pS,prcond,prank,pwork,plwork,piwork,pinfo);

  let worksize = em.getValue(pwork, 'double');
  pwork = defineEmArrayVariable('f64', worksize)[0];
  em.setValue(plwork,worksize,'i32');

  fn(pm,pn,pnrhs,pA,plda,
    pB,pldb,pS,prcond,prank,pwork,plwork,piwork,pinfo);

  let info = em.getValue(pinfo,'i32');
  if(info < 0) {
    throw new Error('Invalid argument ('+(-info)+')');
  }
  if(info > 0) {
    throw new Error('SVD algorithm failed to converge ('+info+')');
  }

  let rank = em.getValue(prank,'i32');

  mA.set(A);
  mB.set(B);
  mS.set(S);
  return rank;
}

/**
 * @hidden
 */
export function gelsd(
  mA:TypedArray, m:number, n:number, nrhs:number, rcond:number,
  mB:TypedArray, mS:TypedArray
)
{
  return gelsd_internal(mA,m,n,nrhs,rcond,mB,mS);
}