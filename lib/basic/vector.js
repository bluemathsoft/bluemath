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
var __1 = require("..");
var constants_1 = require("../constants");
/**
 * @hidden
 */
var Vector = (function () {
    function Vector(data, datatype) {
        this.datatype = datatype || 'f32';
        if (ArrayBuffer.isView(data)) {
            this._data = data;
        }
        else if (Array.isArray(data)) {
            switch (this.datatype) {
                case 'i8':
                    this._data = new Int8Array(data);
                    break;
                case 'i16':
                    this._data = new Int16Array(data);
                    break;
                case 'i32':
                    this._data = new Int32Array(data);
                    break;
                case 'f32':
                    this._data = new Float32Array(data);
                    break;
                case 'f64':
                    this._data = new Float64Array(data);
                    break;
                default:
                    throw new Error("Unknown datatype");
            }
        }
        else {
            switch (this.datatype) {
                case 'i8':
                    this._data = new Int8Array(data);
                    break;
                case 'i16':
                    this._data = new Int16Array(data);
                    break;
                case 'i32':
                    this._data = new Int32Array(data);
                    break;
                case 'f32':
                    this._data = new Float32Array(data);
                    break;
                case 'f64':
                    this._data = new Float64Array(data);
                    break;
                default:
                    throw new Error("Unknown datatype");
            }
        }
    }
    Vector.prototype.get = function (i) {
        return this._data[i];
    };
    Vector.prototype.set = function (i, value) {
        this._data[i] = value;
    };
    Vector.prototype.size = function () {
        return this._data.length;
    };
    Vector.prototype.clone = function () {
        return new Vector(this._data.slice());
    };
    /**
     * Add other vector to this
     */
    Vector.prototype.add = function (other) {
        console.assert(this.size() === other.size());
        for (var i = 0; i < this._data.length; i++) {
            this._data[i] += other._data[i];
        }
        return this;
    };
    /**
     * Subtract other vector from this
     */
    Vector.prototype.sub = function (other) {
        console.assert(this.size() === other.size());
        for (var i = 0; i < this._data.length; i++) {
            this._data[i] -= other._data[i];
        }
        return this;
    };
    /**
     * Multiply by a constant
     */
    Vector.prototype.mul = function (k) {
        for (var i = 0; i < this._data.length; i++) {
            this._data[i] *= k;
        }
        return this;
    };
    /**
     * Square length of this vector
     */
    Vector.prototype.lenSq = function () {
        var s = 0;
        for (var i = 0; i < this._data.length; i++) {
            s += this._data[i] * this._data[i];
        }
        return s;
    };
    /**
     * Length of this vector
     */
    Vector.prototype.len = function () {
        return Math.sqrt(this.lenSq());
    };
    /**
     * Unit vector of this vector
     */
    Vector.prototype.unit = function () {
        var len = this.len();
        if (__1.iszero(len)) {
            var arr = new Array(this.size());
            for (var i = 0, l = this.size(); i < l; i++) {
                arr[i] = 0.0;
            }
            return new Vector(arr);
        }
        else {
            return this.clone().mul(1 / len);
        }
    };
    /**
     * Is this vector non-zero within given tolerance
     * (i.e. either of its members are greater than tolerance in magnitude)
     */
    Vector.prototype.isNonZero = function (tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        for (var i = 0; i < this._data.length; i++) {
            if (Math.abs(this._data[i]) > tolerance) {
                return true;
            }
        }
        return false;
    };
    /**
     * Is this vector zero within given tolerance
     * (i.e. All members are less than tolerance in magnitude)
     */
    Vector.prototype.isZero = function (tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        return !this.isNonZero(tolerance);
    };
    /**
     * Square distance to other vector
     */
    Vector.prototype.distSq = function (other) {
        console.assert(this.size() === other.size());
        return this.clone().sub(other).lenSq();
    };
    /**
     * Distance to other vector
     */
    Vector.prototype.dist = function (other) {
        return Math.sqrt(this.distSq(other));
    };
    /**
     * Dot product with other vector
     */
    Vector.prototype.dot = function (other) {
        var dot = 0.0;
        for (var i = 0; i < this._data.length; i++) {
            dot += this._data[i] * other._data[i];
        }
        return dot;
    };
    /**
     * Round to nearest integer, same rules as Math.round
     */
    Vector.prototype.round = function () {
        var v = new Int32Array(this.size());
        for (var i = 0; i < v.length; i++) {
            v[i] = Math.round(this._data[i]);
        }
        this._data = v;
        this.datatype = 'i32';
        return this;
    };
    /**
     * Is equal to other vector, within given tolerance
     */
    Vector.prototype.isEqual = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        for (var i = 0; i < this._data.length; i++) {
            if (!__1.isequal(this._data[i], other._data[i], tolerance)) {
                return false;
            }
        }
        return true;
    };
    Vector.prototype.swap = function (i, j) {
        if (i >= this._data.length || j >= this._data.length) {
            throw new Error('Index out of range');
        }
        var tmp = this._data[i];
        this._data[i] = this._data[j];
        this._data[j] = tmp;
    };
    /**
     * A[i] <- A[permutation[i]]
     */
    Vector.prototype.permute = function (permutation) {
        if (this._data.length !== permutation.size()) {
            throw new Error("Permutation size doesn't match Vector size");
        }
        // TODO : Inefficient implementation,
        // because it causes storage duplication
        var tmp = new Vector(this._data.length);
        for (var i = 0; i < this._data.length; i++) {
            tmp.set(i, this._data[permutation.get(i)]);
        }
        for (var i = 0; i < this._data.length; i++) {
            this._data[i] = tmp.get(i);
        }
    };
    /**
     */
    Vector.prototype.permuteInverse = function (permutation) {
        if (this._data.length !== permutation.size()) {
            throw new Error("Permutation size doesn't match Vector size");
        }
        // TODO : Inefficient implementation,
        // because it causes storage duplication
        var tmp = this.clone();
        for (var i = 0; i < this._data.length; i++) {
            this._data[permutation.get(i)] = tmp.get(i);
        }
    };
    /**
     * Return the min values for variable number of input point vectors
     * All points should be vectors of same size
     */
    Vector.low = function (points) {
        var lows = new Float32Array(points[0].size());
        lows.fill(Infinity);
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            for (var i = 0; i < point.size(); i++) {
                lows[i] = Math.min(point._data[i], lows[i]);
            }
        }
        return new Vector(lows, 'f32');
    };
    /**
     * Return the max values for variable number of input point vectors
     * All points should be vectors of same size
     */
    Vector.high = function (points) {
        var highs = new Float32Array(points[0].size());
        highs.fill(-Infinity);
        for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
            var point = points_2[_i];
            for (var i = 0; i < point.size(); i++) {
                highs[i] = Math.max(point._data[i], highs[i]);
            }
        }
        return new Vector(highs, 'f32');
    };
    /**
     * String representation
     */
    Vector.prototype.toString = function (precision) {
        if (precision === void 0) { precision = 2; }
        var s = [];
        for (var i = 0; i < this._data.length; i++) {
            s.push(this._data[i].toFixed(precision));
        }
        return '[' + s.join(',') + ']';
    };
    Vector.prototype.toArray = function () {
        var array = [];
        for (var i = 0; i < this._data.length; i++) {
            array.push(this._data[i]);
        }
        return array;
    };
    return Vector;
}());
exports.default = Vector;
