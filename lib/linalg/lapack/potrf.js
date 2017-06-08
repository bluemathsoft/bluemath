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
var lapacklite = require("../../../ext/lapacklite");
var em = lapacklite.Module;
var common_1 = require("./common");
/**
 * @hidden
 */
function spotrf(mA, n) {
    var puplo = em._malloc(common_1.SIZE_CHAR);
    var pn = em._malloc(common_1.SIZE_INT);
    var pA = em._malloc(n * n * common_1.SIZE_SINGLE);
    var plda = em._malloc(common_1.SIZE_INT);
    var pinfo = em._malloc(common_1.SIZE_INT);
    em.setValue(puplo, 'L'.charCodeAt(0), 'i8');
    em.setValue(pn, n, 'i32');
    em.setValue(plda, n, 'i32');
    var A = new Float32Array(em.HEAPF32.buffer, pA, n * n);
    A.set(mA);
    common_1.spotrf_wrap(puplo, pn, pA, plda, pinfo);
    mA.set(A);
}
/**
 * @hidden
 */
function dpotrf(mA, n) {
    var puplo = em._malloc(common_1.SIZE_CHAR);
    var pn = em._malloc(common_1.SIZE_INT);
    var pA = em._malloc(n * n * common_1.SIZE_DOUBLE);
    var plda = em._malloc(common_1.SIZE_INT);
    var pinfo = em._malloc(common_1.SIZE_INT);
    em.setValue(puplo, 'L'.charCodeAt(0), 'i8');
    em.setValue(pn, n, 'i32');
    em.setValue(plda, n, 'i32');
    var A = new Float64Array(em.HEAPF64.buffer, pA, n * n);
    A.set(mA);
    common_1.dpotrf_wrap(puplo, pn, pA, plda, pinfo);
    mA.set(A);
}
/**
 * @hidden
 */
function potrf(mA, n) {
    if (mA instanceof Float64Array) {
        return dpotrf(mA, n);
    }
    else {
        return spotrf(mA, n);
    }
}
exports.potrf = potrf;
