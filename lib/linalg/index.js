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
var construction_1 = require("./construction");
exports.eye = construction_1.eye;
exports.zeros = construction_1.zeros;
var operations_1 = require("./operations");
exports.matmul = operations_1.matmul;
exports.norm = operations_1.norm;
exports.solve = operations_1.solve;
exports.cholesky = operations_1.cholesky;
exports.inner = operations_1.inner;
exports.outer = operations_1.outer;
var lapack = require("./lapack");
exports.lapack = lapack;
