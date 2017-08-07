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
var common_1 = require("@bluemath/common");
exports.eye = common_1.eye;
exports.zeros = common_1.zeros;
exports.empty = common_1.empty;
exports.range = common_1.range;
exports.iszero = common_1.iszero;
exports.isequal = common_1.isequal;
exports.torad = common_1.torad;
exports.todeg = common_1.todeg;
exports.add = common_1.add;
exports.mul = common_1.mul;
exports.sub = common_1.sub;
exports.div = common_1.div;
exports.count = common_1.count;
exports.NDArray = common_1.NDArray;
exports.Complex = common_1.Complex;
exports.EPSILON = common_1.EPSILON;
var linalg = require("@bluemath/linalg");
exports.linalg = linalg;
var geom = require("@bluemath/geom");
exports.geom = geom;
exports.version = '0.2.13'; // TODO: populate from package.json
