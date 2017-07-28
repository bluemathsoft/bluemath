
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

  getDimension() {
    return this.cpoints.shape[1];
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

  setWeight(index:number, weight:number) {
    if(!this.weights) {
      throw new Error('Not a Rational BSpline');
    }
    if(index < 0 || index >= this.weights.shape[0]) {
      throw new Error('Index out of bounds');
    }
    this.weights.set(index, weight);
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

  insertKnot(un:number, r:number) {
    let p = this.degree;
    let dim = this.getDimension();
    let k = this.findSpan(un);
    let isRational = this.isRational();

    // If un already exists in the knot vector then s is it's multiplicity
    let s =0;
    for(let i=0; i<this.knots.shape[0]; i++) {
      if(this.knots.get(i) === un) {
        s++;
      }
    }

    if(r+s >= p) {
      throw new Error('Knot insertion exceeds knot multiplicity beyond degree');
    }

    let m = this.knots.shape[0] - 1;
    let n = m-p-1;

    let P = this.cpoints;
    let Up = this.knots;
    let Q = new NDArray({shape:[P.shape[0]+r,dim]});
    let Uq = new NDArray({shape:[Up.shape[0]+r]});
    let Rtmp, Wtmp;

    Rtmp = new NDArray({shape:[p+1,dim]});

    let Wp, Wq;
    if(isRational) {
      Wp = this.weights;
      Wq = new NDArray({shape:[Wp.shape[0] + r]});
      Wtmp = new NDArray({shape:[p+1]});
    }

    // Load new knot vector
    for(let i=0; i<k+1; i++) {
      Uq.set(i, Up.get(i));
    }

    for(let i=1; i<r+1; i++) {
      Uq.set(k+i, un);
    }

    for(let i=k+1; i<m+1; i++) {
      Uq.set(i+r, Up.get(i));
    }

    // Save unaltered control points
    for(let i=0; i<k-p+1; i++) {
      for(let j=0; j<dim; j++) {
        Q.set(i,j, P.get(i,j));
      }
      if(isRational) {
        Wq.set(i, Wp.get(i));
      }
    }

    for(let i=k-s; i<n+1; i++) {
      for(let j=0; j<dim; j++) {
        Q.set(i+r,j, P.get(i,j));
      }
      if(isRational) {
        Wq.set(i+r,Wp.get(i));
      }
    }

    for(let i=0; i<p-s+1; i++) {
      for(let j=0; j<dim; j++) {
        Rtmp.set(i,j, P.get(k-p+i,j));
      }
    }

    let L=0;
    for(let j=1; j<r+1; j++) {
      L = k-p+j;
      for(let i=0; i<p-j-s+1; i++) {
        let alpha = (un - <number>Up.get(L+i))/(<number>Up.get(i+k+1) - <number>Up.get(L+i));
        for(let z=0; z<dim; z++) {
          Rtmp.set(i,z, alpha * <number>Rtmp.get(i+1,z) + (1-alpha) * <number>Rtmp.get(i,z));
        }
        if(isRational) {
          Wtmp.set(i, alpha * <number>Wtmp.get(i+1) + (1-alpha) * <number>Wtmp.get(i));
        }
      }
      for(let z=0; z<dim; z++) {
        Q.set(L,z, Rtmp.get(0,z));
        Q.set(k+r-j-s,z, Rtmp.get(p-j-s,z));
      }
      if(isRational) {
        Wq.set(L, Wtmp.get(0));
        Wq.set(k+r-j-s, Wtmp.get(p-j-s));
      }
    }

    for(let i=L+1; i<k-s+1; i++) {
      for(let z=0; z<dim; z++) {
        Q.set(i,z, Rtmp.get(i-L,z));
      }
      if(isRational) {
        Wq.set(i, Wtmp.get(i-L));
      }
    }

    this.knots = Uq;
    this.cpoints = Q;
    if(isRational) {
      this.weights = Wq;
    }
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

  clone() : BSplineCurve2D {
    return new BSplineCurve2D(
      this.degree,
      this.cpoints.clone(),
      this.knots.clone(),
      this.weights ? this.weights.clone() : undefined);
  }

  evaluate(t:number, tess?:NDArray, tessidx?:number) : Vector2|null {
    let p = this.degree;
    let span = this.findSpan(t);
    let N = this.evaluateBasis(span, t);
    let denominator = this.getTermDenominator(span, N);
    if(tess) {
      tessidx = tessidx || 0;
      for(let i=0; i<p+1; i++) {
        let K;
        if(this.weights) {
          K = N[i] * <number>this.weights.get(span-p+i)/denominator;
        } else {
          K = N[i]/denominator;
        }
        let cx = <number>this.cpoints.get(span-p+i, 0);
        let cy = <number>this.cpoints.get(span-p+i, 1);
        tess.set(tessidx, 0, (<number>tess.get(tessidx,0)) + K*cx);
        tess.set(tessidx, 1, (<number>tess.get(tessidx,1)) + K*cy);
      }
      return null;
    } else {
      let point = new Vector2();
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

  evaluate(t:number, tess?:NDArray, tessidx?:number) : Vector3|null {
    let p = this.degree;
    let span = this.findSpan(t);
    let N = this.evaluateBasis(span, t);

    let denominator = this.getTermDenominator(span, N);
    if(tess) {
      tessidx = tessidx || 0;
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
        tess.set(tessidx, 0, (<number>tess.get(tessidx,0)) + K*cx);
        tess.set(tessidx, 1, (<number>tess.get(tessidx,1)) + K*cy);
        tess.set(tessidx, 2, (<number>tess.get(tessidx,2)) + K*cz);
      }
      return null;
    } else {
      let point = new Vector3();
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

  tessellate(resolution=10) : NDArray {
    let tess = new NDArray({shape:[resolution+1,3], datatype:'f32'});
    for(let i=0; i<resolution+1; i++) {
      this.evaluate(i/resolution, tess, i);
    }
    return tess;
  }

  clone() : BSplineCurve3D {
    return new BSplineCurve3D(
      this.degree,
      this.cpoints.clone(),
      this.knots.clone(),
      this.weights ? this.weights.clone() : undefined);
  }
}

export {
  BSplineCurve,
  BSplineCurve2D,
  BSplineCurve3D
}