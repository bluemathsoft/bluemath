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

export const CURVE_DATA = [
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
        [-1, 1, 1],
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
    "name" : "Insert Knot in Simple BSpline 5",
    "type" : "Action",
    "object" : {
      "actiontype" : "insert_knot_curve",
      "input" : "Simple BSpline 5",
      "knot_to_insert" : 0.6,
      "num_insertions" : 1
    }
  }
];


