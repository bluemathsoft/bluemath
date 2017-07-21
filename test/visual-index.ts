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

import {NDArray,geom,range} from '../src'
let {BSplineCurve2D} = geom.nurbs;

interface TraceSpec {
  x?: number[];
  y?: number[];
  points2d? : NDArray;
  points3d? : NDArray;
  type : 'line'|'point';
  name? : string;
};

interface PlotSpec {
  traces : TraceSpec[];
}

let plots = [];

function bmplot(name: string, spec: PlotSpec) {

  let pelem = document.createElement('div');
  pelem.setAttribute('id', 'plot-' + name);
  pelem.setAttribute('class', 'plot');
  let W = 600;
  let H = 600;
  pelem.style.width = W+'px';
  pelem.style.height = H+'px';
  /*
  pelem.style.position = 'absolute';
  pelem.style.left = (window.innerWidth/2)+'px';
  pelem.style.top = (window.innerHeight/2)+'px';
  pelem.style.marginLeft = `-${W/2}px`;
  pelem.style.marginTop = `-${H/2}px`;
  */

  let data = [];

  for(let trace of spec.traces) {
    if(trace.x && trace.y) {
      console.assert(Array.isArray(trace.x));
      console.assert(Array.isArray(trace.y));
      data.push({
        x: trace.x,
        y: trace.y,
        type : 'scatter',
        mode : trace.type === 'line' ? 'lines' : 'markers',
        name : trace.name
      });
    } else if(trace.points2d) {
      console.assert(trace.points2d.is2D() && trace.points2d.shape[1] >= 2);
      data.push({
        x: Array.from(trace.points2d.slice(':',0).data),
        y: Array.from(trace.points2d.slice(':',1).data),
        mode : trace.type === 'line' ? 'lines' : 'markers',
        name : trace.name
      });
    } else {
      throw new Error('Invalid Trace Spec');
    }
  }

  Plotly.plot(pelem, data, {
    margin: {  }
  });
  document.body.appendChild(pelem);
};

window.onload = () => {
  let RESOLUTION=50;
  let bcrv = new BSplineCurve2D(3,
    new NDArray([[0,0],[3,11],[4,0],[5.5,3],[6,0],[10,10]]),
    new NDArray([0,0,0,0,0.4,0.7,1,1,1,1]));
  bmplot('Curve',{
    traces : [
      { points2d:bcrv.tessellate(RESOLUTION), type:'line', name:'Curve' },
      { points2d:bcrv.cpoints, type:'point', name:'Control Points' }
    ]
  });
  let Nip = bcrv.tessellateBasis(RESOLUTION);
  let u = new NDArray({shape:[RESOLUTION+1]});
  for(let i=0; i<RESOLUTION+1; i++) {
    u.set(i, i/RESOLUTION);
  }
  let traces = [];
  for(let i=0; i<Nip.shape[0]; i++) {
    traces.push({
      x : Array.from(u.data),
      y : Array.from(Nip.slice(i,':').data),
      type:'line',
      name:`N(${i},${bcrv.degree})`
    });
  }
  bmplot('Basis',{traces:traces});
};
