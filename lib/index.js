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
var ops_1 = require("./ops");
exports.eye = ops_1.eye;
exports.zeros = ops_1.zeros;
exports.range = ops_1.range;
exports.iszero = ops_1.iszero;
exports.isequal = ops_1.isequal;
exports.torad = ops_1.torad;
exports.todeg = ops_1.todeg;
exports.add = ops_1.add;
exports.mul = ops_1.mul;
exports.sub = ops_1.sub;
exports.div = ops_1.div;
var linalg = require("./linalg");
exports.linalg = linalg;
var constants_1 = require("./constants");
exports.EPSILON = constants_1.EPSILON;
var basic_1 = require("./basic");
exports.NDArray = basic_1.NDArray;
exports.Matrix = basic_1.Matrix;
exports.Vector = basic_1.Vector;
exports.Vector2 = basic_1.Vector2;
exports.Vector3 = basic_1.Vector3;
exports.Complex = basic_1.Complex;
exports.PermutationVector = basic_1.PermutationVector;
exports.BandMatrix = basic_1.BandMatrix;
exports.version = '0.2.13'; // TODO: populate from package.json
