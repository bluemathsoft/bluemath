
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

import {
  eye, zeros,
  iszero, isequal,
  torad, todeg,
  add, mul, sub, div
} from './ops'
import * as linalg from './linalg'
import {EPSILON} from './constants'
import {
  NDArray,
  Matrix, Vector, Vector2, Vector3, Complex,
  PermutationVector, BandMatrix
} from './basic'

export type NumberType = 'i8'|'ui8'|'i16'|'ui16'|'i32'|'ui32'|'f32'|'f64';
export type TypedArray = Int8Array | Uint8Array | Int16Array |
    Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

export const version = '0.2.11'; // TODO: populate from package.json

export {
  // Submodules
  linalg,

  // Constants
  EPSILON,

  // Classes
  NDArray,
  Matrix, Vector, Vector2, Vector3, Complex,
  PermutationVector, BandMatrix,

  // Ops
  eye, zeros,
  iszero, isequal,
  torad, todeg,
  add, mul, sub, div
}

