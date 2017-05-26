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
var vector_1 = require("./vector");
/**
 * 2D Vector
 */
var Vector2 = (function (_super) {
    __extends(Vector2, _super);
    function Vector2(x, y) {
        if (x === void 0) { x = 0.0; }
        if (y === void 0) { y = 0.0; }
        return _super.call(this, [x, y]) || this;
    }
    Object.defineProperty(Vector2.prototype, "x", {
        get: function () {
            return this._data[0];
        },
        set: function (newx) {
            this._data[0] = newx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "y", {
        get: function () {
            return this._data[1];
        },
        set: function (newy) {
            this._data[1] = newy;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Cross product with other vector
     */
    Vector2.prototype.cross = function (other) {
        return this.x * other.y - this.y * other.x;
    };
    /**
     * Vector orthogonal to this vector
     */
    Vector2.prototype.orthogonal = function () {
        return new Vector2(this.y, -this.x);
    };
    return Vector2;
}(vector_1.default));
exports.default = Vector2;
