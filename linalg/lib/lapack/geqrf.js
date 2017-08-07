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
var lapacklite = require("../../ext/lapacklite");
var em = lapacklite.Module;
var common_1 = require("./common");
/**
 * @hidden
 */
function geqrf_internal(mA, m, n, mTau, numtype) {
    var fn = numtype === 'f32' ? common_1.sgeqrf_wrap : common_1.dgeqrf_wrap;
    var lda = Math.max(1, m);
    var pm = common_1.defineEmVariable('i32', m);
    var pn = common_1.defineEmVariable('i32', n);
    var plda = common_1.defineEmVariable('i32', lda);
    var plwork = common_1.defineEmVariable('i32', -1);
    var pinfo = common_1.defineEmVariable('i32');
    var _a = common_1.defineEmArrayVariable(numtype, m * n, mA), pA = _a[0], A = _a[1];
    var _b = common_1.defineEmArrayVariable(numtype, Math.min(m, n)), ptau = _b[0], tau = _b[1];
    var pwork = common_1.defineEmArrayVariable(numtype, 1)[0];
    // work size query
    fn(pm, pn, pA, plda, ptau, pwork, plwork, pinfo);
    var worksize = em.getValue(pwork, numtype === 'f32' ? 'float' : 'double');
    pwork = common_1.defineEmArrayVariable(numtype, worksize)[0];
    em.setValue(plwork, worksize, 'i32');
    fn(pm, pn, pA, plda, ptau, pwork, plwork, pinfo);
    var info = em.getValue(pinfo, 'i32');
    if (info < 0) {
        throw new Error('Invalid argument (' + (-info) + ')');
    }
    mA.set(A);
    mTau.set(tau);
}
/**
 * @hidden
 */
function geqrf(mA, m, n, mTau) {
    if (mA instanceof Float64Array) {
        geqrf_internal(mA, m, n, mTau, 'f64');
    }
    else {
        geqrf_internal(mA, m, n, mTau, 'f32');
    }
}
exports.geqrf = geqrf;
