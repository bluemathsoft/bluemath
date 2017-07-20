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

import {NDArray,geom} from '../src'
let {BSplineCurve2D} = geom.nurbs;


interface PlotSpec {
  x?: number[];
  y?: number[];
  points2d? : NDArray;
  points3d? : NDArray;
};

function bmplot(name: string, spec: PlotSpec) {

  let pelem = document.createElement('div');
  pelem.setAttribute('id', 'plot-' + name);
  pelem.setAttribute('class', 'plot');

  let traces = [];

  if(spec.x && spec.y) {
    console.assert(Array.isArray(spec.x));
    console.assert(Array.isArray(spec.y));
    traces.push({
      x: spec.x,
      y: spec.y
    });
  } else if(spec.points2d) {
    console.assert(spec.points2d.is2D() && spec.points2d.shape[1] >= 2);
    traces.push({
      x: Array.from(spec.points2d.slice(':',0).data),
      y: Array.from(spec.points2d.slice(':',1).data)
    });
  } else {
    throw new Error('Missing Plot Spec');
  }
  Plotly.plot(pelem, traces, {
    margin: { t: 0 }
  });
  document.body.appendChild(pelem);
};

window.onload = () => {
  let bcrv = new BSplineCurve2D(1,
    new NDArray([[0,0],[10,10]]), new NDArray([0,0,1,1]));
  bmplot('bcrv1',{points2d:bcrv.tessellate()});
};
