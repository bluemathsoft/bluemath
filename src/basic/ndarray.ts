
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

import {NumberType,TypedArray} from '..'
import {isequal} from '../utils'
import {EPSILON} from '../constants'
import Complex from './complex'

export interface NDArrayOptions {
  shape? : number[];
  datatype? : NumberType;
  fill? : number;
}

/**
 * @hidden
 */
function deduceShape(data:Array<any>) {
  let dim = 0;
  let d = data;
  let shape = [data.length];
  while(Array.isArray(d[0])) {
    shape.push(d[0].length);
    dim++;
    d = d[0];
  }
  return shape;
}

/**
 * @hidden
 */
function deduceNumberType(data:TypedArray) : NumberType {
  if(data instanceof Float32Array) {
    return 'f32';
  } else if(data instanceof Float64Array) {
    return 'f64';
  } else if(data instanceof Int8Array) {
    return 'i8';
  } else if(data instanceof Uint8Array) {
    return 'ui8';
  } else if(data instanceof Int16Array) {
    return 'i16';
  } else if(data instanceof Uint16Array) {
    return 'ui16';
  } else if(data instanceof Int32Array) {
    return 'i32';
  } else if(data instanceof Uint32Array) {
    return 'ui32';
  } else {
    throw new Error('Unknown datatype');
  }
}

/**
 * @hidden
 */
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

function getDataArrayType(typestr?:string) {
  switch(typestr) {
    case 'i8':
      return Int8Array;
    case 'ui8':
      return Uint8Array;
    case 'i16':
      return Int16Array;
    case 'ui16':
      return Uint16Array;
    case 'i32':
      return Int32Array;
    case 'ui32':
      return Uint32Array;
    case 'f32':
      return Float32Array;
    case 'f64':
      return Float64Array;
    default:
      throw new Error('Unknown datatype');
  }
}

export default class NDArray {

  shape : number[];
  size : number;
  datatype : NumberType;

  /**
   * Real part of number elements is stored in this array
   */
  private _data : TypedArray;

  /**
   * If any number element of this array is Complex then its
   * imaginary part is stored in _idata sparse array object
   * indexed against its address.
   * Note that _idata is not a TypedArray as _data. This way
   * the storage is optimized for the use cases where real number
   * data is common, but in some fringe cases the number could be
   * complex.
   */
  private _idata : number[];

  constructor(
    arg0:TypedArray|Array<any>|NDArrayOptions,
    arg1?:NDArrayOptions)
  {
    this.size = 0;
    this.datatype = 'f32';
    this._idata = [];
    if(Array.isArray(arg0)) {
      this.shape = deduceShape(arg0);
      this._calcSize();
      if(arg1 && arg1.datatype) {
        this.datatype = arg1.datatype;
      }
      this._alloc(this.size, arg0, this.datatype);
    } else if(ArrayBuffer.isView(arg0)) {
      this._data = arg0;
      if(arg1 && arg1.shape) {
        this.shape = arg1.shape;
      } else {
        this.shape = [arg0.length];
      }
      // in this case options.datatype is ignored if supplied
      this.datatype = deduceNumberType(arg0);
      this._calcSize();
    } else { // must be NDArrayOption
      let options = arg0;
      if(options.datatype) {
        this.datatype = options.datatype;
      }
      if(options.shape) {
        this.shape = options.shape;
        this._calcSize();
        this._alloc(this.size, undefined, this.datatype);
        if(options.fill) {
          this._data.fill(options.fill);
        }
      }
    }
  }

  get data() {
    return this._data;
  }

  reshape(shape:number[]) {
    this.shape = shape;
    let oldsize = this.size;
    this._calcSize();
    if(this.size > oldsize) {
      // Rellocate a buffer of bigger size, copy old data to it
      this._alloc(this.size, this._data, this.datatype);
      // Fill the excess elements in new buffer with 0
      this._data.fill(0,oldsize);
    }
  }


  clone() {
    let dataArrayType = getDataArrayType(this.datatype);
    let data = new dataArrayType(this._data);
    return new NDArray(data,{shape:this.shape.slice()});
  }

  private _calcSize() {
    this.size = this.shape.reduce((prev,cur) => prev*cur, 1);
  }

  private _alloc(size:number, data?:TypedArray|Array<any>, datatype?:NumberType) {
    let dataArrayType = getDataArrayType(datatype);
    this._data = new dataArrayType(size);
    if(Array.isArray(data)) {
      populateFromArray(this._data, 0, data);
    } else if(ArrayBuffer.isView(data)) {
      this._data.set(data);
    }
  }

  private _indexToAddress(...indices:number[]) {
    if(indices.length !== this.shape.length) {
      throw new Error('Mismatched number of dimensions');
    }
    let addr = 0;
    for (let i = 0; i < this.shape.length; i++) {
      if (i < this.shape.length - 1) {
        addr += this.shape[i + 1] * indices[i];
      } else {
        if(indices[i] < 0) {
          throw new Error('Invalid index '+indices[i]);
        }
        if(indices[i] >= this.shape[i]) {
          throw new Error('Index out of bounds '+indices[i]);
        }
        addr += indices[i];
      }
    }
    return addr;
  }

  /**
   * @hidden
   */
  _addressToIndex(di:number) {
    if(di >= this.size) {
      throw new Error("Data index out of range");
    }
    let index = new Array(this.shape.length);
    for(let i=this.shape.length-1; i>=0; i--) {
      let d = this.shape[i];
      index[i] = di%d;
      di = Math.floor(di/d);
    }
    return index;
  }

  toArray() {
    if(this.shape.length <= 0) {
      throw new Error('Zero shape');
    }
    let aarr = [];
    let step = 1;
    for(let i=this.shape.length-1; i>=0; i--) {

      let d = this.shape[i];
      step = step * d;

      let nelem = this.size/step;

      if(i === this.shape.length-1) {
        for(let j=0; j<nelem; j++) {
          let arr = new Array(step);
          for(let k=0; k<d; k++) {
            arr[k] = this._data[j*step+k];
          }
          aarr.push(arr);
        }
      } else {
        let darr = new Array(nelem);
        for(let j=0; j<nelem; j++) {
          darr[j] = aarr.slice(j*d,(j+1)*d);
        }
        aarr = darr;
      }
    }
    return aarr[0];
  }

  fill(value:number) {
    this._data.fill(value);
  }

  get(...indices:number[]) : number|Complex {
    let addr = this._indexToAddress(...indices);
    return this._data[addr];
  }

  set(...args:(number|Complex)[]) {
    let nargs = args.length;
    let index = <number[]>(args.slice(0,nargs-1));
    let addr = this._indexToAddress(...index);
    let val = args[nargs-1];
    if(val instanceof Complex) {
      this._data[addr] = val.real;
      this._idata[addr] = val.imag;
    } else {
      this._data[addr] = val;
    }
  }

  swaprows(i:number, j:number) : void {
    if(this.shape.length !== 2) {
      throw new Error('This NDArray is not a Matrix (2D)');
    }
    if(i === j) {
      return; // No need to swap
    }
    let nrows = this.shape[0];
    let ncols = this.shape[1];
    if(i >= nrows || j >= nrows) {
      throw new Error("Index out of range");
    }
    for(let k=0; k<ncols; k++) {
      let tmp = this.get(i,k);
      this.set(i,k,this.get(j,k));
      this.set(j,k,tmp);
    }
  }

  /**
   * @hidden
   */
  datacompare(otherdata:TypedArray, tolerance=EPSILON) {
    for(let i=0; i<this._data.length; i++) {
      if(!isequal(this._data[i], otherdata[i], tolerance)) {
        return false;
      }
    }
    return true;
  }

  isEqual(other:NDArray, tolerance=EPSILON) : boolean {
    if(this.shape.length !== other.shape.length) {
      return false;
    }
    for(let i=0; i<this.shape.length; i++) {
      if(this.shape[i] !== other.shape[i]) {
        return false;
      }
    }
    return other.datacompare(this._data, tolerance);
  }

  swapOrder() {
    if(this.shape.length !== 2) {
      throw new Error(
        'swapOrder is not defined for ndarrays other than dim 2');
    }

    let clone = this.clone();

    let I = this.shape[0];
    let J = this.shape[1];

    this.reshape([J,I]);

    for(let i=0; i<J; i++) {
      for(let j=0; j<I; j++) {
        this.set(i,j, clone.get(j,i));
      }
    }
  }

  slice(...slices:(string|number|undefined|null)[]):NDArray {
    let slice_recipe:number[][] = [];
    // Each slice specifies the index-range in that dimension to return
    for(let i=0; i<slices.length; i++) {
      let slice = slices[i];
      let max = this.shape[i];
      if(slice === undefined || slice === null || slice === ':') {
        // gather all indices in this dimension
        slice_recipe.push([0,max]);
      } else if(typeof slice === 'string') {
        // assume the slice format to be [<from_index>:<to_index>]
        // if from_index or to_index is missing then they are replaced
        // by 0 or max respectively
        let match = /([-\d]*)\:([-\d]*)/.exec(slice);
        let from = 0;
        let to = max;
        if(match) {
          if(match[1] !== '') {
            from = parseInt(match[1],10);
          }
          if(match[2] !== '') {
            to = Math.min(parseInt(match[2],10), max);
          }
        }
        slice_recipe.push([from,to]);
      } else if(typeof slice === 'number') {
        slice_recipe.push([slice,slice+1]);
      } else {
        throw new Error("Unexpected slice :"+slice)
      }
    }
    // At this point slice_recipe contains an array of index ranges
    // index range is an array [from_index,to_index]
    // If slices argument has less slices than the number of dimensions
    // of this array (i.e. this.shape.length),
    // then we assume that lower (i.e. inner) dimensions are missing and
    // we take that as wildcard and return all indices in those
    // dimensions
    for(let i=slice_recipe.length; i<this.shape.length; i++) {
      slice_recipe.push([0,this.shape[i]]);
    }
    console.assert(slice_recipe.length === this.shape.length);

    // From slice_recipe find the total size of the result array
    // and also the shape of the result array
    let newsize = 1;
    let newshape = [];
    for(let i=0; i<slice_recipe.length; i++) {
      let recipe = slice_recipe[i];
      let dimsize = recipe[1]-recipe[0];
      newshape.push(dimsize);
      newsize *= dimsize;
    }

    let newndarray;
    let dataArrayType = getDataArrayType(this.datatype);
    if(newsize > 0) {
      // Create result array of the calculated size
      newndarray = new NDArray(
        new dataArrayType(newsize), {shape:newshape});
      // populate the result array from the original array (i.e. this)
      for(let i=0; i<newsize; i++) {
        let newindices = newndarray._addressToIndex(i);
        let oldindices = newindices.map((idx,i) => idx+slice_recipe[i][0]);
        newndarray.set(...newindices,this.get(...oldindices)); // todo
      }
    } else {
      newndarray = new NDArray({shape:[0]});
    }
    return newndarray;
  }

  toString() {
    let precision = 4;
    return JSON.stringify(this.toArray(), function (key, val) { 
      !key; // to avoid unused variable warning
      if(val.toFixed) {
        return Number(val.toFixed(3));
      } else if(Array.isArray(val) && !Array.isArray(val[0])) {
        return '['+val.map(v=>v.toFixed(precision)).join(',')+']';
      } else {
        return val;
      }
    },precision);
  }
}