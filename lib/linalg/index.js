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
exports.matmul = ops_1.matmul;
exports.norm = ops_1.norm;
exports.solve = ops_1.solve;
exports.cholesky = ops_1.cholesky;
exports.inner = ops_1.inner;
exports.outer = ops_1.outer;
exports.svd = ops_1.svd;
exports.rank = ops_1.rank;
exports.lstsq = ops_1.lstsq;
exports.lu_custom = ops_1.lu_custom;
exports.slogdet = ops_1.slogdet;
exports.det = ops_1.det;
exports.inv = ops_1.inv;
exports.qr = ops_1.qr;
exports.triu = ops_1.triu;
exports.tril = ops_1.tril;
exports.eig = ops_1.eig;
var lapack = require("./lapack");
exports.lapack = lapack;
