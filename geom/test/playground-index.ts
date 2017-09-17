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

$(document).ready(function () {
  $('.js-example-basic-single').select2({
  }).on('change',function() {
    console.log($('.js-example-basic-single').val());
  });

  let plotDiv = document.createElement('div');
  document.body.appendChild(plotDiv);
  plotDiv.style.width = '600px';
  plotDiv.style.height = '600px';

	Plotly.plot( plotDiv, [{
    x: [1, 2, 3, 4, 5],
    y: [1, 2, 4, 8, 16] }], {
    margin: { t: 0 } }
  );
});
