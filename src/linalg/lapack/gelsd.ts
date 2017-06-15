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
  sgelsd_wrap, dgelsd_wrap 
} from './common'

function gelsd_internal(
  mA:TypedArray, m:number, n:number, nrhs:number,
  mB:TypedArray, mS:TypedArray, numtype:'f32'|'f64'
)
{
  let fn = numtype === 'f32' ? sgelsd_wrap : dgelsd_wrap;

  let rank;

  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);
  let pnrhs = defineEmVariable('i32',nrhs);
  let plda = defineEmVariable('i32',Math.max(1,m));
  let pldb = defineEmVariable('i32',Math.max(1,m,n));
  let prank = defineEmVariable('i32',rank);
  let plwork = defineEmVariable('i32',-1);

  let [pwork] = defineEmArrayVariable(numtype,1);
  let pinfo = defineEmVariable('i32');
}

export function gelsd(
  mA:TypedArray, m:number, n:number, nrhs:number,
  mB:TypedArray, mS:TypedArray
)
{
  if(mA instanceof Float64Array) {
    gelsd_internal(mA,m,n,nrhs,mB,mS,'f64');
  } else {
    gelsd_internal(mA,m,n,nrhs,mB,mS,'f32');
  }
}