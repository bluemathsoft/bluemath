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
var vector_1 = require("./vector");
var __1 = require("..");
var constants_1 = require("../constants");
var Matrix = (function () {
    // private _LU : Matrix;
    // private _permutation : Vector;
    // private _luindx : Array<number>;
    /**
     * If arg0 is 2D array, all its rows should be the same length.
     * Let length of first row is assumed to be the number of columns.
     * `data` is assigned to the internal _data variable by reference,
     * i.e. it's not deep copied
     */
    function Matrix(arg0, datatype) {
        this.datatype = datatype || 'float32';
        if (Array.isArray(arg0)) {
            this._rows = arg0.length;
            console.assert(Array.isArray(arg0[0]));
            this._cols = arg0[0].length;
            this._alloc(arg0);
        }
        else {
            this._rows = arg0.rows;
            this._cols = arg0.cols;
            this._alloc(arg0.data);
        }
    }
    Object.defineProperty(Matrix.prototype, "rows", {
        get: function () {
            return this._rows;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "cols", {
        get: function () {
            return this._cols;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "size", {
        get: function () {
            return this._data.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Matrix.identity = function (size, datatype) {
        var m = new Matrix({ rows: size, cols: size }, datatype);
        m.fill(0);
        for (var i = 0; i < size; i++) {
            m.set(i, i, 1);
        }
        return m;
    };
    Matrix.prototype._alloc = function (data) {
        var size = this._rows * this._cols;
        switch (this.datatype) {
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
        if (data) {
            if (Array.isArray(data)) {
                for (var i = 0; i < this._rows; i++) {
                    for (var j = 0; j < this._cols; j++) {
                        this._data[this._getAddress(i, j)] = data[i][j];
                    }
                }
            }
            else if (ArrayBuffer.isView(data)) {
                if (size !== data.length) {
                    throw new Error("Mismatch between data size and input dimensions");
                }
                this._data = data;
            }
            else {
                throw new Error("Unexpected data format");
            }
        }
    };
    Matrix.prototype.swaprows = function (i, j) {
        if (i >= this.rows || j >= this.rows) {
            throw new Error("Index out of range");
        }
        for (var k = 0; k < this.cols; k++) {
            var tmp = this.get(i, k);
            this.set(i, k, this.get(j, k));
            this.set(j, k, tmp);
        }
    };
    Matrix.prototype.clone = function () {
        var datacopy;
        switch (this.datatype) {
            case 'int8':
                datacopy = Int8Array.from(this._data);
                break;
            case 'uint8':
                datacopy = Uint8Array.from(this._data);
                break;
            case 'int16':
                datacopy = Int16Array.from(this._data);
                break;
            case 'uint16':
                datacopy = Uint16Array.from(this._data);
                break;
            case 'int32':
                datacopy = Int32Array.from(this._data);
                break;
            case 'uint32':
                datacopy = Uint32Array.from(this._data);
                break;
            case 'float32':
                datacopy = Float32Array.from(this._data);
                break;
            case 'float64':
                datacopy = Float64Array.from(this._data);
                break;
            default:
                throw new Error("Unknown datatype");
        }
        return new Matrix({ rows: this._rows, cols: this._cols, data: datacopy });
    };
    /**
     * Assign value to all items in the matrix
     */
    Matrix.prototype.fill = function (value) {
        this._data.fill(value);
    };
    Matrix.prototype._getAddress = function (row, col) {
        return row * this._cols + col;
    };
    Matrix.prototype.get = function (row, col) {
        var address = this._getAddress(row, col);
        return this._data[address];
    };
    Matrix.prototype.row = function (idx) {
        if (idx >= this.rows || idx < 0) {
            throw new Error('Row index out of range');
        }
        return new vector_1.default(this._data.slice(idx * this.cols, (idx + 1) * this.cols));
    };
    Matrix.prototype.col = function (idx) {
        if (idx >= this.cols || idx < 0) {
            throw new Error('Column index out of range');
        }
        var col = new vector_1.default(this.rows);
        for (var i = 0; i < this.rows; i++) {
            col.set(i, this.get(i, idx));
        }
        return col;
    };
    Matrix.prototype.set = function (row, col, value) {
        var address = this._getAddress(row, col);
        this._data[address] = value;
    };
    Matrix.prototype.scale = function (k) {
        for (var i = 0; i < this._data.length; i++) {
            this._data[i] *= k;
        }
    };
    Matrix.prototype.mul = function (other) {
        if (other instanceof Matrix) {
            var A = this;
            var B = other;
            if (A._cols !== B._rows) {
                throw new Error("Incompatible dimensions for multiplication");
            }
            var result = new Matrix({ rows: A._rows, cols: B._cols }, A.datatype);
            for (var i = 0; i < A._rows; i++) {
                for (var j = 0; j < B._cols; j++) {
                    var value = 0.0;
                    for (var k = 0; k < A._cols; k++) {
                        value += A.get(i, k) * B.get(k, j);
                    }
                    result.set(i, j, value);
                }
            }
            return result;
        }
        else {
            // A vector is nx1 matrix
            // Therefore for multiplication to be possible, this matrix should
            // be 1xn matrix
            if (this.rows !== 1 || this.cols !== other.size()) {
                throw new Error("Incompatible dimensions for multiplication");
            }
            var result = 0.0;
            for (var i = 0; i < this.cols; i++) {
                result += this.get(0, i) * other.get(i);
            }
            return result;
        }
    };
    /**
     * This matrix remains unchanged
     */
    Matrix.prototype.transpose = function () {
        var xpose = new Matrix({ rows: this.cols, cols: this.rows });
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                xpose.set(j, i, this.get(i, j));
            }
        }
        return xpose;
    };
    Matrix.prototype.isEqual = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        if (this.rows !== other.rows) {
            return false;
        }
        if (this.cols !== other.cols) {
            return false;
        }
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (!__1.utils.isEqualFloat(this.get(i, j), other.get(i, j), tolerance)) {
                    return false;
                }
            }
        }
        return true;
    };
    Matrix.prototype.toArray = function () {
        var arr = [];
        for (var i = 0; i < this.rows; i++) {
            arr[i] = [];
            for (var j = 0; j < this.cols; j++) {
                arr[i][j] = this.get(i, j);
            }
        }
        return arr;
    };
    Matrix.prototype.toString = function () {
        var s = '';
        for (var i = 0; i < this.rows; i++) {
            s += '[ ';
            for (var j = 0; j < this.cols; j++) {
                s += this.get(i, j).toFixed(2);
                if (j < this.cols - 1) {
                    s += ', ';
                }
            }
            s += ' ]\n';
        }
        return s;
    };
    /*
    Ref: Golub-Loan 3.1.1
    System of equations that forms lower triangular system can be solved by
    forward substitution.
      [ l00  0  ] [x0]  = [b0]
      [ l10 l11 ] [x1]    [b1]
    Caller must ensure this matrix is Lower triangular before calling this
    routine. Otherwise, undefined behavior
     */
    Matrix.prototype.solveByForwardSubstitution = function (x) {
        for (var i = 0; i < this.rows; i++) {
            var sum = 0;
            for (var j = 0; j < i; j++) {
                sum += x.get(j) * this.get(i, j);
            }
            x.set(i, (x.get(i) - sum) / this.get(i, i));
        }
    };
    /*
    System of equations that forms upper triangular system can be solved by
    backward substitution.
      [ u00 u01 ] [x0]  = [b0]
      [ 0   u11 ] [x1]    [b1]
    Caller must ensure this matrix is Upper triangular before calling this
    routine. Otherwise, undefined behavior
    */
    Matrix.prototype.solveByBackwardSubstitution = function (x) {
        for (var i = this.rows - 1; i >= 0; i--) {
            var sum = 0;
            for (var j = this.cols - 1; j > i; j--) {
                sum += x.get(j) * this.get(i, j);
            }
            x.set(i, (x.get(i) - sum) / this.get(i, i));
        }
    };
    /**
     * Algo 3.2.1 Golub and Loan
     */
    Matrix.prototype.LUDecompose = function () {
        console.assert(this.rows === this.cols);
        var n = this.rows;
        for (var k = 0; k < n - 1; k++) {
            for (var t = k + 1; t < n; t++) {
                this.set(t, k, this.get(t, k) / this.get(k, k));
            }
            for (var i = k + 1; i < n; i++) {
                for (var j = k + 1; j < n; j++) {
                    this.set(i, j, this.get(i, j) - this.get(i, k) * this.get(k, j));
                }
            }
        }
    };
    return Matrix;
}());
exports.default = Matrix;
