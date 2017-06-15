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
var lapacklite = require("../../../ext/lapacklite");
var em = lapacklite.Module;
/**
 * @hidden
 */
exports.SIZE_CHAR = 1;
/**
 * @hidden
 */
exports.SIZE_INT = 4;
/**
 * @hidden
 */
exports.SIZE_DOUBLE = 8;
/**
 * @hidden
 */
exports.SIZE_SINGLE = 4;
/**
 * @hidden
 */
exports.spotrf_wrap = em.cwrap('spotrf_', null, ['number', 'number', 'number', 'number', 'number']);
/**
 * @hidden
 */
exports.dpotrf_wrap = em.cwrap('dpotrf_', null, ['number', 'number', 'number', 'number', 'number']);
/**
 * @hidden
 */
exports.sgesv_wrap = em.cwrap('sgesv_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.dgesv_wrap = em.cwrap('dgesv_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.sgemm_wrap = em.cwrap('sgemm_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.dgemm_wrap = em.cwrap('dgemm_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.dgemv_wrap = em.cwrap('dgemv_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.sgemv_wrap = em.cwrap('sgemv_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.sdot_wrap = em.cwrap('sdot_', null, ['number', 'number', 'number', 'number', 'number']);
/**
 * @hidden
 */
exports.ddot_wrap = em.cwrap('ddot_', null, ['number', 'number', 'number', 'number', 'number']);
/**
 * @hidden
 */
exports.dgesdd_wrap = em.cwrap('dgesdd_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.sgesdd_wrap = em.cwrap('sgesdd_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.sgeqrf_wrap = em.cwrap('sgeqrf_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
]);
/**
 * @hidden
 */
exports.dgeqrf_wrap = em.cwrap('dgeqrf_', null, [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
]);
/**
 * @hidden
 */
function defineEmVariable(type, init) {
    var p;
    switch (type) {
        case 'i32':
            p = em._malloc(exports.SIZE_INT);
            if (init) {
                em.setValue(p, init, type);
            }
            break;
        case 'i8':
            p = em._malloc(exports.SIZE_CHAR);
            if (init) {
                em.setValue(p, init, type);
            }
            break;
        case 'f32':
            p = em._malloc(exports.SIZE_SINGLE);
            if (init) {
                em.setValue(p, init, 'float');
            }
            break;
        case 'f64':
            p = em._malloc(exports.SIZE_DOUBLE);
            if (init) {
                em.setValue(p, init, 'double');
            }
            break;
        default:
            throw new Error('Unhandled variable type');
    }
    return p;
}
exports.defineEmVariable = defineEmVariable;
/**
 * @hidden
 */
function defineEmArrayVariable(type, len, init) {
    var p, arr;
    switch (type) {
        case 'i8':
            p = em._malloc(len * exports.SIZE_CHAR);
            arr = new Int8Array(em.HEAP8.buffer, p, len);
            if (init) {
                arr.set(init);
            }
            return [p, arr];
        case 'i32':
            p = em._malloc(len * exports.SIZE_INT);
            arr = new Int32Array(em.HEAP32.buffer, p, len);
            if (init) {
                arr.set(init);
            }
            return [p, arr];
        case 'f32':
            p = em._malloc(len * exports.SIZE_SINGLE);
            arr = new Float32Array(em.HEAPF32.buffer, p, len);
            if (init) {
                arr.set(init);
            }
            return [p, arr];
        case 'f64':
            p = em._malloc(len * exports.SIZE_DOUBLE);
            arr = new Float64Array(em.HEAPF64.buffer, p, len);
            if (init) {
                arr.set(init);
            }
            return [p, arr];
        default:
            throw new Error('Unhandled type');
    }
}
exports.defineEmArrayVariable = defineEmArrayVariable;
