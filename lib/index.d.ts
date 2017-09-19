import { eye, zeros, empty, range, iszero, isequal, torad, todeg, add, mul, sub, div, count, NDArray, Complex, EPSILON } from '@bluemath/common';
import * as linalg from '@bluemath/linalg';
import * as geom from '@bluemath/geom';
import * as topo from '@bluemath/topo';
export declare type NumberType = 'i8' | 'ui8' | 'i16' | 'ui16' | 'i32' | 'ui32' | 'f32' | 'f64';
export declare type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export declare const version = "0.3.3";
export { linalg, geom, topo, EPSILON, NDArray, Complex, eye, zeros, empty, range, iszero, isequal, torad, todeg, add, mul, sub, div, count };
