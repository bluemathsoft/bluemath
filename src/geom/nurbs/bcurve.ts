
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
  findSpan, getBasisFunction, getBasisFunctionDerivatives,
  bernstein                                                                                                     
} from './helper'
import {NDArray} from '../../basic'
import {zeros} from '../..'

class BezierCurve {
  degree : number;
  cpoints : NDArray;
  weights? : NDArray;

  constructor(degree:number, cpoints:NDArray, weights?:NDArray) {
    this.degree = degree;
    console.assert(cpoints.is2D());
    this.cpoints = cpoints;
    if(weights) {
      console.assert(weights.length === degree+1);
    }
    this.weights = weights;
  }

  get dimension() {
    return this.cpoints.shape[1];
  }

  /**
   * Is this Rational Bezier Curve
   */
  isRational() : boolean {
    return !!this.weights;
  }

  evaluate(u:number, tess?:NDArray, tessidx?:number) {
    let B = bernstein(this.degree, u);
    let dim = this.dimension;
    let isRational = this.isRational();

    let denominator;
    if(isRational) {
      denominator = 0;
      for(let i=0; i<this.degree+1; i++) {
        denominator += B[i] * <number>this.weights.get(i);
      }
    } else {
      denominator = 1;
    }

    if(tess !== undefined && tessidx !== undefined) {

      for(let k=0; k<this.degree+1; k++) {
        if(isRational) {
          for(let z=0; z<dim; z++) {
            tess.set(tessidx,z,
              <number>tess.get(tessidx,z) +
              B[k] * <number>this.cpoints.get(k,z) *
              <number>this.weights.get(k));
          }
        } else {
          for(let z=0; z<dim; z++) {
            tess.set(tessidx,z, 
              <number>tess.get(tessidx,z) +
              B[k] * <number>this.cpoints.get(k,z));
          }
        }
      }
      for(let z=0; z<dim; z++) {
        tess.set(tessidx,z,<number>tess.get(tessidx,z)/denominator);
      }
      return null;
    } else {
      throw new Error('Not implemented');
    }
  }

  tessellate(resolution=10) : NDArray {
    let tess = new NDArray({
      shape:[resolution+1,this.dimension],
      datatype:'f32'
    });
    for(let i=0; i<resolution+1; i++) {
      this.evaluate(i/resolution, tess, i);
    }
    return tess;
  }

  toString() {
    let s = `Bezier(Deg ${this.degree} cpoints ${this.cpoints.toString()})`;
    if(this.isRational()) {
      s += ` weights ${this.weights.toString()}`;
    }
    return s;
  }
}

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

  get dimension() {
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

  /**
   * Algorithm A5.1 from "The NURBS Book"
   */
  insertKnot(un:number, r:number) {
    let p = this.degree;
    let dim = this.dimension;
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

  /**
   * Algorithm A5.4 from "The NURBS Book"
   */
  refineKnots(ukList:number[]) {
    let m = this.knots.length-1;
    let p = this.degree;
    let n = m-p-1;
    let dim = this.dimension;
    let X = ukList;
    let r = ukList.length-1;
    let P = this.cpoints;
    let Q = new NDArray({shape:[P.length+r+1, dim]});
    let U = this.knots;
    let Ubar = new NDArray({shape:[U.length+r+1]});
    let isRational = this.isRational();

    let Wp,Wq;
    if(isRational) {
      Wq = new NDArray({shape:[P.length+r+1]});
      Wp = this.weights;
    }

    let a = this.findSpan(X[0]);
    let b = this.findSpan(X[r]);
    b += 1;

    // Copy control points and weights for u < a and u > b
    for(let j=0; j<a-p+1; j++) {
      for(let k=0; k<dim; k++) {
        Q.set(j,k, P.get(j,k));
      }
      if(isRational) {
        Wq.set(j, Wp.get(j));
      }
    }
    for(let j=b-1; j<n+1; j++) {
      for(let k=0; k<dim; k++) {
        Q.set(j+r+1,k, P.get(j,k));
      }
      if(isRational) {
        Wq.set(j+r+1, Wp.get(j));
      }
    }

    // Copy knots for u < a and u > b
    for(let j=0; j<a+1; j++) {
      Ubar.set(j, U.get(j));
    }
    for(let j=b+p; j<m+1; j++) {
      Ubar.set(j+r+1, U.get(j));
    }

    // For values of u between a and b
    let i = b+p-1;
    let k = b+p+r;

    for(let j=r; j>=0; j--) {
      while(X[j] <= U.get(i) && i>a) {
        for(let z=0; z<dim; z++) {
          Q.set(k-p-1,z, P.get(i-p-1,z));
        }
        if(isRational) {
          Wq.set(k-p-1, Wp.get(i-p-1));
        }
        Ubar.set(k,U.get(i));
        k -= 1;
        i -= 1;
      }
      for(let z=0; z<dim; z++) {
        Q.set(k-p-1,z, Q.get(k-p,z));
      }
      if(isRational) {
        Wq.set(k-p-1, Wq.get(k-p));
      }

      for(let l=1; l<p+1; l++) {
        let ind = k-p+l;
        let alpha = <number>Ubar.get(k+l)-X[j];
        if(Math.abs(alpha) === 0.0) {
          for(let z=0; z<dim; z++) {
            Q.set(ind-1,z, Q.get(ind,z));
          }
          if(isRational) {
            Wq.set(ind-1, Wq.get(ind));
          }
        } else {
          alpha = alpha/(<number>Ubar.get(k+l)-<number>U.get(i-p+l));
          for(let z=0; z<dim; z++) {
            Q.set(ind-1,z,
              alpha * <number>Q.get(ind-1,z) +
              (1.0-alpha) * <number>Q.get(ind,z));
          }
          if(isRational) {
            Wq.set(ind-1,
              alpha*<number>Wq.get(ind-1) +
              (1.0-alpha)*<number>Wq.get(ind));
          }
        }
      }
      Ubar.set(k, X[j]);
      k -= 1;
    }
    this.knots = Ubar;
    this.cpoints = Q;
    if(isRational) {
      this.weights = Wq;
    }
  }

  /**
   * Algorithm A5.6 from "The NURBS Book"
   * The total number of bezier segments required to decompose a
   * given bspline curve
   *  = Number of internal knots + 1
   *  = Length of knot vector - 2*(p+1) + 1
   *  = (m+1) - 2*(p+1) + 1
   *  = m - 2*p
   */
  decompose() {
    let p = this.degree;
    let U = this.knots;
    let m = U.length-1;
    let P = this.cpoints;
    let dim = this.dimension;
    let alphas = new NDArray({shape:[p]});

    let a = p;
    let b = p+1;

    let total_bezier = m-2*p;

    let Q = new NDArray({shape:[total_bezier,p+1,dim]});
    let nb = 0; // Counter for Bezier segments
    for(let i=0; i<p+1; i++) {
      for(let z=0; z<dim; z++) {
        Q.set(nb,i,z, P.get(i,z))
      }
    }

    let i;

    while(b<m) {
      i = b;
      while(b<m && U.get(b+1) === U.get(b)) {
        b += 1;
      }
      let mult = b-i+1;
      if(mult < p) {
        let numerator = <number>U.get(b) - <number>U.get(a);

        // Compute and store alphas
        for(let j=p; j>mult; j--) {
          alphas.set(j-mult-1, numerator/(<number>U.get(a+j)-<number>U.get(a)));
        }
        let r = p-mult; // Insert knot r times
        for(let j=1; j<r+1; j++) {
          let save = r-j;
          let s = mult+j; // This many new points
          for(let k=p; k>s-1; k--) {
            let alpha = <number>alphas.get(k-s);
            for(let z=0; z<dim; z++) {
              Q.set(nb,k,z,
                alpha*<number>Q.get(nb,k,z) +
                (1.0-alpha)*<number>Q.get(nb,k-1,z));
            }
          }
          if(b<m) {
            for(let z=0; z<dim; z++) {
              Q.set(nb+1,save,z, Q.get(nb,p,z));
            }
          }
        }
      }
      nb += 1;
      if(b<m) { // Initilize for next segment
        for(let i=p-mult; i<p+1; i++) {
          for(let z=0; z<dim; z++) {
            Q.set(nb,i,z, P.get(b-p+i,z))
          }
        }
        a = b;
        b += 1;
      }
    }

    let bezlist = [];
    for(let i=0; i<Q.length; i++) {
      bezlist.push(new BezierCurve(p, Q.slice(i).reshape([p+1,dim])));
    }
    return bezlist;
  }

  evaluate(t:number, tess?:NDArray, tessidx?:number) : NDArray|null {
    let p = this.degree;
    let span = this.findSpan(t);
    let dim = this.dimension;
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
        for(let z=0; z<dim; z++) {
          let c = <number>this.cpoints.get(span-p+i, z);
          tess.set(tessidx, z, (<number>tess.get(tessidx,z)) + K*c);
        }
      }
      return null;
    } else {
      let point = new NDArray({shape:[dim]});
      for(let i=0; i<p+1; i++) {
        let K;
        if(this.weights) {
          K = N[i] * <number>this.weights.get(span-p+i)/denominator;
        } else {
          K = N[i]/denominator;
        }
        for(let z=0; z<dim; z++) {
          let c = <number>this.cpoints.get(span-p+i, z);
          point.set(z, <number>point.get(z) + K*c);
        }
      }
      return point;
    }
  }

  evaluateDerivative(
    t:number, d:number, tess?:NDArray, tessidx?:number) : NDArray|null
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
      throw new Error('Not implemented');
      /*
      let varr = [];
      for(let i=0; i<du+1; i++) {
        varr.push(new Vector2(
          <number>ders.get(i,0), <number>ders.get(i,1)));
      }
      return varr;
      */
    }
  }

  tessellate(resolution=10) : NDArray {
    let tess = new NDArray({
      shape:[resolution+1,this.dimension],
      datatype:'f32'
    });
    for(let i=0; i<resolution+1; i++) {
      this.evaluate(i/resolution, tess, i);
    }
    return tess;
  }

  tessellateDerivatives(resolution=10, d:number) : NDArray {
    let tess = new NDArray({
      shape:[resolution+1,d,this.dimension],
      datatype:'f32'
    });
    for(let i=0; i<resolution+1; i++) {
      this.evaluateDerivative(i/resolution, d, tess, i);
    }
    return tess;
  }

  clone() : BSplineCurve {
    return new BSplineCurve(
      this.degree,
      this.cpoints.clone(),
      this.knots.clone(),
      this.weights ? this.weights.clone() : undefined);
  }

  toString() {
    let s = `BSpline(Deg ${this.degree} cpoints ${this.cpoints.toString()})`;
    s += ` knots ${this.knots.toString}`;
    if(this.isRational()) {
      s += ` weights ${this.weights.toString()}`;
    }
    return s;
  }
}

export {
  BezierCurve,
  BSplineCurve
}