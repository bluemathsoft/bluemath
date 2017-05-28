/*

 Copyright (C) 2017 Jayesh Salvi, Blue Math Software Inc.

 This file is part of Zector Math.

 Zector Math is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Zector Math is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with Zector Math.  If not, see <http://www.gnu.org/licenses/>.

 */

import {isEqualFloat} from '../../utils'

/**
 * @hidden
 * Compute all n'th degree bernstein polynomials at given parameter value
 */
function bernstein(n:number, u:number) : Array<number> {
  let B = new Array(n+1);
  B[0] = 1.0;
  let u1 = 1.0-u;
  for(let j=1; j<=n; j++) {
    let saved = 0.0;
    for(let k=0; k<j; k++) {
      let temp = B[k];
      B[k] = saved + u1*temp;
      saved = u*temp;
    }
    B[j] = saved;
  }
  return B;
}

/**
 * @hidden
 * Find the index of the knot span in which `u` lies
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} u Parameter
 * @returns {number}
 */
function findSpan(p:number, U:Array<number>, u:number)
  : number
{
  let m = U.length-1;
  let n = m-p-1;
  if(isEqualFloat(u, U[n+1])) {
    return n;
  }
  let low = p;
  let high = n+1;
  let mid = Math.floor((low+high)/2);
  while(u < U[mid] || u >= U[mid+1]) {
    if(u < U[mid]) {
      high = mid;
    } else {
      low = mid;
    }
    mid = Math.floor((low+high)/2);
  }
  return mid;
}

/**
 * @hidden
 * Evaluate basis function values 
 * @param {number} p Degree
 * @param {Array.<number>} U Knot vector
 * @param {number} i Knot span index
 * @param {number} u Parameter
 * @returns {Array} Basis function values at i,u
 */
function getBasisFunction(p:number, U:Array<number>, i:number, u:number)
  : Array<number>
{
  let N = new Array(p+1);
  N[0] = 1.0;
  let left = new Array(p+1);
  let right = new Array(p+1);
  for(let j=1; j<=p; j++) {
    left[j] = u-U[i+1-j];
    right[j] = U[i+j]-u;
    let saved = 0.0;
    for(let r=0; r<j; r++) {
      let temp = N[r]/(right[r+1]+left[j-r]);
      N[r] = saved+right[r+1]*temp;
      saved = left[j-r]*temp;
    }
    N[j] = saved;
  }
  return N;
}

/**
 * @hidden
 * Compute non-zero basis functions and their derivatives, upto and including
 * n'th derivative (n <= p). Output is 2-dimensional array `ders`
 * @param {number} p Degree
 * @param {number} u Parameter
 * @param {number} i Knot span
 * @param {Array.<number>} U Knot vector
 * @param {number} n nth derivative
 * @returns {Array.<Array<number>>} ders ders[k][j] is k'th derivative of
 *            basic function N(i-p+j,p), where 0<=k<=n and 0<=j<=p
 */
function getBasisFunctionDerivatives(
  p:number, u:number, i:number, U:Array<number>, n:number)
  : Array<Array<number>>
{

  let ders = new Array(n+1);
  for(let i=0; i<n+1; i++) { ders[i] = new Array(p+1); }
  let ndu = new Array(p+1);
  for(let i=0; i<p+1; i++) { ndu[i] = new Array(p+1); }
  ndu[0][0] = 1.0;
  let a = new Array(2);
  for(let i=0; i<2; i++) { a[i] = new Array(p+1); }
  let left = [];
  let right = [];

  for(let j=1; j<=p; j++) {
    left[j] = u - U[i+1-j];
    right[j] = U[i+j]-u;
    let saved = 0.0;
    for(let r=0; r<j; r++) {
      // Lower triangle
      ndu[j][r] = right[r+1]+left[j-r];
      let temp = ndu[r][j-1]/ndu[j][r];
      // Upper triangle
      ndu[r][j] = saved + right[r+1]*temp;
      saved = left[j-r]*temp;
    }
    ndu[j][j] = saved;
  }
  
  for(let j=0; j<=p; j++) { // Load the basis functions
    ders[0][j] = ndu[j][p];
  }
  
  // This section computes the derivatives (eq 2.9)
  for(let r=0; r<=p; r++) {
    let s1=0;
    let s2=1;
    // Alternate rows in array a
    a[0][0] = 1.0;
    for(let k=1; k<=n; k++) {
      let d = 0.0;
      let rk = r-k;
      let pk = p-k;
      if(r >= k) {
        a[s2][0] = a[s1][0]/ndu[pk+1][rk];
        d = a[s2][0] * ndu[rk][pk];
      }
      let j1, j2;
      if(rk >= -1) {
        j1 = 1;
      } else {
        j1 = -rk;
      }
      if(r-1 <= pk) {
        j2 = k-1;
      } else {
        j2 = p-r;
      }
      for(let j=j1; j<=j2; j++) {
        a[s2][j] = (a[s1][j]-a[s1][j-1]) / ndu[pk+1][rk+j];
        d += a[s2][j] * ndu[rk+j][pk];
      }
      if(r <= pk) {
        a[s2][k] = -a[s1][k-1]/ndu[pk+1][r];
        d += a[s2][k]*ndu[r][pk];
      }
      ders[k][r] = d;

      // Switch rows
      let temp = s1;
      s1 = s2;
      s2 = temp;
    }
  }

  // Multiply through by the correct factors (eq 2.9)
  let r = p;
  for(let k=1; k<=n; k++) {
    for(let j=0; j<=p; j++) {
      ders[k][j] *= r;
    }
    r *= p-k;
  }
  return ders;

}

export {
  bernstein,
  findSpan,
  getBasisFunction,
  getBasisFunctionDerivatives
}