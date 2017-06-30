import { TypedArray } from '../..';
/**
 * @hidden
 */
export declare const SIZE_CHAR = 1;
/**
 * @hidden
 */
export declare const SIZE_INT = 4;
/**
 * @hidden
 */
export declare const SIZE_DOUBLE = 8;
/**
 * @hidden
 */
export declare const SIZE_SINGLE = 4;
/**
 * @hidden
 */
export declare const spotrf_wrap: any;
/**
 * @hidden
 */
export declare const dpotrf_wrap: any;
/**
 * @hidden
 */
export declare const sgesv_wrap: any;
/**
 * @hidden
 */
export declare const dgesv_wrap: any;
/**
 * @hidden
 */
export declare const sgemm_wrap: any;
/**
 * @hidden
 */
export declare const dgemm_wrap: any;
/**
 * @hidden
 */
export declare const dgemv_wrap: any;
/**
 * @hidden
 */
export declare const sgemv_wrap: any;
/**
 * @hidden
 */
export declare const sdot_wrap: any;
/**
 * @hidden
 */
export declare const ddot_wrap: any;
/**
 * @hidden
 */
export declare const dgesdd_wrap: any;
/**
 * @hidden
 */
export declare const sgesdd_wrap: any;
/**
 * @hidden
 */
export declare const sgeqrf_wrap: any;
/**
 * @hidden
 */
export declare const dgeqrf_wrap: any;
/**
 * @hidden
 */
export declare const sorgqr_wrap: any;
/**
 * @hidden
 */
export declare const dorgqr_wrap: any;
/**
 * @hidden
 */
export declare const dgelsd_wrap: any;
/**
 * @hidden
 */
export declare const sgetrf_wrap: any;
/**
 * @hidden
 */
export declare const dgetrf_wrap: any;
/**
 * @hidden
 */
export declare const sgeev_wrap: any;
/**
 * @hidden
 */
export declare const dgeev_wrap: any;
/**
 * @hidden
 */
export declare function defineEmVariable(type: 'i8' | 'i32' | 'f32' | 'f64', init?: number): number;
/**
 * @hidden
 */
export declare function defineEmArrayVariable(type: 'i8' | 'i32' | 'f32' | 'f64', len: number, init?: TypedArray): [number, TypedArray];
