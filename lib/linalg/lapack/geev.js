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
function geev_internal(mA, n, compleft, compright, numtype) {
    var fn = numtype === 'f32' ? common_1.sgeev_wrap : common_1.dgeev_wrap;
    var lda = Math.max(1, n);
    var ldvl = compleft ? n : 1;
    var ldvr = compright ? n : 1;
    var jobvl = compleft ? 'V' : 'N';
    var jobvr = compright ? 'V' : 'N';
    var pjobvl = common_1.defineEmVariable('i8', jobvl.charCodeAt(0));
    var pjobvr = common_1.defineEmVariable('i8', jobvr.charCodeAt(0));
    var pn = common_1.defineEmVariable('i32', n);
    var plda = common_1.defineEmVariable('i32', lda);
    var pldvl = common_1.defineEmVariable('i32', ldvl);
    var pldvr = common_1.defineEmVariable('i32', ldvr);
    var plwork = common_1.defineEmVariable('i32', -1);
    var pinfo = common_1.defineEmVariable('i32');
    var pA = common_1.defineEmArrayVariable(numtype, n * n, mA)[0];
    var _a = common_1.defineEmArrayVariable(numtype, compleft ? ldvl * n : 1), pVL = _a[0], VL = _a[1];
    var _b = common_1.defineEmArrayVariable(numtype, compright ? ldvr * n : 1), pVR = _b[0], VR = _b[1];
    var _c = common_1.defineEmArrayVariable(numtype, n), pwr = _c[0], WR = _c[1];
    var _d = common_1.defineEmArrayVariable(numtype, n), pwi = _d[0], WI = _d[1];
    var pwork = common_1.defineEmArrayVariable(numtype, 1)[0];
    // work size query
    fn(pjobvl, pjobvr, pn, pA, plda, pwr, pwi, pVL, pldvl, pVR, pldvr, pwork, plwork, pinfo);
    var worksize = em.getValue(pwork, numtype === 'f32' ? 'float' : 'double');
    pwork = common_1.defineEmArrayVariable(numtype, worksize)[0];
    em.setValue(plwork, worksize, 'i32');
    fn(pjobvl, pjobvr, pn, pA, plda, pwr, pwi, pVL, pldvl, pVR, pldvr, pwork, plwork, pinfo);
    var info = em.getValue(pinfo, 'i32');
    if (info < 0) {
        throw new Error('Invalid argument (' + (-info) + ')');
    }
    if (info > 0) {
        throw new Error('Failed to compute all eigen values (' + info + ')');
    }
    return [WR, WI, VL, VR];
}
/**
 * @hidden
 */
function geev(A, n, compleft, compright) {
    if (A instanceof Float64Array) {
        return geev_internal(A, n, compleft, compright, 'f64');
    }
    else {
        return geev_internal(A, n, compleft, compright, 'f32');
    }
}
exports.geev = geev;
