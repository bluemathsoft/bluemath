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
var common_1 = require("../common");
function gemm_internal(mA, mB, mC, m, n, k, alpha, beta, numtype) {
    var ptransa = common_1.defineEmVariable('i8', 'N'.charCodeAt(0));
    var ptransb = common_1.defineEmVariable('i8', 'N'.charCodeAt(0));
    var pm = common_1.defineEmVariable('i32', m);
    var pn = common_1.defineEmVariable('i32', n);
    var pk = common_1.defineEmVariable('i32', k);
    var palpha = common_1.defineEmVariable(numtype, alpha);
    var pbeta = common_1.defineEmVariable(numtype, beta);
    var pA = common_1.defineEmArrayVariable(numtype, m * k, mA)[0];
    var pB = common_1.defineEmArrayVariable(numtype, k * n, mB)[0];
    var _a = common_1.defineEmArrayVariable(numtype, m * n, mC), pC = _a[0], C = _a[1];
    var plda = common_1.defineEmVariable('i32', m);
    var pldb = common_1.defineEmVariable('i32', k);
    var pldc = common_1.defineEmVariable('i32', m);
    if (numtype === 'f32') {
        common_1.sgemm_wrap(ptransa, ptransb, pm, pn, pk, palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
    }
    else {
        common_1.dgemm_wrap(ptransa, ptransb, pm, pn, pk, palpha, pA, plda, pB, pldb, pbeta, pC, pldc);
    }
    mC.set(C);
}
/**
 * @hidden
 */
function gemm(mA, mB, mC, m, n, k, alpha, beta) {
    if (mA instanceof Float64Array ||
        mB instanceof Float64Array ||
        mC instanceof Float64Array) {
        gemm_internal(mA, mB, mC, m, n, k, alpha, beta, 'f64');
    }
    else {
        gemm_internal(mA, mB, mC, m, n, k, alpha, beta, 'f32');
    }
}
exports.gemm = gemm;
