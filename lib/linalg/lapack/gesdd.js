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
// function sgesdd(mA:TypedArray, m:number, n:number) {
// }
/**
 * @hidden
 */
function dgesdd(mA, m, n) {
    var pjobz = em._malloc(common_1.SIZE_CHAR);
    var pm = em._malloc(common_1.SIZE_INT);
    var pn = em._malloc(common_1.SIZE_INT);
    var pA = em._malloc(m * n * common_1.SIZE_DOUBLE);
    var plda = em._malloc(common_1.SIZE_INT);
    var pS = em._malloc(Math.min(m, n) * common_1.SIZE_DOUBLE);
    var pU = em._malloc(1 * m * common_1.SIZE_DOUBLE);
    var pldu = em._malloc(common_1.SIZE_INT);
    var pVT = em._malloc(n * n * common_1.SIZE_DOUBLE);
    var pldvt = em._malloc(common_1.SIZE_INT);
    var piwork = em._malloc(8 * Math.min(m, n) * common_1.SIZE_DOUBLE);
    var pwork = em._malloc(1 * common_1.SIZE_DOUBLE);
    var pinfo = em._malloc(common_1.SIZE_INT);
    var plwork = em._malloc(common_1.SIZE_INT);
    em.setValue(pjobz, 'A'.charCodeAt(0), 'i8');
    em.setValue(pm, m, 'i32');
    em.setValue(pn, n, 'i32');
    em.setValue(plda, m, 'i32');
    em.setValue(pldu, n, 'i32');
    em.setValue(pldvt, n, 'i32');
    em.setValue(plwork, -1, 'i32');
    var a = new Float64Array(em.HEAPF64.buffer, pA, m * n);
    a.set(mA);
    common_1.dgesdd_wrap(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt, pwork, plwork, piwork, pinfo);
}
/**
 * @hidden
 */
function gesdd(mA, m, n) {
    if (mA instanceof Float64Array) {
        return dgesdd(mA, m, n);
    }
    else {
        //return sgesdd(mA,m,n);
    }
}
exports.gesdd = gesdd;
