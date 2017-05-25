
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

import {TypedArray} from '..'

type DataType = 'i8'|'ui8'|'i16'|'ui16'|'i32'|'ui32'|'f32'|'f64';
export {DataType}

export interface NDArrayOptions {
  shape : number[];
  datatype? : DataType;
}

function deduceShape(data:Array<any>) {
  let dim = 0;
  let d = data;
  let shape = [data.length];
  while(Array.isArray(d[0])) {
    shape.push(d[0].length);
    dim++;
    d = data[0];
  }
  return shape;
}

function populateFromArray(data:TypedArray, idx:number, arr:Array<any>) {
  if(Array.isArray(arr[0])) {
    let len = 0;
    for(let i=0; i<arr.length; i++) {
      let l = populateFromArray(data, idx+len, arr[i]);
      len += l;
    }
    return len;
  } else {
    for(let i=0; i<arr.length; i++) {
      data[idx+i] = arr[i];
    }
    return arr.length;
  }
}

export default class NDArray {

  shape : number[];
  size : number;
  private _data : TypedArray;

  constructor(
    data:TypedArray|Array<any>,
    options?:NDArrayOptions)
  {
    if(Array.isArray(data)) {
      this.shape = deduceShape(data);
      this._calcSize();
      if(options && options.datatype) {
        this._alloc(this.size, data, options.datatype);
      }
    } else {
      this._data = data;
      if(options && options.shape) {
        this.shape = options.shape;
      } else {
        this.shape = [data.length];
      }
      this._calcSize();
    }
  }

  private _calcSize() {
    this.size = this.shape.reduce((prev,cur) => prev*cur, 1);
  }

  private _alloc(size:number, data?:Array<any>, datatype?:DataType) {
    switch(datatype) {
    case 'i8':
      this._data = new Int8Array(size);
      break;
    case 'ui8':
      this._data = new Uint8Array(size);
      break;
    case 'i16':
      this._data = new Int16Array(size);
      break;
    case 'ui16':
      this._data = new Uint16Array(size);
      break;
    case 'i32':
      this._data = new Int32Array(size);
      break;
    case 'ui32':
      this._data = new Uint32Array(size);
      break;
    case 'f32':
      this._data = new Float32Array(size);
      break;
    case 'f64':
      this._data = new Float64Array(size);
      break;
    }
    if(data) {
      populateFromArray(this._data, 0, data);
    }
  }
}