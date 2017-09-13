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

import {
  isequal, empty, NDArray, TypedArray, add, sub, mul, dir, dot, cross,
  arr, iszero, length
} from '@bluemath/common'

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
function findSpan(p:number, U:Array<number>|TypedArray, u:number)
  : number
{
  let m = U.length-1;
  let n = m-p-1;
  if(isequal(u, U[n+1])) {
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
function getBasisFunction(
  p:number, U:Array<number>|TypedArray, i:number, u:number)
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
 * The NURBS book Algo A2.3
 * Compute non-zero basis functions and their derivatives, upto and including
 * n'th derivative (n <= p). Output is 2-dimensional array `ders`
 * @param {number} p Degree
 * @param {number} u Parameter
 * @param {number} i Knot span
 * @param {NDArray} knots Knot vector
 * @param {number} n nth derivative
 * @returns {NDArray} ders ders[k][j] is k'th derivative of
 *            basic function N(i-p+j,p), where 0<=k<=n and 0<=j<=p
 */
function getBasisFunctionDerivatives(
  p:number, u:number, ki:number, knots:NDArray, n:number)
  : NDArray
{
  let U = knots.data;

  let ndu = empty([p+1,p+1]);
  let ders = empty([n+1,p+1]);

  ndu.set(0,0, 1.0);
  let a = empty([2,p+1]);

  let left = [];
  let right = [];

  for(let j=1; j<=p; j++) {
    left[j] = u - U[ki+1-j];
    right[j] = U[ki+j]-u;
    let saved = 0.0;
    for(let r=0; r<j; r++) {
      // Lower triangle
      ndu.set(j,r, right[r+1]+left[j-r]);
      let temp = ndu.getN(r,j-1)/ndu.getN(j,r);
      // Upper triangle
      ndu.set(r,j, saved + right[r+1]*temp);
      saved = left[j-r]*temp;
    }
    ndu.set(j,j, saved);
  }
  
  for(let j=0; j<=p; j++) { // Load the basis functions
    ders.set(0,j, ndu.get(j,p));
  }
  
  // This section computes the derivatives (eq 2.9)
  for(let r=0; r<=p; r++) {
    let s1=0;
    let s2=1;
    // Alternate rows in array a
    a.set(0,0, 1.0);
    for(let k=1; k<=n; k++) {
      let d = 0.0;
      let rk = r-k;
      let pk = p-k;
      if(r >= k) {
        a.set(s2,0, a.getN(s1,0)/ndu.getN(pk+1,rk));
        d = a.getN(s2,0) * ndu.getN(rk,pk);
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
        a.set(s2,j, (a.getN(s1,j)-a.getN(s1,j-1)) / ndu.getN(pk+1,rk+j));
        d += a.getN(s2,j) * ndu.getN(rk+j,pk);
      }
      if(r <= pk) {
        a.set(s2,k, -a.get(s1,k-1)/ndu.getN(pk+1,r));
        d += a.getN(s2,k)*ndu.getN(r,pk);
      }
      ders.set(k,r,d);

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
      ders.set(k,j, mul(ders.get(k,j), r));
    }
    r *= p-k;
  }

  return ders;
}

function blossom(cpoints:NDArray, n:number, ts:number[]) : NDArray {
  let b = cpoints.clone();
  if(ts.length !== n) {
    throw new Error("Number of parameters not equal to degee");
  }
  for(let r=1; r<n+1; r++) {
    let t = ts[r-1];
    for(let i=0; i<n+1-r; i++) {
      b.set(i, add(
        mul((1-t), b.get(i)),
        mul(t, b.get(i+1))
      ));
    }
  }
  return <NDArray>b.get(0);
}

/**
 * Computes equation of plane passing through given 3 points
 * Eqn of plane is
 *  ax + by + cz + d = 0
 * This routine returns [a,b,c,d]
 * The direction of the normal is defined by assuming that A,B,C are in
 * counter-clockwise direction. i.e. if you curl fingers of right hand
 * in counter-clockwise direction, then the raised thumb will give the
 * direction of the plane normal
 */
function planeFrom3Points(A:NDArray, B:NDArray, C:NDArray) {
  if(A.shape.length !== 1 || B.shape.length !== 1 || C.shape.length !== 1) {
    throw new Error('A,B,C should be 1D position vectors, i.e. Point coord');
  }
  if(A.shape[0] !== 3 || B.shape[0] !== 3 || C.shape[0] !== 3) {
    throw new Error('A,B,C should be points in 3D space');
  }
  let AB = <NDArray>sub(B,A);
  let AC = <NDArray>sub(C,A);
  let n = dir(cross(AB,AC));
  let d = -dot(n,A);
  return [n.getN(0), n.getN(1), n.getN(2), d];
}

/**
 * Finds intersection between two line segments in 3D
 * First line segment extends from p1 to p2, and second extends from p3 to p4
 * Input points are assumed to be coordinates in 3D coord system
 * 
 * Algorithm based on C implemention by Paul Bourke
 * http://paulbourke.net/geometry/pointlineplane/lineline.c
 * 
 * The method will return a tuple with results (ua, ub),
 * where u is the parameter value on each line
 * If there is no intersection null will be returned
 */
function intersectLineSegLineSeg3D(
  p1:number[],p2:number[],p3:number[],p4:number[]):null|number[]
{
  if(p1.length !== 3 || p2.length !== 3 || p3.length !== 3 || p4.length !== 3)
  {
    throw new Error('All input points need to be 3D');
  }
  let pt1 = arr(p1);
  let pt2 = arr(p2);
  let pt3 = arr(p3);
  let pt4 = arr(p4);

  let p13 = <NDArray>sub(pt1,pt3);
  let p43 = <NDArray>sub(pt4,pt3);

  if(iszero(p43.getN(0)) && iszero(p43.getN(1)) && iszero(p43.getN(2))) {
    return null;
  }

  let p21 = <NDArray>sub(pt2,pt1);

  if(iszero(p21.getN(0)) && iszero(p21.getN(1)) && iszero(p21.getN(2))) {
    return null;
  }

  let d1343 = dot(p13,p43);
  let d4321 = dot(p43,p21);
  let d1321 = dot(p13,p21);
  let d4343 = dot(p43,p43);
  let d2121 = dot(p21,p21);

  let denom = d2121 * d4343 - d4321 * d4321;

  if(iszero(denom)) {
    return null;
  }

  let numer = d1343 * d4321 - d1321 * d4343;

  let mua = numer / denom;
  let mub = (d1343 + d4321 * mua) / d4343;

  let pa = add(pt1, mul(mua, p21));
  let pb = add(pt3, mul(mub, p43));

  // Line segment pa to pb represents shortest line segment between a and b
  // If it's of length zero, then ua, ub represent point of intersection
  // between the two lines
  if(iszero(length(<NDArray>sub(pb,pa)))) {
    return [mua, mub];
  }
  return null;
}

export {
  bernstein,
  findSpan,
  getBasisFunction,
  getBasisFunctionDerivatives,
  blossom,
  planeFrom3Points,
  intersectLineSegLineSeg3D
}