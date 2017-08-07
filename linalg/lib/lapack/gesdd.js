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
function gesdd_internal(mA, m, n, mU, mS, mVT, job, numtype) {
    var fn = (numtype === 'f32') ? common_1.sgesdd_wrap : common_1.dgesdd_wrap;
    var pjobz = common_1.defineEmVariable('i8', job.charCodeAt(0));
    var pm = common_1.defineEmVariable('i32', m);
    var pn = common_1.defineEmVariable('i32', n);
    var plda = common_1.defineEmVariable('i32', Math.max(m, 1));
    var pldu = common_1.defineEmVariable('i32', Math.max(m, 1));
    var pldvt = common_1.defineEmVariable('i32', n);
    var plwork = common_1.defineEmVariable('i32', -1);
    var _a = common_1.defineEmArrayVariable(numtype, m * n, mA), pA = _a[0], A = _a[1];
    var _b = common_1.defineEmArrayVariable(numtype, Math.min(m, n)), pS = _b[0], S = _b[1];
    var _c = common_1.defineEmArrayVariable(numtype, m * n), pU = _c[0], U = _c[1];
    var _d = common_1.defineEmArrayVariable(numtype, n * n), pVT = _d[0], VT = _d[1];
    var piwork = common_1.defineEmArrayVariable('i32', 8 * Math.min(m, n))[0];
    var pwork = common_1.defineEmArrayVariable(numtype, 1)[0];
    var pinfo = common_1.defineEmVariable('i32');
    // work size query
    fn(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt, pwork, plwork, piwork, pinfo);
    var worksize = em.getValue(pwork, numtype === 'f32' ? 'float' : 'double');
    pwork = common_1.defineEmArrayVariable(numtype, worksize)[0];
    em.setValue(plwork, worksize, 'i32');
    fn(pjobz, pm, pn, pA, plda, pS, pU, pldu, pVT, pldvt, pwork, plwork, piwork, pinfo);
    var info = em.getValue(pinfo, 'i32');
    if (info < 0) {
        throw new Error('Invalid argument (' + (-info) + ')');
    }
    if (info > 0) {
        throw new Error('DBDSDC did not converge (' + info + ')');
    }
    mA.set(A);
    mS.set(S);
    if (job !== 'N') {
        mU.set(U);
        mVT.set(VT);
    }
}
/**
 * @hidden
 */
function gesdd(mA, m, n, mU, mS, mVT, job) {
    if (mA instanceof Float64Array ||
        mU instanceof Float64Array ||
        mVT instanceof Float64Array) {
        return gesdd_internal(mA, m, n, mU, mS, mVT, job, 'f64');
    }
    else {
        return gesdd_internal(mA, m, n, mU, mS, mVT, job, 'f32');
    }
}
exports.gesdd = gesdd;
