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
let {BSplineCurve,BezierCurve,BezierSurface,BSplineSurface} = geom.nurbs;
const RESOLUTION = 50;

import {DATA} from './nurbs-data'

let plots = [];

function generateBSplinePlotlyData3D(bcrv) {
  let traces = [];
  let Nip = bcrv.tessellateBasis(RESOLUTION);
  let u = new NDArray({shape:[RESOLUTION+1]});
  for(let i=0; i<RESOLUTION+1; i++) {
    u.set(i, i/RESOLUTION);
  }
  let tess = bcrv.tessellate(RESOLUTION);

  traces.push({
    x: Array.from(tess.get(':',0).data),
    y: Array.from(tess.get(':',1).data),
    z: Array.from(tess.get(':',2).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter3d',
    mode : 'lines',
    name:'Curve'
  });
  traces.push({
    x: Array.from(bcrv.cpoints.get(':',0).data),
    y: Array.from(bcrv.cpoints.get(':',1).data),
    z: Array.from(bcrv.cpoints.get(':',2).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter3d',
    mode : 'markers',
    name:'Control Points'
  });
  /*
  for(let i=0; i<Nip.shape[0]; i++) {
    traces.push({
      x : Array.from(u.data),
      y : Array.from(Nip.get(i,':').data),
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
  */
  return traces;
}

function generateBSplinePlotlyData2D(bcrv) {

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
    x: Array.from(tess.get(':',0).data),
    y: Array.from(tess.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'lines',
    name:'Curve'
  });
  traces.push({
    x: Array.from(tessD.get(':',0).data),
    y: Array.from(tessD.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'lines',
    visible : 'legendonly',
    name:'1st Derivative'
  });
  traces.push({
    x: Array.from(bcrv.cpoints.get(':',0).data),
    y: Array.from(bcrv.cpoints.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'markers',
    name:'Control Points'
  });
  for(let i=0; i<Nip.shape[0]; i++) {
    traces.push({
      x : Array.from(u.data),
      y : Array.from(Nip.get(i,':').data),
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

function generateBSplinePlotlyData(bcrv : BSplineCurve) {
  if(bcrv.dimension === 2) {
    return generateBSplinePlotlyData2D(bcrv);
  } else if(bcrv.dimension === 3) {
    return generateBSplinePlotlyData3D(bcrv);
  }
}

function generateBezierPlotlyData(bezcrv : BezierCurve) {
  let traces = [];  
  let tess = bezcrv.tessellate(RESOLUTION);

  if(bezcrv.dimension === 2) {
    traces.push({
      x: Array.from(tess.get(':',0).data),
      y: Array.from(tess.get(':',1).data),
      xaxis : 'x1',
      yaxis : 'y1',
      type : 'scatter',
      mode : 'lines',
      name:'Curve'
    });
    traces.push({
      x: Array.from(bezcrv.cpoints.get(':',0).data),
      y: Array.from(bezcrv.cpoints.get(':',1).data),
      xaxis : 'x1',
      yaxis : 'y1',
      type : 'scatter',
      mode : 'markers',
      name:'Control Points'
    });
  } else if(bezcrv.dimension === 3) {
    traces.push({
      x: Array.from(tess.get(':',0).data),
      y: Array.from(tess.get(':',1).data),
      z: Array.from(tess.get(':',2).data),
      type : 'scatter3d',
      mode : 'lines',
      name:'Curve'
    });
    traces.push({
      x: Array.from(bezcrv.cpoints.get(':',0).data),
      y: Array.from(bezcrv.cpoints.get(':',1).data),
      z: Array.from(bezcrv.cpoints.get(':',2).data),
      type : 'scatter3d',
      mode : 'markers',
      name:'Control Points'
    });
  }
  return traces;
}

let PLOT_WIDTH = 500;
let GAP_FRACTION = 0.02;

const BEZCURVE_CONSTRUCTION_LAYOUT = {
  width : 500,
  height : 500,
  margin : {},
};
const BEZSURF_CONSTRUCTION_LAYOUT = {
  width : 700,
  height : 700,
  margin : {t:0,b:0},
};

const CURVE_CONSTRUCTION_LAYOUT = {
  width : 500,
  height : 500,
  margin : {t:0,b:0},
  xaxis: { anchor: 'y1' },
  xaxis2: { anchor: 'y2' },
  yaxis2: { domain: [0, 0.5-GAP_FRACTION] , title:'Parametric space'},
  yaxis: { domain: [0.5+GAP_FRACTION, 1] , title:'Euclidean space'},
};

const CURVE_COMPARISION_LAYOUT = {
  width : 500,
  height : 500,
  margin : {t:0,b:0},
  xaxis: { anchor: 'y1' },
  xaxis2: { anchor: 'y2' },
  yaxis2: { domain: [0, 0.5-GAP_FRACTION] },
  yaxis: { domain: [0.5+GAP_FRACTION, 1] },
};

const SURFACE_COMPARISION_LAYOUT = {
  width : 600,
  height : 1000,
  margin : {t:0,b:0,l:10,r:10},
  scene1 : {
    domain : {
      x : [0.0,1.0],
      y : [0.0,0.5]
    }
  },
  scene2 : {
    domain : {
      x : [0.0,1.0],
      y : [0.5,1.0]
    }
  }
};

function displayBezierCurve(crvData) {
  let pelem = $('#curve-viz #mainplot').get(0);

  $('#curve-viz').show();
  $('#action-viz').hide();

  let {degree, cpoints, weights} = crvData;

  let bezcrv = new BezierCurve(degree,new NDArray(cpoints),
    weights ? new NDArray(weights) : null);

  let traces = generateBezierPlotlyData(bezcrv);

  Plotly.newPlot(pelem, traces, BEZCURVE_CONSTRUCTION_LAYOUT);
}

function displayBSplineCurve(crvData) {

  let pelem = $('#curve-viz #mainplot').get(0);

  $('#curve-viz').show();
  $('#action-viz').hide();

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

  let bcrv = new BSplineCurve(degree,
      new NDArray(cpoints), new NDArray(knots),
      crvData.weights ? new NDArray(crvData.weights) : undefined);

  let traces = generateBSplinePlotlyData(bcrv);

  Plotly.newPlot(pelem, traces, CURVE_CONSTRUCTION_LAYOUT);

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
      var value = parseFloat($(this).text());
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
          Plotly.newPlot(pelem, generateBSplinePlotlyData(bcrv), CURVE_CONSTRUCTION_LAYOUT);
          let handle = $(this).find('.ui-slider-handle');
          $(handle).text(''+ui.value);
        },
        create : function () {
          let handle = $(this).find('.ui-slider-handle');
          $(handle).text($(this).slider('value').toFixed(2));
        }
      });
    });
  }

  $('#knotsliders')
    .append(
      $('<span></span>')
        .attr('id','clamped-zero-knots')
        .text(knotzeros.join(','))
      );

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
            Plotly.newPlot(pelem, generateBSplinePlotlyData(bcrv), CURVE_CONSTRUCTION_LAYOUT);
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

function displayBezierSurface(bezsrfData) {
  let pelem = $('#action-viz #mainplot').get(0);
  $('#curve-viz').hide();
  $('#action-viz').show();

  let bezsrf = new BezierSurface(
    bezsrfData.u_degree, bezsrfData.v_degree,
    new NDArray(bezsrfData.cpoints));

  let tess = bezsrf.tessellatePoints(10);
  let traces = [];

  let ures = tess.shape[0];
  let vres = tess.shape[1];
  let xdata = [];
  let ydata = [];
  let zdata = [];
  for(let i=0; i<ures; i++) {
    for(let j=0; j<vres; j++) {
      let pt:NDArray = <NDArray>(tess.get(i,j));
      xdata.push(<number>pt.get(0));
      ydata.push(<number>pt.get(1));
      zdata.push(<number>pt.get(2));
    }
  }

  traces.push({
    x: xdata,
    y: ydata,
    z: zdata,
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter3d',
    mode : 'markers',
    name:'Bezier Surface'
  });

  let uncp = bezsrf.cpoints.shape[0];
  let vncp = bezsrf.cpoints.shape[1];
  let cxdata = [];
  let cydata = [];
  let czdata = [];
  for(let i=0; i<uncp; i++) {
    for(let j=0; j<vncp; j++) {
      let cp:NDArray = <NDArray>(bezsrf.cpoints.get(i,j));
      cxdata.push(<number>cp.get(0));
      cydata.push(<number>cp.get(1));
      czdata.push(<number>cp.get(2));
    }
  }

  traces.push({
    x: cxdata,
    y: cydata,
    z: czdata,
    type : 'scatter3d',
    mode : 'markers',
    name:'Control Points'
  });

  Plotly.newPlot(pelem, traces, BEZSURF_CONSTRUCTION_LAYOUT);
}

function displayBSplineSurface(bsrfData) {
  let pelem = $('#action-viz #mainplot').get(0);
  let traces = [];
  $('#curve-viz').hide();
  $('#action-viz').show();

  let bsrf = new BSplineSurface(
    bsrfData.u_degree, bsrfData.v_degree,
    new NDArray(bsrfData.u_knots), new NDArray(bsrfData.v_knots),
    new NDArray(bsrfData.cpoints),
    bsrfData.weights ? new NDArray(bsrfData.weights) : undefined);
  let tess = bsrf.tessellatePoints(10);

  let ures = tess.shape[0];
  let vres = tess.shape[1];
  let xdata = [];
  let ydata = [];
  let zdata = [];
  for(let i=0; i<ures; i++) {
    for(let j=0; j<vres; j++) {
      let pt:NDArray = <NDArray>(tess.get(i,j));
      xdata.push(<number>pt.get(0));
      ydata.push(<number>pt.get(1));
      zdata.push(<number>pt.get(2));
    }
  }

  traces.push({
    x: xdata,
    y: ydata,
    z: zdata,
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter3d',
    mode : 'markers',
    name:'BSpline Surface'
  });

  let uncp = bsrf.cpoints.shape[0];
  let vncp = bsrf.cpoints.shape[1];
  let cxdata = [];
  let cydata = [];
  let czdata = [];
  for(let i=0; i<uncp; i++) {
    for(let j=0; j<vncp; j++) {
      let cp:NDArray = <NDArray>(bsrf.cpoints.get(i,j));
      cxdata.push(<number>cp.get(0));
      cydata.push(<number>cp.get(1));
      czdata.push(<number>cp.get(2));
    }
  }

  traces.push({
    x: cxdata,
    y: cydata,
    z: czdata,
    type : 'scatter3d',
    mode : 'markers',
    name:'Control Points'
  });

  Plotly.newPlot(pelem, traces, BEZSURF_CONSTRUCTION_LAYOUT);
}

function displayCurveDecomposition(crvsrc, bezcrvs) {
  let pelem = $('#action-viz #mainplot').get(0);

  let traces = [];

  let tessSource = crvsrc.tessellate(RESOLUTION);
  traces.push({
    x: Array.from(tessSource.get(':',0).data),
    y: Array.from(tessSource.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'lines',
    name:'Curve'
  });
  traces.push({
    x: Array.from(crvsrc.cpoints.get(':',0).data),
    y: Array.from(crvsrc.cpoints.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'markers',
    name:'Control Points'
  });

  for(let bezcrv of bezcrvs) {
    let tess = bezcrv.tessellate(RESOLUTION);
    traces.push({
      x: Array.from(tess.get(':',0).data),
      y: Array.from(tess.get(':',1).data),
      xaxis : 'x2',
      yaxis : 'y2',
      type : 'scatter',
      mode : 'lines',
      name:'Curve'
    });
    traces.push({
      x: Array.from(bezcrv.cpoints.get(':',0).data),
      y: Array.from(bezcrv.cpoints.get(':',1).data),
      xaxis : 'x2',
      yaxis : 'y2',
      type : 'scatter',
      mode : 'markers',
      name:'Control Points'
    });
  }

  Plotly.newPlot(pelem, traces, CURVE_COMPARISION_LAYOUT);
}

function displayCurveComparision(crvsrc, crvtgt, titles) {
  let pelem = $('#action-viz #mainplot').get(0);

  let traces = [];

  let tessSource = crvsrc.tessellate(RESOLUTION);
  traces.push({
    x: Array.from(tessSource.get(':',0).data),
    y: Array.from(tessSource.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'lines',
    name:'Curve'
  });
  traces.push({
    x: Array.from(crvsrc.cpoints.get(':',0).data),
    y: Array.from(crvsrc.cpoints.get(':',1).data),
    xaxis : 'x1',
    yaxis : 'y1',
    type : 'scatter',
    mode : 'markers',
    name:'Control Points'
  });

  let tessTarget = crvtgt.tessellate(RESOLUTION);
  traces.push({
    x: Array.from(tessTarget.get(':',0).data),
    y: Array.from(tessTarget.get(':',1).data),
    xaxis : 'x2',
    yaxis : 'y2',
    type : 'scatter',
    mode : 'lines',
    name:'Curve'
  });
  traces.push({
    x: Array.from(crvtgt.cpoints.get(':',0).data),
    y: Array.from(crvtgt.cpoints.get(':',1).data),
    xaxis : 'x2',
    yaxis : 'y2',
    type : 'scatter',
    mode : 'markers',
    name:'Control Points'
  });

  if(titles) {
    CURVE_COMPARISION_LAYOUT.yaxis.title = titles[0];
    CURVE_COMPARISION_LAYOUT.yaxis2.title = titles[1];
  } else {
    CURVE_COMPARISION_LAYOUT.yaxis.title = undefined;
    CURVE_COMPARISION_LAYOUT.yaxis2.title = undefined;
  }

  Plotly.newPlot(pelem, traces, CURVE_COMPARISION_LAYOUT);
}

function displaySurfaceComparision(srfsrc, srftgt, titles) {
  let pelem = $('#action-viz #mainplot').get(0);
  let traces = [];

  let tess = srfsrc.tessellatePoints(10);

  let ures = tess.shape[0];
  let vres = tess.shape[1];
  let xdata = [];
  let ydata = [];
  let zdata = [];
  for(let i=0; i<ures; i++) {
    for(let j=0; j<vres; j++) {
      let pt:NDArray = <NDArray>(tess.get(i,j));
      xdata.push(<number>pt.get(0));
      ydata.push(<number>pt.get(1));
      zdata.push(<number>pt.get(2));
    }
  }

  traces.push({
    x: xdata,
    y: ydata,
    z: zdata,
    type : 'scatter3d',
    mode : 'markers',
    visible : 'legendonly',
    name : titles[0]+' Surface',
    scene:'scene1'
  });

  let uncp = srfsrc.cpoints.shape[0];
  let vncp = srfsrc.cpoints.shape[1];
  let cxdata = [];
  let cydata = [];
  let czdata = [];
  for(let i=0; i<uncp; i++) {
    for(let j=0; j<vncp; j++) {
      let cp:NDArray = <NDArray>(srfsrc.cpoints.get(i,j));
      cxdata.push(<number>cp.get(0));
      cydata.push(<number>cp.get(1));
      czdata.push(<number>cp.get(2));
    }
  }

  traces.push({
    x: cxdata,
    y: cydata,
    z: czdata,
    type : 'scatter3d',
    mode : 'markers',
    name : titles[0]+' Control Points',
    scene:'scene1'
  });

  tess = srftgt.tessellatePoints(10);

  ures = tess.shape[0];
  vres = tess.shape[1];
  xdata = [];
  ydata = [];
  zdata = [];
  for(let i=0; i<ures; i++) {
    for(let j=0; j<vres; j++) {
      let pt:NDArray = <NDArray>(tess.get(i,j));
      xdata.push(<number>pt.get(0));
      ydata.push(<number>pt.get(1));
      zdata.push(<number>pt.get(2));
    }
  }

  traces.push({
    x: xdata,
    y: ydata,
    z: zdata,
    type : 'scatter3d',
    mode : 'markers',
    visible : 'legendonly',
    name:titles[1]+' Surface',
    scene:'scene2'
  });

  uncp = srftgt.cpoints.shape[0];
  vncp = srftgt.cpoints.shape[1];
  let cxdata2 = [];
  let cydata2 = [];
  let czdata2 = [];
  for(let i=0; i<uncp; i++) {
    for(let j=0; j<vncp; j++) {
      let cp:NDArray = <NDArray>(srftgt.cpoints.get(i,j));
      cxdata2.push(<number>cp.get(0));
      cydata2.push(<number>cp.get(1));
      czdata2.push(<number>cp.get(2));
    }
  }

  traces.push({
    x: cxdata2,
    y: cydata2,
    z: czdata2,
    type : 'scatter3d',
    mode : 'markers',
    name : titles[1]+' Control Points',
    scene : 'scene2'
  });

  Plotly.newPlot(pelem, traces, SURFACE_COMPARISION_LAYOUT);
}

function performAction(actionData) {
  $('#curve-viz').hide();
  $('#action-viz').show();

  if(actionData.actiontype === 'insert_knot_curve') {
    let crvdef = DATA_MAP[nameToKey(actionData.input)].object;
    let crvSource = new BSplineCurve(crvdef.degree,
        new NDArray(crvdef.cpoints), new NDArray(crvdef.knots),
        crvdef.weights ? new NDArray(crvdef.weights) : undefined);
    let crvTarget = crvSource.clone();
    let un = actionData['knot_to_insert'];
    let r = actionData['num_insertions'];
    crvTarget.insertKnot(un, r);

    displayCurveComparision(crvSource, crvTarget,
      ['Before Knot Insertion','After Knot Insertion']);

  } else if(actionData.actiontype === 'refine_knot_curve') {
    let crvdef = DATA_MAP[nameToKey(actionData.input)].object;
    let crvSource;
    crvSource = new BSplineCurve(crvdef.degree,
      new NDArray(crvdef.cpoints), new NDArray(crvdef.knots),
      crvdef.weights ? new NDArray(crvdef.weights) : undefined);
    let crvTarget = crvSource.clone();
    let uklist = actionData['knots_to_add'];
    crvTarget.refineKnots(uklist);
    displayCurveComparision(crvSource, crvTarget,
      ['Before Knot Refinement','After Knot Refinement']);

  } else if(actionData.actiontype === 'decompose_curve') {
    let crvdef = DATA_MAP[nameToKey(actionData.input)].object;
    let crvSource = new BSplineCurve(crvdef.degree,
        new NDArray(crvdef.cpoints), new NDArray(crvdef.knots),
        crvdef.weights ? new NDArray(crvdef.weights) : undefined);
    let bezcrvs = crvSource.decompose();
    displayCurveDecomposition(crvSource, bezcrvs);
  } else if(actionData.actiontype === 'insert_knot_surf') {
    let srfdef = DATA_MAP[nameToKey(actionData.input)].object;
    let srfSource = new BSplineSurface(
      srfdef.u_degree, srfdef.v_degree,
      new NDArray(srfdef.u_knots), new NDArray(srfdef.v_knots),
      new NDArray(srfdef.cpoints),
      srfdef.weights ? new NDArray(srfdef.weights) : undefined
    );
    let srfTarget = srfSource.clone();

    if(actionData.u_knot_to_insert !== undefined) {
      srfTarget.insertKnotU(
        actionData.u_knot_to_insert,actionData.num_insertions_u);
    } else if(actionData.v_knot_to_insert !== undefined) {
      srfTarget.insertKnotV(
        actionData.v_knot_to_insert,actionData.num_insertions_v);
    } else {
      console.assert(false);
    }

    console.log(srfTarget.toString());

    displaySurfaceComparision(srfSource, srfTarget,
      ['Before knot insertion','After knot insertion']);
  }
}

function nameToKey(name) {
  return name.replace(/[\(\)\s]+/g,'-').toLowerCase();
}

let DATA_MAP = {};

window.onload = () => {

  for(let i=0; i<DATA.length; i++) {
    let entry = DATA[i];
    let key = nameToKey(entry.name);
    $('#geom-selection').append(
      $('<option></option>').val(key).html(entry.name));
    DATA_MAP[key] = entry;
  }

  $('#geom-selection').on('change', ev => {
    let choice = $('#geom-selection option:selected').val();
    window.location.href =
      window.location.protocol + '//' +
      window.location.host + window.location.pathname + '#' + choice;
    window.location.reload(true);
  });

  let urlmatch = /#([\d\w-]+)$/.exec(window.location.href);

  let curChoice;
  if(urlmatch) {
    curChoice = urlmatch[1];
    $('#geom-selection').val(''+curChoice);
  } else {
    curChoice = $('#geom-selection option:selected').val();
  }
  let data = DATA_MAP[curChoice];
  if(data.type === 'BezierCurve') {
    displayBezierCurve(data.object);
  } else if(data.type === 'BSplineCurve') {
    displayBSplineCurve(data.object);
  } else if(data.type === 'BezSurf') {
    displayBezierSurface(data.object);
  } else if(data.type === 'BSurf') {
    displayBSplineSurface(data.object);
  } else if(data.type === 'Action') {
    performAction(data.object);
  }
};
