
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

import * as common from '@bluemath/common' 
import * as linalg from '@bluemath/linalg'
import * as geom from '@bluemath/geom'
import * as topo from '@bluemath/topo'

export type NumberType = 'i8'|'ui8'|'i16'|'ui16'|'i32'|'ui32'|'f32'|'f64';
export type TypedArray = Int8Array | Uint8Array | Int16Array |
    Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

export const version = '0.4.3'; // TODO: populate from package.json

export {
  // Submodules
  common,
  linalg,
  geom,
  topo
}

