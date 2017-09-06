

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
import {NDArray,arr} from '@bluemath/common'

import {BSplineCurve, BezierCurve} from '../src/nurbs/bcurve'
import {planeFrom3Points} from '../src/nurbs/helper'

export default function testNURBS() {

  QUnit.module('Helper', () => {
    QUnit.test('XY plane',assert=> {
      assert.deepEqual(planeFrom3Points(
        arr([0,0,0]),
        arr([5,0,0]),
        arr([0,5,0])
      ), [0,0,1,0]);
      assert.deepEqual(planeFrom3Points(
        arr([0,0,0]),
        arr([0,5,0]),
        arr([5,0,0])
      ), [0,0,-1,0]);
      assert.deepEqual(planeFrom3Points(
        arr([0,0,3]),
        arr([0,5,3]),
        arr([5,0,3])
      ), [0,0,-1,3]);
      assert.deepEqual(planeFrom3Points(
        arr([0,0,3]),
        arr([5,0,3]),
        arr([0,5,3])
      ), [0,0,1,-3]);
    });
    QUnit.test('XZ plane',assert=> {
      assert.deepEqual(planeFrom3Points(
        arr([0,0,0]),
        arr([5,0,0]),
        arr([0,0,5])
      ), [0,-1,0,0]);
      assert.deepEqual(planeFrom3Points(
        arr([0,0,0]),
        arr([0,0,5]),
        arr([5,0,0])
      ), [0,1,0,0]);
      assert.deepEqual(planeFrom3Points(
        arr([0,2,0]),
        arr([0,2,5]),
        arr([5,2,0])
      ), [0,1,0,-2]);
      assert.deepEqual(planeFrom3Points(
        arr([0,2,0]),
        arr([5,2,0]),
        arr([0,2,5])
      ), [0,-1,0,2]);
    });
    QUnit.test('YZ plane',assert=> {
      assert.deepEqual(planeFrom3Points(
        arr([0,0,0]),
        arr([0,5,0]),
        arr([0,0,5])
      ), [1,0,0,0]);
      assert.deepEqual(planeFrom3Points(
        arr([0,0,0]),
        arr([0,0,5]),
        arr([0,5,0])
      ), [-1,0,0,0]);
      assert.deepEqual(planeFrom3Points(
        arr([2,0,0]),
        arr([2,0,5]),
        arr([2,5,0])
      ), [-1,0,0,2]);
      assert.deepEqual(planeFrom3Points(
        arr([2,0,0]),
        arr([2,5,0]),
        arr([2,0,5])
      ), [1,0,0,-2]);
    });
    QUnit.test('Oblique plane',assert=> {
      {
        let [a,b,c,d] = planeFrom3Points(
          arr([1,0,0]),
          arr([0,1,0]),
          arr([0,0,1])
        );
        assert.ok(a>0 && b>0 && c>0);
      }
      {
        let [a,b,c,d] = planeFrom3Points(
          arr([0,1,0]),
          arr([1,0,0]),
          arr([0,0,1])
        );
        assert.ok(a<0 && b<0 && c<0);
      }
    });
  });

  QUnit.module('NURBS', () => {
    QUnit.module('Bezier2D', () => {
      QUnit.test('construction', assert => {
        let bezcrv = new BezierCurve(3,arr([
          [0,0],[1,3],[2,-3],[3,1]
        ]));
        assert.ok(!!bezcrv);
      });
      QUnit.test('isStraight', assert => {
        let bezcrv = new BezierCurve(3,arr([
          [0,0],[1,3],[2,-3],[3,1]
        ]));
        assert.ok(!bezcrv.isLine());

        bezcrv = new BezierCurve(3,arr([
          [0,0],[1,1],[2,2],[5,5]
        ]));
        assert.ok(bezcrv.isLine());

        bezcrv = new BezierCurve(1,arr([
          [0,0],[5,5]
        ]));
        assert.ok(bezcrv.isLine());

        bezcrv = new BezierCurve(2,arr([
          [0,0],[5,1e-3],[10,0]
        ]));
        assert.ok(!bezcrv.isLine());
        assert.ok(bezcrv.isLine(1e-2));
      });
      
      QUnit.skip('computeZeroCurvatureLocations', assert => {
        let bezcrv = new BezierCurve(3, arr([
          [0,0],[3,3],[6,3],[9,0]
        ]));
        console.log(bezcrv.computeZeroCurvatureLocations());
        assert.ok(true);
      });

    });
    QUnit.module('BSplineCurve2D', () => {
      QUnit.test('construction', assert => {
        let bcrv = new BSplineCurve(1,
          new NDArray([[0,0],[10,10]]), new NDArray([0,0,1,1]));
        assert.ok(!!bcrv);
        assert.equal(bcrv.degree, 1);
        assert.equal(bcrv.cpoints.shape[0], 2);
        assert.equal(bcrv.knots.shape[0], 4);
      });
    });
  });
}
