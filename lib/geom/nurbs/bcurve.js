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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var helper_1 = require("./helper");
var basic_1 = require("../../basic");
var BSplineCurve = (function () {
    function BSplineCurve(degree, cpoints, knots, weights) {
        this.degree = degree;
        this.cpoints = cpoints;
        this.knots = knots;
        this.weights = weights;
        /*
         The degree p, number of control points n+1, number of knots m+1
         are related by
         m = n + p + 1
         [The NURBS book, P3.1]
         */
        var p = degree;
        var m = knots.length + 1;
        var n = cpoints.length + 1;
        console.assert(m === n + p + 1);
    }
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
        return helper_1.getBasisFunction(this.degree, this.knots, span, t);
    };
    BSplineCurve.prototype.findSpan = function (t) {
        return helper_1.findSpan(this.degree, this.knots, t);
    };
    BSplineCurve.prototype.getTermDenominator = function (span, N) {
        var p = this.degree;
        var denominator;
        if (this.weights) {
            denominator = 0.0;
            for (var i = 0; i < N.length; i++) {
                denominator += N[i] * this.weights[span - p + i];
            }
        }
        else {
            denominator = 1.0;
        }
        return denominator;
    };
    return BSplineCurve;
}());
exports.BSplineCurve = BSplineCurve;
var BSplineCurve2D = (function (_super) {
    __extends(BSplineCurve2D, _super);
    function BSplineCurve2D(degree, cpoints, knots, weights) {
        return _super.call(this, degree, cpoints, knots, weights) || this;
    }
    BSplineCurve2D.prototype.evaluate = function (t) {
        var p = this.degree;
        var span = this.findSpan(t);
        var N = this.evaluateBasis(span, t);
        var point = new basic_1.Vector2();
        var denominator = this.getTermDenominator(span, N);
        for (var i = 0; i < p + 1; i++) {
            var K = void 0;
            if (this.weights) {
                K = N[i] * this.weights[span - p + i] / denominator;
            }
            else {
                K = N[i] / denominator;
            }
            var cpoint = this.cpoints[span - p + i];
            point.x += K * cpoint.x;
            point.y += K * cpoint.y;
        }
        return point;
    };
    return BSplineCurve2D;
}(BSplineCurve));
exports.BSplineCurve2D = BSplineCurve2D;
var BSplineCurve3D = (function (_super) {
    __extends(BSplineCurve3D, _super);
    function BSplineCurve3D(degree, cpoints, knots, weights) {
        return _super.call(this, degree, cpoints, knots, weights) || this;
    }
    BSplineCurve3D.prototype.evaluate = function (t) {
        var p = this.degree;
        var span = this.findSpan(t);
        var N = this.evaluateBasis(span, t);
        var point = new basic_1.Vector3();
        var denominator = this.getTermDenominator(span, N);
        for (var i = 0; i < p + 1; i++) {
            var K = void 0;
            if (this.weights) {
                K = N[i] * this.weights[span - p + i] / denominator;
            }
            else {
                K = N[i] / denominator;
            }
            var cpoint = this.cpoints[span - p + i];
            point.x += K * cpoint.x;
            point.y += K * cpoint.y;
            point.z += K * cpoint.z;
        }
        return point;
    };
    return BSplineCurve3D;
}(BSplineCurve));
exports.BSplineCurve3D = BSplineCurve3D;
