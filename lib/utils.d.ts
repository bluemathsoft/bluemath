/**
 * @hidden
 * Convert angle to degrees
 */
export declare function toDeg(angleInRadians: number): number;
/**
 * @hidden
 * Convert angle to radians
 */
export declare function toRad(angleInDegrees: number): number;
/**
 * Check if input equals zero within given tolerance
 */
export declare function isZero(x: number, tolerance?: number): boolean;
/**
 * Check if two input numbers are equal within given tolerance
 */
export declare function isEqualFloat(a: number, b: number, tolerance?: number): boolean;
/**
 * @hidden
 * Find cube root of given number. Math.pow return NaN while taking
 * cube root of negative number, because some of the results might
 * be complex numbers. This function only return the real cubeRoot
 * of given number
 */
export declare function cubeRoot(x: number): number;
