"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ndarray_1 = require("../basic/ndarray");
/**
 * Creates m-by-n Identity matrix
 *
 * ```
 * eye(2) // Creates 2x2 Identity matrix
 * eye([2,2]) // Creates 2x2 Identity matrix
 * eye([2,3]) // Create 2x3 Identity matrix with main diagonal set to 1
 * eye(2,'i32') // Creates 2x2 Identity matrix of 32-bit integers
 * ```
 */
function eye(arg0, datatype) {
    var n, m;
    if (Array.isArray(arg0)) {
        n = arg0[0];
        if (arg0.length > 1) {
            m = arg0[1];
        }
        else {
            m = n;
        }
    }
    else {
        n = m = arg0;
    }
    var A = new ndarray_1.default({ shape: [n, m], datatype: datatype, fill: 0 });
    var ndiag = Math.min(n, m);
    for (var i = 0; i < ndiag; i++) {
        A.set(i, i, 1);
    }
    return A;
}
exports.eye = eye;
/**
 * Creates NDArray of filled with zeros
 *
 * ```
 * zeros(2) // Creates 2x2 matrix of zeros
 * zeros([2,2,2]) // Create 2x2x2 matrix of zeros
 * zeros(2,'i16') // Creates 2x2 matrix of 16-bit integers filled with zeros
 * ```
 */
function zeros(arg0, datatype) {
    var A;
    if (Array.isArray(arg0)) {
        A = new ndarray_1.default({ shape: arg0, datatype: datatype });
    }
    else {
        A = new ndarray_1.default({ shape: [arg0, arg0], datatype: datatype });
    }
    A.fill(0);
    return A;
}
exports.zeros = zeros;
