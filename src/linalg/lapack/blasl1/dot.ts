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
  defineEmVariable, defineEmArrayVariable,
  sdot_wrap, ddot_wrap 
} from '../common'

/**
 * @hidden
 */
function dot_internal(vx:TypedArray, vy:TypedArray, ntype:'f32'|'f64')
{
  let n = vx.length;
  let pn = defineEmVariable('i32', n);
  let pincx = defineEmVariable('i32',1);
  let pincy = defineEmVariable('i32',1);

  let [px] = defineEmArrayVariable(ntype,n,vx);
  let [py] = defineEmArrayVariable(ntype,n,vy);

  if(ntype === 'f32') {
    return sdot_wrap(pn, px, pincx, py, pincy);
  } else {
    return ddot_wrap(pn, px, pincx, py, pincy);
  }
}

/**
 * @hidden
 */
export function dot(vx:TypedArray, vy:TypedArray) {
  if(vx.length !== vy.length) {
    throw new Error('Input vectors of different size');
  }
  if(vx instanceof Float64Array || vy instanceof Float64Array) {
    return dot_internal(vx,vy,'f64');
  } else {
    return dot_internal(vx,vy,'f32');
  }
}