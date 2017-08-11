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
var ndarray_1 = require("./ndarray");
var AABB = (function () {
    function AABB(arg0, arg1) {
        var dim = 0;
        if (Array.isArray(arg0) || ArrayBuffer.isView(arg0)) {
            this._min = new ndarray_1.NDArray(arg0);
        }
        else {
            dim = arg0;
            this._min = new ndarray_1.NDArray({ shape: [dim] });
            this._min.fill(Infinity);
        }
        if (arg1 && (Array.isArray(arg1) || ArrayBuffer.isView(arg1))) {
            this._max = new ndarray_1.NDArray(arg1);
        }
        else {
            this._max = new ndarray_1.NDArray({ shape: [dim] });
            this._max.fill(-Infinity);
        }
    }
    Object.defineProperty(AABB.prototype, "min", {
        get: function () {
            return this._min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AABB.prototype, "max", {
        get: function () {
            return this._max;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Update this AABB to include given coordinate
     */
    AABB.prototype.update = function (coord) {
        if (coord instanceof ndarray_1.NDArray) {
            for (var i = 0; i < this._min.length; i++) {
                this._min.set(i, Math.min(this._min.get(i), coord.get(i)));
            }
            for (var i = 0; i < this._max.length; i++) {
                this._max.set(i, Math.max(this._max.get(i), coord.get(i)));
            }
        }
        else {
            for (var i = 0; i < this._min.length; i++) {
                this._min.set(i, Math.min(this._min.get(i), coord[i]));
            }
            for (var i = 0; i < this._max.length; i++) {
                this._max.set(i, Math.max(this._max.get(i), coord[i]));
            }
        }
    };
    AABB.prototype.merge = function (other) {
        for (var i = 0; i < this.min.length; i++) {
            this.min.set(i, Math.min(this.min.get(i), other.min.get(i)));
        }
        for (var i = 0; i < this.max.length; i++) {
            this.max.set(i, Math.max(this.max.get(i), other.max.get(i)));
        }
    };
    return AABB;
}());
exports.AABB = AABB;
