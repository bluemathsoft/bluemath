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
/**
 * @hidden
 */
function dot_internal(vx, vy, ntype) {
    var n = vx.length;
    var pn = common_1.defineEmVariable('i32', n);
    var pincx = common_1.defineEmVariable('i32', 1);
    var pincy = common_1.defineEmVariable('i32', 1);
    var px = common_1.defineEmArrayVariable(ntype, n, vx)[0];
    var py = common_1.defineEmArrayVariable(ntype, n, vy)[0];
    if (ntype === 'f32') {
        return common_1.sdot_wrap(pn, px, pincx, py, pincy);
    }
    else {
        return common_1.ddot_wrap(pn, px, pincx, py, pincy);
    }
}
/**
 * @hidden
 */
function dot(vx, vy) {
    if (vx.length !== vy.length) {
        throw new Error('Input vectors of different size');
    }
    if (vx instanceof Float64Array || vy instanceof Float64Array) {
        return dot_internal(vx, vy, 'f64');
    }
    else {
        return dot_internal(vx, vy, 'f32');
    }
}
exports.dot = dot;
