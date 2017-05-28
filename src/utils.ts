
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

/**
 * @hidden
 * Convert angle to degrees
 */
export function toDeg(angleInRadians:number) : number {
  return 180 * angleInRadians / Math.PI;
}

/**
 * @hidden
 * Convert angle to radians
 */
export function toRad(angleInDegrees:number) : number {
  return Math.PI * angleInDegrees / 180;
}

/**
 * Check if input equals zero within given tolerance
 */
export function isZero(x:number, tolerance=EPSILON) : boolean {
  return Math.abs(x) < tolerance;
}

/**
 * Check if two input numbers are equal within given tolerance
 */
export function isEqualFloat(a:number, b:number, tolerance=EPSILON) : boolean {
  return isZero(a-b, tolerance);
}

/**
 * @hidden
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
export function cubeRoot(x:number) : number {
  return x<0 ? -Math.pow(-x,1/3) : Math.pow(x,1/3);
}