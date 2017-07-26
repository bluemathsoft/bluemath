
 /*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of bluemath.

 bluemath is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 bluemath is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with bluemath. If not, see <http://www.gnu.org/licenses/>.

*/

import {                                                                                                                                                      
  findSpan, getBasisFunction, getBasisFunctionDerivatives                                                                                                     
} from './helper'
import {NDArray, Vector2, Vector3} from '../../basic'
import {zeros,range} from '../..'

/**
 * @hidden
 */
class BSplineCurve {

  degree : number;
  cpoints : NDArray;
  knots : NDArray;
  weights? : NDArray;

  constructor(
    degree:number,
    cpoints:NDArray,
    knots:NDArray,
    weights?:NDArray)
  {
    this.degree = degree;
    console.assert(cpoints.is2D());
    this.cpoints = cpoints;
    console.assert(knots.is1D());
    this.knots = knots;
    if(weights) {
      console.assert(knots.is1D());
    }
    this.weights = weights;

    /*                                                                                                                                                        
     The degree p, number of control points n+1, number of knots m+1                                                                                          
     are related by                                                                                                                                           
     m = n + p + 1                                                                                                                                            
     [The NURBS book, P3.1]                                                                                                                                   
     */
    let p = degree;
    let m = knots.shape[0]-1;
    let n = cpoints.shape[0]-1;
    console.assert(m === n+p+1);
  }

  setKnots(knots:NDArray) {
    if(!this.knots.isShapeEqual(knots)) {
      throw new Error('Invalid knot vector length');
    }
    this.knots = knots;
  }

  setKnot(index:number,knot:number) {
    if(index >= this.knots.shape[0] || index < 0) {
      throw new Error('Invalid knot index');
    }
    if(knot < 0 || knot > 1) {
      throw new Error('Invalid knot value');
    }
    if(index < this.degree+1) {
      if(knot !== 0) {
        throw new Error('Clamped knot has to be zero');
      }
    }
    if(index >= (this.knots.shape[0]-this.degree-1)) {
      if(knot !== 1) {
        throw new Error('Clamped knot has to be one');
      }
    }
    this.knots.set(index, knot);
  }

  /**
   * Is this Rational BSpline Curve
   */
  isRational() : boolean {
    return !!this.weights;
  }

  /**
   * Evaluate basis function derivatives upto n'th
   */
  evaluateBasisDerivatives(span:number, n:number, t:number)
    : NDArray
  {
    return getBasisFunctionDerivatives(this.degree, t, span, this.knots, n);
  }

  evaluateBasis(span:number, t:number) : number[] {
    return getBasisFunction(this.degree, this.knots.data, span, t);
  }

  findSpan(t:number) {
    return findSpan(this.degree, this.knots.data, t);
  }

  protected getTermDenominator(span:number, N:number[]) : number {
    let p = this.degree;

    let denominator;
    if(this.weights) {
      denominator = 0.0;
      for(let i=0; i<N.length; i++) {
        denominator += N[i] * <number>this.weights.get(span-p+i);
      }
    } else {
      denominator = 1.0;
    }
    return denominator;
  }
}

/**
 * @hidden
 */
class BSplineCurve2D extends BSplineCurve {

  constructor(
    degree:number,
    cpoints:NDArray,
    knots:NDArray,
    weights?:NDArray)
  {
    super(degree, cpoints, knots, weights);
  }

  evaluate(t:number, tess?:NDArray, tessidx?:number) : Vector2|null {
    let p = this.degree;
    let span = this.findSpan(t);
    let N = this.evaluateBasis(span, t);
    if(tess) {
      tessidx = tessidx || 0;
      let denominator = this.getTermDenominator(span, N);
      for(let i=0; i<p+1; i++) {
        let K;
        if(this.weights) {
          K = N[i] * <number>this.weights.get(span-p+i)/denominator;
        } else {
          K = N[i]/denominator;
        }
        let cx = <number>this.cpoints.get(span-p+i, 0);
        let cy = <number>this.cpoints.get(span-p+i, 1);
        tess.set(tessidx,0, (<number>tess.get(tessidx,0)) + K*cx);
        tess.set(tessidx,1, (<number>tess.get(tessidx,1)) + K*cy);
      }
      return null;
    } else {
      let point = new Vector2();
      let denominator = this.getTermDenominator(span, N);
      for(let i=0; i<p+1; i++) {
        let K;
        if(this.weights) {
          K = N[i] * <number>this.weights.get(span-p+i)/denominator;
        } else {
          K = N[i]/denominator;
        }
        let cx = <number>this.cpoints.get(span-p+i, 0);
        let cy = <number>this.cpoints.get(span-p+i, 1);
        point.x += K * cx;
        point.y += K * cy;
      }
      return point;
    }
  }

  evaluateDerivative(
    t:number, d:number, tess?:NDArray, tessidx?:number) : Vector2[]|null
  {
    let p = this.degree;
    let P = this.cpoints;
    let du = Math.min(d,p);
    let ders = zeros([du+1,2]);
    let span = this.findSpan(t);
    let Nders = this.evaluateBasisDerivatives(span, du, t);
    for(let k=0; k<du+1; k++) {
      ders.set(k,0, 0);
      ders.set(k,1, 0);
      for(let j=0; j<p+1; j++) {
        for(let i=0; i<2; i++) {
          ders.set(k,i,
            <number>ders.get(k,i)+
            <number>Nders.get(k,j)*<number>P.get(span-p+j,i));
        }
      }
    }
    if(tess && tessidx !== undefined) {
      for(let i=0; i<du+1; i++) {
        for(let j=0; j<2; j++) {
          tess.set(tessidx,i,j, ders.get(i,j));
        }
      }
      return null;
    } else {
      let varr = [];
      for(let i=0; i<du+1; i++) {
        varr.push(new Vector2(
          <number>ders.get(i,0), <number>ders.get(i,1)));
      }
      return varr;
    }
  }

  tessellate(resolution=10) : NDArray {
    let tess = new NDArray({shape:[resolution+1,2],datatype:'f32'});
    for(let i=0; i<resolution+1; i++) {
      this.evaluate(i/resolution, tess, i);
    }
    return tess;
  }

  tessellateDerivatives(resolution=10, d:number) : NDArray {
    let tess = new NDArray({shape:[resolution+1,d,2], datatype:'f32'});
    for(let i=0; i<resolution+1; i++) {
      this.evaluateDerivative(i/resolution, d, tess, i);
    }
    return tess;
  }

  tessellateBasis(resolution=10) : NDArray {
    let n = this.cpoints.shape[0]-1;
    let p = this.degree;
    let Nip = zeros([n+1,resolution+1],'f32');
    for(let i=0; i<resolution+1; i++) {
      let u = i/resolution;
      let span = this.findSpan(u);
      let N = this.evaluateBasis(span, u);
      for(let j=p; j>=0; j--) {
        Nip.set(span-j,i,N[p-j]);
      }
    }
    return Nip;
  }
}

/**
 * @hidden
 */
class BSplineCurve3D extends BSplineCurve {

  constructor(
    degree:number,
    cpoints:NDArray,
    knots:NDArray,
    weights?:NDArray)
  {
    super(degree, cpoints, knots, weights);
  }

  evaluate(t:number) : Vector3 {
    let p = this.degree;
    let span = this.findSpan(t);
    let N = this.evaluateBasis(span, t);
    let point = new Vector3();

    let denominator = this.getTermDenominator(span, N);
    for(let i=0; i<p+1; i++) {
      let K;
      if(this.weights) {
        K = N[i] * <number>this.weights.get(span-p+i)/denominator;
      } else {
        K = N[i]/denominator;
      }
      let cx = <number>this.cpoints.get(span-p+i,0);
      let cy = <number>this.cpoints.get(span-p+i,1);
      let cz = <number>this.cpoints.get(span-p+i,2);
      point.x += K * cx;
      point.y += K * cy;
      point.z += K * cz;
    }
    return point;
  }
}

export {
  BSplineCurve,
  BSplineCurve2D,
  BSplineCurve3D
}