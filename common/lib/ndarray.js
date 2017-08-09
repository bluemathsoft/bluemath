"use strict";
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ops_1 = require("./ops");
var constants_1 = require("./constants");
var complex_1 = require("./complex");
/**
 * @hidden
 */
function deduceShape(data) {
    var dim = 0;
    var d = data;
    var shape = [data.length];
    while (Array.isArray(d[0])) {
        shape.push(d[0].length);
        dim++;
        d = d[0];
    }
    return shape;
}
/**
 * @hidden
 */
function deduceNumberType(data) {
    if (data instanceof Float32Array) {
        return 'f32';
    }
    else if (data instanceof Float64Array) {
        return 'f64';
    }
    else if (data instanceof Int8Array) {
        return 'i8';
    }
    else if (data instanceof Uint8Array) {
        return 'ui8';
    }
    else if (data instanceof Int16Array) {
        return 'i16';
    }
    else if (data instanceof Uint16Array) {
        return 'ui16';
    }
    else if (data instanceof Int32Array) {
        return 'i32';
    }
    else if (data instanceof Uint32Array) {
        return 'ui32';
    }
    else {
        throw new Error('Unknown datatype');
    }
}
/**
 * @hidden
 */
function populateFromArray(data, idx, arr) {
    if (Array.isArray(arr[0])) {
        var len = 0;
        for (var i = 0; i < arr.length; i++) {
            var l = populateFromArray(data, idx + len, arr[i]);
            len += l;
        }
        return len;
    }
    else {
        for (var i = 0; i < arr.length; i++) {
            data[idx + i] = arr[i];
        }
        return arr.length;
    }
}
function getDataArrayType(typestr) {
    switch (typestr) {
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
var NDArray = (function () {
    function NDArray(arg0, arg1) {
        this._size = 0;
        this._datatype = 'f32';
        this._idata = [];
        if (Array.isArray(arg0)) {
            this._shape = deduceShape(arg0);
            this._calcSize();
            if (arg1 && arg1.datatype) {
                this._datatype = arg1.datatype;
            }
            this._alloc(this._size, arg0, this._datatype);
            if (arg1 && arg1.idata) {
                this._idata = arg1.idata;
            }
        }
        else if (ArrayBuffer.isView(arg0)) {
            this._data = arg0;
            if (arg1 && arg1.shape) {
                this._shape = arg1.shape;
            }
            else {
                this._shape = [arg0.length];
            }
            // in this case options.datatype is ignored if supplied
            this._datatype = deduceNumberType(arg0);
            this._calcSize();
            if (arg1 && arg1.idata) {
                this._idata = arg1.idata;
            }
        }
        else {
            var options = arg0;
            if (options.datatype) {
                this._datatype = options.datatype;
            }
            if (options.shape) {
                this._shape = options.shape;
                this._calcSize();
                this._alloc(this._size, undefined, this._datatype);
                if (options.fill) {
                    this._data.fill(options.fill);
                }
            }
            if (options.idata) {
                this._idata = options.idata;
            }
        }
    }
    Object.defineProperty(NDArray.prototype, "shape", {
        get: function () {
            return this._shape;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NDArray.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    NDArray.prototype.is1D = function () {
        return this._shape.length === 1;
    };
    NDArray.prototype.is2D = function () {
        return this._shape.length === 2;
    };
    Object.defineProperty(NDArray.prototype, "length", {
        /**
         * Number of elements in outermost (i.e. 0th) dimension
         */
        get: function () {
            return this._shape[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NDArray.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NDArray.prototype, "datatype", {
        get: function () {
            return this._datatype;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Set new shape for the data stored in the array
     * The old data remains intact. If the total size with the new shape
     * is larger than the old size, then excess elements of the data are
     * fill with zero.
     * @param shape New shape
     */
    NDArray.prototype.reshape = function (shape) {
        this._shape = shape;
        var oldsize = this._size;
        this._calcSize();
        if (this._size > oldsize) {
            // Rellocate a buffer of bigger size, copy old data to it
            this._alloc(this._size, this._data, this._datatype);
            // Fill the excess elements in new buffer with 0
            this._data.fill(0, oldsize);
        }
        return this;
    };
    /**
     * Create deep copy of the array
     */
    NDArray.prototype.clone = function () {
        var dataArrayType = getDataArrayType(this._datatype);
        var data = new dataArrayType(this._data);
        return new NDArray(data, { shape: this._shape.slice(), idata: this._idata.slice() });
    };
    NDArray.prototype._calcSize = function () {
        this._size = this._shape.reduce(function (prev, cur) { return prev * cur; }, 1);
    };
    NDArray.prototype._alloc = function (size, data, datatype) {
        var dataArrayType = getDataArrayType(datatype);
        this._data = new dataArrayType(size);
        if (Array.isArray(data)) {
            populateFromArray(this._data, 0, data);
        }
        else if (ArrayBuffer.isView(data)) {
            this._data.set(data);
        }
    };
    NDArray.prototype._indexToAddress = function () {
        var indices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indices[_i] = arguments[_i];
        }
        if (indices.length !== this._shape.length) {
            throw new Error('Mismatched number of dimensions');
        }
        var addr = 0;
        var acc = 0;
        for (var i = this._shape.length - 1; i >= 0; i--) {
            if (i < this._shape.length - 1) {
                addr += acc * indices[i];
                acc = acc * this._shape[i];
            }
            else {
                if (indices[i] < 0) {
                    throw new Error('Invalid index ' + indices[i]);
                }
                if (indices[i] >= this._shape[i]) {
                    throw new Error('Index out of bounds ' + indices[i]);
                }
                addr += indices[i];
                acc = this._shape[i];
            }
        }
        return addr;
    };
    /**
     * @hidden
     */
    NDArray.mapAddressToIndex = function (addr, shape) {
        var index = new Array(shape.length);
        for (var i = shape.length - 1; i >= 0; i--) {
            var d = shape[i];
            index[i] = addr % d;
            addr = Math.floor(addr / d);
        }
        return index;
    };
    /**
     * @hidden
     */
    NDArray.prototype._addressToIndex = function (addr) {
        if (addr >= this._size) {
            throw new Error("Data index out of range");
        }
        return NDArray.mapAddressToIndex(addr, this._shape);
    };
    /**
     * Create nested array
     */
    NDArray.prototype.toArray = function () {
        if (this._shape.length <= 0) {
            throw new Error('Zero shape');
        }
        var aarr = [];
        var step = 1;
        // iterate over dimensions from innermost to outermost
        for (var i = this._shape.length - 1; i >= 0; i--) {
            // Step size in i'th dimension
            var d = this._shape[i];
            step = step * d;
            // number of elements in i'th dimension
            var nelem = this._size / step;
            if (i === this._shape.length - 1) {
                // innermost dimension, create array from all elements
                for (var j = 0; j < nelem; j++) {
                    var arr = new Array(step);
                    for (var k = 0; k < d; k++) {
                        var index = j * step + k;
                        if (this._idata[index] === undefined) {
                            arr[k] = this._data[index];
                        }
                        else {
                            arr[k] = new complex_1.Complex(this._data[index], this._idata[index]);
                        }
                    }
                    aarr.push(arr);
                }
            }
            else {
                // outer dimensions, create array from inner dimension's arrays
                var darr = new Array(nelem);
                for (var j = 0; j < nelem; j++) {
                    darr[j] = aarr.slice(j * d, (j + 1) * d);
                }
                aarr = darr;
            }
        }
        return aarr[0];
    };
    /**
     * Set all members of this array to given value
     */
    NDArray.prototype.fill = function (value) {
        this._data.fill(value);
    };
    NDArray.prototype.isSliceIndex = function (index) {
        if (index.length < this._shape.length) {
            return true;
        }
        for (var i = 0; i < index.length; i++) {
            var item = index[i];
            if (item === undefined ||
                item === null ||
                typeof item === 'string') {
                return true;
            }
        }
        return false;
    };
    /**
     * Set member at given index
     * All but the last argument should specify the index.
     * The last argument is the value to set.
     */
    NDArray.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var nargs = args.length;
        var index = (args.slice(0, nargs - 1));
        var val = args[nargs - 1];
        if (this.isSliceIndex(index)) {
            //
            // Input value must be an array and the specified index
            // must resolve to a slice instead of a single item.
            // Assign the contents of input value array to the 
            // this array's slice for specified index
            //
            if (!(val instanceof NDArray)) {
                throw new Error('Input value should be NDArray');
            }
            var valslice = val;
            var slice_recipe = this.createSliceRecipe(index);
            var _a = this.computeSliceShapeAndSize(slice_recipe), sliceshape = _a.shape, slicesize = _a.size;
            if (!NDArray.areShapesEqual(sliceshape, valslice._shape)) {
                throw new Error("Input value has incompatible shape");
            }
            for (var i = 0; i < slicesize; i++) {
                // Convert each address of slice array to index
                var sliceidx = NDArray.mapAddressToIndex(i, sliceshape);
                // Find index into the original array (oldidx) that corresponds
                // to the newidx
                var targetidx = [];
                var rangecount = 0;
                for (var i_1 = slice_recipe.length - 1; i_1 >= 0; i_1--) {
                    if (Array.isArray(slice_recipe[i_1])) {
                        // Every element of the new index corresponds to a range element
                        // in the slice recipe. To map the new index to old index, we
                        // have to take the lower end of the range in slice recipe and
                        // add it to the element in new index
                        var range = slice_recipe[i_1];
                        var low = range[0];
                        var idxelem = sliceidx[sliceidx.length - 1 - rangecount];
                        targetidx.unshift(idxelem + low);
                        rangecount++;
                    }
                    else {
                        // Copy the constant recipe element as-is into index
                        targetidx.unshift(slice_recipe[i_1]);
                    }
                }
                this.set.apply(this, targetidx.concat([(_b = val).get.apply(_b, sliceidx)]));
            }
        }
        else {
            // Assignment of single item
            var addr = this._indexToAddress.apply(this, index);
            if (val instanceof complex_1.Complex) {
                this._data[addr] = val.real;
                this._idata[addr] = val.imag;
            }
            else {
                this._data[addr] = val;
            }
        }
        var _b;
    };
    /**
     * Swaps matrix rows (this must be a 2D array)
     */
    NDArray.prototype.swaprows = function (i, j) {
        if (this._shape.length !== 2) {
            throw new Error('This NDArray is not a Matrix (2D)');
        }
        if (i === j) {
            return; // No need to swap
        }
        var nrows = this._shape[0];
        var ncols = this._shape[1];
        if (i >= nrows || j >= nrows) {
            throw new Error("Index out of range");
        }
        for (var k = 0; k < ncols; k++) {
            var tmp = this.get(i, k);
            this.set(i, k, this.get(j, k));
            this.set(j, k, tmp);
        }
    };
    /**
     * @hidden
     */
    NDArray.prototype.datacompare = function (otherdata, otheridata, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        for (var i = 0; i < this._data.length; i++) {
            if (this._idata[i] === undefined) {
                if (!ops_1.isequal(this._data[i], otherdata[i], tolerance)) {
                    return false;
                }
            }
            else {
                if (otheridata[i] === undefined) {
                    // other is not complex number
                    return false;
                }
                var thisC = new complex_1.Complex(this._data[i], this._idata[i]);
                var otherC = new complex_1.Complex(otherdata[i], otheridata[i]);
                return thisC.isEqual(otherC);
            }
        }
        return true;
    };
    /**
     * Iterate over each element, invoke a callback with each index and value
     */
    NDArray.prototype.forEach = function (callback) {
        for (var i = 0; i < this._size; i++) {
            var index = this._addressToIndex(i);
            if (this._idata[i] === undefined) {
                callback.apply(void 0, [this._data[i]].concat(index));
            }
            else {
                callback.apply(void 0, [new complex_1.Complex(this._data[i], this._idata[i])].concat(index));
            }
        }
    };
    /**
     * @hidden
     */
    NDArray.areShapesEqual = function (shape1, shape2) {
        if (shape1.length !== shape2.length) {
            return false;
        }
        for (var i = 0; i < shape1.length; i++) {
            if (shape1[i] !== shape2[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Checks if the shape of this ndarray matches the shape of other
     */
    NDArray.prototype.isShapeEqual = function (other) {
        return NDArray.areShapesEqual(this._shape, other._shape);
    };
    /**
     * Does equality test for each element of the array as well as the
     * shape of the arrays
     * @param other Other NDArray to compare with
     * @param tolerance
     */
    NDArray.prototype.isEqual = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        var shapeequal = this.isShapeEqual(other);
        return shapeequal && other.datacompare(this._data, this._idata, tolerance);
    };
    /**
     * Return 1D copy of this array
     */
    NDArray.prototype.flatten = function () {
        var copy = this.clone();
        copy.reshape([this._size]);
        return copy;
    };
    /**
     * Change between Row-major and Column-major layout
     */
    NDArray.prototype.swapOrder = function () {
        if (this._shape.length !== 2) {
            throw new Error('swapOrder is not defined for ndarrays other than dim 2');
        }
        var clone = this.clone();
        var I = this._shape[0];
        var J = this._shape[1];
        this.reshape([J, I]);
        for (var i = 0; i < J; i++) {
            for (var j = 0; j < I; j++) {
                this.set(i, j, clone.get(j, i));
            }
        }
    };
    NDArray.prototype.createSliceRecipe = function (slices) {
        if (slices.length > this._shape.length) {
            throw new Error('Excess number of dimensions specified');
        }
        var slice_recipe = [];
        // Each slice specifies the index-range in that dimension to return
        for (var i = 0; i < slices.length; i++) {
            var slice = slices[i];
            var max = this._shape[i];
            if (slice === undefined || slice === null || slice === ':') {
                // gather all indices in this dimension
                slice_recipe.push([0, max]);
            }
            else if (typeof slice === 'string') {
                // assume the slice format to be [<from_index>:<to_index>]
                // if from_index or to_index is missing then they are replaced
                // by 0 or max respectively
                var match = /([-\d]*)\:([-\d]*)/.exec(slice);
                var from = 0;
                var to = max;
                if (match) {
                    if (match[1] !== '') {
                        from = parseInt(match[1], 10);
                    }
                    if (match[2] !== '') {
                        to = Math.min(parseInt(match[2], 10), max);
                    }
                }
                slice_recipe.push([from, to]);
            }
            else if (typeof slice === 'number') {
                slice_recipe.push(slice);
            }
            else {
                throw new Error("Unexpected slice :" + slice);
            }
        }
        // If slices argument has less slices than the number of dimensions
        // of this array (i.e. this.shape.length),
        // then we assume that lower (i.e. inner) dimensions are missing and
        // we take that as wildcard and return all indices in those
        // dimensions
        for (var i = slice_recipe.length; i < this._shape.length; i++) {
            slice_recipe.push([0, this._shape[i]]);
        }
        return slice_recipe;
    };
    NDArray.prototype.computeSliceShapeAndSize = function (slice_recipe) {
        // The number of dimensions of the resulting slice equals the
        // number of slice recipies that are ranges
        var shape = [];
        var size = 1;
        for (var i = slice_recipe.length - 1; i >= 0; i--) {
            if (Array.isArray(slice_recipe[i])) {
                var recipe = slice_recipe[i];
                var dim = recipe[1] - recipe[0];
                shape.unshift(dim); // Prepend
                size *= dim;
            }
        }
        return { shape: shape, size: size };
    };
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
    NDArray.prototype.get = function () {
        var slices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            slices[_i] = arguments[_i];
        }
        var slice_recipe = this.createSliceRecipe(slices);
        console.assert(slice_recipe.length === this._shape.length);
        // Count elements of slice recipe that are ranges
        var nranges = 0;
        for (var i = 0; i < slice_recipe.length; i++) {
            if (Array.isArray(slice_recipe[i])) {
                nranges++;
            }
        }
        // If the slice recipe doesn't contain any ranges, then the
        // result is a single element of the array
        if (nranges === 0) {
            var idx = slice_recipe;
            var addr = this._indexToAddress.apply(this, idx);
            if (this._idata[addr] === undefined) {
                return this._data[addr];
            }
            else {
                return new complex_1.Complex(this._data[addr], this._idata[addr]);
            }
        }
        var _a = this.computeSliceShapeAndSize(slice_recipe), sliceshape = _a.shape, slicesize = _a.size;
        var slicearr = new NDArray({ shape: sliceshape, datatype: this._datatype });
        for (var i = 0; i < slicesize; i++) {
            // Convert each address of slice array to index
            var newidx = slicearr._addressToIndex(i);
            // Find index into the original array (oldidx) that corresponds
            // to the newidx
            var oldidx = [];
            var rangecount = 0;
            for (var i_2 = slice_recipe.length - 1; i_2 >= 0; i_2--) {
                if (Array.isArray(slice_recipe[i_2])) {
                    // Every element of the new index corresponds to a range element
                    // in the slice recipe. To map the new index to old index, we
                    // have to take the lower end of the range in slice recipe and
                    // add it to the element in new index
                    var range = slice_recipe[i_2];
                    var low = range[0];
                    var idxelem = newidx[newidx.length - 1 - rangecount];
                    oldidx.unshift(idxelem + low);
                    rangecount++;
                }
                else {
                    // Copy the constant recipe element as-is into index
                    oldidx.unshift(slice_recipe[i_2]);
                }
            }
            slicearr.set.apply(slicearr, newidx.concat([this.get.apply(this, oldidx)]));
        }
        return slicearr;
    };
    /**
     * @hidden
     */
    NDArray.prototype.take = function (indices, axis) {
        !indices;
        !axis;
        throw new Error('TODO');
    };
    /**
     * @hidden
     */
    NDArray.prototype.max = function (axis) {
        if (axis !== undefined && axis !== null) {
            if (typeof axis === 'number') {
                if (axis >= this._shape.length) {
                    throw new Error('axis is out of range');
                }
                var maxshape = this._shape.slice();
                maxshape.splice(axis, 1);
                var maxsize = maxshape.reduce(function (a, b) { return a * b; }, 1);
                var maxarr = new NDArray({ datatype: this._datatype, shape: maxshape });
                for (var i = 0; i < maxsize; i++) {
                    var maxindex = maxarr._addressToIndex(i);
                    var sliceindex = maxindex.slice();
                    sliceindex.splice(axis, 0, ':');
                    var slice = this.get.apply(this, sliceindex);
                    maxarr.set.apply(maxarr, maxindex.concat([slice.max()]));
                }
                return maxarr;
            }
            else if (Array.isArray(axis)) {
                throw new Error('TODO');
            }
            else {
                throw new Error('Invalid type for axis');
            }
        }
        else {
            if (Object.keys(this._idata).length > 0) {
                throw new Error('TODO');
            }
            else {
                return Math.max.apply(Math.max, this._data);
            }
        }
    };
    /**
     * @hidden
     */
    NDArray.prototype.min = function () {
        throw new Error('TODO');
    };
    /**
     * @hidden
     */
    NDArray.prototype.mean = function () {
        throw new Error('TODO');
    };
    /**
     * @hidden
     */
    NDArray.prototype.all = function () {
        throw new Error('TODO');
    };
    /**
     * @hidden
     */
    NDArray.prototype.any = function () {
        throw new Error('TODO');
    };
    /**
     * @hidden
     */
    NDArray.prototype.sort = function () {
        throw new Error('TODO');
    };
    /**
     * @hidden
     */
    NDArray.prototype.argsort = function () {
        throw new Error('TODO');
    };
    NDArray.prototype.copyfrom = function (other) {
        if (!this.isShapeEqual(other)) {
            throw new Error('Shape mismatch');
        }
        this._data.set(other.data);
    };
    NDArray.prototype.copyto = function (other) {
        other.copyfrom(this);
    };
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
    NDArray.prototype.toString = function (precision) {
        if (precision === void 0) { precision = 4; }
        if (['i8', 'ui8', 'i16', 'ui16', 'i32', 'ui32'].indexOf(this._datatype) >= 0) {
            precision = 0;
        }
        function whitespace(length) {
            if (length === void 0) { length = 0; }
            var s = '';
            for (var i = 0; i < length; i++) {
                s += ' ';
            }
            return s;
        }
        if (this._shape.length <= 0) {
            return '[]';
        }
        var sarr = [];
        var step = 1;
        var _loop_1 = function (i) {
            // Step size in i'th dimension
            var d = this_1._shape[i];
            step = step * d;
            // number of elements in i'th dimension
            var nelem = this_1._size / step;
            if (i === this_1._shape.length - 1) {
                // innermost dimension, create array from all elements
                for (var j = 0; j < nelem; j++) {
                    var str = whitespace(i + 1) + '[';
                    for (var k = 0; k < d; k++) {
                        var index = j * step + k;
                        if (this_1._idata[index] === undefined) {
                            str += this_1._data[index].toFixed(precision);
                        }
                        else {
                            str += new complex_1.Complex(this_1._data[index], this_1._idata[index])
                                .toString(precision);
                        }
                        if (k < d - 1) {
                            str += ',';
                        }
                    }
                    str += ']';
                    sarr.push(str);
                }
            }
            else {
                // outer dimensions, create array from inner dimension's arrays
                var sdarr = new Array(nelem);
                for (var j = 0; j < nelem; j++) {
                    sdarr[j] =
                        whitespace(i + 1) + '[\n' +
                            sarr.slice(j * d, (j + 1) * d).map(function (s) { return whitespace(i + 1) + s; }).join(',\n') + '\n' +
                            whitespace(i + 1) + ']';
                }
                sarr = sdarr;
            }
        };
        var this_1 = this;
        // iterate over dimensions from innermost to outermost
        for (var i = this._shape.length - 1; i >= 0; i--) {
            _loop_1(i);
        }
        return sarr[0];
    };
    NDArray.prototype.toHTML = function (precision) {
        if (precision === void 0) { precision = 4; }
        if (['i8', 'ui8', 'i16', 'ui16', 'i32', 'ui32'].indexOf(this._datatype) >= 0) {
            precision = 0;
        }
        var tagnames = ['table', 'tr', 'td'];
        if (this._shape.length <= 0) {
            return '<table></table>';
        }
        var sarr = [];
        var step = 1;
        // iterate over dimensions from innermost to outermost
        for (var i = this._shape.length - 1; i >= 0; i--) {
            // Step size in i'th dimension
            var d = this._shape[i];
            step = step * d;
            var tag = tagnames[(i + 1) % 3];
            var outertag = tagnames[(3 + i) % 3]; // adding 3 wraps around the mod range
            // number of elements in i'th dimension
            var nelem = this._size / step;
            if (i === this._shape.length - 1) {
                // innermost dimension, create array from all elements
                for (var j = 0; j < nelem; j++) {
                    var str = "<" + outertag + ">";
                    for (var k = 0; k < d; k++) {
                        var index = j * step + k;
                        str += "<" + tag + ">";
                        if (this._idata[index] === undefined) {
                            str += this._data[index].toFixed(precision);
                        }
                        else {
                            str += new complex_1.Complex(this._data[index], this._idata[index])
                                .toString(precision);
                        }
                        str += "</" + tag + ">";
                    }
                    str += "</" + outertag + ">";
                    sarr.push(str);
                }
            }
            else {
                // outer dimensions, create array from inner dimension's arrays
                var sdarr = new Array(nelem);
                for (var j = 0; j < nelem; j++) {
                    sdarr[j] = "<" + outertag + ">" +
                        sarr.slice(j * d, (j + 1) * d).join('') +
                        ("</" + outertag + ">");
                }
                sarr = sdarr;
            }
        }
        return sarr[0];
        //return '<table>'+sarr[0]+'</table>';
    };
    return NDArray;
}());
exports.NDArray = NDArray;
var Vec2 = (function (_super) {
    __extends(Vec2, _super);
    function Vec2(x, y) {
        return _super.call(this, [x, y]) || this;
    }
    return Vec2;
}(NDArray));
exports.Vec2 = Vec2;
var Vec3 = (function (_super) {
    __extends(Vec3, _super);
    function Vec3(x, y, z) {
        return _super.call(this, [x, y, z]) || this;
    }
    return Vec3;
}(NDArray));
exports.Vec3 = Vec3;
