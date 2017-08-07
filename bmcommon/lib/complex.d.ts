export declare class Complex {
    real: number;
    imag: number;
    constructor(real?: number, imag?: number);
    clone(): Complex;
    inverse(): Complex;
    isEqual(other: Complex, tolerance?: number): boolean;
    toString(precision?: number): string;
}
