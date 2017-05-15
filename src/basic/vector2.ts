
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

import Vector from './vector'

/**
 * 2D Vector
 */
export default class Vector2 extends Vector {

  constructor(x=0.0, y=0.0) {
    super([x,y]);
  }

  get x() : number {
    return this._data[0];
  }

  set x(newx:number) {
    this._data[0] = newx;
  }

  get y() : number {
    return this._data[1];
  }

  set y(newy:number) {
    this._data[1] = newy;
  }

  /**
   * Cross product with other vector
   */
  cross(other:Vector2) : number {
    return this.x*other.y - this.y*other.x;
  }

  /**
   * Vector orthogonal to this vector
   */
  orthogonal() : Vector2 {
    return new Vector2(this.y, -this.x);
  }
}
