export default class Complex {
    real: number;
    imag: number;
    constructor(real?: number, imag?: number);
    clone(): Complex;
    isEqual(other: Complex, tolerance?: number): boolean;
    toString(precision?: number): string;
}
