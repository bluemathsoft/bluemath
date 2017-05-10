
import {EPSILON} from './constants'

/**
 * Convert angle to degrees
 */
export function toDeg(angleInRadians:number) : number {
  return 180 * angleInRadians / Math.PI;
}

/**
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
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
export function cubeRoot(x:number) : number {
  return x<0 ? -Math.pow(-x,1/3) : Math.pow(x,1/3);
}
