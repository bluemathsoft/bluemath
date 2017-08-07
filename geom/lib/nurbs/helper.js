"use strict";
/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math.  If not, see <http://www.gnu.org/licenses/>.

 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@bluemath/common");
/**
 * @hidden
 * Compute all n'th degree bernstein polynomials at given parameter value
 */
function bernstein(n, u) {
    var B = new Array(n + 1);
    B[0] = 1.0;
    var u1 = 1.0 - u;
    for (var j = 1; j <= n; j++) {
        var saved = 0.0;
        for (var k = 0; k < j; k++) {
            var temp = B[k];
            B[k] = saved + u1 * temp;
            saved = u * temp;
        }
        B[j] = saved;
    }
    return B;
}
exports.bernstein = bernstein;
/**
 * @hidden
 * Find the index of the knot span in which `u` lies
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} u Parameter
 * @returns {number}
 */
function findSpan(p, U, u) {
    var m = U.length - 1;
    var n = m - p - 1;
    if (common_1.isequal(u, U[n + 1])) {
        return n;
    }
    var low = p;
    var high = n + 1;
    var mid = Math.floor((low + high) / 2);
    while (u < U[mid] || u >= U[mid + 1]) {
        if (u < U[mid]) {
            high = mid;
        }
        else {
            low = mid;
        }
        mid = Math.floor((low + high) / 2);
    }
    return mid;
}
exports.findSpan = findSpan;
/**
 * @hidden
 * Evaluate basis function values
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} i Knot span index
 * @param {number} u Parameter
 * @returns {Array} Basis function values at i,u
 */
function getBasisFunction(p, U, i, u) {
    var N = new Array(p + 1);
    N[0] = 1.0;
    var left = new Array(p + 1);
    var right = new Array(p + 1);
    for (var j = 1; j <= p; j++) {
        left[j] = u - U[i + 1 - j];
        right[j] = U[i + j] - u;
        var saved = 0.0;
        for (var r = 0; r < j; r++) {
            var temp = N[r] / (right[r + 1] + left[j - r]);
            N[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        N[j] = saved;
    }
    return N;
}
exports.getBasisFunction = getBasisFunction;
/**
 * @hidden
 * Compute non-zero basis functions and their derivatives, upto and including
 * n'th derivative (n <= p). Output is 2-dimensional array `ders`
 * @param {number} p Degree
 * @param {number} u Parameter
 * @param {number} i Knot span
 * @param {NDArray} knots Knot vector
 * @param {number} n nth derivative
 * @returns {NDArray} ders ders[k][j] is k'th derivative of
 *            basic function N(i-p+j,p), where 0<=k<=n and 0<=j<=p
 */
function getBasisFunctionDerivatives(p, u, ki, knots, n) {
    var U = knots.data;
    var ders = new Array(n + 1);
    for (var i = 0; i < n + 1; i++) {
        ders[i] = new Array(p + 1);
    }
    var ndu = new Array(p + 1);
    for (var i = 0; i < p + 1; i++) {
        ndu[i] = new Array(p + 1);
    }
    ndu[0][0] = 1.0;
    var a = new Array(2);
    for (var i = 0; i < 2; i++) {
        a[i] = new Array(p + 1);
    }
    var left = [];
    var right = [];
    for (var j = 1; j <= p; j++) {
        left[j] = u - U[ki + 1 - j];
        right[j] = U[ki + j] - u;
        var saved = 0.0;
        for (var r_1 = 0; r_1 < j; r_1++) {
            // Lower triangle
            ndu[j][r_1] = right[r_1 + 1] + left[j - r_1];
            var temp = ndu[r_1][j - 1] / ndu[j][r_1];
            // Upper triangle
            ndu[r_1][j] = saved + right[r_1 + 1] * temp;
            saved = left[j - r_1] * temp;
        }
        ndu[j][j] = saved;
    }
    for (var j = 0; j <= p; j++) {
        ders[0][j] = ndu[j][p];
    }
    // This section computes the derivatives (eq 2.9)
    for (var r_2 = 0; r_2 <= p; r_2++) {
        var s1 = 0;
        var s2 = 1;
        // Alternate rows in array a
        a[0][0] = 1.0;
        for (var k = 1; k <= n; k++) {
            var d = 0.0;
            var rk = r_2 - k;
            var pk = p - k;
            if (r_2 >= k) {
                a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
                d = a[s2][0] * ndu[rk][pk];
            }
            var j1 = void 0, j2 = void 0;
            if (rk >= -1) {
                j1 = 1;
            }
            else {
                j1 = -rk;
            }
            if (r_2 - 1 <= pk) {
                j2 = k - 1;
            }
            else {
                j2 = p - r_2;
            }
            for (var j = j1; j <= j2; j++) {
                a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
                d += a[s2][j] * ndu[rk + j][pk];
            }
            if (r_2 <= pk) {
                a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r_2];
                d += a[s2][k] * ndu[r_2][pk];
            }
            ders[k][r_2] = d;
            // Switch rows
            var temp = s1;
            s1 = s2;
            s2 = temp;
        }
    }
    // Multiply through by the correct factors (eq 2.9)
    var r = p;
    for (var k = 1; k <= n; k++) {
        for (var j = 0; j <= p; j++) {
            ders[k][j] *= r;
        }
        r *= p - k;
    }
    return new common_1.NDArray(ders);
}
exports.getBasisFunctionDerivatives = getBasisFunctionDerivatives;
