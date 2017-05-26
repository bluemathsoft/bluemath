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
var matrix_1 = require("./matrix");
;
var BandMatrix = (function (_super) {
    __extends(BandMatrix, _super);
    function BandMatrix(def) {
        var _this = this;
        var nrows = def.lowerbandwidth + def.upperbandwidth + 1;
        var ncols = Math.min(def.rows, def.cols);
        console.assert(def.data.length === nrows * ncols);
        _this = _super.call(this, { rows: nrows, cols: ncols, data: def.data }) || this;
        _this._def = def;
        return _this;
    }
    /**
     *
     * @example
     * For the rectangular matrix
     *    -                         -
     *    | a11 a12 a13   0   0   0 |
     *    | a21 a22 a23 a24   0   0 |
     *    |   0 a32 a33 a34 a35   0 |
     *    |   0   0 a43 a44 a45   0 |
     *    |   0   0   0 a54 a55 a56 |
     *    |   0   0   0   0 a65 a66 |
     *    -                         -
     *
     * Band matrix is given by
     *    lower bandwidth p = 1
     *    upper bandwidth q = 2
     *    -                         -
     *    |   *   * a13 a24 a35 a46 |
     *    |   * a12 a23 a34 a45 a56 |
     *    | a11 a22 a33 a44 a55 a66 |
     *    | a21 a32 a43 a54 a65   * |
     *    -                         -
     */
    BandMatrix.prototype.toRectangularMatrix = function () {
        var m = new matrix_1.default({
            rows: this._def.rows,
            cols: this._def.cols
        }, 'float32');
        var q = this._def.upperbandwidth;
        for (var i = 0; i < m.rows; i++) {
            for (var j = 0; j < m.cols; j++) {
                var brow = i - j + q;
                var bcol = j;
                if (brow < 0 || brow >= this.rows ||
                    bcol < 0 || bcol >= this.cols) {
                    m.set(i, j, 0);
                }
                else {
                    m.set(i, j, this.get(brow, bcol));
                }
            }
        }
        return m;
    };
    return BandMatrix;
}(matrix_1.default));
exports.default = BandMatrix;
