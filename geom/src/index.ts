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

import * as nurbs from './nurbs'
import {NDArray,arr,cross} from '@bluemath/common'

class Axis {
  origin : NDArray;
  z : NDArray;
}

class CoordSystem {
  origin : NDArray;
  z : NDArray;
  x : NDArray;
  y : NDArray;

  constructor(origin:NDArray|number[],
    x:NDArray|number[], z:NDArray|number[])
  {
    this.origin = origin instanceof NDArray ? origin : arr(origin);
    this.x = x instanceof NDArray ? x : arr(x);
    this.z = z instanceof NDArray ? z : arr(z);
    this.y = cross(this.z,this.x);
  }
}

export {
  nurbs,
  Axis,
  CoordSystem
};