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

window.onload = () => {
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
};