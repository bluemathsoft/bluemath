"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var constants_1 = require("./constants");
/**
 * @hidden
 * Convert angle to degrees
 */
function toDeg(angleInRadians) {
    return 180 * angleInRadians / Math.PI;
}
exports.toDeg = toDeg;
/**
 * @hidden
 * Convert angle to radians
 */
function toRad(angleInDegrees) {
    return Math.PI * angleInDegrees / 180;
}
exports.toRad = toRad;
/**
 * Check if input equals zero within given tolerance
 */
function iszero(x, tolerance) {
    if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
    return Math.abs(x) < tolerance;
}
exports.iszero = iszero;
/**
 * Check if two input numbers are equal within given tolerance
 */
function isequal(a, b, tolerance) {
    if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
    return iszero(a - b, tolerance);
}
exports.isequal = isequal;
/**
 * @hidden
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
function cuberoot(x) {
    return x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
}
exports.cuberoot = cuberoot;
