
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

import {NumberType,TypedArray} from '.'
import {isequal} from './ops'
import {EPSILON} from './constants'
import {Complex} from './complex'

export interface NDArrayOptions {
  shape? : number[];
  datatype? : NumberType;
  fill? : number;
  idata? : number[];
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

/**
 * N-Dimensional Array
 * ===
 * 
 * It can store real as well as complex numbers in n-dimensions
 * It can be used to store Vectors (1D) or Matrices (2D).
 * This class stores the data internally in flat typed arrays
 * 
 * NDArray is the central class of Bluemath library.
 * It's used to input and output data to/from most of the APIs of this library.
 * 
 * Construction
 * ---
 * 
 * You can create an NDArray
 * 
 * * With shape and/or data type
 * ```javascript
 * // 3-dimensional array with 32-bit integer storage
 * new NDArray({shape:[3,4,3],datatype:'i32'});
 * ```
 * 
 * * Initializing it with array data
 * ```javascript
 * // 2x3 Matrix with 64-bit floating point (double) storage
 * new NDArray([[1,1,1],[4,4,4]],{datatype:'f64'});
 * ```
 * 
 * * Using standard functions
 * ```javascript
 * zeros([2,2,2]); // Returns 2x2x2 NDArray of zeros
 * eye([4,4]); // Creates 4x4 Identity matrix
 * ```
 * 
 * Basic math operations
 * ---
 * 
 * Bluemath provides functions that allow basic math operations
 * on NDArrays
 * 
 * [[add]]
 * 
 * [[sub]]
 * 
 * [[mul]]
 * 
 * [[div]]
 */
export class NDArray {

  /**
   * Array of array dimensions. First being the outermost dimension.
   */
  private _shape : number[];

  /**
   * Size of the data (i.e. number of real/complex numbers stored
   * in this array)
   */
  private _size : number;

  /**
   * Data type of each number, specified by a string code
   */
  private _datatype : NumberType;

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
    this._size = 0;
    this._datatype = 'f32';
    this._idata = [];
    if(Array.isArray(arg0)) {
      this._shape = deduceShape(arg0);
      this._calcSize();
      if(arg1 && arg1.datatype) {
        this._datatype = arg1.datatype;
      }
      this._alloc(this._size, arg0, this._datatype);
      if(arg1 && arg1.idata) {
        this._idata = arg1.idata;
      }
    } else if(ArrayBuffer.isView(arg0)) {
      this._data = arg0;
      if(arg1 && arg1.shape) {
        this._shape = arg1.shape;
      } else {
        this._shape = [arg0.length];
      }
      // in this case options.datatype is ignored if supplied
      this._datatype = deduceNumberType(arg0);
      this._calcSize();
      if(arg1 && arg1.idata) {
        this._idata = arg1.idata;
      }
    } else { // must be NDArrayOption
      let options = arg0;
      if(options.datatype) {
        this._datatype = options.datatype;
      }
      if(options.shape) {
        this._shape = options.shape;
        this._calcSize();
        this._alloc(this._size, undefined, this._datatype);
        if(options.fill) {
          this._data.fill(options.fill);
        }
      }
      if(options.idata) {
        this._idata = options.idata;
      }
    }
  }

  get shape() {
    return this._shape;
  }

  get size() {
    return this._size;
  }

  is1D() : boolean {
    return this._shape.length === 1;
  }

  is2D() : boolean {
    return this._shape.length === 2;
  }

  /**
   * Number of elements in outermost (i.e. 0th) dimension
   */
  get length() {
    return this._shape[0];
  }

  get data() {
    return this._data;
  }

  get datatype() {
    return this._datatype;
  }

  /**
   * Set new shape for the data stored in the array
   * The old data remains intact. If the total size with the new shape
   * is larger than the old size, then excess elements of the data are
   * fill with zero.
   * @param shape New shape
   */
  reshape(shape:number[]) {
    this._shape = shape;
    let oldsize = this._size;
    this._calcSize();
    if(this._size > oldsize) {
      // Rellocate a buffer of bigger size, copy old data to it
      this._alloc(this._size, this._data, this._datatype);
      // Fill the excess elements in new buffer with 0
      this._data.fill(0,oldsize);
    }
    return this;
  }

  /**
   * Create deep copy of the array
   */
  clone() {
    let dataArrayType = getDataArrayType(this._datatype);
    let data = new dataArrayType(this._data);
    return new NDArray(data,{shape:this._shape.slice(),idata:this._idata.slice()});
  }

  private _calcSize() {
    this._size = this._shape.reduce((prev,cur) => prev*cur, 1);
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

  _indexToAddress(...indices:number[]) {
    if(indices.length !== this._shape.length) {
      throw new Error('Mismatched number of dimensions');
    }
    let addr = 0;
    let acc = 0;
    for(let i=this._shape.length-1; i>=0; i--) {
      if(i < this._shape.length-1) {
        addr += acc * indices[i];
        acc = acc * this._shape[i];
      } else {
        if(indices[i] < 0) {
          throw new Error('Invalid index '+indices[i]);
        }
        if(indices[i] >= this._shape[i]) {
          throw new Error('Index out of bounds '+indices[i]);
        }
        addr += indices[i];
        acc = this._shape[i];
      }
    }
    return addr;
  }

  /**
   * @hidden
   */
  private static mapAddressToIndex(addr:number, shape:number[]) {
    let index = new Array(shape.length);
    for(let i=shape.length-1; i>=0; i--) {
      let d = shape[i];
      index[i] = addr%d;
      addr = Math.floor(addr/d);
    }
    return index;
  }

  /**
   * @hidden
   */
  _addressToIndex(addr:number) {
    if(addr >= this._size) {
      throw new Error("Data index out of range");
    }
    return NDArray.mapAddressToIndex(addr, this._shape);
  }

  /**
   * Create nested array
   */
  toArray() {
    if(this._shape.length <= 0) {
      throw new Error('Zero shape');
    }
    let aarr = [];
    let step = 1;

    // iterate over dimensions from innermost to outermost
    for(let i=this._shape.length-1; i>=0; i--) {

      // Step size in i'th dimension
      let d = this._shape[i];
      step = step * d;

      // number of elements in i'th dimension
      let nelem = this._size/step;

      if(i === this._shape.length-1) {
        // innermost dimension, create array from all elements
        for(let j=0; j<nelem; j++) {
          let arr = new Array(step);
          for(let k=0; k<d; k++) {
            let index = j*step+k;
            if(this._idata[index] === undefined) {
              arr[k] = this._data[index];
            } else {
              arr[k] = new Complex(this._data[index],this._idata[index]);
            }
          }
          aarr.push(arr);
        }
      } else {
        // outer dimensions, create array from inner dimension's arrays
        let darr = new Array(nelem);
        for(let j=0; j<nelem; j++) {
          darr[j] = aarr.slice(j*d,(j+1)*d);
        }
        aarr = darr;
      }
    }
    return aarr[0];
  }

  /**
   * Set all members of this array to given value
   */
  fill(value:number) {
    this._data.fill(value);
  }

  private isSliceIndex(index:(number|Complex|string|undefined|null)[]) {
    if(index.length < this._shape.length) {
      return true;
    }
    for(let i=0; i<index.length; i++) {
      let item = index[i];
      if(item === undefined ||
        item === null ||
        typeof item === 'string')
      {
        return true;
      }
    }
    return false;
  }

  /**
   * Set member at given index
   * All but the last argument should specify the index.
   * The last argument is the value to set.
   */
  set(...args:(number|Complex|string|undefined|null|NDArray)[]) {
    let nargs = args.length;
    let index = <number[]>(args.slice(0,nargs-1));
    let val = args[nargs-1];
    if(this.isSliceIndex(index)) {
      //
      // Input value must be an array and the specified index
      // must resolve to a slice instead of a single item.
      // Assign the contents of input value array to the 
      // this array's slice for specified index
      //
      if(!(val instanceof NDArray)) {
        throw new Error('Input value should be NDArray');
      }
      let valslice = <NDArray>val;
      let slice_recipe = this.createSliceRecipe(index);
      let {shape:sliceshape,size:slicesize} =
        this.computeSliceShapeAndSize(slice_recipe);

      if(!NDArray.areShapesEqual(sliceshape, valslice._shape)) {
        throw new Error("Input value has incompatible shape");
      }

      for(let i=0; i<slicesize; i++) {
        // Convert each address of slice array to index
        let sliceidx = NDArray.mapAddressToIndex(i,sliceshape);

        // Find index into the original array (oldidx) that corresponds
        // to the newidx
        let targetidx:number[] = [];
        let rangecount = 0;
        for(let i=slice_recipe.length-1; i>=0; i--) {
          if(Array.isArray(slice_recipe[i])) {
            // Every element of the new index corresponds to a range element
            // in the slice recipe. To map the new index to old index, we
            // have to take the lower end of the range in slice recipe and
            // add it to the element in new index
            let range = <number[]>slice_recipe[i];
            let low = range[0];
            let idxelem = sliceidx[sliceidx.length-1-rangecount];
            targetidx.unshift(idxelem+low);
            rangecount++;
          } else {
            // Copy the constant recipe element as-is into index
            targetidx.unshift(<number>slice_recipe[i]);
          }
        }
        this.set(...targetidx, (<NDArray>val).get(...sliceidx));
      }
    } else {
      // Assignment of single item
      let addr = this._indexToAddress(...index);
      if(val instanceof Complex) {
        this._data[addr] = val.real;
        this._idata[addr] = val.imag;
      } else {
        this._data[addr] = <number>val;
      }
    }
  }

  /**
   * Swaps matrix rows (this must be a 2D array)
   */
  swaprows(i:number, j:number) : void {
    if(this._shape.length !== 2) {
      throw new Error('This NDArray is not a Matrix (2D)');
    }
    if(i === j) {
      return; // No need to swap
    }
    let nrows = this._shape[0];
    let ncols = this._shape[1];
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
  datacompare(otherdata:TypedArray, otheridata:number[], tolerance=EPSILON) {
    for(let i=0; i<this._data.length; i++) {
      if(this._idata[i] === undefined) {
        if(!isequal(this._data[i], otherdata[i], tolerance)) {
          return false;
        }
      } else {
        if(otheridata[i] === undefined) {
          // other is not complex number
          return false;
        }
        let thisC = new Complex(this._data[i],this._idata[i]);
        let otherC = new Complex(otherdata[i],otheridata[i]);
        return thisC.isEqual(otherC);
      }
    }
    return true;
  }

  /**
   * Iterate over each element, invoke a callback with each index and value
   */
  forEach(callback:(value:number|Complex,...index:number[])=>void) {
    for(let i=0; i<this._size; i++) {
      let index = this._addressToIndex(i);
      if(this._idata[i] === undefined) {
        callback(this._data[i], ...index)
      } else {
        callback(new Complex(this._data[i],this._idata[i]), ...index);
      }
    }
  }

  /**
   * @hidden
   */
  private static areShapesEqual(shape1:number[], shape2:number[]) : boolean {
    if(shape1.length !== shape2.length) {
      return false;
    }
    for(let i=0; i<shape1.length; i++) {
      if(shape1[i] !== shape2[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checks if the shape of this ndarray matches the shape of other
   */
  isShapeEqual(other:NDArray) : boolean {
    return NDArray.areShapesEqual(this._shape, other._shape);
  }

  /**
   * Does equality test for each element of the array as well as the
   * shape of the arrays
   * @param other Other NDArray to compare with
   * @param tolerance
   */
  isEqual(other:NDArray, tolerance=EPSILON) : boolean {
    let shapeequal = this.isShapeEqual(other);
    return shapeequal && other.datacompare(this._data, this._idata, tolerance);
  }

  /**
   * Return 1D copy of this array
   */
  flatten() {
    let copy = this.clone();
    copy.reshape([this._size]);
    return copy;
  }

  /**
   * Change between Row-major and Column-major layout
   */
  swapOrder() {
    if(this._shape.length !== 2) {
      throw new Error(
        'swapOrder is not defined for ndarrays other than dim 2');
    }

    let clone = this.clone();

    let I = this._shape[0];
    let J = this._shape[1];

    this.reshape([J,I]);

    for(let i=0; i<J; i++) {
      for(let j=0; j<I; j++) {
        this.set(i,j, clone.get(j,i));
      }
    }
  }

  private createSliceRecipe(slices:(string|number|undefined|null)[]) {
    if(slices.length > this._shape.length) {
      throw new Error('Excess number of dimensions specified');
    }
    let slice_recipe:Array<number|number[]> = [];
    // Each slice specifies the index-range in that dimension to return
    for(let i=0; i<slices.length; i++) {
      let slice = slices[i];
      let max = this._shape[i];
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
        slice_recipe.push(slice);
      } else {
        throw new Error("Unexpected slice :"+slice);
      }
    }

    // If slices argument has less slices than the number of dimensions
    // of this array (i.e. this.shape.length),
    // then we assume that lower (i.e. inner) dimensions are missing and
    // we take that as wildcard and return all indices in those
    // dimensions
    for(let i=slice_recipe.length; i<this._shape.length; i++) {
      slice_recipe.push([0,this._shape[i]]);
    }

    return slice_recipe;
  }

  private computeSliceShapeAndSize(slice_recipe:Array<number|number[]>) {
    // The number of dimensions of the resulting slice equals the
    // number of slice recipies that are ranges
    let shape = [];
    let size = 1;
    for(let i=slice_recipe.length-1; i>=0; i--) {
      if(Array.isArray(slice_recipe[i])) {
        let recipe:number[] = <number[]>slice_recipe[i];
        let dim = recipe[1]-recipe[0];
        shape.unshift(dim); // Prepend
        size *= dim;
      }
    }
    return {shape, size}
  }

  /**
   * Shorthand for get(...) method to avoid casting to <number>
   */
  getN(...slices:(string|number|undefined|null)[]):number {
    return <number>this.get(...slices);
  }

  /**
   * Shorthand for get(...) method to avoid casting to <NDArray>
   */
  getA(...slices:(string|number|undefined|null)[]):NDArray {
    return <NDArray>this.get(...slices);
  }

  /**
   * Shorthand for get(...) method to avoid casting to <Complex>
   */
  getC(...slices:(string|number|undefined|null)[]):Complex {
    return <Complex>this.get(...slices);
  }

  /**
   * Returns a specific element or a new NDArray that's a subset of
   * this array as defined by the slicing recipe.
   * Each element of the slicing recipe (i.e. any argument) can be
   * * A number specifying a specific element or slice of the array
   * in given dimension. 
   * * A string of the form '<start>:<stop>', specifying the range of
   * slices in the given dimension. Both '<start>' and '<stop>' are
   * optional
   * 
   * Caveats
   * ---
   * * Negative indices not supported yet
   * * No support for `<start>:<stop>:<step>` format yet
   */
  get(...slices:(string|number|undefined|null)[]):NDArray|number|Complex {

    let slice_recipe = this.createSliceRecipe(slices);
    console.assert(slice_recipe.length === this._shape.length);

    // Count elements of slice recipe that are ranges
    let nranges = 0;
    for(let i=0; i<slice_recipe.length; i++) {
      if(Array.isArray(slice_recipe[i])) { nranges++; }
    }

    // If the slice recipe doesn't contain any ranges, then the
    // result is a single element of the array
    if(nranges === 0) {
      let idx = <number[]>slice_recipe;
      let addr = this._indexToAddress(...idx);
      if(this._idata[addr] === undefined) {
        return this._data[addr];
      } else {
        return new Complex(this._data[addr], this._idata[addr]);
      }
    }

    let {shape:sliceshape,size:slicesize} =
      this.computeSliceShapeAndSize(slice_recipe);

    let slicearr = new NDArray({shape:sliceshape, datatype:this._datatype});

    for(let i=0; i<slicesize; i++) {

      // Convert each address of slice array to index
      let newidx = slicearr._addressToIndex(i);

      // Find index into the original array (oldidx) that corresponds
      // to the newidx
      let oldidx:number[] = [];
      let rangecount = 0;
      for(let i=slice_recipe.length-1; i>=0; i--) {
        if(Array.isArray(slice_recipe[i])) {
          // Every element of the new index corresponds to a range element
          // in the slice recipe. To map the new index to old index, we
          // have to take the lower end of the range in slice recipe and
          // add it to the element in new index
          let range = <number[]>slice_recipe[i];
          let low = range[0];
          let idxelem = newidx[newidx.length-1-rangecount];
          oldidx.unshift(idxelem+low);
          rangecount++;
        } else {
          // Copy the constant recipe element as-is into index
          oldidx.unshift(<number>slice_recipe[i]);
        }
      }
      slicearr.set(...newidx, this.get(...oldidx));
    }

    return slicearr;
  }

  /**
   * @hidden
   */
  take(indices:number[],axis:number) : NDArray {
    !indices;
    !axis;
    throw new Error('TODO');
  }

  /**
   * @hidden
   */
  max(axis?:number|number[]) : number|NDArray {
    if(axis !== undefined && axis !== null) {
      if(typeof axis === 'number') {
        if(axis >= this._shape.length) {
          throw new Error('axis is out of range');
        }
        let maxshape = this._shape.slice();
        maxshape.splice(axis,1);
        let maxsize = maxshape.reduce((a,b)=>a*b,1);
        let maxarr = new NDArray({datatype:this._datatype, shape:maxshape});
        for(let i=0; i<maxsize; i++) {
          let maxindex = maxarr._addressToIndex(i);
          let sliceindex = maxindex.slice();
          sliceindex.splice(axis,0,':');
          let slice = <NDArray>this.get(...sliceindex);
          maxarr.set(...maxindex,<number>slice.max());
        }
        return maxarr;
      } else if(Array.isArray(axis)) {
        throw new Error('TODO');
      } else {
        throw new Error('Invalid type for axis');
      }
    } else {
      if(Object.keys(this._idata).length > 0) {
        throw new Error('TODO');
      } else {
        return Math.max.apply(Math.max, this._data);
      }
    }
  }

  /**
   * @hidden
   */
  min() {
    throw new Error('TODO');
  }

  /**
   * @hidden
   */
  mean() {
    throw new Error('TODO');
  }

  /**
   * @hidden
   */
  all() {
    throw new Error('TODO');
  }

  /**
   * @hidden
   */
  any() {
    throw new Error('TODO');
  }

  /**
   * @hidden
   */
  sort() {
    throw new Error('TODO');
  }

  /**
   * @hidden
   */
  argsort() {
    throw new Error('TODO');
  }

  copyfrom(other:NDArray) {
    if(!this.isShapeEqual(other)) {
      throw new Error('Shape mismatch');
    }
    this._data.set(other.data);
  }

  copyto(other:NDArray) {
    other.copyfrom(this);
  }

  /*
  toString(precision=4) {
    return JSON.stringify(this.toArray(), function (key, val) { 
      !key; // to avoid unused variable warning
      if(val instanceof Complex) {
        return val.toString();
      } else if(typeof val === 'number') {
        return Number(val.toFixed(precision));
      } else if(Array.isArray(val) && !Array.isArray(val[0])) {
        return '['+val.map(v => {
          if(v instanceof Complex) {
            return v.toString();
          } else {
            return v.toFixed(precision)
          }
        }).join(',')+']';
      } else {
        return val;
      }
    },precision);
  }
  */

  toString(precision=4) {

    if(['i8','ui8','i16','ui16','i32','ui32'].indexOf(this._datatype) >= 0) {
      precision = 0;
    }

    function whitespace(length=0) {
      let s = '';
      for(let i=0; i<length; i++) { s+=' '; }
      return s;
    }

    if(this._shape.length <= 0) {
      return '[]';
    }
    let sarr = [];
    let step = 1;

    // iterate over dimensions from innermost to outermost
    for(let i=this._shape.length-1; i>=0; i--) {

      // Step size in i'th dimension
      let d = this._shape[i];
      step = step * d;

      // number of elements in i'th dimension
      let nelem = this._size/step;
      if(i === this._shape.length-1) {

        // innermost dimension, create array from all elements
        for(let j=0; j<nelem; j++) {
          let str = whitespace(i+1)+'[';
          for(let k=0; k<d; k++) {
            let index = j*step+k;

            if(this._idata[index] === undefined) {
              str += this._data[index].toFixed(precision);
            } else {
              str += new Complex(this._data[index],this._idata[index])
                .toString(precision);
            }

            if(k < d-1) {
              str += ',';
            }
          }
          str += ']';
          sarr.push(str);
        }
      } else {
        // outer dimensions, create array from inner dimension's arrays
        let sdarr = new Array(nelem);
        for(let j=0; j<nelem; j++) {
          sdarr[j] =
            whitespace(i+1)+'[\n'+
            sarr.slice(j*d,(j+1)*d).map(s => whitespace(i+1)+s).join(',\n')+'\n'+
            whitespace(i+1)+']';
        }
        sarr = sdarr;
      }
    }
    return sarr[0];
  }

  toHTML(precision=4) {

    if(['i8','ui8','i16','ui16','i32','ui32'].indexOf(this._datatype) >= 0) {
      precision = 0;
    }
    let tagnames = ['table','tr','td'];

    if(this._shape.length <= 0) {
      return '<table></table>';
    }
    let sarr = [];
    let step = 1;

    // iterate over dimensions from innermost to outermost
    for(let i=this._shape.length-1; i>=0; i--) {

      // Step size in i'th dimension
      let d = this._shape[i];
      step = step * d;

      let tag = tagnames[(i+1)%3];
      let outertag = tagnames[(3+i)%3]; // adding 3 wraps around the mod range

      // number of elements in i'th dimension
      let nelem = this._size/step;
      if(i === this._shape.length-1) {

        // innermost dimension, create array from all elements
        for(let j=0; j<nelem; j++) {
          let str = `<${outertag}>`;
          for(let k=0; k<d; k++) {
            let index = j*step+k;

            str += `<${tag}>`;
            if(this._idata[index] === undefined) {
              str += this._data[index].toFixed(precision);
            } else {
              str += new Complex(this._data[index],this._idata[index])
                .toString(precision);
            }
            str += `</${tag}>`;

          }
          str += `</${outertag}>`;
          sarr.push(str);
        }
      } else {
        // outer dimensions, create array from inner dimension's arrays
        let sdarr = new Array(nelem);
        for(let j=0; j<nelem; j++) {
          sdarr[j] = `<${outertag}>`+
            sarr.slice(j*d,(j+1)*d).join('')+
            `</${outertag}>`;
        }
        sarr = sdarr;
      }
    }
    return sarr[0];
    //return '<table>'+sarr[0]+'</table>';
  }
}

export class Vec2 extends NDArray {
  constructor(x:number, y:number) {
    super([x,y]);
  }
}

export class Vec3 extends NDArray {
  constructor(x:number, y:number, z:number) {
    super([x,y,z]);
  }
}