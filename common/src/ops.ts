
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
import {EPSILON} from './constants'
import {NDArray} from './ndarray'
import {Complex} from './complex'
import {NumberType} from '.'

/**
 * Convert angle to degrees
 */
export function todeg(angleInRadians:number) : number {
  return 180 * angleInRadians / Math.PI;
}

/**
 * Convert angle to radians
 */
export function torad(angleInDegrees:number) : number {
  return Math.PI * angleInDegrees / 180;
}

/**
 * Check if input equals zero within given tolerance
 */
export function iszero(x:number, tolerance=EPSILON) : boolean {
  // the 'less-than-equal' comparision is necessary for correct result
  // when tolerance = 0
  return Math.abs(x) <= tolerance;
}

/**
 * Check if two input numbers are equal within given tolerance
 */
export function isequal(a:number, b:number, tolerance=EPSILON) : boolean {
  return iszero(a-b, tolerance);
}

/**
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
export function cuberoot(x:number) : number {
  return x<0 ? -Math.pow(-x,1/3) : Math.pow(x,1/3);
}

/**
 * Generate array of integers within given range.
 * If both a and b are specified then return [a,b)
 * if only a is specifed then return [0,a)
 */
export function range(a:number,b?:number) : NDArray {
  if(b === undefined) {
    b = a;
    a = 0;
  }
  b = Math.max(b,0);
  let arr = [];
  for(let i=a; i<b; i++) {
    arr.push(i);
  }
  return new NDArray(arr,{datatype:'i32'});
}

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
export function eye(arg0:number|number[], datatype?:NumberType) {
  let n,m;
  if(Array.isArray(arg0)) {
    n = arg0[0];
    if(arg0.length > 1) {
      m = arg0[1];
    } else {
      m = n;
    }
  } else {
    n = m = arg0;
  }
  let A = new NDArray({shape:[n,m],datatype:datatype,fill:0});
  let ndiag = Math.min(n,m);
  for(let i=0; i<ndiag; i++) {
    A.set(i,i,1);
  }
  return A;
}

export function count(arr:NDArray, item:number, tolerance=EPSILON) {
  let n = 0;
  arr.forEach(function (val:number) {
    if(isequal(item, val, tolerance)) {
      n++;
    }
  });
  return n;
}

/**
 * Creates NDArray filled with zeros
 * 
 * ```
 * zeros(2) // Creates array of zeros of length 2
 * zeros([2,2,2]) // Create 2x2x2 matrix of zeros
 * zeros(2,'i16') // Creates array of 2 16-bit integers filled with zeros
 * ```
 */
export function zeros(arg0:number|number[], datatype?:NumberType) {
  let A;
  if(Array.isArray(arg0)) {
    A = new NDArray({shape:arg0, datatype:datatype});
  } else {
    A = new NDArray({shape:[arg0], datatype:datatype})
  }
  A.fill(0);
  return A;
}

/**
 * Creates empty NDArray of given shape or of given length if argument is
 * a number
 */
export function empty(arg0:number|number[], datatype?:NumberType) {
  let A;
  if(Array.isArray(arg0)) {
    A = new NDArray({shape:arg0, datatype:datatype});
  } else {
    A = new NDArray({shape:[arg0], datatype:datatype})
  }
  return A;
}

/**
 * @hidden
 */
function _add_numbers(a:number|Complex, b:number|Complex) {
  if(typeof a === 'number') {
    if(typeof b === 'number') {
      return a+b;
    } else if(b instanceof Complex) {
      let answer = b.clone();
      answer.real += a;
      return answer;
    }
  } else if(a instanceof Complex) {
    if(typeof b === 'number') {
      let answer = a.clone();
      answer.real += b;
      return answer;
    } else if(b instanceof Complex) {
      let answer = a.clone();
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
function _add_ndarrays(a:NDArray, b:NDArray) : NDArray {
  if(!a.isShapeEqual(b)) {
    throw new Error('Addition of NDArray with mismatched shapes');
  }
  let answer = a.clone();
  a.forEach((value, ...index:number[]) => {
    let aval = value;
    let bval = <number|Complex>b.get(...index);
    let ansval = _add_numbers(aval, bval);
    answer.set(...index, ansval);
  });
  return answer;
}

/**
 * @hidden
 */
function _add_ndarray_and_number(a:NDArray, b:number|Complex) {
  let answer = a.clone();
  a.forEach((value,...index:number[]) => {
    let aval = value;
    let ansval = _add_numbers(aval, b);
    answer.set(...index, ansval);
  });
  return answer;
}

/**
 * @hidden
 */
function _add_two(a:NDArray|number|Complex, b:NDArray|number|Complex)
  : NDArray|number|Complex
{
  if(a === 0) {
    return b;
  }
  if(b === 0) {
    return a;
  }
  if(typeof a === 'number') {
    if(typeof b === 'number' || b instanceof Complex) {
      return _add_numbers(a,b);
    } else if(b instanceof NDArray) {
      return _add_ndarray_and_number(b, a);
    }
  } else if(a instanceof NDArray) {
    if(typeof b === 'number' || b instanceof Complex) {
      return _add_ndarray_and_number(a, b);
    } else if(b instanceof NDArray) {
      return _add_ndarrays(a, b);
    }
  } else if(a instanceof Complex) {
    if(typeof b === 'number' || b instanceof Complex) {
      return _add_numbers(a,b);
    } else if(b instanceof NDArray) {
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
export function add(...args:(NDArray|number|Complex)[]) {
  let acc:number|Complex|NDArray = args[0];
  for(let i=1; i<args.length; i++) {
    acc = _add_two(acc, args[i]);
  }
  return acc;
}

/**
 * @hidden
 */
function _mul_numbers(a:number|Complex, b:number|Complex) {
  if(typeof a === 'number') {
    if(typeof b === 'number') {
      return a * b;
    } else if(b instanceof Complex) {
      let answer = b.clone();
      answer.real *=  a;
      answer.imag *= a;
      return answer;
    }
  } else if(a instanceof Complex) {
    if(typeof b === 'number') {
      let answer = a.clone();
      answer.real *= b;
      answer.imag *= b;
      return answer;
    } else if(b instanceof Complex) {
      let answer = new Complex();
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
function _mul_two(a:NDArray|number|Complex, b:NDArray|number|Complex)
  : NDArray|number|Complex
{
  if(a === 1) {
    return b;
  }
  if(b === 1) {
    return a;
  }
  if(typeof a === 'number' || a instanceof Complex) {
    if(typeof b === 'number' || b instanceof Complex) {
      return _mul_numbers(a,b);
    } else if(b instanceof NDArray) {
      let answer = b.clone();
      answer.forEach((value, ...index:number[]) => {
        answer.set(...index, _mul_numbers(a, value));
      });
      return answer;
    }
  } else if(a instanceof NDArray) {
    if(typeof b === 'number' || b instanceof Complex) {
      let answer = a.clone();
      answer.forEach((value, ...index:number[]) => {
        answer.set(...index, _mul_numbers(b, value));
      });
      return answer;
    } else if(b instanceof NDArray) {
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
export function mul(...args:(NDArray|number|Complex)[]) {
  let acc:number|Complex|NDArray = args[0];
  for(let i=1; i<args.length; i++) {
    acc = _mul_two(acc, args[i]);
  }
  return acc;
}

/**
 * Subtract second argument from first
 * The arguments could be a number (real or complex) or NDArray.
 * If some of the arguments are NDArrays, then their shapes should
 * be compatible with the other operand of subtraction operation,
 * otherwise an exception is thrown
 */
export function sub(a:number|Complex|NDArray, b:number|Complex|NDArray) {
  return _add_two(a, _mul_two(-1,b));
}

/**
 * Divide first argument by second
 * The first argument can be a number (real or complex) or NDArray.
 * The second argument can be a number (real or complex)
 */
export function div(a:number|Complex|NDArray, b:number|Complex) {
  if(b instanceof Complex) {
    return _mul_two(a, b.inverse());
  } else {
    return _mul_two(a, 1/b);
  }
}
