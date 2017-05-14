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

import {NumberType, TypedArray} from '..'

export default class Matrix {

  shape : Array<number>
  data : TypedArray
  datatype : NumberType
  size : number

  constructor(
    shape:Array<number>,
    data? : TypedArray,
    datatype? : NumberType)
  {
    this.shape = shape;
    this._computeSize();

    this.datatype = datatype || 'float32';

    if(!data) {
      this._alloc();
    } else {
      this.data = data;
    }
  }

  private _computeSize() : void {
    let size = 1;
    for(let dimsize of this.shape) {
      size *= dimsize;
    }
    this.size = size;
  }

  private _alloc() : void {
    switch(this.datatype) {
      case 'int8':
        this.data = new Int8Array(this.size);
        break;
      case 'int16':
        this.data = new Int16Array(this.size);
        break;
      case 'int32':
        this.data = new Int32Array(this.size);
        break;
      case 'float32':
        this.data = new Float32Array(this.size);
        break;
      case 'float64':
        this.data = new Float64Array(this.size);
        break;
      default:
        throw new Error("Unknown datatype");
    }
  }

  /**
   * Assign value to all items in the matrix
   */
  fill(value:number) {
    this.data.fill(value);
  }

  private _getAddress(indices:Array<number>) {
    console.assert(indices.length === this.shape.length);
    let addr = 0;
    for (let i = 0; i < this.shape.length; i++) {
      if (i < this.shape.length - 1) {
        addr += this.shape[i + 1] * indices[i];
      } else {
        addr += indices[i];
      }
    }
    return addr;
  }

  get(indices:Array<number>) : number {
    let address = this._getAddress(indices);
    return this.data[address];
  }

  set(indices:Array<number>, value:number) : void {
    let address = this._getAddress(indices);
    this.data[address] = value;
  }

}