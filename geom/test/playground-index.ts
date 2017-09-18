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

import $ = require("jquery");
require('select2');
import * as Plotly from 'plotly.js/lib/core'

import {DATA} from './pgdata'

function doPlot(plotDiv,width=600,height=600) {
  let layout:Partial<Plotly.Layout> = {
    showlegend : false
  };
  let RANGE = [0,25];
  let margin = 0.0;

  if(width < height) { // Portrait - Vertical stack
    layout.yaxis = { range:RANGE, domain:[0,0.5-margin] };
    layout.yaxis2 = { range:RANGE, domain:[0.5+margin,1] };
  } else { // Landscape - Horizontal stack
    layout.xaxis = { range:RANGE, domain:[0,0.5-margin] };
    layout.xaxis2 = { range:RANGE, domain:[0.5+margin,1] };
    layout.yaxis2 = { range:RANGE, anchor : 'x2' };
  }
  layout.margin = {
    t:0,
    b:0,
    l:0,
    r:0
  }
  plotDiv.style.width = width+'px';
  plotDiv.style.height = height+'px';

	Plotly.newPlot(plotDiv, [
      {
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 3, 16],
        xaxis : 'x1',
        yaxis : 'y1'
      },
      {
        x: [1, 2, 3, 4, 5],
        y: [1, 20, 4, 8, 16],
        xaxis : 'x2',
        yaxis : 'y2'
      }
    ], layout
    /*
    {

      // Vertical
      xaxis : {range:[0,25]},
      yaxis : { range:[0,25], domain : [0,0.5]},
      yaxis2 : { range:[0,25], domain : [0.5,1]}

      // Horizontal
      //xaxis : { domain:[0,0.45]},
      //xaxis2 : { domain:[0.55,1]},
      // yaxis2 : { anchor:'x2' }
    }
    */
  );

}

function nameToKey(name) {
  return name.replace(/[\(\)\s]+/g,'-').toLowerCase();
}

$(document).ready(function () {

  let selectData = DATA.map(group => {
    return {
      text : group.groupname,
      children : (<any[]>group.objects).map(object => {
        return {
          id : nameToKey(object.name),
          text : object.name
        };
      })
    };
  });

  $('.js-example-basic-single').select2({
    data : selectData,
    width : '50%'
  }).on('change',function() {
    console.log($('.js-example-basic-single').val());
  });

  let plotDiv = document.createElement('div');
  document.body.appendChild(plotDiv);

  doPlot(plotDiv,window.innerWidth-50, window.innerHeight-50);

  $(window).resize(function () {
    doPlot(plotDiv,window.innerWidth-50, window.innerHeight-50);
  });
});
