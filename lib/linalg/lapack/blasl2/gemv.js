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
function gemv_internal(alpha, mA, m, n, vx, vy, beta, ntype) {
    if (vx.length !== n) {
        throw new Error('Length of x doesn\'t match num columns of A');
    }
    if (vy.length !== m) {
        throw new Error('Length of y doesn\'t match num rows of A');
    }
    var ptrans = common_1.defineEmVariable('i8', 'N'.charCodeAt(0));
    var pm = common_1.defineEmVariable('i32', m);
    var pn = common_1.defineEmVariable('i32', n);
    var plda = common_1.defineEmVariable('i32', m);
    var pincx = common_1.defineEmVariable('i32', 1);
    var pincy = common_1.defineEmVariable('i32', 1);
    var palpha = common_1.defineEmVariable(ntype, alpha);
    var pbeta = common_1.defineEmVariable(ntype, beta);
    var pA = common_1.defineEmArrayVariable(ntype, m * n, mA)[0];
    var px = common_1.defineEmArrayVariable(ntype, n, vx)[0];
    var _a = common_1.defineEmArrayVariable(ntype, m, vy), py = _a[0], y = _a[1];
    if (ntype === 'f32') {
        common_1.sgemv_wrap(ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy);
    }
    else {
        common_1.dgemv_wrap(ptrans, pm, pn, palpha, pA, plda, px, pincx, pbeta, py, pincy);
    }
    vy.set(y);
}
/**
 * @hidden
 */
function gemv(alpha, mA, m, n, vx, vy, beta) {
    if (mA instanceof Float64Array ||
        vx instanceof Float64Array || vy instanceof Float64Array) {
        gemv_internal(alpha, mA, m, n, vx, vy, beta, 'f64');
    }
    else {
        gemv_internal(alpha, mA, m, n, vx, vy, beta, 'f32');
    }
}
exports.gemv = gemv;
