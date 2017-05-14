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

import {NumberType, NumberArray2D, TypedArray} from '..'


export default class Matrix {

  private _data : TypedArray
  private datatype : NumberType
  private rows : number;
  private cols : number;

  /**
   * If arg0 is 2D array, all its rows should be the same length.
   * Let length of first row is assumed to be the number of columns.
   */
  constructor(
    arg0 : NumberArray2D | {rows:number,cols:number},
    datatype? : NumberType)
  {
    this.datatype = datatype || 'float32';

    if(Array.isArray(arg0)) {
      this.rows = arg0.length;
      console.assert(Array.isArray(arg0[0]));
      this.cols = arg0[0].length;
      this._alloc(arg0);
    } else {
      this.rows = arg0.rows;
      this.cols = arg0.cols;
      this._alloc();
    }
  }

  get size() : number {
    return this._data.length;
  }

  get data() : TypedArray {
    return this._data;
  }

  private _alloc(data?:NumberArray2D) : void {
    let size = this.rows*this.cols;
    switch(this.datatype) {
      case 'int8':
        this._data = new Int8Array(size);
        break;
      case 'uint8':
        this._data = new Uint8Array(size);
        break;
      case 'int16':
        this._data = new Int16Array(size);
        break;
      case 'uint16':
        this._data = new Uint16Array(size);
        break;
      case 'int32':
        this._data = new Int32Array(size);
        break;
      case 'uint32':
        this._data = new Uint32Array(size);
        break;
      case 'float32':
        this._data = new Float32Array(size);
        break;
      case 'float64':
        this._data = new Float64Array(size);
        break;
      default:
        throw new Error("Unknown datatype");
    }
    if(data) {
      for(let i=0; i<this.rows; i++) {
        for(let j=0; j<this.cols; j++) {
          this._data[this._getAddress(i,j)] = data[i][j];
        }
      }
    }
  }

  /**
   * Assign value to all items in the matrix
   */
  fill(value:number) {
    this._data.fill(value);
  }

  private _getAddress(row:number, col:number) {
    return row * this.cols + col;
  }

  get(row:number,col:number) : number {
    let address = this._getAddress(row,col);
    return this._data[address];
  }

  set(row:number, col:number, value:number) : void {
    let address = this._getAddress(row,col);
    this._data[address] = value;
  }

}