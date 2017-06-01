"use strict";
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
var vector_1 = require("./vector");
var matrix_1 = require("./matrix");
/**
 * @hidden
 */
var PermutationVector = (function (_super) {
    __extends(PermutationVector, _super);
    function PermutationVector(arg0, datatype) {
        var _this = _super.call(this, arg0, datatype || 'i16') || this;
        if (typeof arg0 === 'number') {
            // Initialize the Permutation vector to [0,1,2,...,n-1]
            // This corresponds to Identity matrix
            for (var i = 0; i < arg0; i++) {
                _this._data[i] = i;
            }
        }
        return _this;
    }
    PermutationVector.prototype.toMatrix = function () {
        var n = this._data.length;
        var d = new Int32Array(n * n);
        for (var i = 0; i < n; i++) {
            var j = this.get(i);
            d[i * n + j] = 1;
        }
        return new matrix_1.default({
            rows: this._data.length,
            cols: this._data.length,
            data: d
        });
    };
    return PermutationVector;
}(vector_1.default));
exports.default = PermutationVector;
