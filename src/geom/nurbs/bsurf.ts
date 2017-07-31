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
import {zeros,range} from '../..'

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
    let dim = this.dimension;
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
          for(let z=0; z<dim; z++) {
            tess.set(uidx,vidx,z,
              <number>tess.get(uidx,vidx,z) +
              Bu[i] * Bv[j] * <number>this.cpoints.get(i,j,z)
                * <number>this.weights.get(i,j)
            );
          }
        } else {
          for(let z=0; z<dim; z++) {
            tess.set(uidx,vidx,z,
              <number>tess.get(uidx,vidx,z) +
              Bu[i] * Bv[j] * <number>this.cpoints.get(i,j,z)
            );
          }
        }
      }
    }
  }

}

export {
  BezierSurface
}