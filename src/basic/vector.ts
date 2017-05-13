
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

import {NumberArray1D, NumberType, TypedArray} from '..'
import {utils} from '..'
import {EPSILON} from '../constants'

export default class Vector {

  data : TypedArray | NumberArray1D;
  datatype : NumberType;

  constructor(data:TypedArray | NumberArray1D, datatype?:NumberType) {
    this.datatype = datatype || 'float32';
    if(ArrayBuffer.isView(data)) {
      this.data = data;
    } else {
      switch(this.datatype) {
        case 'int8':
          this.data = new Int8Array(data);
          break;
        case 'int16':
          this.data = new Int16Array(data);
          break;
        case 'int32':
          this.data = new Int32Array(data);
          break;
        case 'float32':
          this.data = new Float32Array(data);
          break;
        case 'float64':
          this.data = new Float64Array(data);
          break;
        default:
          throw new Error("Unknown datatype");
      }
    }
  }

  size() {
    return this.data.length;
  }

  clone() {
    return new Vector(this.data.slice());
  }

  /**
   * Add other vector to this
   */
  add(other:Vector) : Vector {
    console.assert(this.size() === other.size());
    for(let i=0; i<this.data.length; i++) {
      this.data[i] += other.data[i];
    }
    return this;
  }

  /**
   * Subtract other vector from this
   */
  sub(other:Vector) : Vector {
    console.assert(this.size() === other.size());
    for(let i=0; i<this.data.length; i++) {
      this.data[i] -= other.data[i];
    }
    return this;
  }

  /**
   * Multiply by a constant
   */
  mul(k:number) : Vector {
    for(let i=0; i<this.data.length; i++) {
      this.data[i] *= k;
    }
    return this;
  }

  /**
   * Square length of this vector
   */
  lenSq() : number {
    let s = 0;
    for(let i=0; i<this.data.length; i++) {
      s += this.data[i]*this.data[i];
    }
    return s;
  }

  /**
   * Length of this vector
   */
  len() : number {
    return Math.sqrt(this.lenSq());
  }

  /**
   * Unit vector of this vector
   */
  unit() : Vector {
    let len = this.len();
    if(utils.isZero(len)) {
      let arr = new Array<number>(this.size());
      for(let i=0, l=this.size(); i<l; i++) { arr[i] = 0.0; }
      return new Vector(arr);
    } else {
      return this.clone().mul(1/len);
    }
  }

  /**
   * Is this vector non-zero within given tolerance
   * (i.e. either of its members are greater than tolerance in magnitude)
   */
  isNonZero(tolerance=EPSILON) : boolean {
    for(let i=0; i<this.data.length; i++) {
      if(Math.abs(this.data[i]) > tolerance) {
        return true;
      }
    }
    return false;
  }

  /**
   * Is this vector zero within given tolerance
   * (i.e. All members are less than tolerance in magnitude)
   */
  isZero(tolerance=EPSILON) : boolean {
    return !this.isNonZero(tolerance);
  }

  /**
   * Square distance to other vector
   */
  distSq(other:Vector) : number {
    console.assert(this.size() === other.size());
    return this.clone().sub(other).lenSq();
  }

  /**
   * Distance to other vector
   */
  dist(other:Vector) : number {
    return Math.sqrt(this.distSq(other));
  }

  /**
   * Dot product with other vector
   */
  dot(other:Vector) : number {
    let dot = 0.0;
    for(let i=0; i<this.data.length; i++) {
      dot += this.data[i] * other.data[i];
    }
    return dot;
  }

  /**
   * Round to nearest integer, same rules as Math.round
   */
  round() : Vector {
    let v = new Int32Array(this.size());
    for(let i=0; i<v.length; i++) {
      v[i] = Math.round(this.data[i]);
    }
    this.data = v;
    this.datatype = 'int32';
    return this;
  }

  /**
   * Is equal to other vector, within given tolerance
   */
  isEqual(other:Vector, tolerance=EPSILON) : boolean {
    return this.clone().sub(other).isZero(tolerance);
  }

  /**
   * Return the min values for variable number of input point vectors
   * All points should be vectors of same size
   */
  static low(points : Array<Vector>) {
    let lows = new Float32Array(points[0].size());
    lows.fill(Infinity);
    for(let point of points) {
      for(let i=0; i<point.size(); i++) {
        lows[i] = Math.min(point.data[i], lows[i]);
      }
    }
    return new Vector(lows, 'float32');
  }

  /**
   * Return the max values for variable number of input point vectors
   * All points should be vectors of same size
   */
  static high(points : Array<Vector>) {
    let highs = new Float32Array(points[0].size());
    highs.fill(-Infinity);
    for(let point of points) {
      for(let i=0; i<point.size(); i++) {
        highs[i] = Math.max(point.data[i], highs[i]);
      }
    }
    return new Vector(highs, 'float32');
  }

  /**
   * String representation
   */
  toString(precision=2) : string {
    let s = [];
    for(let i=0; i<this.data.length; i++) {
      s.push(this.data[i].toFixed(precision));
    }
    return '['+s.join(',')+']';
  }
}