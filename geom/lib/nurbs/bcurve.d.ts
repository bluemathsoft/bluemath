import { NDArray } from '@bluemath/common';
declare class BezierCurve {
    degree: number;
    cpoints: NDArray;
    weights?: NDArray;
    constructor(degree: number, cpoints: NDArray, weights?: NDArray);
    readonly dimension: number;
    /**
     * Is this Rational Bezier Curve
     */
    isRational(): boolean;
    evaluate(u: number, tess?: NDArray, tessidx?: number): null;
    tessellate(resolution?: number): NDArray;
    toString(): string;
}
/**
 * @hidden
 */
declare class BSplineCurve {
    degree: number;
    cpoints: NDArray;
    knots: NDArray;
    weights?: NDArray;
    constructor(degree: number, cpoints: NDArray, knots: NDArray, weights?: NDArray);
    readonly dimension: number;
    setKnots(knots: NDArray): void;
    setKnot(index: number, knot: number): void;
    setWeight(index: number, weight: number): void;
    /**
     * Is this Rational BSpline Curve
     */
    isRational(): boolean;
    /**
     * Evaluate basis function derivatives upto n'th
     */
    evaluateBasisDerivatives(span: number, n: number, t: number): NDArray;
    evaluateBasis(span: number, t: number): number[];
    findSpan(t: number): number;
    protected getTermDenominator(span: number, N: number[]): number;
    tessellateBasis(resolution?: number): NDArray;
    /**
     * Algorithm A5.1 from "The NURBS Book"
     */
    insertKnot(un: number, r: number): void;
    /**
     * Algorithm A5.4 from "The NURBS Book"
     */
    refineKnots(ukList: number[]): void;
    /**
     * Algorithm A5.6 from "The NURBS Book"
     * The total number of bezier segments required to decompose a
     * given bspline curve
     *  = Number of internal knots + 1
     *  = Length of knot vector - 2*(p+1) + 1
     *  = (m+1) - 2*(p+1) + 1
     *  = m - 2*p
     */
    decompose(): BezierCurve[];
    evaluate(t: number, tess?: NDArray, tessidx?: number): NDArray | null;
    evaluateDerivative(t: number, d: number, tess?: NDArray, tessidx?: number): NDArray | null;
    tessellate(resolution?: number): NDArray;
    tessellateDerivatives(resolution: number | undefined, d: number): NDArray;
    clone(): BSplineCurve;
    toString(): string;
}
export { BezierCurve, BSplineCurve };
