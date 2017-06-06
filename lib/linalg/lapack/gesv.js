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
var lapacklite_1 = require("../../../ext/lapacklite");
var em = lapacklite_1.default;
var common_1 = require("./common");
/**
 * @hidden
 */
function sgesv(mA, mB, n, nrhs) {
    var pn = em._malloc(common_1.SIZE_INT);
    var pnrhs = em._malloc(common_1.SIZE_INT);
    var pinfo = em._malloc(common_1.SIZE_INT);
    var plda = em._malloc(common_1.SIZE_INT);
    var pldb = em._malloc(common_1.SIZE_INT);
    var pA = em._malloc(n * n * common_1.SIZE_SINGLE);
    var pB = em._malloc(n * nrhs * common_1.SIZE_SINGLE);
    var pIPIV = em._malloc(n * common_1.SIZE_INT);
    em.setValue(pn, n, 'i32');
    em.setValue(pnrhs, nrhs, 'i32');
    em.setValue(plda, n, 'i32');
    em.setValue(pldb, n, 'i32');
    var A = new Float32Array(em.HEAPF32.buffer, pA, n * n);
    var B = new Float32Array(em.HEAPF32.buffer, pB, n * nrhs);
    var IPIV = new Int32Array(em.HEAP32.buffer, pIPIV, n);
    A.set(mA);
    B.set(mB);
    common_1.sgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);
    mA.set(A);
    mB.set(B);
    return IPIV;
}
/**
 * @hidden
 */
function dgesv(mA, mB, n, nrhs) {
    var pn = em._malloc(common_1.SIZE_INT);
    var pnrhs = em._malloc(common_1.SIZE_INT);
    var pinfo = em._malloc(common_1.SIZE_INT);
    var plda = em._malloc(common_1.SIZE_INT);
    var pldb = em._malloc(common_1.SIZE_INT);
    var pA = em._malloc(n * n * common_1.SIZE_DOUBLE);
    var pB = em._malloc(n * nrhs * common_1.SIZE_DOUBLE);
    var pIPIV = em._malloc(n * common_1.SIZE_INT);
    em.setValue(pn, n, 'i32');
    em.setValue(pnrhs, nrhs, 'i32');
    em.setValue(plda, n, 'i32');
    em.setValue(pldb, n, 'i32');
    var A = new Float64Array(em.HEAPF64.buffer, pA, n * n);
    var B = new Float64Array(em.HEAPF64.buffer, pB, n * nrhs);
    var IPIV = new Int32Array(em.HEAP32.buffer, pIPIV, n);
    A.set(mA);
    B.set(mB);
    common_1.dgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);
    mA.set(A);
    mB.set(B);
    return IPIV;
}
/**
 * @hidden
 */
function gesv(mA, mB, n, nrhs) {
    if (mA instanceof Float64Array || mB instanceof Float64Array) {
        return dgesv(mA, mB, n, nrhs);
    }
    else {
        return sgesv(mA, mB, n, nrhs);
    }
}
exports.gesv = gesv;
