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
var constants_1 = require("./constants");
var ops_1 = require("./ops");
var Complex = (function () {
    function Complex(real, imag) {
        this.real = real || 0;
        this.imag = imag || 0;
    }
    Complex.prototype.clone = function () {
        return new Complex(this.real, this.imag);
    };
    Complex.prototype.inverse = function () {
        // 1/Complex number is converted to a usable complex number by
        // multiplying both numerator and denominator by complex conjugate
        // of the original number (rationalizing the denominator)
        var r = this.real;
        var i = this.imag;
        var den = r * r + i * i;
        return new Complex(r / den, -i / den);
    };
    Complex.prototype.isEqual = function (other, tolerance) {
        if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
        return ops_1.isequal(this.real, other.real, tolerance) &&
            ops_1.isequal(this.imag, other.imag, tolerance);
    };
    Complex.prototype.toString = function (precision) {
        if (precision === void 0) { precision = 4; }
        var sign = (this.imag >= 0) ? '+' : '-';
        return "(" + this.real.toFixed(precision) +
            ("" + sign + Math.abs(this.imag).toFixed(precision) + "i)");
    };
    return Complex;
}());
exports.Complex = Complex;
