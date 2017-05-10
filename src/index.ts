
import {EPSILON} from './constants'
import Vector2 from './vector2'

/**
 * Convert angle to degrees
 */
function toDeg(angleInRadians:number) : number {
  return 180 * angleInRadians / Math.PI;
}

/**
 * Convert angle to radians
 */
function toRad(angleInDegrees:number) : number {
  return Math.PI * angleInDegrees / 180;
}

/**
 * Check if input equals zero within given tolerance
 */
function isZero(x:number, tolerance=EPSILON) : boolean {
  return Math.abs(x) < tolerance;
}

/**
 * Check if two input numbers are equal within given tolerance
 */
function isEqualFloat(a:number, b:number, tolerance=EPSILON) : boolean {
  return isZero(a-b, tolerance);
}

/**
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
function cubeRoot(x:number) : number {
  return x<0 ? -Math.pow(-x,1/3) : Math.pow(x,1/3);
}


export {
  Vector2,
  toDeg, toRad, isZero, isEqualFloat, cubeRoot
}
