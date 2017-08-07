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
function getrf_internal(mA, m, n, mipiv, numtype) {
    var fn = numtype === 'f32' ? common_1.sgetrf_wrap : common_1.dgetrf_wrap;
    var pm = common_1.defineEmVariable('i32', m);
    var pn = common_1.defineEmVariable('i32', n);
    var plda = common_1.defineEmVariable('i32', Math.max(1, m));
    console.assert(mipiv.length === Math.min(m, n));
    var _a = common_1.defineEmArrayVariable(numtype, m * n, mA), pA = _a[0], A = _a[1];
    var _b = common_1.defineEmArrayVariable('i32', Math.min(m, n), mipiv), pipiv = _b[0], ipiv = _b[1];
    var pinfo = common_1.defineEmVariable('i32');
    fn(pm, pn, pA, plda, pipiv, pinfo);
    var info = em.getValue(pinfo, 'i32');
    if (info < 0) {
        throw new Error('Invalid argument (' + (-info) + ')');
    }
    if (info > 0) {
        // Fortran has 1-based indexing
        console.error("U(" + (info - 1) + "," + (info - 1) + ") is zero");
    }
    mA.set(A);
    mipiv.set(ipiv);
}
/**
 * @hidden
 */
function getrf(mA, m, n, mipiv) {
    if (mA instanceof Float64Array) {
        getrf_internal(mA, m, n, mipiv, 'f64');
    }
    else {
        getrf_internal(mA, m, n, mipiv, 'f32');
    }
}
exports.getrf = getrf;
