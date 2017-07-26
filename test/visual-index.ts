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
const RESOLUTION = 50;

import {CURVE_DATA} from './nurbs-data'

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

function generatePlotlyData(bcrv : BSplineCurve2D) {

  let traces = [];
  let Nip = bcrv.tessellateBasis(RESOLUTION);
  let u = new NDArray({shape:[RESOLUTION+1]});
  for(let i=0; i<RESOLUTION+1; i++) {
    u.set(i, i/RESOLUTION);
  }
  let tess = bcrv.tessellate(RESOLUTION);
  let tessD = bcrv.tessellateDerivatives(RESOLUTION, 1);
  let tdshape = tessD.shape;
  tessD.reshape([tdshape[0], tdshape[2]]);

  traces.push({
    x: Array.from(tess.slice(':',0).data),
    y: Array.from(tess.slice(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type:'line',
    name:'Curve'
  });
  traces.push({
    x: Array.from(tessD.slice(':',0).data),
    y: Array.from(tessD.slice(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type:'line',
    visible : 'legendonly',
    name:'1st Derivative'
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
  return traces;
}

let PLOT_WIDTH = 500;
let GAP_FRACTION = 0.02;

const LAYOUT = {
  width : 500,
  height : 500,
  margin : {t:0,b:0},
  xaxis: { anchor: 'y1' },
  xaxis2: { anchor: 'y2' },
  yaxis2: { domain: [0, 0.5-GAP_FRACTION] , title:'Parametric space'},
  yaxis: { domain: [0.5+GAP_FRACTION, 1] , title:'Euclidean space'},
};

function createPlot(elem, traces) {
  Plotly.newPlot(elem, traces, LAYOUT);
}

function updatePlot(elem, traces) {
  Plotly.newPlot(elem, traces, LAYOUT);
}

function displayCurve(pelem, crvData) {

  if(!crvData.knots) {
    // Assume it's a bezier curve
    crvData.knots = [];
    for(let i=0; i<=crvData.degree; i++) {
      crvData.knots.push(0);
    }
    for(let i=0; i<=crvData.degree; i++) {
      crvData.knots.push(1);
    }
  }
  let {degree, cpoints, knots} = crvData;

  let bcrv = new BSplineCurve2D(degree,
    new NDArray(cpoints), new NDArray(knots),
    crvData.weights ? new NDArray(crvData.weights) : undefined);

  let traces = generatePlotlyData(bcrv);

  createPlot(pelem, traces);

  let knotzeros = new Array(degree);
  knotzeros.fill(0);
  $('#knotsliders')
    .empty();

  $('#knotsliders')
    .append($('<span></span>'))
    .html('Knot Vector U');
  $('#knotsliders').append('<br>');

  $('#weights').empty();

  if(bcrv.isRational()) {
    $('#weights')
      .append($('<span></span>'))
      .html('Weights');
    $('#weights').append('<br>');

    let weightsEq = $('<div></div>').attr('id','eq');
    for(let i=0; i<bcrv.weights.shape[0]; i++) {
      weightsEq.append(
        $('<span></span>')
          .attr('id', `weight${i}`)
          .text(''+<number>bcrv.weights.get(i))
      );
    }
    $('#weights').append(weightsEq);

    $("#weights > #eq > span").each(function () {
      // read initial values from markup and remove that
      var value = parseInt($(this).text(), 10);
      $(this).empty().slider({
        value: value,
        min : -2,
        max : +10,
        step : 0.1,
        animate: true,
        orientation: "vertical",
        slide : function (ev, ui) {
          let thisid = $(ev.target).attr('id');
          let thisnum = parseInt(/weight(\d+)/.exec(thisid)[1]);
          bcrv.setWeight(thisnum, ui.value);
          updatePlot(pelem, generatePlotlyData(bcrv));
        }
      });
    });
  }

  $('#knotsliders')
    .append($('<span></span>')
    .attr('id','clamped-zero-knots')
    .text(knotzeros.join(',')));

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
          if(thisnum === degree+1 && ui.handleIndex === 0) {
            return false;
          }
          if(thisnum === knots.length-degree-1 && ui.handleIndex === 1) {
            return false;
          }
          let handles = $(this).find('.ui-slider-handle');

          let needsUpdate = false;

          if(ui.handleIndex === 0) {
            let val = ui.values[0]/100;
            let leftslider = $(`#slider${thisnum-1}`);
            let leftvalues = leftslider.slider('values');
            leftvalues[1] = ui.values[0];
            leftslider.slider('option','values',leftvalues);
            $(handles[0]).text(val.toFixed(2));
            let leftsliderhandles =
              $(`#slider${thisnum-1}>.ui-slider-handle`);
            $(leftsliderhandles[1]).text(val.toFixed(2));

            bcrv.setKnot(thisnum-1, val);
            needsUpdate = needsUpdate || true;
          }

          if(ui.handleIndex === 1) {
            let val = ui.values[1]/100;
            let rightslider = $(`#slider${thisnum+1}`);
            let rightvalues = rightslider.slider('values');
            rightvalues[0] = ui.values[1];
            rightslider.slider('option','values',rightvalues);
            $(handles[1]).text(val.toFixed(2));
            let rightsliderhandles =
              $(`#slider${thisnum+1}>.ui-slider-handle`);
            $(rightsliderhandles[0]).text(val.toFixed(2));

            bcrv.setKnot(thisnum, val);
            needsUpdate = needsUpdate || true;
          }

          if(needsUpdate) {
            updatePlot(pelem, generatePlotlyData(bcrv));
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
  let knotones = new Array(degree);
  knotones.fill(1);
  $('#knotsliders').append($('<span></span>')
    .attr('id','clamped-one-knots')
    .text(knotones.join(',')));
}

window.onload = () => {

  let pelem = document.getElementById('mainplot');

  for(let i=0; i<CURVE_DATA.length; i++) {
    let entry = CURVE_DATA[i];
    $('#geom-selection').append(
      $('<option></options>').val(''+i).html(entry.name));
  }

  let curChoice = parseInt($('#geom-selection option:selected').val());
  
  $('#geom-selection').on('change', ev => {
    let choice = parseInt($('#geom-selection option:selected').val());
    displayCurve(pelem, CURVE_DATA[choice].object);
  });

  let crvData = CURVE_DATA[curChoice].object;
  displayCurve(pelem, CURVE_DATA[curChoice].object);

};
