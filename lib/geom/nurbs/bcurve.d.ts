import { Vector, Vector2, Vector3 } from '../../basic';
/**
 * @hidden
 */
declare class BSplineCurve {
    degree: number;
    cpoints: Array<Vector>;
    knots: Array<number>;
    weights?: Array<number>;
    constructor(degree: number, cpoints: Array<Vector>, knots: Array<number>, weights?: Array<number>);
    /**
     * Is this Rational BSpline Curve
     */
    isRational(): boolean;
    /**
     * Evaluate basis function derivatives upto n'th
     */
    evaluateBasisDerivatives(span: number, n: number, t: number): number[][];
    evaluateBasis(span: number, t: number): number[];
    findSpan(t: number): number;
    protected getTermDenominator(span: number, N: number[]): number;
}
/**
 * @hidden
 */
declare class BSplineCurve2D extends BSplineCurve {
    constructor(degree: number, cpoints: Array<Vector2>, knots: Array<number>, weights?: Array<number>);
    evaluate(t: number): Vector2;
}
/**
 * @hidden
 */
declare class BSplineCurve3D extends BSplineCurve {
    constructor(degree: number, cpoints: Array<Vector3>, knots: Array<number>, weights?: Array<number>);
    evaluate(t: number): Vector3;
}
export { BSplineCurve, BSplineCurve2D, BSplineCurve3D };
