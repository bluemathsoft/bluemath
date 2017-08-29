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

import {NDArray} from '@bluemath/common'
import {Topology} from '../src/topo'
import {Triangulation} from '../src/delaunay'

import * as topo from '../src/topo'

let Viz = require('viz.js');

function testTopology() {
  let tp = new Topology();
  tp.fromPolygon(new NDArray([
    [50,50],
    [200,100],
    [350,50],
    [350,350],
    [200,400],
    [50,350]
  ]));
  document.body.innerHTML = tp.toSVG();
}

function testTriangulation() {
  let tri = Triangulation.fromTriangulation(
    [20,20, 200,20, 100,100], // points
    [0,1,2], // triangles
    // edges
    [
      [0,1, 0],
      [1,2, 0],
      [2,0, 0]
    ],
    // vertices
    [
      [0,1], // incident edges, TODO:orientation?
      [1,2],
      [2,0]
    ]
  );
  document.body.innerHTML = tri.toSVG();
}

function testEulerOpsBodyViz() {
  topo.IDManager.init(['B','V','E','F','L','HE']);
  let {vertex:v0,face:f0,body} = topo.EulerOps.MVFS();
  let {vertex:v1,edge:e0} = topo.EulerOps.MEV(f0,v0);

  // console.log(body.toDOT());
  // console.log(Viz);
  let img = Viz(body.toDOT(), {format:"png-image-element"});
  document.body.appendChild(img);
}

window.onload = () => {
  testEulerOpsBodyViz();
};