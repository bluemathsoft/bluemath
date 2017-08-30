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

import {iszero} from '@bluemath/common'

export function pointLineOrientation(a:number[],b:number[],c:number[]) {
  // This predicate is based upon the formula described here
  // https://www.cs.cmu.edu/~quake/robust.html
  // Unfortunately I don't know the proof of this formula, but the
  // tests so far are working
  let [ax,ay] = a;
  let [bx,by] = b;
  let [cx,cy] = c;
  let det = (ax-cx)*(by-cy) - (bx-cx)*(ay-cy);
  if(iszero(det)) {
    return 0;
  }
  return det/Math.abs(det);
}

export function pointInCircle(a:number[],b:number[],c:number[],d:number[]) {

  let [ax,ay] = a;
  let [bx,by] = b;
  let [cx,cy] = c;
  let [dx,dy] = d;

  /*
   * | A B C |   | ax-dx  ay-dy  (ax-dx)^2+(ay-dy)^2 |
   * | D E F | = | bx-dx  by-dy  (bx-dx)^2+(by-dy)^2 |
   * | G H I |   | cx-dx  cy-dy  (cx-dx)^2+(cy-dy)^2 |
   *
   * det = AEI + BFG + CDH - GEC - HFA - IDB
   */
  let A = ax-dx;
  let B = ay-dy;
  let D = bx-dx;
  let E = by-dy;
  let G = cx-dx;
  let H = cy-dy;

  let C = A*A+B*B;
  let F = D*D+E*E;
  let I = G*G+H*H;

  let det = A*E*I + B*F*G + C*D*H - G*E*C - H*F*A - I*D*B;
  if(iszero(det)) {
    return 0;
  }
  return det/Math.abs(det);
}