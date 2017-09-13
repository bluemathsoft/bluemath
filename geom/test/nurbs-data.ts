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

export const DATA = [
  {
    "name": "Quadratic Bezier 0",
    "type": "BezierCurve",
    "object": {
      "degree": 2,
      "cpoints": [
        [0, 1],
        [1, 0],
        [0, -1]
      ]
    }
  },
  {
    "name": "Cubic Bezier 0",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [-3, 1],
        [0, 3],
        [1, -1],
        [3, 3]
      ]
    }
  },
  {
    "name": "Cubic Bezier 1",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [1, -3],
        [3, 0],
        [-1, 1],
        [3, 4.5]
      ]
    }
  },
  {
    "name": "Cubic Bezier 2",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [0.25, -0.3],
        [0.5, 0.0],
        [0.75, -0.1],
        [1.0, 0.45]
      ]
    }
  },
  {
    "name": "Cubic Bezier 3",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [-3, -3],
        [3, 0],
        [-1, 1],
        [3, 4.5]
      ]
    }
  },
  {
    "name": "Cubic Bezier 4",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [-2.5, -3],
        [0, 3],
        [1, -1],
        [2.5, 4.5]
      ]
    }
  },
  {
    "name": "Cubic Bezier 3 (3D)",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [-3, -3, 0.0],
        [3, 0, 0.0],
        [-1, 1, 0.0],
        [3, 4.5, 0.0]
      ]
    }
  },
  {
    "name": "Cubic Bezier 4 (3D)",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [-2.5, -3, 0.0],
        [0, 3, 0.0],
        [1, -1, 0.0],
        [2.5, 4.5, 0.0]
      ]
    }
  },
  {
    "name": "Cubic Bezier 5 (3D)",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [-2.5, -3, -1.0],
        [0, 3, 0.0],
        [1, -1, 1.0],
        [-1.5, -4.5, 0]
      ]
    }
  },
  {
    "name": "Rational Bezier 0",
    "type": "BezierCurve",
    "object": {
      "degree": 2,
      "cpoints": [
        [1, 0],
        [1, 1],
        [0, 1]
      ],
      "weights": [
        1, 0.70710678, 1
      ]
    }
  },
  {
    "name": "Rational Bezier 1",
    "type": "BezierCurve",
    "object": {
      "degree": 3,
      "cpoints": [
        [0.5, 0],
        [2, 2.5],
        [3, -2.5],
        [5, 3]
      ],
      "weights": [
        1, 0.5, 2, 1
      ]
    }
  },
  {
    "name": "Simple BSpline 0",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "cpoints": [
        [-5, -5],
        [-2, 0],
        [-1, 5],
        [-0.5, 2],
        [0.5, 2],
        [1, 5],
        [2, 0],
        [5, -5]
      ],
      "knots": [
        0, 0, 0, 0.2, 0.4, 0.6, 0.8, 0.8, 1, 1, 1
      ]
    }
  },
  {
    "name": "Quadratic Bezier as BSpline",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "knots": [0, 0, 0, 1, 1, 1],
      "cpoints": [
        [1, 0],
        [1, 1],
        [0, 1]
      ]
    }
  },
  {
    "name": "Cubic Bezier as BSpline",
    "type": "BSplineCurve",
    "object": {
      "degree": 3,
      "knots": [0, 0, 0, 0, 1, 1, 1, 1],
      "cpoints": [
        [1, 0],
        [0.5, 1],
        [-0.5, 1],
        [-1, 0]
      ]
    }
  },
  {
    "name": "Simple BSpline 1",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "knots": [0, 0, 0, 1, 1, 1],
      "cpoints": [
        [-5, -5],
        [0.5, 2],
        [5, -5]
      ]
    }
  },
  {
    "name": "Simple BSpline 2",
    "type": "BSplineCurve",
    "object": {
      "degree": 3,
      "knots": [0, 0, 0, 0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1, 1],
      "cpoints": [
        [-3, -2],
        [-1, -1],
        [0, -5],
        [3, -5],
        [4, 0],
        [3, 5],
        [0, 5],
        [-1, 1]
      ]
    }
  },
  {
    "name": "Simple BSpline 3",
    "type": "BSplineCurve",
    "object": {
      "degree": 3,
      "knots": [0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1],
      "cpoints": [
        [-1, 0], [0, 0], [0, 1], [1, 1], [1.5, 0], [1, -1], [0, -1]
      ]
    }
  },
  {
    "name": "Simple BSpline 4",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "knots": [0, 0, 0, 0.2, 0.4, 0.6, 0.8, 1, 1, 1],
      "cpoints": [
        [-1, 0], [-1, 1], [0, 1], [0, -1], [1, -1], [0.75, 0.5], [2, 0.5]
      ]
    }
  },
  {
    "name": "Simple BSpline 5",
    "type": "BSplineCurve",
    "object": {
      "degree": 3,
      "knots": [0, 0, 0, 0, 0.25, 0.5, 0.75, 1, 1, 1, 1],
      "cpoints": [
        [-1, 0], [-1, 1], [0, 1], [0, 0], [1, 0], [1.75, 0.5], [1.2, 1.5]
      ]
    }
  },
  {
    "name": "Simple BSpline 6 (3D)",
    "type": "BSplineCurve",
    "object": {
      "degree": 3,
      "knots": [0, 0, 0, 0, 1, 1, 1, 1],
      "cpoints": [
        [-1, -1, 2],
        [-1, 0, 1],
        [1, 1, 1],
        [-1, 2, 0]
      ]
    }
  },
  {
    "name": "Rational BSpline 0",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "knots": [
        0, 0, 0, 0.2, 0.4, 0.6, 0.8, 0.8, 1, 1, 1
      ],
      "cpoints": [
        [-5, -5],
        [-2, 0],
        [-1, 5],
        [-0.5, 2],
        [0.5, 2],
        [1, 5],
        [2, 0],
        [5, -5]
      ],
      "weights": [
        1, 1, 1, 1, 1, 1, 3, 1
      ]
    }
  },
  {
    "name": "Straight line as BSpline",
    "type": "BSplineCurve",
    "object": {
      "degree": 1,
      "knots": [0, 0, 1, 1],
      "cpoints": [
        [0, 0], [4, 5]
      ]
    }
  },
  {
    "name": "Full Circle (4 segments)",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "knots": [0, 0, 0, 0.25, 0.25, 0.5, 0.5, 0.75, 0.75, 1, 1, 1],
      "weights": [
        1, 0.70710678, 1, 0.707106781, 1, 0.707106781, 1, 0.707106781, 1
      ],
      "cpoints": [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0]
      ]
    }
  },
  {
    "name": "Full Circle (3 segments)",
    "type": "BSplineCurve",
    "object": {
      "degree": 2,
      "knots": [0, 0, 0, 0.333, 0.333, 0.666, 0.666, 1, 1, 1],
      "weights": [
        1, 0.5, 1, 0.5, 1, 0.5, 1
      ],
      "cpoints": [
        [0.866, 0.5],
        [0, 2],
        [-0.866, 0.5],
        [-1.732, -1],
        [0, -1],
        [1.732, -1],
        [0.866, 0.5]
      ]
    }
  },

  {
    "name" : "Simple Bezier surface 0" ,
    "type" : "BezSurf",
    "object" : {
      "u_degree" : 3,
      "v_degree" : 2,
      "cpoints" : [
        [[-1,-1,0],[0,-1,0],[1,-1,0]],
        [[-1,0,1],[0,0,2],[1,0,-1]],
        [[-1,1,0],[0,1,0],[1,1,0]],
        [[-1,2,0],[0,2,0],[1,2,0]]
      ]
    }
  },
  {
    "name" : "Simple Rational Bezier surface 0" ,
    "type" : "BezSurf",
    "object" : {
      "u_degree" : 3,
      "v_degree" : 2,
      "cpoints" : [
        [[-1,-1,0],[0,-1,0],[1,-1,0]],
        [[-1,0,1],[0,0,2],[1,0,-1]],
        [[-1,1,0],[0,1,0],[1,1,0]],
        [[-1,2,0],[0,2,0],[1,2,0]]
      ],
      "weights" : [
        [1,2,1],
        [1,1,1],
        [3,1,1],
        [1,1,1]
      ]
    }
  },


  {
    "name" : "Simple BSurf 0",
    "type" :"BSurf",
    "object" : {
      "u_degree" : 2,
      "v_degree" : 2,
      "u_knots" : [0,0,0,1,1,1],
      "v_knots" : [0,0,0,1,1,1],
      "cpoints" : [
        [[-1,-1,0],[0,-1,0],[1,-1,0]],
        [[-1,0,1],[0,0,2],[1,0,-1]],
        [[-1,1,0],[0,1,0],[1,1,0]]
      ]
    }
  },
  {
    "name" : "Simple BSurf 1",
    "type" : "BSurf",
    "comment" : "As defined in 'The NURBS book' Fig 5.9",
    "object" : {
      "u_degree" : 3,
      "v_degree" : 2,
      "u_knots" : [0,0,0,0,1,1,1,1],
      "v_knots" : [0,0,0,0.5,1,1,1],
      "cpoints" :[
        [ [-1,-1,2],[0,-1,1],[1,-1,1],[2,-1,1] ],
        [ [-1,0,1],[0,0,1],[1,0,1],[2,0,1] ],
        [ [-1,1,1],[0,1,-1],[1,1,-1],[2,1,-1] ],
        [ [-1,2,0],[0,2,0],[1,2,-1],[2,2,-1] ]
      ]
    }
  },
  {
    "name" : "Simple BSurf 2",
    "type" : "BSurf",
    "comment" : "u goes top-bottom, v goes left-right",
    "object" : {
      "u_degree" : 3,
      "v_degree" : 2,
      "u_knots" : [0,0,0,0,0.5,0.75,1,1,1,1],
      "v_knots" : [0,0,0,0.5,1,1,1],
      "cpoints" :[
        [ [-1,-1,2],[0,-1,1],[1,-1,1],[2,-1,1] ],
        [ [-1,0,1],[0,0,1],[1,0,1],[2,0,1] ],
        [ [-1,1,1],[0,1,-1],[1,1,-1],[2,1,-1] ],
        [ [-1,2,0],[0,2,0],[1,2,-1],[2,2,-1] ],
        [ [-1,3,0],[0,3,0],[1,3,-1],[2,3,-1] ],
        [ [-1,5,0],[0,5,0],[1,5,-1],[2,5,-1] ]
      ]
    }
  },
  {
    "name" : "Line1",
    "type" : "SpecificGeometry",
    "object" : {
      "type" : "LineSegment",
      "from" : [0,1],
      "to" : [0,4]
    }
  },
  {
    "name" : "CircleArc1",
    "type" : "SpecificGeometry",
    "object" : {
      "type" : "CircleArc",
      "radius" : 4,
      "coord" : {
        origin : [0,0,0],
        x : [1,0,0],
        z : [0,0,1]
      },
      "start" : Math.PI/4,
      "end" : 3*Math.PI/2
    }
  },
  {
    "name" : "Split Bezier 0",
    "type" : "Action",
    "object" : {
      "actiontype" : "split_bezier",
      "input" : "Cubic Bezier 0",
      "split_intervals" : [[0,0.4],[0.4,1]]
    }
  },
  {
    "name" : "Split Bezier 1",
    "type" : "Action",
    "object" : {
      "actiontype" : "split_bezier",
      "input" : "Cubic Bezier 1",
      "split_intervals" : [[0,0.4],[0.4,1]]
    }
  },
  {
    "name" : "Insert Knot in Simple BSpline 5",
    "type" : "Action",
    "object" : {
      "actiontype" : "insert_knot_curve",
      "input" : "Simple BSpline 5",
      "knot_to_insert" : 0.6,
      "num_insertions" : 1
    }
  },
  {
    "name" : "Insert 3 Knots in Simple BSpline 5",
    "type" : "Action",
    "object" : {
      "actiontype" : "insert_knot_curve",
      "input" : "Simple BSpline 5",
      "knot_to_insert" : 0.24,
      "num_insertions" : 2
    }
  },
  {
    "name" : "Refine knots of Simple BSpline 5",
    "type" : "Action",
    "object" : {
      "actiontype" : "refine_knot_curve",
      "input" : "Simple BSpline 5",
      "knots_to_add" : [0.6,0.6,0.7]
    }
  },
  {
    "name" : "Decompose Simple BSpline 5",
    "type" : "Action",
    "object" : {
      "actiontype" : "decompose_curve",
      "input" : "Simple BSpline 5"
    }
  },

  {
    "name" : "Insert u Knot in Simple BSurf 1",
    "type" : "Action",
    "object" : {
      "actiontype" : "insert_knot_surf",
      "input" : "Simple BSurf 1",
      "u_knot_to_insert" : 0.5,
      "num_insertions_u" : 1
    }
  },
  {
    "name" : "Insert v Knot in Simple BSurf 1",
    "type" : "Action",
    "object" : {
      "actiontype" : "insert_knot_surf",
      "input" : "Simple BSurf 1",
      "v_knot_to_insert" : 0.5,
      "num_insertions_v" : 1
    }
  },
  {
    "name" : "Refine u Knot in Simple BSurf 1",
    "type" : "Action",
    "object" : {
      "actiontype" : "refine_knot_surf",
      "input" : "Simple BSurf 1",
      "u_knots_to_add" : [0.3,0.5,0.5]
    }
  },
  {
    "name" : "Refine v Knot in Simple BSurf 1",
    "type" : "Action",
    "object" : {
      "actiontype" : "refine_knot_surf",
      "input" : "Simple BSurf 1",
      "v_knots_to_add" : [0.5,0.9,0.9]
    }
  },
  {
    "name" : "Decompose Simple BSurf 2",
    "type" : "Action",
    "object" : {
      "actiontype" : "decompose_surf",
      "input" : "Simple BSurf 2"
    }
  }
];


