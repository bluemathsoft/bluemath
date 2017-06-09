
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
  sgemv_wrap, dgemv_wrap 
} from '../common'


function gemv_internal(
  alpha:number,
  mA:TypedArray, m:number,n:number,
  vx:TypedArray,
  vy:TypedArray,
  beta:number,
  ntype:'f32'|'f64') : void
{
  if(vx.length !== n) {
    throw new Error('Length of x doesn\'t match num columns of A');
  }
  if(vy.length !== m) {
    throw new Error('Length of y doesn\'t match num rows of A');
  }

  let ptrans = defineEmVariable('i8','N'.charCodeAt(0));
  let pm = defineEmVariable('i32',m);
  let pn = defineEmVariable('i32',n);

  let plda = defineEmVariable('i32',m);
  let pincx = defineEmVariable('i32',1);
  let pincy = defineEmVariable('i32',1);

  let palpha = defineEmVariable(ntype,alpha);
  let pbeta = defineEmVariable(ntype,beta);

  let [pA] = defineEmArrayVariable(ntype, m*n, mA);
  let [px] = defineEmArrayVariable(ntype,n,vx);
  let [py,y] = defineEmArrayVariable(ntype,m,vy);

  if(ntype === 'f32') {
    sgemv_wrap(ptrans, pm, pn, palpha, pA, plda, px,
      pincx, pbeta, py, pincy);
  } else {
    dgemv_wrap(ptrans, pm, pn, palpha, pA, plda, px,
      pincx, pbeta, py, pincy);
  }
  vy.set(y);
}


/**
 * @hidden
 */
export function gemv(
  alpha:number,
  mA:TypedArray, m:number,n:number,
  vx:TypedArray,
  vy:TypedArray,
  beta:number) : void
{
  if(mA instanceof Float64Array ||
    vx instanceof Float64Array || vy instanceof Float64Array)
  {
    gemv_internal(alpha, mA, m, n, vx, vy, beta, 'f64');
  } else {
    gemv_internal(alpha, mA, m, n, vx, vy, beta, 'f32');
  }
}