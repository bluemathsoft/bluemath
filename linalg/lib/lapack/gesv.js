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
var common_1 = require("./common");
function gesv_internal(mA, mB, n, nrhs, numtype) {
    var pn = common_1.defineEmVariable('i32', n);
    var pnrhs = common_1.defineEmVariable('i32', nrhs);
    var pinfo = common_1.defineEmVariable('i32');
    var plda = common_1.defineEmVariable('i32', n);
    var pldb = common_1.defineEmVariable('i32', n);
    var _a = common_1.defineEmArrayVariable(numtype, n * n, mA), pA = _a[0], A = _a[1];
    var _b = common_1.defineEmArrayVariable(numtype, n * nrhs, mB), pB = _b[0], B = _b[1];
    var _c = common_1.defineEmArrayVariable('i32', n), pIPIV = _c[0], IPIV = _c[1];
    if (numtype === 'f32') {
        common_1.sgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);
    }
    else {
        common_1.dgesv_wrap(pn, pnrhs, pA, plda, pIPIV, pB, pldb, pinfo);
    }
    mA.set(A);
    mB.set(B);
    return IPIV;
}
/**
 * @hidden
 */
function gesv(mA, mB, n, nrhs) {
    if (mA instanceof Float64Array || mB instanceof Float64Array) {
        return gesv_internal(mA, mB, n, nrhs, 'f64');
    }
    else {
        return gesv_internal(mA, mB, n, nrhs, 'f32');
    }
}
exports.gesv = gesv;
