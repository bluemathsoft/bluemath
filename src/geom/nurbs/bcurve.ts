
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
import {Vector, Vector2, Vector3} from '../../basic'

class BSplineCurve {

  degree : number;
  cpoints : Array<Vector>;
  knots : Array<number>;
  weights? : Array<number>;

  constructor(
    degree:number,
    cpoints:Array<Vector>,
    knots:Array<number>,
    weights?:Array<number>)
  {
    this.degree = degree;
    this.cpoints = cpoints;
    this.knots = knots;
    this.weights = weights;

    /*                                                                                                                                                        
     The degree p, number of control points n+1, number of knots m+1                                                                                          
     are related by                                                                                                                                           
     m = n + p + 1                                                                                                                                            
     [The NURBS book, P3.1]                                                                                                                                   
     */
    let p = degree;
    let m = knots.length+1;
    let n = cpoints.length+1;
    console.assert(m === n+p+1);
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
    : number[][] 
  {
    return getBasisFunctionDerivatives(this.degree, t, span, this.knots, n)
  }

  evaluateBasis(span:number, t:number) : number[] {
    return getBasisFunction(this.degree, this.knots, span, t);
  }

  findSpan(t:number) {
    return findSpan(this.degree, this.knots, t);                                                                                                              
  }

  protected getTermDenominator(span:number, N:number[]) : number {
    let p = this.degree;

    let denominator;
    if(this.weights) {
      denominator = 0.0;
      for(let i=0; i<N.length; i++) {
        denominator += N[i] * this.weights[span-p+i];
      }
    } else {
      denominator = 1.0;
    }
    return denominator;
  }
}

class BSplineCurve2D extends BSplineCurve {

  constructor(
    degree:number,
    cpoints:Array<Vector2>,
    knots:Array<number>,
    weights?:Array<number>)
  {
    super(degree, cpoints, knots, weights);
  }

  evaluate(t:number) : Vector2 {
    let p = this.degree;
    let span = this.findSpan(t);
    let N = this.evaluateBasis(span, t);
    let point = new Vector2();

    let denominator = this.getTermDenominator(span, N);
    for(let i=0; i<p+1; i++) {
      let K;
      if(this.weights) {
        K = N[i] * this.weights[span-p+i]/denominator;
      } else {
        K = N[i]/denominator;
      }
      let cpoint = <Vector2>this.cpoints[span-p+i];
      point.x += K * cpoint.x;
      point.y += K * cpoint.y;
    }
    return point;
  }
}

class BSplineCurve3D extends BSplineCurve {

  constructor(
    degree:number,
    cpoints:Array<Vector3>,
    knots:Array<number>,
    weights?:Array<number>)
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
        K = N[i] * this.weights[span-p+i]/denominator;
      } else {
        K = N[i]/denominator;
      }
      let cpoint = <Vector3>this.cpoints[span-p+i];
      point.x += K * cpoint.x;
      point.y += K * cpoint.y;
      point.z += K * cpoint.z;
    }
    return point;
  }
}

export {
  BSplineCurve,
  BSplineCurve2D,
  BSplineCurve3D
}