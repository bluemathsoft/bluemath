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
function sgemv(alpha, mA, m, n, vx, vy, beta) {
    if (vx.length !== n) {
        throw new Error('Length of x doesn\'t match num columns of A');
    }
    if (vy.length !== m) {
        throw new Error('Length of y doesn\'t match num rows of A');
    }
    var ptrans = em._malloc(common_1.SIZE_CHAR);
    var pm = em._malloc(common_1.SIZE_INT);
    var pn = em._malloc(common_1.SIZE_INT);
    var plda = em._malloc(common_1.SIZE_INT);
    var pincx = em._malloc(common_1.SIZE_INT);
    var pincy = em._malloc(common_1.SIZE_INT);
    var palpha = em._malloc(common_1.SIZE_SINGLE);
    var pbeta = em._malloc(common_1.SIZE_SINGLE);
    var pA = em._malloc(m * n * common_1.SIZE_SINGLE);
    var px = em._malloc(n * common_1.SIZE_SINGLE);
    var py = em._malloc(m * common_1.SIZE_SINGLE);
    em.setValue(ptrans, 'N'.charCodeAt(0), 'i8');
    em.setValue(pm, m, 'i32');
    em.setValue(pn, n, 'i32');
    em.setValue(plda, m, 'i32');
    em.setValue(pincx, 1, 'i32');
    em.setValue(pincy, 1, 'i32');
    em.setValue(palpha, alpha, 'float');
    em.setValue(pbeta, beta, 'float');
    var A = new Float32Array(em.HEAPF32.buffer, pA, m * n);
    var x = new Float32Array(em.HEAPF32.buffer, px, n);
    var y = new Float32Array(em.HEAPF32.buffer, py, m);
    A.set(mA);
    x.set(vx);
    y.set(vy);
    common_1.sgemv_wrap(ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy);
    vy.set(y);
}
/**
 * @hidden
 */
function dgemv(alpha, mA, m, n, vx, vy, beta) {
    if (vx.length !== n) {
        throw new Error('Length of x doesn\'t match num columns of A');
    }
    if (vy.length !== m) {
        throw new Error('Length of y doesn\'t match num rows of A');
    }
    var ptrans = em._malloc(common_1.SIZE_CHAR);
    var pm = em._malloc(common_1.SIZE_INT);
    var pn = em._malloc(common_1.SIZE_INT);
    var plda = em._malloc(common_1.SIZE_INT);
    var pincx = em._malloc(common_1.SIZE_INT);
    var pincy = em._malloc(common_1.SIZE_INT);
    var palpha = em._malloc(common_1.SIZE_DOUBLE);
    var pbeta = em._malloc(common_1.SIZE_DOUBLE);
    var pA = em._malloc(m * n * common_1.SIZE_DOUBLE);
    var px = em._malloc(n * common_1.SIZE_DOUBLE);
    var py = em._malloc(m * common_1.SIZE_DOUBLE);
    em.setValue(ptrans, 'N'.charCodeAt(0), 'i8');
    em.setValue(pm, m, 'i32');
    em.setValue(pn, n, 'i32');
    em.setValue(plda, m, 'i32');
    em.setValue(pincx, 1, 'i32');
    em.setValue(pincy, 1, 'i32');
    em.setValue(palpha, alpha, 'double');
    em.setValue(pbeta, beta, 'double');
    var A = new Float64Array(em.HEAPF64.buffer, pA, m * n);
    var x = new Float64Array(em.HEAPF64.buffer, px, n);
    var y = new Float64Array(em.HEAPF64.buffer, py, m);
    A.set(mA);
    x.set(vx);
    y.set(vy);
    common_1.dgemv_wrap(ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy);
    vy.set(y);
}
/**
 * @hidden
 */
function gemv(alpha, mA, m, n, vx, vy, beta) {
    if (mA instanceof Float64Array ||
        vx instanceof Float64Array || vy instanceof Float64Array) {
        dgemv(alpha, mA, m, n, vx, vy, beta);
    }
    else {
        sgemv(alpha, mA, m, n, vx, vy, beta);
    }
}
exports.gemv = gemv;
