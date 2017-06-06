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
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils");
var constants_1 = require("../constants");
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
var NDArray = (function () {
    function NDArray(arg0, arg1) {
        this.size = 0;
        this.datatype = 'f32';
        if (Array.isArray(arg0)) {
            this.shape = deduceShape(arg0);
            this._calcSize();
            if (arg1 && arg1.datatype) {
                this.datatype = arg1.datatype;
            }
            this._alloc(this.size, arg0, this.datatype);
        }
        else if (ArrayBuffer.isView(arg0)) {
            this._data = arg0;
            if (arg1 && arg1.shape) {
                this.shape = arg1.shape;
            }
            else {
                this.shape = [arg0.length];
            }
            // in this case options.datatype is ignored if supplied
            this.datatype = deduceNumberType(arg0);
            this._calcSize();
        }
        else {
            var options = arg0;
            if (options.datatype) {
                this.datatype = options.datatype;
            }
            if (options.shape) {
                this.shape = options.shape;
                this._calcSize();
                this._alloc(this.size, undefined, this.datatype);
                if (options.fill) {
                    this._data.fill(options.fill);
                }
            }
        }
    }
    Object.defineProperty(NDArray.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    NDArray.prototype.reshape = function (shape) {
        this.shape = shape;
        var oldsize = this.size;
        this._calcSize();
        if (this.size > oldsize) {
            // Rellocate a buffer of bigger size, copy old data to it
            this._alloc(this.size, this._data, this.datatype);
            // Fill the excess elements in new buffer with 0
            this._data.fill(0, oldsize);
        }
    };
    NDArray.prototype.clone = function () {
        var data;
        switch (this.datatype) {
            case 'i8':
                data = new Int8Array(this._data);
                break;
            case 'ui8':
                data = new Uint8Array(this._data);
                break;
            case 'i16':
                data = new Int16Array(this._data);
                break;
            case 'ui16':
                data = new Uint16Array(this._data);
                break;
            case 'i32':
                data = new Int32Array(this._data);
                break;
            case 'ui32':
                data = new Uint32Array(this._data);
                break;
            case 'f32':
                data = new Float32Array(this._data);
                break;
            case 'f64':
                data = new Float64Array(this._data);
                break;
            default:
                throw new Error('Unknown datatype');
        }
        return new NDArray(data, { shape: this.shape.slice() });
    };
    NDArray.prototype._calcSize = function () {
        this.size = this.shape.reduce(function (prev, cur) { return prev * cur; }, 1);
    };
    NDArray.prototype._alloc = function (size, data, datatype) {
        switch (datatype) {
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
            default:
                throw new Error('Unknown datatype');
        }
        if (Array.isArray(data)) {
            populateFromArray(this._data, 0, data);
        }
        else if (ArrayBuffer.isView(data)) {
            this._data.set(data);
        }
    };
    NDArray.prototype._getAddress = function () {
        var indices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indices[_i] = arguments[_i];
        }
        if (indices.length !== this.shape.length) {
            throw new Error('Mismatched number of dimensions');
        }
        var addr = 0;
        for (var i = 0; i < this.shape.length; i++) {
            if (i < this.shape.length - 1) {
                addr += this.shape[i + 1] * indices[i];
            }
            else {
                if (indices[i] < 0) {
                    throw new Error('Invalid index ' + indices[i]);
                }
                if (indices[i] >= this.shape[i]) {
                    throw new Error('Index out of bounds ' + indices[i]);
                }
                addr += indices[i];
            }
        }
        return addr;
    };
    NDArray.prototype.dataIndexToIndex = function (di) {
        if (di >= this.size) {
            throw new Error("Data index out of range");
        }
        var index = new Array(this.shape.length);
        for (var i = this.shape.length - 1; i >= 0; i--) {
            var d = this.shape[i];
            index[i] = di % d;
            di = Math.floor(di / d);
        }
        return index;
    };
    NDArray.prototype.toArray = function () {
        if (this.shape.length <= 0) {
            throw new Error('Zero shape');
        }
        var aarr = [];
        var step = 1;
        for (var i = this.shape.length - 1; i >= 0; i--) {
            var d = this.shape[i];
            step = step * d;
            var nelem = this.size / step;
            if (i === this.shape.length - 1) {
                for (var j = 0; j < nelem; j++) {
                    var arr = new Array(step);
                    for (var k = 0; k < d; k++) {
                        arr[k] = this._data[j * step + k];
                    }
                    aarr.push(arr);
                }
            }
            else {
                var darr = new Array(nelem);
                for (var j = 0; j < nelem; j++) {
                    darr[j] = aarr.slice(j * d, (j + 1) * d);
                }
                aarr = darr;
            }
        }
        return aarr[0];
    };
    NDArray.prototype.fill = function (value) {
        this._data.fill(value);
    };
    NDArray.prototype.get = function () {
        var indices = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            indices[_i] = arguments[_i];
        }
        var addr = this._getAddress.apply(this, indices);
        return this._data[addr];
    };
    NDArray.prototype.set = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var nargs = args.length;
        var addr = this._getAddress.apply(this, (args.slice(0, nargs - 1)));
        this._data[addr] = args[nargs - 1];
    };
    NDArray.prototype.swaprows = function (i, j) {
        if (this.shape.length !== 2) {
            throw new Error('This NDArray is not a Matrix (2D)');
        }
        if (i === j) {
            return; // No need to swap
        }
        var nrows = this.shape[0];
        var ncols = this.shape[1];
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
    NDArray.prototype.datacompare = function (otherdata, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        for (var i = 0; i < this._data.length; i++) {
            if (!utils_1.isequal(this._data[i], otherdata[i], tolerance)) {
                return false;
            }
        }
        return true;
    };
    NDArray.prototype.isEqual = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        if (this.shape.length !== other.shape.length) {
            return false;
        }
        for (var i = 0; i < this.shape.length; i++) {
            if (this.shape[i] !== other.shape[i]) {
                return false;
            }
        }
        return other.datacompare(this._data, tolerance);
    };
    NDArray.prototype.swapOrder = function () {
        if (this.shape.length !== 2) {
            throw new Error('swapOrder is not defined for ndarrays other than dim 2');
        }
        for (var i = 0; i < this.shape[0]; i++) {
            for (var j = 0; j < this.shape[1]; j++) {
                if (i > j) {
                    var tmp = this.get(i, j);
                    this.set(i, j, this.get(j, i));
                    this.set(j, i, tmp);
                }
            }
        }
    };
    NDArray.prototype.toString = function () {
        return JSON.stringify(this.toArray(), null, 2);
    };
    return NDArray;
}());
exports.default = NDArray;
