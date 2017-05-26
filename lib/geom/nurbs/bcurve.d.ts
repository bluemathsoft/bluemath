import { Vector, Vector2, Vector3 } from '../../basic';
import { NumberArray1D, NumberArray2D } from '../..';
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
    evaluateBasisDerivatives(span: number, n: number, t: number): NumberArray2D;
    evaluateBasis(span: number, t: number): NumberArray1D;
    findSpan(t: number): number;
    protected getTermDenominator(span: number, N: NumberArray1D): number;
}
declare class BSplineCurve2D extends BSplineCurve {
    constructor(degree: number, cpoints: Array<Vector2>, knots: Array<number>, weights?: Array<number>);
    evaluate(t: number): Vector2;
}
declare class BSplineCurve3D extends BSplineCurve {
    constructor(degree: number, cpoints: Array<Vector3>, knots: Array<number>, weights?: Array<number>);
    evaluate(t: number): Vector3;
}
export { BSplineCurve, BSplineCurve2D, BSplineCurve3D };
