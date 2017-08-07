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
var BezierCurve = (function () {
    function BezierCurve(degree, cpoints, weights) {
        this.degree = degree;
        console.assert(cpoints.is2D());
        this.cpoints = cpoints;
        if (weights) {
            console.assert(weights.length === degree + 1);
        }
        this.weights = weights;
    }
    Object.defineProperty(BezierCurve.prototype, "dimension", {
        get: function () {
            return this.cpoints.shape[1];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Is this Rational Bezier Curve
     */
    BezierCurve.prototype.isRational = function () {
        return !!this.weights;
    };
    BezierCurve.prototype.evaluate = function (u, tess, tessidx) {
        var B = helper_1.bernstein(this.degree, u);
        var dim = this.dimension;
        var denominator;
        if (this.weights) {
            denominator = 0;
            for (var i = 0; i < this.degree + 1; i++) {
                denominator += B[i] * this.weights.get(i);
            }
        }
        else {
            denominator = 1;
        }
        if (tess !== undefined && tessidx !== undefined) {
            for (var k = 0; k < this.degree + 1; k++) {
                if (this.weights) {
                    for (var z = 0; z < dim; z++) {
                        tess.set(tessidx, z, tess.get(tessidx, z) +
                            B[k] * this.cpoints.get(k, z) *
                                this.weights.get(k));
                    }
                }
                else {
                    for (var z = 0; z < dim; z++) {
                        tess.set(tessidx, z, tess.get(tessidx, z) +
                            B[k] * this.cpoints.get(k, z));
                    }
                }
            }
            for (var z = 0; z < dim; z++) {
                tess.set(tessidx, z, tess.get(tessidx, z) / denominator);
            }
            return null;
        }
        else {
            throw new Error('Not implemented');
        }
    };
    BezierCurve.prototype.tessellate = function (resolution) {
        if (resolution === void 0) { resolution = 10; }
        var tess = new common_1.NDArray({
            shape: [resolution + 1, this.dimension],
            datatype: 'f32'
        });
        for (var i = 0; i < resolution + 1; i++) {
            this.evaluate(i / resolution, tess, i);
        }
        return tess;
    };
    BezierCurve.prototype.toString = function () {
        var s = "Bezier(Deg " + this.degree + " cpoints " + this.cpoints.toString() + ")";
        if (this.weights) {
            s += " weights " + this.weights.toString();
        }
        return s;
    };
    return BezierCurve;
}());
exports.BezierCurve = BezierCurve;
/**
 * @hidden
 */
var BSplineCurve = (function () {
    function BSplineCurve(degree, cpoints, knots, weights) {
        this.degree = degree;
        console.assert(cpoints.is2D());
        this.cpoints = cpoints;
        console.assert(knots.is1D());
        this.knots = knots;
        if (weights) {
            console.assert(knots.is1D());
        }
        this.weights = weights;
        /*
         The degree p, number of control points n+1, number of knots m+1
         are related by
         m = n + p + 1
         [The NURBS book, P3.1]
         */
        var p = degree;
        var m = knots.shape[0] - 1;
        var n = cpoints.shape[0] - 1;
        console.assert(m === n + p + 1);
    }
    Object.defineProperty(BSplineCurve.prototype, "dimension", {
        get: function () {
            return this.cpoints.shape[1];
        },
        enumerable: true,
        configurable: true
    });
    BSplineCurve.prototype.setKnots = function (knots) {
        if (!this.knots.isShapeEqual(knots)) {
            throw new Error('Invalid knot vector length');
        }
        this.knots = knots;
    };
    BSplineCurve.prototype.setKnot = function (index, knot) {
        if (index >= this.knots.shape[0] || index < 0) {
            throw new Error('Invalid knot index');
        }
        if (knot < 0 || knot > 1) {
            throw new Error('Invalid knot value');
        }
        if (index < this.degree + 1) {
            if (knot !== 0) {
                throw new Error('Clamped knot has to be zero');
            }
        }
        if (index >= (this.knots.shape[0] - this.degree - 1)) {
            if (knot !== 1) {
                throw new Error('Clamped knot has to be one');
            }
        }
        this.knots.set(index, knot);
    };
    BSplineCurve.prototype.setWeight = function (index, weight) {
        if (!this.weights) {
            throw new Error('Not a Rational BSpline');
        }
        if (index < 0 || index >= this.weights.shape[0]) {
            throw new Error('Index out of bounds');
        }
        this.weights.set(index, weight);
    };
    /**
     * Is this Rational BSpline Curve
     */
    BSplineCurve.prototype.isRational = function () {
        return !!this.weights;
    };
    /**
     * Evaluate basis function derivatives upto n'th
     */
    BSplineCurve.prototype.evaluateBasisDerivatives = function (span, n, t) {
        return helper_1.getBasisFunctionDerivatives(this.degree, t, span, this.knots, n);
    };
    BSplineCurve.prototype.evaluateBasis = function (span, t) {
        return helper_1.getBasisFunction(this.degree, this.knots.data, span, t);
    };
    BSplineCurve.prototype.findSpan = function (t) {
        return helper_1.findSpan(this.degree, this.knots.data, t);
    };
    BSplineCurve.prototype.getTermDenominator = function (span, N) {
        var p = this.degree;
        var denominator;
        if (this.weights) {
            denominator = 0.0;
            for (var i = 0; i < N.length; i++) {
                denominator += N[i] * this.weights.get(span - p + i);
            }
        }
        else {
            denominator = 1.0;
        }
        return denominator;
    };
    BSplineCurve.prototype.tessellateBasis = function (resolution) {
        if (resolution === void 0) { resolution = 10; }
        var n = this.cpoints.shape[0] - 1;
        var p = this.degree;
        var Nip = common_1.zeros([n + 1, resolution + 1], 'f32');
        for (var i = 0; i < resolution + 1; i++) {
            var u = i / resolution;
            var span = this.findSpan(u);
            var N = this.evaluateBasis(span, u);
            for (var j = p; j >= 0; j--) {
                Nip.set(span - j, i, N[p - j]);
            }
        }
        return Nip;
    };
    /**
     * Algorithm A5.1 from "The NURBS Book"
     */
    BSplineCurve.prototype.insertKnot = function (un, r) {
        var p = this.degree;
        var dim = this.dimension;
        var k = this.findSpan(un);
        var isRational = this.isRational();
        // If un already exists in the knot vector then s is it's multiplicity
        var s = 0;
        for (var i = 0; i < this.knots.shape[0]; i++) {
            if (this.knots.get(i) === un) {
                s++;
            }
        }
        if (r + s >= p) {
            throw new Error('Knot insertion exceeds knot multiplicity beyond degree');
        }
        var m = this.knots.shape[0] - 1;
        var n = m - p - 1;
        var P = this.cpoints;
        var Up = this.knots;
        var Q = new common_1.NDArray({ shape: [P.shape[0] + r, dim] });
        var Uq = new common_1.NDArray({ shape: [Up.shape[0] + r] });
        var Rtmp, Wtmp;
        Rtmp = new common_1.NDArray({ shape: [p + 1, dim] });
        var Wp, Wq;
        if (this.weights) {
            Wp = this.weights;
            Wq = new common_1.NDArray({ shape: [Wp.shape[0] + r] });
            Wtmp = new common_1.NDArray({ shape: [p + 1] });
        }
        // Load new knot vector
        for (var i = 0; i < k + 1; i++) {
            Uq.set(i, Up.get(i));
        }
        for (var i = 1; i < r + 1; i++) {
            Uq.set(k + i, un);
        }
        for (var i = k + 1; i < m + 1; i++) {
            Uq.set(i + r, Up.get(i));
        }
        // Save unaltered control points
        for (var i = 0; i < k - p + 1; i++) {
            for (var j = 0; j < dim; j++) {
                Q.set(i, j, P.get(i, j));
            }
            if (Wp && Wq) {
                Wq.set(i, Wp.get(i));
            }
        }
        for (var i = k - s; i < n + 1; i++) {
            for (var j = 0; j < dim; j++) {
                Q.set(i + r, j, P.get(i, j));
            }
            if (Wp && Wq) {
                Wq.set(i + r, Wp.get(i));
            }
        }
        for (var i = 0; i < p - s + 1; i++) {
            for (var j = 0; j < dim; j++) {
                Rtmp.set(i, j, P.get(k - p + i, j));
            }
        }
        var L = 0;
        for (var j = 1; j < r + 1; j++) {
            L = k - p + j;
            for (var i = 0; i < p - j - s + 1; i++) {
                var alpha = (un - Up.get(L + i)) / (Up.get(i + k + 1) - Up.get(L + i));
                for (var z = 0; z < dim; z++) {
                    Rtmp.set(i, z, alpha * Rtmp.get(i + 1, z) + (1 - alpha) * Rtmp.get(i, z));
                }
                if (Wtmp) {
                    Wtmp.set(i, alpha * Wtmp.get(i + 1) + (1 - alpha) * Wtmp.get(i));
                }
            }
            for (var z = 0; z < dim; z++) {
                Q.set(L, z, Rtmp.get(0, z));
                Q.set(k + r - j - s, z, Rtmp.get(p - j - s, z));
            }
            if (Wq && Wtmp) {
                Wq.set(L, Wtmp.get(0));
                Wq.set(k + r - j - s, Wtmp.get(p - j - s));
            }
        }
        for (var i = L + 1; i < k - s + 1; i++) {
            for (var z = 0; z < dim; z++) {
                Q.set(i, z, Rtmp.get(i - L, z));
            }
            if (Wq && Wtmp) {
                Wq.set(i, Wtmp.get(i - L));
            }
        }
        this.knots = Uq;
        this.cpoints = Q;
        if (isRational) {
            this.weights = Wq;
        }
    };
    /**
     * Algorithm A5.4 from "The NURBS Book"
     */
    BSplineCurve.prototype.refineKnots = function (ukList) {
        var m = this.knots.length - 1;
        var p = this.degree;
        var n = m - p - 1;
        var dim = this.dimension;
        var X = ukList;
        var r = ukList.length - 1;
        var P = this.cpoints;
        var Q = new common_1.NDArray({ shape: [P.length + r + 1, dim] });
        var U = this.knots;
        var Ubar = new common_1.NDArray({ shape: [U.length + r + 1] });
        var Wp, Wq;
        if (this.weights) {
            Wq = new common_1.NDArray({ shape: [P.length + r + 1] });
            Wp = this.weights;
        }
        var a = this.findSpan(X[0]);
        var b = this.findSpan(X[r]);
        b += 1;
        // Copy control points and weights for u < a and u > b
        for (var j = 0; j < a - p + 1; j++) {
            for (var k_1 = 0; k_1 < dim; k_1++) {
                Q.set(j, k_1, P.get(j, k_1));
            }
            if (Wp && Wq) {
                Wq.set(j, Wp.get(j));
            }
        }
        for (var j = b - 1; j < n + 1; j++) {
            for (var k_2 = 0; k_2 < dim; k_2++) {
                Q.set(j + r + 1, k_2, P.get(j, k_2));
            }
            if (Wp && Wq) {
                Wq.set(j + r + 1, Wp.get(j));
            }
        }
        // Copy knots for u < a and u > b
        for (var j = 0; j < a + 1; j++) {
            Ubar.set(j, U.get(j));
        }
        for (var j = b + p; j < m + 1; j++) {
            Ubar.set(j + r + 1, U.get(j));
        }
        // For values of u between a and b
        var i = b + p - 1;
        var k = b + p + r;
        for (var j = r; j >= 0; j--) {
            while (X[j] <= U.get(i) && i > a) {
                for (var z = 0; z < dim; z++) {
                    Q.set(k - p - 1, z, P.get(i - p - 1, z));
                }
                if (Wp && Wq) {
                    Wq.set(k - p - 1, Wp.get(i - p - 1));
                }
                Ubar.set(k, U.get(i));
                k -= 1;
                i -= 1;
            }
            for (var z = 0; z < dim; z++) {
                Q.set(k - p - 1, z, Q.get(k - p, z));
            }
            if (Wp && Wq) {
                Wq.set(k - p - 1, Wq.get(k - p));
            }
            for (var l = 1; l < p + 1; l++) {
                var ind = k - p + l;
                var alpha = Ubar.get(k + l) - X[j];
                if (Math.abs(alpha) === 0.0) {
                    for (var z = 0; z < dim; z++) {
                        Q.set(ind - 1, z, Q.get(ind, z));
                    }
                    if (Wp && Wq) {
                        Wq.set(ind - 1, Wq.get(ind));
                    }
                }
                else {
                    alpha = alpha / (Ubar.get(k + l) - U.get(i - p + l));
                    for (var z = 0; z < dim; z++) {
                        Q.set(ind - 1, z, alpha * Q.get(ind - 1, z) +
                            (1.0 - alpha) * Q.get(ind, z));
                    }
                    if (Wq) {
                        Wq.set(ind - 1, alpha * Wq.get(ind - 1) +
                            (1.0 - alpha) * Wq.get(ind));
                    }
                }
            }
            Ubar.set(k, X[j]);
            k -= 1;
        }
        this.knots = Ubar;
        this.cpoints = Q;
        if (this.weights) {
            this.weights = Wq;
        }
    };
    /**
     * Algorithm A5.6 from "The NURBS Book"
     * The total number of bezier segments required to decompose a
     * given bspline curve
     *  = Number of internal knots + 1
     *  = Length of knot vector - 2*(p+1) + 1
     *  = (m+1) - 2*(p+1) + 1
     *  = m - 2*p
     */
    BSplineCurve.prototype.decompose = function () {
        var p = this.degree;
        var U = this.knots;
        var m = U.length - 1;
        var P = this.cpoints;
        var dim = this.dimension;
        var alphas = new common_1.NDArray({ shape: [p] });
        var a = p;
        var b = p + 1;
        var total_bezier = m - 2 * p;
        var Q = new common_1.NDArray({ shape: [total_bezier, p + 1, dim] });
        var nb = 0; // Counter for Bezier segments
        for (var i_1 = 0; i_1 < p + 1; i_1++) {
            for (var z = 0; z < dim; z++) {
                Q.set(nb, i_1, z, P.get(i_1, z));
            }
        }
        var i;
        while (b < m) {
            i = b;
            while (b < m && U.get(b + 1) === U.get(b)) {
                b += 1;
            }
            var mult = b - i + 1;
            if (mult < p) {
                var numerator = U.get(b) - U.get(a);
                // Compute and store alphas
                for (var j = p; j > mult; j--) {
                    alphas.set(j - mult - 1, numerator / (U.get(a + j) - U.get(a)));
                }
                var r = p - mult; // Insert knot r times
                for (var j = 1; j < r + 1; j++) {
                    var save = r - j;
                    var s = mult + j; // This many new points
                    for (var k = p; k > s - 1; k--) {
                        var alpha = alphas.get(k - s);
                        for (var z = 0; z < dim; z++) {
                            Q.set(nb, k, z, alpha * Q.get(nb, k, z) +
                                (1.0 - alpha) * Q.get(nb, k - 1, z));
                        }
                    }
                    if (b < m) {
                        for (var z = 0; z < dim; z++) {
                            Q.set(nb + 1, save, z, Q.get(nb, p, z));
                        }
                    }
                }
            }
            nb += 1;
            if (b < m) {
                for (var i_2 = p - mult; i_2 < p + 1; i_2++) {
                    for (var z = 0; z < dim; z++) {
                        Q.set(nb, i_2, z, P.get(b - p + i_2, z));
                    }
                }
                a = b;
                b += 1;
            }
        }
        var bezlist = [];
        for (var i_3 = 0; i_3 < Q.length; i_3++) {
            bezlist.push(new BezierCurve(p, Q.get(i_3).reshape([p + 1, dim])));
        }
        return bezlist;
    };
    BSplineCurve.prototype.evaluate = function (t, tess, tessidx) {
        var p = this.degree;
        var span = this.findSpan(t);
        var dim = this.dimension;
        var N = this.evaluateBasis(span, t);
        var denominator = this.getTermDenominator(span, N);
        if (tess) {
            tessidx = tessidx || 0;
            for (var i = 0; i < p + 1; i++) {
                var K = void 0;
                if (this.weights) {
                    K = N[i] * this.weights.get(span - p + i) / denominator;
                }
                else {
                    K = N[i] / denominator;
                }
                for (var z = 0; z < dim; z++) {
                    var c = this.cpoints.get(span - p + i, z);
                    tess.set(tessidx, z, tess.get(tessidx, z) + K * c);
                }
            }
            return null;
        }
        else {
            var point = new common_1.NDArray({ shape: [dim] });
            for (var i = 0; i < p + 1; i++) {
                var K = void 0;
                if (this.weights) {
                    K = N[i] * this.weights.get(span - p + i) / denominator;
                }
                else {
                    K = N[i] / denominator;
                }
                for (var z = 0; z < dim; z++) {
                    var c = this.cpoints.get(span - p + i, z);
                    point.set(z, point.get(z) + K * c);
                }
            }
            return point;
        }
    };
    BSplineCurve.prototype.evaluateDerivative = function (t, d, tess, tessidx) {
        var p = this.degree;
        var P = this.cpoints;
        var du = Math.min(d, p);
        var ders = common_1.zeros([du + 1, 2]);
        var span = this.findSpan(t);
        var Nders = this.evaluateBasisDerivatives(span, du, t);
        for (var k = 0; k < du + 1; k++) {
            ders.set(k, 0, 0);
            ders.set(k, 1, 0);
            for (var j = 0; j < p + 1; j++) {
                for (var i = 0; i < 2; i++) {
                    ders.set(k, i, ders.get(k, i) +
                        Nders.get(k, j) * P.get(span - p + j, i));
                }
            }
        }
        if (tess && tessidx !== undefined) {
            for (var i = 0; i < du + 1; i++) {
                for (var j = 0; j < 2; j++) {
                    tess.set(tessidx, i, j, ders.get(i, j));
                }
            }
            return null;
        }
        else {
            throw new Error('Not implemented');
            /*
            let varr = [];
            for(let i=0; i<du+1; i++) {
              varr.push(new Vector2(
                <number>ders.get(i,0), <number>ders.get(i,1)));
            }
            return varr;
            */
        }
    };
    BSplineCurve.prototype.tessellate = function (resolution) {
        if (resolution === void 0) { resolution = 10; }
        var tess = new common_1.NDArray({
            shape: [resolution + 1, this.dimension],
            datatype: 'f32'
        });
        for (var i = 0; i < resolution + 1; i++) {
            this.evaluate(i / resolution, tess, i);
        }
        return tess;
    };
    BSplineCurve.prototype.tessellateDerivatives = function (resolution, d) {
        if (resolution === void 0) { resolution = 10; }
        var tess = new common_1.NDArray({
            shape: [resolution + 1, d, this.dimension],
            datatype: 'f32'
        });
        for (var i = 0; i < resolution + 1; i++) {
            this.evaluateDerivative(i / resolution, d, tess, i);
        }
        return tess;
    };
    BSplineCurve.prototype.clone = function () {
        return new BSplineCurve(this.degree, this.cpoints.clone(), this.knots.clone(), this.weights ? this.weights.clone() : undefined);
    };
    BSplineCurve.prototype.toString = function () {
        var s = "BSpline(Deg " + this.degree + " cpoints " + this.cpoints.toString() + ")";
        s += " knots " + this.knots.toString;
        if (this.weights) {
            s += " weights " + this.weights.toString();
        }
        return s;
    };
    return BSplineCurve;
}());
exports.BSplineCurve = BSplineCurve;
