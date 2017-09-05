"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var constants_1 = require("./constants");
var ndarray_1 = require("./ndarray");
var complex_1 = require("./complex");
/**
 * Convert angle to degrees
 */
function todeg(angleInRadians) {
    return 180 * angleInRadians / Math.PI;
}
exports.todeg = todeg;
/**
 * Convert angle to radians
 */
function torad(angleInDegrees) {
    return Math.PI * angleInDegrees / 180;
}
exports.torad = torad;
/**
 * Check if input equals zero within given tolerance
 */
function iszero(x, tolerance) {
    if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
    // the 'less-than-equal' comparision is necessary for correct result
    // when tolerance = 0
    return Math.abs(x) <= tolerance;
}
exports.iszero = iszero;
/**
 * Check if two input numbers are equal within given tolerance
 */
function isequal(a, b, tolerance) {
    if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
    return iszero(a - b, tolerance);
}
exports.isequal = isequal;
/**
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
function cuberoot(x) {
    return x < 0 ? -Math.pow(-x, 1 / 3) : Math.pow(x, 1 / 3);
}
exports.cuberoot = cuberoot;
/**
 * Generate array of integers within given range.
 * If both a and b are specified then return [a,b)
 * if only a is specifed then return [0,a)
 */
function range(a, b) {
    if (b === undefined) {
        b = a;
        a = 0;
    }
    b = Math.max(b, 0);
    var arr = [];
    for (var i = a; i < b; i++) {
        arr.push(i);
    }
    return new ndarray_1.NDArray(arr, { datatype: 'i32' });
}
exports.range = range;
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
    var A = new ndarray_1.NDArray({ shape: [n, m], datatype: datatype, fill: 0 });
    var ndiag = Math.min(n, m);
    for (var i = 0; i < ndiag; i++) {
        A.set(i, i, 1);
    }
    return A;
}
exports.eye = eye;
function count(arr, item, tolerance) {
    if (tolerance === void 0) { tolerance = constants_1.EPSILON; }
    var n = 0;
    arr.forEach(function (val) {
        if (isequal(item, val, tolerance)) {
            n++;
        }
    });
    return n;
}
exports.count = count;
/**
 * Creates NDArray filled with zeros
 *
 * ```
 * zeros(2) // Creates array of zeros of length 2
 * zeros([2,2,2]) // Create 2x2x2 matrix of zeros
 * zeros(2,'i16') // Creates array of 2 16-bit integers filled with zeros
 * ```
 */
function zeros(arg0, datatype) {
    var A;
    if (Array.isArray(arg0)) {
        A = new ndarray_1.NDArray({ shape: arg0, datatype: datatype });
    }
    else {
        A = new ndarray_1.NDArray({ shape: [arg0], datatype: datatype });
    }
    A.fill(0);
    return A;
}
exports.zeros = zeros;
/**
 * Creates empty NDArray of given shape or of given length if argument is
 * a number
 */
function empty(arg0, datatype) {
    var A;
    if (Array.isArray(arg0)) {
        A = new ndarray_1.NDArray({ shape: arg0, datatype: datatype });
    }
    else {
        A = new ndarray_1.NDArray({ shape: [arg0], datatype: datatype });
    }
    return A;
}
exports.empty = empty;
/**
 * Shorthand method to create new NDArray object from Javascript Array
 */
function arr(arg) {
    return new ndarray_1.NDArray(arg);
}
exports.arr = arr;
/**
 * Compute dot product of A and B, where both of them are 1D vectors of
 * same length
 */
function dot(A, B) {
    if (A.shape.length !== 1) {
        throw new Error('A is not a 1D array');
    }
    if (B.shape.length !== 1) {
        throw new Error('B is not a 1D array');
    }
    if (A.data.length !== B.data.length) {
        throw new Error("A and B are of different length");
    }
    var dot = 0.0;
    for (var i = 0; i < A.data.length; i++) {
        dot += A.data[i] * B.data[i];
    }
    return dot;
}
exports.dot = dot;
/**
 * Computes cross product of A and B
 * Only defined for A and B to 1D vectors of length at least 3
 * Only first 3 elements of A and B are used
 */
function cross(A, B) {
    if (A.shape.length !== 1 || B.shape.length !== 1) {
        throw new Error('A or B is not 1D');
    }
    if (A.length < 3 || B.length < 3) {
        throw new Error('A or B is less than 3 in length');
    }
    var a1 = A.getN(0);
    var a2 = A.getN(1);
    var a3 = A.getN(2);
    var b1 = B.getN(0);
    var b2 = B.getN(1);
    var b3 = B.getN(2);
    return new ndarray_1.NDArray([
        a2 * b3 - a3 * b2,
        a3 * b1 - a1 * b3,
        a1 * b2 - a2 * b1
    ]);
}
exports.cross = cross;
/**
 * Computes length or magnitude of A, where A is a 1D vector
 */
function length(A) {
    if (A.shape.length !== 1) {
        throw new Error('A is not a 1D array');
    }
    return Math.sqrt(dot(A, A));
}
exports.length = length;
/**
 * Computes direction vector of A, where A is a 1D vector
 */
function dir(A) {
    if (A.shape.length !== 1) {
        throw new Error('A is not a 1D array');
    }
    return div(A, length(A));
}
exports.dir = dir;
/**
 * @hidden
 */
function _add_numbers(a, b) {
    if (typeof a === 'number') {
        if (typeof b === 'number') {
            return a + b;
        }
        else if (b instanceof complex_1.Complex) {
            var answer = b.clone();
            answer.real += a;
            return answer;
        }
    }
    else if (a instanceof complex_1.Complex) {
        if (typeof b === 'number') {
            var answer = a.clone();
            answer.real += b;
            return answer;
        }
        else if (b instanceof complex_1.Complex) {
            var answer = a.clone();
            answer.real += b.real;
            answer.imag += b.imag;
            return answer;
        }
    }
    throw new Error('Addition of incompatible types');
}
/**
 * @hidden
 */
function _add_ndarrays(a, b) {
    if (!a.isShapeEqual(b)) {
        throw new Error('Addition of NDArray with mismatched shapes');
    }
    var answer = a.clone();
    a.forEach(function (value) {
        var index = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            index[_i - 1] = arguments[_i];
        }
        var aval = value;
        var bval = b.get.apply(b, index);
        var ansval = _add_numbers(aval, bval);
        answer.set.apply(answer, index.concat([ansval]));
    });
    return answer;
}
/**
 * @hidden
 */
function _add_ndarray_and_number(a, b) {
    var answer = a.clone();
    a.forEach(function (value) {
        var index = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            index[_i - 1] = arguments[_i];
        }
        var aval = value;
        var ansval = _add_numbers(aval, b);
        answer.set.apply(answer, index.concat([ansval]));
    });
    return answer;
}
/**
 * @hidden
 */
function _add_two(a, b) {
    if (a === 0) {
        return b;
    }
    if (b === 0) {
        return a;
    }
    if (typeof a === 'number') {
        if (typeof b === 'number' || b instanceof complex_1.Complex) {
            return _add_numbers(a, b);
        }
        else if (b instanceof ndarray_1.NDArray) {
            return _add_ndarray_and_number(b, a);
        }
    }
    else if (a instanceof ndarray_1.NDArray) {
        if (typeof b === 'number' || b instanceof complex_1.Complex) {
            return _add_ndarray_and_number(a, b);
        }
        else if (b instanceof ndarray_1.NDArray) {
            return _add_ndarrays(a, b);
        }
    }
    else if (a instanceof complex_1.Complex) {
        if (typeof b === 'number' || b instanceof complex_1.Complex) {
            return _add_numbers(a, b);
        }
        else if (b instanceof ndarray_1.NDArray) {
            return _add_ndarray_and_number(b, a);
        }
    }
    throw new Error('Addition of invalid types');
}
/**
 * Add all arguments in accordance to their types
 * The arguments could be NDArray or numbers (real/complex).
 * If some of them are NDArray's, then their shapes have to match,
 * otherwise exception is thrown
 * The order of addition starts from left to right
 */
function add() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var acc = args[0];
    for (var i = 1; i < args.length; i++) {
        acc = _add_two(acc, args[i]);
    }
    return acc;
}
exports.add = add;
/**
 * @hidden
 */
function _mul_numbers(a, b) {
    if (typeof a === 'number') {
        if (typeof b === 'number') {
            return a * b;
        }
        else if (b instanceof complex_1.Complex) {
            var answer = b.clone();
            answer.real *= a;
            answer.imag *= a;
            return answer;
        }
    }
    else if (a instanceof complex_1.Complex) {
        if (typeof b === 'number') {
            var answer = a.clone();
            answer.real *= b;
            answer.imag *= b;
            return answer;
        }
        else if (b instanceof complex_1.Complex) {
            var answer = new complex_1.Complex();
            answer.real = a.real * b.real - a.imag * b.imag;
            answer.imag = a.imag * b.real + a.real * b.imag;
            return answer;
        }
    }
    throw new Error('Multiplication of incompatible types');
}
/**
 * @hidden
 */
function _mul_two(a, b) {
    if (a === 1) {
        return b;
    }
    if (b === 1) {
        return a;
    }
    if (typeof a === 'number' || a instanceof complex_1.Complex) {
        if (typeof b === 'number' || b instanceof complex_1.Complex) {
            return _mul_numbers(a, b);
        }
        else if (b instanceof ndarray_1.NDArray) {
            var answer_1 = b.clone();
            answer_1.forEach(function (value) {
                var index = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    index[_i - 1] = arguments[_i];
                }
                answer_1.set.apply(answer_1, index.concat([_mul_numbers(a, value)]));
            });
            return answer_1;
        }
    }
    else if (a instanceof ndarray_1.NDArray) {
        if (typeof b === 'number' || b instanceof complex_1.Complex) {
            var answer_2 = a.clone();
            answer_2.forEach(function (value) {
                var index = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    index[_i - 1] = arguments[_i];
                }
                answer_2.set.apply(answer_2, index.concat([_mul_numbers(b, value)]));
            });
            return answer_2;
        }
        else if (b instanceof ndarray_1.NDArray) {
            throw new Error("NDArray*NDarray is not supported. Consider linalg.matmul");
        }
    }
    throw new Error('Multiplication of incompatible types');
}
/**
 * Multiply all arguments in accordance with their data types
 * Each argument can be a number (real or complex) or NDArray.
 * If some of the arguments are NDArrays, then their shapes should
 * be compatible with the other operand of multiplication operation,
 * otherwise an exception is thrown
 * The order of multiplication starts from left to right
 */
function mul() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var acc = args[0];
    for (var i = 1; i < args.length; i++) {
        acc = _mul_two(acc, args[i]);
    }
    return acc;
}
exports.mul = mul;
/**
 * Subtract second argument from first
 * The arguments could be a number (real or complex) or NDArray.
 * If some of the arguments are NDArrays, then their shapes should
 * be compatible with the other operand of subtraction operation,
 * otherwise an exception is thrown
 */
function sub(a, b) {
    return _add_two(a, _mul_two(-1, b));
}
exports.sub = sub;
/**
 * Divide first argument by second
 * The first argument can be a number (real or complex) or NDArray.
 * The second argument can be a number (real or complex)
 */
function div(a, b) {
    if (b instanceof complex_1.Complex) {
        return _mul_two(a, b.inverse());
    }
    else {
        return _mul_two(a, 1 / b);
    }
}
exports.div = div;
