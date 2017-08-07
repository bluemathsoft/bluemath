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
var helper_1 = require("./helper");
var common_1 = require("@bluemath/common");
var BezierSurface = (function () {
    function BezierSurface(u_degree, v_degree, cpoints, weights) {
        this.u_degree = u_degree;
        this.v_degree = v_degree;
        console.assert(cpoints.shape.length === 3);
        console.assert(cpoints.shape[2] === 2 || cpoints.shape[2] === 3);
        this.cpoints = cpoints;
        if (weights) {
            console.assert(weights.shape.length === 2);
        }
        this.weights = weights;
    }
    Object.defineProperty(BezierSurface.prototype, "dimension", {
        get: function () {
            return this.cpoints.shape[2];
        },
        enumerable: true,
        configurable: true
    });
    BezierSurface.prototype.isRational = function () {
        return !!this.weights;
    };
    BezierSurface.prototype.evaluate = function (u, v, tess, uidx, vidx) {
        var Bu = helper_1.bernstein(this.u_degree, u);
        var Bv = helper_1.bernstein(this.v_degree, v);
        var denominator = 1;
        if (this.weights) {
            denominator = 0;
            for (var i = 0; i < this.u_degree + 1; i++) {
                for (var j = 0; j < this.v_degree + 1; j++) {
                    denominator += Bu[i] * Bv[j] * this.weights.get(i, j);
                }
            }
        }
        for (var i = 0; i < this.u_degree + 1; i++) {
            for (var j = 0; j < this.v_degree + 1; j++) {
                if (this.weights) {
                    tess.set(uidx, vidx, common_1.add(tess.get(uidx, vidx), common_1.mul(Bu[i], Bv[j], this.weights.get(i, j), this.cpoints.get(i, j))));
                }
                else {
                    tess.set(uidx, vidx, common_1.add(tess.get(uidx, vidx), common_1.mul(Bu[i], Bv[j], this.cpoints.get(i, j))));
                }
            }
        }
    };
    BezierSurface.prototype.tessellatePoints = function (resolution) {
        if (resolution === void 0) { resolution = 10; }
        var tess = new common_1.NDArray({
            shape: [resolution + 1, resolution + 1, this.dimension],
            datatype: 'f32'
        });
        for (var i = 0; i < resolution + 1; i++) {
            for (var j = 0; j < resolution + 1; j++) {
                var u = i / resolution;
                var v = j / resolution;
                this.evaluate(u, v, tess, i, j);
            }
        }
        return tess;
    };
    return BezierSurface;
}());
exports.BezierSurface = BezierSurface;
var BSplineSurface = (function () {
    function BSplineSurface(u_degree, v_degree, u_knots, v_knots, cpoints, weights) {
        this.u_degree = u_degree;
        this.v_degree = v_degree;
        this.u_knots = u_knots;
        this.v_knots = v_knots;
        this.cpoints = cpoints;
        this.weights = weights;
    }
    Object.defineProperty(BSplineSurface.prototype, "dimension", {
        get: function () {
            return this.cpoints.shape[2];
        },
        enumerable: true,
        configurable: true
    });
    BSplineSurface.prototype.clone = function () {
        return new BSplineSurface(this.u_degree, this.v_degree, this.u_knots.clone(), this.v_knots.clone(), this.cpoints.clone(), this.weights ? this.weights.clone() : undefined);
    };
    BSplineSurface.prototype.isRational = function () {
        return !!this.weights;
    };
    BSplineSurface.prototype.evaluate = function (u, v, tess, uidx, vidx) {
        var u_span = helper_1.findSpan(this.u_degree, this.u_knots.data, u);
        var v_span = helper_1.findSpan(this.v_degree, this.v_knots.data, v);
        var Nu = helper_1.getBasisFunction(this.u_degree, this.u_knots.data, u_span, u);
        var Nv = helper_1.getBasisFunction(this.v_degree, this.v_knots.data, v_span, v);
        var dim = this.dimension;
        var u_ind = u_span - this.u_degree;
        var temp;
        for (var l = 0; l < this.v_degree + 1; l++) {
            temp = common_1.zeros([dim]);
            var v_ind = v_span - this.v_degree + l;
            for (var k = 0; k < this.u_degree + 1; k++) {
                temp = common_1.add(temp, common_1.mul(Nu[k], this.cpoints.get(u_ind + k, v_ind)));
            }
            tess.set(uidx, vidx, common_1.add(tess.get(uidx, vidx), common_1.mul(Nv[l], temp)));
        }
    };
    BSplineSurface.prototype.tessellatePoints = function (resolution) {
        if (resolution === void 0) { resolution = 10; }
        var tess = new common_1.NDArray({
            shape: [resolution + 1, resolution + 1, this.dimension],
            datatype: 'f32'
        });
        for (var i = 0; i < resolution + 1; i++) {
            for (var j = 0; j < resolution + 1; j++) {
                var u = i / resolution;
                var v = j / resolution;
                this.evaluate(u, v, tess, i, j);
            }
        }
        return tess;
    };
    BSplineSurface.prototype.insertKnotU = function (un, r) {
        var p = this.u_degree;
        // Knot will be inserted between [k, k+1)
        var k = helper_1.findSpan(p, this.u_knots.data, un);
        // If un already exists in the knot vector, s is its multiplicity
        var s = common_1.count(this.u_knots, un, 0);
        if (r + s > p) {
            throw new Error('Knot insertion exceeds knot multiplicity beyond degree');
        }
        var mU = this.u_knots.length - 1;
        var nU = mU - this.u_degree - 1;
        var mV = this.v_knots.length - 1;
        var nV = mV - this.v_degree - 1;
        var P = this.cpoints;
        var Q = common_1.empty([nU + 1 + r, nV + 1, this.dimension]);
        var UP = this.u_knots;
        var UQ = common_1.empty([UP.length + r]);
        var VP = this.v_knots;
        var VQ = common_1.empty([VP.length]);
        // Load u-vector
        for (var i = 0; i < k + 1; i++) {
            UQ.set(i, UP.get(i));
        }
        for (var i = 1; i < r + 1; i++) {
            UQ.set(k + i, un);
        }
        for (var i = k + 1; i < mU + 1; i++) {
            UQ.set(i + r, UP.get(i));
        }
        // Copy v-vector
        VQ.copyfrom(VP);
        var alpha = common_1.empty([p + 1, r + 1]);
        var R = common_1.empty([p + 1, this.dimension]);
        var L = 0;
        // Pre-calculate alphas
        for (var j = 1; j < r + 1; j++) {
            L = k - p + j;
            for (var i = 0; i < p - j - s + 1; i++) {
                alpha.set(i, j, (un - UP.get(L + i)) / (UP.get(i + k + 1) - UP.get(L + i)));
            }
        }
        for (var row = 0; row < nV + 1; row++) {
            // Save unaltered control points
            for (var i = 0; i < k - p + 1; i++) {
                Q.set(i, row, P.get(i, row));
            }
            for (var i = k - s; i < nU + 1; i++) {
                Q.set(i + r, row, P.get(i, row));
            }
            // Load auxiliary control points
            for (var i = 0; i < p - s + 1; i++) {
                R.set(i, P.get(k - p + i, row));
            }
            for (var j = 1; j < r + 1; j++) {
                L = k - p + j;
                for (var i = 0; i < p - j - s + 1; i++) {
                    R.set(i, common_1.add(common_1.mul(alpha.get(i, j), R.get(i + 1)), common_1.mul(1.0 - alpha.get(i, j), R.get(i))));
                }
                Q.set(L, row, R.get(0));
                Q.set(k + r - j - s, row, R.get(p - j - s));
            }
            // Load the remaining control points
            for (var i = L + 1; i < k - s; i++) {
                Q.set(i, row, R.get(i - L));
            }
        }
        this.cpoints = Q;
        this.v_knots = VQ;
    };
    BSplineSurface.prototype.insertKnotV = function (vn, r) {
        var q = this.v_degree;
        // Knot will be inserted between [k,k+1)
        var k = helper_1.findSpan(this.v_degree, this.v_knots.data, vn);
        // If v already exists in knot vector, s is its multiplicity
        var s = common_1.count(this.v_knots, vn, 0);
        if (r + s > q) {
            throw new Error('Knot insertion exceeds knot multiplicity beyond degree');
        }
        var mU = this.u_knots.length - 1;
        var nU = mU - this.u_degree - 1;
        var mV = this.v_knots.length - 1;
        var nV = mV - this.v_degree - 1;
        var P = this.cpoints;
        var Q = common_1.empty([nU + 1, nV + r + 1, this.dimension]);
        var UP = this.u_knots;
        var UQ = common_1.empty([UP.length]);
        var VP = this.v_knots;
        var VQ = common_1.empty([VP.length + r]);
        // Copy u knot vector
        UQ.copyfrom(UP);
        // Load v knot vector
        for (var i = 0; i < k + 1; i++) {
            VQ.set(i, VP.get(i));
        }
        for (var i = 1; i < r + 1; i++) {
            VQ.set(k + i, vn);
        }
        for (var i = k + 1; i < mV + 1; i++) {
            VQ.set(i + r, VP.get(i));
        }
        var alpha = common_1.empty([q + 1, r + 1]);
        var R = common_1.empty([q + 1, this.dimension]);
        var L = 0;
        // Pre-calculate alphas
        for (var j = 1; j < r + 1; j++) {
            L = k - q + j;
            for (var i = 0; i < q - j - s + 1; i++) {
                alpha.set(i, j, (vn - VP.get(L + i)) / (VP.get(i + k + 1) - VP.get(L + i)));
            }
        }
        for (var col = 0; col < nU + 1; col++) {
            // Save unaltered control points
            for (var i = 0; i < k - q + 1; i++) {
                Q.set(col, i, P.get(col, i));
            }
            for (var i = k - s; i < nV + 1; i++) {
                Q.set(col, i + r, P.get(col, i));
            }
            // Load auxiliary control points
            for (var i = 0; i < q - s + 1; i++) {
                R.set(i, P.get(col, k - q + i));
            }
            for (var j = 1; j < r + 1; j++) {
                L = k - q + j;
                for (var i = 0; i < q - j - s + 1; i++) {
                    R.set(i, common_1.add(common_1.mul(alpha.get(i, j), R.get(i + 1)), common_1.mul((1.0 - alpha.get(i, j)), R.get(i))));
                }
                Q.set(col, L, R.get(0));
                Q.set(col, k + r - j - s, R.get(q - j - s));
            }
            // Load remaining control points
            for (var i = L + 1; i < k - s; i++) {
                Q.set(col, i, R.get(i - L));
            }
        }
        this.cpoints = Q;
        this.v_knots = VQ;
    };
    BSplineSurface.prototype.insertKnotUV = function (un, vn, ur, vr) {
        this.insertKnotU(un, ur);
        this.insertKnotV(vn, vr);
    };
    BSplineSurface.prototype.refineKnotsU = function (uklist) {
        var mU = this.u_knots.length - 1;
        var mV = this.v_knots.length - 1;
        var p = this.u_degree;
        var q = this.v_degree;
        var nU = mU - p - 1;
        var nV = mV - q - 1;
        var X = uklist;
        var r = uklist.length - 1;
        var U = this.u_knots;
        var V = this.v_knots;
        var Ubar = common_1.empty(U.length + r + 1);
        var Vbar = common_1.empty(V.length);
        var P = this.cpoints;
        var Q = common_1.empty([nU + 1 + r + 1, nV + 1, this.dimension]);
        var a = helper_1.findSpan(p, U.data, X[0]);
        var b = helper_1.findSpan(p, U.data, X[r]);
        b += 1;
        // Initialize Ubar (for u<a and u>b)
        for (var j = 0; j < a + 1; j++) {
            Ubar.set(j, U.get(j));
        }
        for (var j = b + p; j < mU + 1; j++) {
            Ubar.set(j + r + 1, U.get(j));
        }
        // Copy V into Vbar as is
        Vbar.copyfrom(V);
        // Copy unaltered control points (corresponding to u<a and u>b)
        for (var row = 0; row < nV + 1; row++) {
            for (var k_1 = 0; k_1 < a - p + 1; k_1++) {
                Q.set(k_1, row, P.get(k_1, row));
            }
            for (var k_2 = b - 1; k_2 < nU + 1; k_2++) {
                Q.set(k_2 + r + 1, row, P.get(k_2, row));
            }
        }
        var i = b + p - 1;
        var k = b + p + r;
        for (var j = r; j >= 0; j--) {
            while (X[j] <= U.get(i) && i > a) {
                Ubar.set(k, U.get(i));
                for (var row = 0; row < nV + 1; row++) {
                    Q.set(k - p - 1, row, P.get(i - p - 1, row));
                }
                k -= 1;
                i -= 1;
            }
            for (var row = 0; row < nV + 1; row++) {
                Q.set(k - p - 1, row, Q.get(k - p, row));
            }
            for (var l = 1; l < p + 1; l++) {
                var ind = k - p + l;
                var alpha = Ubar.get(k + l) - X[j];
                if (common_1.iszero(alpha)) {
                    for (var row = 0; row < nV + 1; row++) {
                        Q.set(ind - 1, row, Q.get(ind, row));
                    }
                }
                else {
                    alpha = alpha / (Ubar.get(k + l) - U.get(i - p + l));
                    for (var row = 0; row < nV + 1; row++) {
                        Q.set(ind - 1, row, common_1.add(common_1.mul(alpha, Q.get(ind - 1, row)), common_1.mul((1.0 - alpha), Q.get(ind, row))));
                    }
                }
            }
            Ubar.set(k, X[j]);
            k -= 1;
        }
        this.u_knots = Ubar;
        this.cpoints = Q;
    };
    BSplineSurface.prototype.refineKnotsV = function (vklist) {
        var mU = this.u_knots.length - 1;
        var mV = this.v_knots.length - 1;
        var p = this.u_degree;
        var q = this.v_degree;
        var nU = mU - p - 1;
        var nV = mV - q - 1;
        var X = vklist;
        var r = vklist.length - 1;
        var U = this.u_knots;
        var V = this.v_knots;
        var Ubar = common_1.empty(U.length);
        var Vbar = common_1.empty(V.length + r + 1);
        var P = this.cpoints;
        var Q = common_1.empty([nU + 1, nU + 1 + r + 1, this.dimension]);
        var a = helper_1.findSpan(q, V.data, X[0]);
        var b = helper_1.findSpan(q, V.data, X[r]);
        b += 1;
        // Initialize Vbar (for u<a and u>b)
        for (var j = 0; j < a + 1; j++) {
            Vbar.set(j, V.get(j));
        }
        for (var j = b + p; j < mV + 1; j++) {
            Vbar.set(j + r + 1, V.get(j));
        }
        // Copy U into Ubar as-is
        Ubar.copyfrom(U);
        // Copy unaltered control points (corresponding to u<a and u>b)
        for (var col = 0; col < nU + 1; col++) {
            for (var k_3 = 0; k_3 < a - p + 1; k_3++) {
                Q.set(col, k_3, P.get(col, k_3));
            }
            for (var k_4 = b - 1; k_4 < nV + 1; k_4++) {
                Q.set(col, k_4 + r + 1, P.get(col, k_4));
            }
        }
        var i = b + p - 1;
        var k = b + p + r;
        for (var j = r; j >= 0; j--) {
            while (X[j] <= U.get(i) && i > a) {
                Vbar.set(k, V.get(i));
                for (var col = 0; col < nU + 1; col++) {
                    Q.set(col, k - p - 1, P.get(col, i - p - 1));
                }
                k -= 1;
                i -= 1;
            }
            for (var col = 0; col < nU + 1; col++) {
                Q.set(col, k - p - 1, Q.get(col, k - p));
            }
            for (var l = 1; l < p + 1; l++) {
                var ind = k - p + l;
                var alpha = Vbar.get(k + l) - X[j];
                if (common_1.iszero(alpha)) {
                    for (var col = 0; col < nU + 1; col++) {
                        Q.set(col, ind - 1, Q.get(col, ind));
                    }
                }
                else {
                    alpha = alpha / (Vbar.get(k + l) - V.get(i - p + l));
                    for (var col = 0; col < nU + 1; col++) {
                        Q.set(col, ind - 1, common_1.add(common_1.mul(alpha, Q.get(col, ind - 1)), common_1.mul((1.0 - alpha), Q.get(col, ind))));
                    }
                }
            }
            Vbar.set(k, X[j]);
            k -= 1;
        }
        this.v_knots = Vbar;
        this.cpoints = Q;
    };
    BSplineSurface.prototype.refineKnotsUV = function (uklist, vklist) {
        this.refineKnotsU(uklist);
        this.refineKnotsV(vklist);
    };
    BSplineSurface.prototype.decomposeU = function () {
        var p = this.u_degree;
        var q = this.v_degree;
        var U = this.u_knots;
        var V = this.v_knots;
        var mU = U.length - 1;
        var mV = V.length - 1;
        var nV = mV - q - 1;
        var P = this.cpoints;
        var alphas = common_1.empty(p);
        var a = p;
        var b = p + 1;
        var total_bezier = mU - 2 * p;
        var Q = common_1.empty([total_bezier, p + 1, nV + 1, this.dimension]);
        var nb = 0; // Counter of Bezier strips along u
        for (var i = 0; i < p + 1; i++) {
            for (var row = 0; row < nV + 1; row++) {
                Q.set(nb, i, row, P.get(i, row));
            }
        }
        while (b < mU) {
            var i = b;
            while (b < mU && U.get(b + 1) === U.get(b)) {
                b += 1;
            }
            var mult = b - i + 1;
            if (mult < p) {
                var numerator = U.get(b) - U.get(a); // Numerator of alpha
                // Compute and store alphas
                for (var j = p; j > mult; j--) {
                    alphas.set(j - mult - 1, numerator / (U.get(a + j) - U.get(a)));
                }
                var r = p - mult; // Insert knot r times
                for (var j = 1; j < r + 1; j++) {
                    var save = r - j;
                    var s = mult + j;
                    for (var k = p; k > s - 1; k--) {
                        var alpha = alphas.get(k - s);
                        for (var row = 0; row < nV + 1; row++) {
                            Q.set(nb, k, row, common_1.add(common_1.mul(alpha, Q.get(nb, k, row)), common_1.mul((1.0 - alpha), Q.get(nb, k - 1, row))));
                        }
                    }
                    if (b < mU) {
                        for (var row = 0; row < nV + 1; row++) {
                            Q.set(nb + 1, save, row, Q.get(nb, p, row));
                        }
                    }
                }
            }
            nb += 1;
            if (b < mU) {
                for (var i_1 = p - mult; i_1 < p + 1; i_1++) {
                    for (var row = 0; row < nV + 1; row++) {
                        Q.set(nb, i_1, row, P.get(b - p + 1, row));
                    }
                }
                a = b;
                b += 1;
            }
        }
        return Q;
    };
    BSplineSurface.prototype.decomposeV = function () {
        var p = this.u_degree;
        var q = this.v_degree;
        var U = this.u_knots;
        var V = this.v_knots;
        var mU = U.length - 1;
        var mV = V.length - 1;
        var nU = mU - p - 1;
        var P = this.cpoints;
        var alphas = common_1.empty(q);
        var a = q;
        var b = q + 1;
        var total_bezier = mV - 2 * q;
        var Q = common_1.empty([total_bezier, nU + 1, q + 1, this.dimension]);
        var nb = 0; // Counter of Bezier strips along v
        for (var i = 0; i < q + 1; i++) {
            for (var col = 0; col < nU + 1; col++) {
                Q.set(nb, col, i, P.get(col, i));
            }
        }
        while (b < mV) {
            var i = b;
            while (b < mV && V.get(b + 1) === V.get(b)) {
                b += 1;
            }
            var mult = b - i + 1;
            if (mult < q) {
                var numerator = V.get(b) - V.get(a); // Numerator of alpha
                // Compute and store alphas
                for (var j = q; j > mult; j--) {
                    alphas.set(j - mult - 1, numerator / (V.get(a + j) - V.get(a)));
                }
                var r = q - mult; // Insert knot r times
                for (var j = 1; j < r + 1; j++) {
                    var save = r - j;
                    var s = mult + j;
                    for (var k = q; k > s - 1; k--) {
                        var alpha = alphas.get(k - s);
                        for (var col = 0; col < nU + 1; col++) {
                            Q.set(nb, col, k, common_1.add(common_1.mul(alpha, Q.get(nb, col, k)), common_1.mul((1.0 - alpha), Q.get(nb, col, k - 1))));
                        }
                    }
                    if (b < mV) {
                        for (var col = 0; col < nU + 1; col++) {
                            Q.set(nb + 1, col, save, Q.get(nb, col, q));
                        }
                    }
                }
            }
            nb += 1;
            if (b < mV) {
                for (var i_2 = q - mult; i_2 < q + 1; i_2++) {
                    for (var col = 0; col < nU + 1; col++) {
                        Q.set(nb, col, i_2, P.get(col, b - p + i_2));
                    }
                }
                a = b;
                b += 1;
            }
        }
        return Q;
    };
    BSplineSurface.prototype.decompose = function () {
        var Q = this.decomposeU();
        // Using Q, create Bezier strip surfaces. These are individual BSurf objects
        // Their u curve will be bezier, but will still be expressed as BSpline
        // Their v curve will still be bspline
        var L = 2 * (this.u_degree + 1);
        var u_bez_knots = common_1.empty(L);
        for (var i = 0; i < this.u_degree + 1; i++) {
            u_bez_knots.set(i, 0);
            u_bez_knots.set(L - i - 1, 1);
        }
        var bezStrips = [];
        for (var numUBez = 0; numUBez < Q.length; numUBez++) {
            var cpoints = Q.get(numUBez);
            bezStrips.push(new BSplineSurface(this.u_degree, this.v_degree, u_bez_knots, this.v_knots, cpoints));
        }
        var bezSurfs = [];
        // Decompose each bezier strip along v
        for (var _i = 0, bezStrips_1 = bezStrips; _i < bezStrips_1.length; _i++) {
            var bezStrip = bezStrips_1[_i];
            var Q_1 = bezStrip.decomposeV();
            for (var numUBez = 0; numUBez < Q_1.length; numUBez++) {
                var cpoints = Q_1.get(numUBez);
                bezSurfs.push(new BezierSurface(this.u_degree, this.v_degree, cpoints));
            }
        }
        return bezSurfs;
    };
    BSplineSurface.prototype.toString = function () {
        var s = "BSplineSurf [udeg " + this.u_degree + " vdeg " + this.v_degree + " \n" +
            ("cpoints " + this.cpoints.toString() + " \n") +
            ("uknots " + this.u_knots.toString() + " \n") +
            ("vknots " + this.v_knots.toString() + " \n");
        if (this.weights) {
            s += "weights " + this.weights.toString() + "\n";
        }
        s += ']';
        return s;
    };
    return BSplineSurface;
}());
exports.BSplineSurface = BSplineSurface;
