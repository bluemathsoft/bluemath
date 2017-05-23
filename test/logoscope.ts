
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

import * as blueplot from 'blueplot'
import {Vector, Matrix} from '../src/basic'
//import {Vector2} from '../src/basic'
//import {BSplineCurve2D} from '../src/geom/nurbs'

window.onload = () => {

  let plot = new blueplot.Plot(600,400);
  document.body.appendChild(plot.dom);

  /*
  let cpoints = [
    new Vector2(10,10),
    new Vector2(40,130),
    new Vector2(150,200),
    new Vector2(200,200)
  ];

  let bcrv1 = new BSplineCurve2D(3,cpoints,[0,0,0,0,1,1,1,1]);
  let points = [];
  for(let i=0; i<101; i++) {
    points.push(bcrv1.evaluate(i/100).toArray());
  }
  let dg = new blueplot.DataGroup2N(plot.width,plot.height);
  dg.fromPoints(points,{type:'line'});
  dg.fromPoints(cpoints.map(v => v.toArray()),{type:'scatter'});
  plot.add(dg);
  */

  let dg = new blueplot.DataGroupMN(plot.width, plot.height,{});
  plot.add(dg);

  (<any>window).plotData = function (data:number[][]) {
    dg.from2DData(data, {type:'grid'});
  };

  let m = new Matrix([
    [3,0,0],
    [2,1,0],
    [6,7,2]
  ]);
  m.solveByForwardSubstitution(new Vector(2));
}