
export type NumberType = 'i8'|'ui8'|'i16'|'ui16'|'i32'|'ui32'|'f32'|'f64';
export type TypedArray = Int8Array | Uint8Array | Int16Array |
    Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

import {
  eye, zeros, empty, arr,
  range,
  iszero, isequal,
  torad, todeg,
  add, mul, sub, div,
  dot, length,
  count
} from './ops'
import {EPSILON} from './constants'
import {NDArray} from './ndarray'
import {Complex} from './complex'

export {

  // Constants
  EPSILON,

  // Classes
  NDArray,
  Complex,

  // Ops
  eye, zeros, empty, arr,
  range,
  iszero, isequal,
  torad, todeg,
  add, mul, sub, div,
  dot, length,
  count
}
