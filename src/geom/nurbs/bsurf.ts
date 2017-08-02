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

import {NDArray} from '../../basic'
import {                                                                                                                                                      
  findSpan, getBasisFunction, getBasisFunctionDerivatives,
  bernstein                                                                                                     
} from './helper'
import {zeros,add,mul} from '../..'

class BezierSurface {

  u_degree : number;
  v_degree : number;
  cpoints : NDArray;
  weights? : NDArray;

  constructor(
    u_degree:number,
    v_degree:number,
    cpoints:NDArray,
    weights?:NDArray)
  {
    this.u_degree = u_degree;
    this.v_degree = v_degree;
    console.assert(cpoints.shape.length === 3);
    console.assert(cpoints.shape[2] === 2 || cpoints.shape[2] === 3);
    this.cpoints = cpoints;
    if(weights) {
      console.assert(weights.shape.length === 2);
    }
    this.weights = weights;
  }

  get dimension() {
    return this.cpoints.shape[2];
  }

  isRational() {
    return !!this.weights;
  }

  evaluate(u:number, v:number, tess:NDArray, uidx:number, vidx:number) {
    let Bu = bernstein(this.u_degree, u);
    let Bv = bernstein(this.v_degree, v);
    let denominator = 1;
    let isRational = this.isRational();
    if(isRational) {
      denominator = 0;
      for(let i=0; i<this.u_degree+1; i++) {
        for(let j=0; j<this.v_degree+1; j++) {
          denominator += Bu[i] * Bv[j] * <number>this.weights.get(i,j);
        }
      } 
    }

    for(let i=0; i<this.u_degree+1; i++) {
      for(let j=0; j<this.v_degree+1; j++) {
        if(isRational) {
          tess.set(uidx, vidx,
            add(tess.get(uidx,vidx),
                mul(Bu[i], Bv[j],
                    this.weights.get(i,j),
                    this.cpoints.get(i,j))))
        } else {
          tess.set(uidx, vidx,
            add(tess.get(uidx,vidx),
                mul(Bu[i], Bv[j],
                    this.cpoints.get(i,j))))
        }
      }
    }
  }

  tessellatePoints(resolution=10) {
    let tess = new NDArray({
      shape : [resolution+1, resolution+1, this.dimension],
      datatype : 'f32'
    });
    for(let i=0; i<resolution+1; i++) {
      for(let j=0; j<resolution+1; j++) {
        let u = i/resolution;
        let v = j/resolution;
        this.evaluate(u,v,tess,i,j);
      }
    }
    return tess;
  }
}

class BSplineSurface {

  u_degree : number;
  v_degree : number;
  cpoints : NDArray;
  u_knots : NDArray;
  v_knots : NDArray;
  weights? : NDArray;

  constructor(
    u_degree:number,
    v_degree:number,
    u_knots:NDArray,
    v_knots:NDArray,
    cpoints:NDArray,
    weights?:NDArray)
  {
    this.u_degree = u_degree;
    this.v_degree = v_degree;
    this.u_knots = u_knots;
    this.v_knots = v_knots;
    this.cpoints = cpoints;
    this.weights = weights;
  }

  get dimension() {
    return this.cpoints.shape[2];
  }

  clone() {
    return new BSplineSurface(
      this.u_degree,
      this.v_degree,
      this.u_knots.clone(),
      this.v_knots.clone(),
      this.cpoints.clone(),
      this.weights ? this.weights.clone() : undefined
    );
  }

  isRational() {
    return !!this.weights;
  }

  evaluate(u:number, v:number, tess:NDArray, uidx:number, vidx:number) {
    let u_span = findSpan(this.u_degree, this.u_knots.data, u);
    let v_span = findSpan(this.v_degree, this.v_knots.data, v);
    let Nu = getBasisFunction(this.u_degree, this.u_knots.data, u_span, u);
    let Nv = getBasisFunction(this.v_degree, this.v_knots.data, v_span, v);
    let dim = this.dimension;

    let u_ind = u_span - this.u_degree;
    let temp;
    for(let l=0; l<this.v_degree+1; l++) {
      temp = zeros([dim]); 
      let v_ind = v_span - this.v_degree + l;
      for(let k=0; k<this.u_degree+1; k++) {
        temp = add(temp, mul(Nu[k],this.cpoints.get(u_ind+k,v_ind)));
      }
      tess.set(uidx,vidx,
        add(tess.get(uidx,vidx), mul(Nv[l], temp)));
    }
  }

  tessellatePoints(resolution=10) {
    let tess = new NDArray({
      shape : [resolution+1, resolution+1, this.dimension],
      datatype : 'f32'
    });
    for(let i=0; i<resolution+1; i++) {
      for(let j=0; j<resolution+1; j++) {
        let u = i/resolution;
        let v = j/resolution;
        this.evaluate(u,v,tess,i,j);
      }
    }
    return tess;
  }
}

export {
  BezierSurface,
  BSplineSurface
}