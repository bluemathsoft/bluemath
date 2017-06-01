import * as utils from './utils';
import * as basic from './basic';
import * as geom from './geom';
import * as linalg from './linalg';
import { EPSILON } from './constants';
declare type NumberType = 'i8' | 'ui8' | 'i16' | 'ui16' | 'i32' | 'ui32' | 'f32' | 'f64';
declare type TypedArray = Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
export { NumberType, utils, basic, geom, linalg, TypedArray, EPSILON };
