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

export const NURBS_DATA = [
  {
    id : 'simple0',
    degree : 3,
    cpoints : [[0,0],[3,11],[4,0],[5.5,3],[6,0],[10,10]],
    knots : [0,0,0,0,0.4,0.7,1,1,1,1]
  },
  {
    id : 'simple1',
    degree : 2,
    cpoints : [
      [-5, -5],
      [-2, 0],
      [-1, 5],
      [-0.5, 2],
      [0.5, 2],
      [1, 5],
      [2, 0],
      [5, -5]
    ],
    knots : [
      0, 0, 0, 0.2, 0.4, 0.6, 0.8, 0.8, 1, 1, 1
    ]
  },
];


