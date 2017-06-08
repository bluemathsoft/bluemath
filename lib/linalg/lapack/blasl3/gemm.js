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
var lapacklite = require("../../../../ext/lapacklite");
var em = lapacklite.Module;
var common_1 = require("../common");
/**
 * @hidden
 */
function sgemm(mA, mB, mC, m, n, k, alpha, beta) {
    var ptransa = em._malloc(common_1.SIZE_CHAR);
    var ptransb = em._malloc(common_1.SIZE_CHAR);
    var pm = em._malloc(common_1.SIZE_INT);
    var pn = em._malloc(common_1.SIZE_INT);
    var pk = em._malloc(common_1.SIZE_INT);
    var palpha = em._malloc(common_1.SIZE_SINGLE);
    var pbeta = em._malloc(common_1.SIZE_SINGLE);
    var pA = em._malloc(m * k * common_1.SIZE_SINGLE);
    var pB = em._malloc(k * n * common_1.SIZE_SINGLE);
    var pC = em._malloc(m * n * common_1.SIZE_SINGLE);
    var plda = em._malloc(common_1.SIZE_INT);
    var pldb = em._malloc(common_1.SIZE_INT);
    var pldc = em._malloc(common_1.SIZE_INT);
    em.setValue(ptransa, 'N'.charCodeAt(0), 'i8');
    em.setValue(ptransb, 'N'.charCodeAt(0), 'i8');
    em.setValue(pm, m, 'i32');
    em.setValue(pn, n, 'i32');
    em.setValue(pk, k, 'i32');
    em.setValue(palpha, alpha, 'float');
    em.setValue(pbeta, beta, 'float');
    em.setValue(plda, m, 'i32');
    em.setValue(pldb, k, 'i32');
    em.setValue(pldc, m, 'i32');
    var a = new Float32Array(em.HEAPF32.buffer, pA, m * k);
    var b = new Float32Array(em.HEAPF32.buffer, pB, k * n);
    var c = new Float32Array(em.HEAPF32.buffer, pC, m * n);
    a.set(mA);
    b.set(mB);
    c.set(mC);
    common_1.sgemm_wrap(ptransa, ptransb, pm, pn, pk, palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
    mC.set(c);
}
/**
 * @hidden
 */
function dgemm(mA, mB, mC, m, n, k, alpha, beta) {
    var ptransa = em._malloc(common_1.SIZE_CHAR);
    var ptransb = em._malloc(common_1.SIZE_CHAR);
    var pm = em._malloc(common_1.SIZE_INT);
    var pn = em._malloc(common_1.SIZE_INT);
    var pk = em._malloc(common_1.SIZE_INT);
    var palpha = em._malloc(common_1.SIZE_DOUBLE);
    var pbeta = em._malloc(common_1.SIZE_DOUBLE);
    var pA = em._malloc(m * k * common_1.SIZE_DOUBLE);
    var pB = em._malloc(k * n * common_1.SIZE_DOUBLE);
    var pC = em._malloc(m * n * common_1.SIZE_DOUBLE);
    var plda = em._malloc(common_1.SIZE_INT);
    var pldb = em._malloc(common_1.SIZE_INT);
    var pldc = em._malloc(common_1.SIZE_INT);
    em.setValue(ptransa, 'N'.charCodeAt(0), 'i8');
    em.setValue(ptransb, 'N'.charCodeAt(0), 'i8');
    em.setValue(pm, m, 'i32');
    em.setValue(pn, n, 'i32');
    em.setValue(pk, k, 'i32');
    em.setValue(palpha, alpha, 'double');
    em.setValue(pbeta, beta, 'double');
    em.setValue(plda, m, 'i32');
    em.setValue(pldb, k, 'i32');
    em.setValue(pldc, m, 'i32');
    var a = new Float64Array(em.HEAPF64.buffer, pA, m * k);
    var b = new Float64Array(em.HEAPF64.buffer, pB, k * n);
    var c = new Float64Array(em.HEAPF64.buffer, pC, m * n);
    a.set(mA);
    b.set(mB);
    c.set(mC);
    common_1.dgemm_wrap(ptransa, ptransb, pm, pn, pk, palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
    mC.set(c);
}
/**
 * @hidden
 */
function gemm(mA, mB, mC, m, n, k, alpha, beta) {
    if (mA instanceof Float64Array ||
        mB instanceof Float64Array ||
        mC instanceof Float64Array) {
        dgemm(mA, mB, mC, m, n, k, alpha, beta);
    }
    else {
        sgemm(mA, mB, mC, m, n, k, alpha, beta);
    }
}
exports.gemm = gemm;
