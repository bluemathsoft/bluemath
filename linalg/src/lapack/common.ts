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

import * as lapacklite from '../../../ext/lapacklite'
let em = lapacklite.Module;

import {TypedArray} from '@bluemath/common'

/**
 * @hidden
 */
export const SIZE_CHAR = 1;
/**
 * @hidden
 */
export const SIZE_INT = 4;
/**
 * @hidden
 */
export const SIZE_DOUBLE = 8;
/**
 * @hidden
 */
export const SIZE_SINGLE = 4;

/**
 * @hidden
 */
export const spotrf_wrap = em.cwrap('spotrf_',null,
  ['number','number','number','number','number']);

/**
 * @hidden
 */
export const dpotrf_wrap = em.cwrap('dpotrf_',null,
  ['number','number','number','number','number']);

/**
 * @hidden
 */
export const sgesv_wrap = em.cwrap('sgesv_',
  null,
  [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
  ]);

/**
 * @hidden
 */
export const dgesv_wrap = em.cwrap('dgesv_',
  null,
  [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
  ]);

/**
 * @hidden
 */
export const sgemm_wrap = em.cwrap('sgemm_',
  null,
  [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
  ]);

/**
 * @hidden
 */
export const dgemm_wrap = em.cwrap('dgemm_',
  null,
  [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number'
  ]);

/**
 * @hidden
 */
export const dgemv_wrap = em.cwrap('dgemv_',
  null,
  [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number'
  ]);

/**
 * @hidden
 */
export const sgemv_wrap = em.cwrap('sgemv_',
  null,
  [
    'number', 'number', 'number', 'number', 'number',
    'number', 'number', 'number', 'number', 'number'
  ]);

/**
 * @hidden
 */
export const sdot_wrap = em.cwrap('sdot_',
  null,
  ['number', 'number', 'number', 'number', 'number']);

/**
 * @hidden
 */
export const ddot_wrap = em.cwrap('ddot_',
  null,
  ['number', 'number', 'number', 'number', 'number']);

/**
 * @hidden
 */
export const dgesdd_wrap = em.cwrap('dgesdd_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export const sgesdd_wrap = em.cwrap('sgesdd_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export const sgeqrf_wrap = em.cwrap('sgeqrf_', null,
  [
    'number','number','number','number','number',
    'number','number','number'
  ]);

/**
 * @hidden
 */
export const dgeqrf_wrap = em.cwrap('dgeqrf_', null,
  [
    'number','number','number','number','number',
    'number','number','number'
  ]);

/**
 * @hidden
 */
export const sorgqr_wrap = em.cwrap('sorgqr_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export const dorgqr_wrap = em.cwrap('dorgqr_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export const dgelsd_wrap = em.cwrap('dgelsd_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export const sgetrf_wrap = em.cwrap('sgetrf_', null,
  [
    'number','number','number','number','number','number'
  ]);

/**
 * @hidden
 */
export const dgetrf_wrap = em.cwrap('dgetrf_', null,
  [
    'number','number','number','number','number','number'
  ]);

/**
 * @hidden
 */
export const sgeev_wrap = em.cwrap('sgeev_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export const dgeev_wrap = em.cwrap('dgeev_', null,
  [
    'number','number','number','number','number',
    'number','number','number','number','number',
    'number','number','number','number'
  ]);

/**
 * @hidden
 */
export function defineEmVariable(
  type:'i8'|'i32'|'f32'|'f64',
  init?:number)
{
  let p;
  switch(type) {
    case 'i32':
      p = em._malloc(SIZE_INT);
      if(init) {
        em.setValue(p, init, type);
      }
      break;
    case 'i8':
      p = em._malloc(SIZE_CHAR);
      if(init) {
        em.setValue(p, init, type);
      }
      break;
    case 'f32':
      p = em._malloc(SIZE_SINGLE);
      if(init) {
        em.setValue(p, init, 'float');
      }
      break;
    case 'f64':
      p = em._malloc(SIZE_DOUBLE);
      if(init) {
        em.setValue(p, init, 'double');
      }
      break;
    default:
      throw new Error('Unhandled variable type');
  }
  return p;
}

/**
 * @hidden
 */
export function defineEmArrayVariable(
  type:'i8'|'i32'|'f32'|'f64',
  len:number,
  init?:TypedArray
) : [number,TypedArray]
{
  let p:number, arr:TypedArray;
  switch(type) {
    case 'i8':
      p = em._malloc(len * SIZE_CHAR);
      arr = new Int8Array(em.HEAP8.buffer, p, len);
      if(init) {
        arr.set(init);
      }
      return [p,arr];
    case 'i32':
      p = em._malloc(len * SIZE_INT);
      arr = new Int32Array(em.HEAP32.buffer, p, len);
      if(init) {
        arr.set(init);
      }
      return [p,arr];
    case 'f32':
      p = em._malloc(len * SIZE_SINGLE);
      arr = new Float32Array(em.HEAPF32.buffer, p, len);
      if(init) {
        arr.set(init);
      }
      return [p,arr];
    case 'f64':
      p = em._malloc(len * SIZE_DOUBLE);
      arr = new Float64Array(em.HEAPF64.buffer, p, len);
      if(init) {
        arr.set(init);
      }
      return [p,arr];
    default:
      throw new Error('Unhandled type');
  }
}