"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/*
import {minimize_nelder_mead} from './nelder-mead'
import {NDArray} from '../basic'
import * as linalg from '../linalg'
import {utils} from '..'

export interface NelderMeadOptions {
  xatol? : number;
  initial_simplex? : NDArray;
  maxiter? : number;
  maxfun? : number;
};

export function minimize(
  method : 'nelder-mead'|'bfgs',
  func : (x: any) => number, // callback
  x0 : number[],
  options : NelderMeadOptions
)
{
  let fcall = 0;
  function func_wrapper(x:any) {
    fcall++;
    return func(x);
  }

  let rho = 1;
  let chi = 2;
  let psi = 0.5;
  let sigma = 0.5;
  let nonzdelt = 0.05;
  let zdelt = 0.00025;

  let sim;
  let N = x0.length;

  if(options.initial_simplex) {
    let isshape = options.initial_simplex.shape;
    if(isshape.length !=2 || isshape[0] !== isshape[1]+1) {
      throw new Error("Initial simplex should be 2D array of shape [N+1,N]");
    }
    if(isshape[1] !== N) {
      throw new Error("Size of initial simplex is not consistent with x0");
    }
    sim = options.initial_simplex.clone();
  } else {
    sim = linalg.zeros([N+1,N]);
    for(let i=0; i<N; i++) {
      sim.set(0,i,x0[i]);
    }
  }

  let maxiter = options.maxiter || N*200;
  let maxfun = options.maxfun || N*200;

  let one2np1 = utils.range(1,N+1);
}
*/
function minimize() {
}
exports.minimize = minimize;
