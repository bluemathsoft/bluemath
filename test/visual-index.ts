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

  let pelem = document.getElementById('mainplot');

  let degree = 3;
  let cpoints = [[0,0],[3,11],[4,0],[5.5,3],[6,0],[10,10]];
  let knots = [0,0,0,0,0.4,0.7,1,1,1,1];

  let RESOLUTION=50;
  let bcrv = new BSplineCurve2D(degree,
    new NDArray(cpoints), new NDArray(knots));

  let Nip = bcrv.tessellateBasis(RESOLUTION);
  let u = new NDArray({shape:[RESOLUTION+1]});
  for(let i=0; i<RESOLUTION+1; i++) {
    u.set(i, i/RESOLUTION);
  }
  let traces = [];
  let tess = bcrv.tessellate(RESOLUTION);
  traces.push({
    x: Array.from(tess.slice(':',0).data),
    y: Array.from(tess.slice(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type:'line',
    name:'Curve'
  });
  traces.push({
    points2d:bcrv.cpoints,
    x: Array.from(bcrv.cpoints.slice(':',0).data),
    y: Array.from(bcrv.cpoints.slice(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'markers',
    name:'Control Points'
  });
  for(let i=0; i<Nip.shape[0]; i++) {
    traces.push({
      x : Array.from(u.data),
      y : Array.from(Nip.slice(i,':').data),
      xaxis : 'x2',
      yaxis : 'y2',
      type:'scatter',
      mode : 'lines',
      name:`N(${i},${bcrv.degree})`
    });
  }
  let ones = new NDArray({shape:[bcrv.knots.shape[0]]});
  ones.fill(1);
  traces.push({
    x : Array.from(bcrv.knots.data),
    y : Array.from(ones.data),
    xaxis : 'x2',
    yaxis : 'y2',
    type : 'scatter',
    mode : 'markers',
    name : 'Knot Vector'
  });

  Plotly.newPlot(pelem, traces, {
    width : 800,
    height : 800,
    xaxis: { anchor: 'y1', title:'Euclidean space' },
    xaxis2: { anchor: 'y2', title:'Parametric space' },
    yaxis2: { domain: [0, 0.45] },
    yaxis: { domain: [0.55, 1] },
  });


  for(let i=degree+1; i<knots.length-degree; i++) {
    let jqelem = $('<div></div>')
      .attr('id',`slider${i}`)
      .addClass('knotslider')
      .slider({
        range : true,
        min : 0,
        max : 100,
        values : [knots[i-1]*100, knots[i]*100],
        slide : function (ev, ui) {
          let thisid = $(this).attr('id');
          let thisnum = parseInt(/slider(\d+)/.exec(thisid)[1]);
          let handles = $(this).find('.ui-slider-handle');
          if(thisnum > degree+1) {
            let val = ui.values[0]/100;
            let leftslider = $(`#slider${thisnum-1}`);
            let leftvalues = leftslider.slider('values');
            leftvalues[1] = ui.values[0];
            leftslider.slider('option','values',leftvalues);
            $(handles[0]).text(val.toFixed(2));
            let leftsliderhandles =
              $(`#slider${thisnum-1}>.ui-slider-handle`);
            $(leftsliderhandles[1]).text(val.toFixed(2));
          }
          if(thisnum < knots.length-degree) {
            let val = ui.values[1]/100;
            let rightslider = $(`#slider${thisnum+1}`);
            let rightvalues = rightslider.slider('values');
            rightvalues[0] = ui.values[1];
            rightslider.slider('option','values',rightvalues);
            $(handles[1]).text(val.toFixed(2));
            let rightsliderhandles =
              $(`#slider${thisnum+1}>.ui-slider-handle`);
            $(rightsliderhandles[0]).text(val.toFixed(2));
          }
        },
        create: function () {
          let values = $(this).slider('values');
          let handles = $(this).find('.ui-slider-handle');
          $(handles[0]).text((values[0]/100).toFixed(2));
          $(handles[1]).text((values[1]/100).toFixed(2));
        }
      });
    $('#knotsliders').append(jqelem);
  }
};
