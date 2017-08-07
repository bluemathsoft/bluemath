import { NDArray } from '@bluemath/common';
declare class BezierSurface {
    u_degree: number;
    v_degree: number;
    cpoints: NDArray;
    weights?: NDArray;
    constructor(u_degree: number, v_degree: number, cpoints: NDArray, weights?: NDArray);
    readonly dimension: number;
    isRational(): boolean;
    evaluate(u: number, v: number, tess: NDArray, uidx: number, vidx: number): void;
    tessellatePoints(resolution?: number): NDArray;
}
declare class BSplineSurface {
    u_degree: number;
    v_degree: number;
    cpoints: NDArray;
    u_knots: NDArray;
    v_knots: NDArray;
    weights?: NDArray;
    constructor(u_degree: number, v_degree: number, u_knots: NDArray, v_knots: NDArray, cpoints: NDArray, weights?: NDArray);
    readonly dimension: number;
    clone(): BSplineSurface;
    isRational(): boolean;
    evaluate(u: number, v: number, tess: NDArray, uidx: number, vidx: number): void;
    tessellatePoints(resolution?: number): NDArray;
    insertKnotU(un: number, r: number): void;
    insertKnotV(vn: number, r: number): void;
    insertKnotUV(un: number, vn: number, ur: number, vr: number): void;
    refineKnotsU(uklist: number[]): void;
    refineKnotsV(vklist: number[]): void;
    refineKnotsUV(uklist: number[], vklist: number[]): void;
    decomposeU(): NDArray;
    decomposeV(): NDArray;
    decompose(): BezierSurface[];
    toString(): string;
}
export { BezierSurface, BSplineSurface };
