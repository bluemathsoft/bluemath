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
import {zeros,add,mul,count,empty} from '../..'

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

  insertKnotU(un:number, r:number) {
    let p = this.u_degree;
    let q = this.v_degree;

    // Knot will be inserted between [k, k+1)
    let k = findSpan(p, this.u_knots.data, un);

    // If un already exists in the knot vector, s is its multiplicity
    let s = count(this.u_knots, un);

    if(r+s <= p) {
      throw new Error('Knot insertion exceeds knot multiplicity beyond degree');
    }

    let mU = this.u_knots.length-1;
    let nU = mU-this.u_degree-1;
    let mV = this.v_knots.length-1;
    let nV = mV-this.v_degree-1;

    let P = this.cpoints;
    let Q = empty([nU+1+r,nV+1,this.dimension]);
    let UP = this.u_knots;
    let UQ = empty([UP.length+r]);
    let VP = this.v_knots;
    let VQ = empty([VP.length]);

    // Load u-vector
    for(let i=0; i<k+1; i++) {
      UQ.set(i, UP.get(i));
    }
    for(let i=1; i<r+1; i++) {
      UQ.set(k+i, un);
    }
    for(let i=k+1; i<mU+1; i++) {
      UQ.set(i+r, UP.get(i));
    }

    // Copy v-vector
    VQ.copyfrom(VP);

    let alpha = empty([p+1,r+1]);
    let R = empty([p+1,this.dimension]);

    let L=0;

    // Pre-calculate alphas
    for(let j=1; j<r+1; j++) {
      L = k-p+j;
      for(let i=0; i<p-j-s+1; i++) {
        alpha.set(i,j,
          (un-<number>UP.get(L+i))/(<number>UP.get(i+k+1)-<number>UP.get(L+i)));
      }
    }

    for(let row=0; row<=nV+1; row++) {
      // Save unaltered control points
      for(let i=0; i<k-p+1; i++) {
        Q.set(i, row, P.get(i, row));
      }
      for(let i=k-s; i<nU+1; i++) {
        Q.set(i+r, row, P.get(i, row));
      }

      // Load auxiliary control points
      for(let i=0; i<p-s+1; i++) {
        R.set(i, P.get(k-p+i, row));
      }
      for(let j=1; j<r+1; j++) {
        L = k-p+j;
        for(let i=0; i<p-j-s+1; i++) {
          R.set(i,
            add(
              mul(alpha.get(i,j), R.get(i+1)),
              mul(1.0-<number>alpha.get(i,j)),R.get(i)
            )
          );
        }
        Q.set(L,row, R.get(0));
        Q.set(k+r-j-s,row, R.get(p-j-s));
      }

      // Load the remaining control points
      for(let i=L+1; i<k-s; i++) { // TODO // Assuming L value is still good
        Q.set(i,row, R.get(i-L));
      }
    }
    this.cpoints = Q
    this.v_knots = VQ
  }
}

export {
  BezierSurface,
  BSplineSurface
}