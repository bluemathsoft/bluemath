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

import {NDArray} from './ndarray'
import {TypedArray} from '../src'

export class AABB {
  private _min : NDArray;
  private _max : NDArray;

  constructor(arg0:number|number[]|TypedArray, arg1?:number[]|TypedArray) {
    let dim = 0;
    if(Array.isArray(arg0) || ArrayBuffer.isView(arg0)) {
      this._min = new NDArray(arg0);
    } else {
      dim = arg0;
      this._min = new NDArray({shape:[dim]});
      this._min.fill(Infinity);
    }
    if(arg1 && (Array.isArray(arg1) || ArrayBuffer.isView(arg1))) {
      this._max = new NDArray(arg1);
    } else {
      this._max = new NDArray({shape:[dim]});
      this._max.fill(-Infinity);
    }
  }

  get min() {
    return this._min;
  }

  get max() {
    return this._max;
  }

  /**
   * Update this AABB to include given coordinate
   */
  update(coord:number[]|NDArray) {
    if(coord instanceof NDArray) {
      for(let i=0; i<this._min.length; i++) {
        this._min.set(i,
          Math.min(<number>this._min.get(i), <number>coord.get(i)));
      }
      for(let i=0; i<this._max.length; i++) {
        this._max.set(i,
          Math.max(<number>this._max.get(i), <number>coord.get(i)));
      }
    } else {
      for(let i=0; i<this._min.length; i++) {
        this._min.set(i,
          Math.min(<number>this._min.get(i), coord[i]));
      }
      for(let i=0; i<this._max.length; i++) {
        this._max.set(i,
          Math.max(<number>this._max.get(i), coord[i]));
      }
    }
  }

  merge(other:AABB) {
    for(let i=0; i<this.min.length; i++) {
      this.min.set(i,
        Math.min(<number>this.min.get(i), <number>other.min.get(i)));
    }
    for(let i=0; i<this.max.length; i++) {
      this.max.set(i,
        Math.max(<number>this.max.get(i), <number>other.max.get(i)));
    }
  }
}