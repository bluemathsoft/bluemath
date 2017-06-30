export default class Complex {
    real: number;
    imag: number;
    constructor(real?: number, imag?: number);
    isEqual(other: Complex, tolerance?: number): boolean;
    toString(precision?: number): string;
}
