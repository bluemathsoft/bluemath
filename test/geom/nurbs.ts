

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
import {NDArray, geom} from '../../src'

let {BSplineCurve} = geom.nurbs;

export default function testNURBS() {
  QUnit.module('NURBS', () => {
    QUnit.module('BSplineCurve2D', () => {
      QUnit.test('construction', assert => {
        let bcrv = new BSplineCurve(1,
          new NDArray([[0,0],[10,10]]), new NDArray([0,0,1,1]));
        assert.ok(!!bcrv);
        assert.equal(bcrv.degree, 1);
        assert.equal(bcrv.cpoints.shape[0], 2);
        assert.equal(bcrv.knots.shape[0], 4);
      });
      QUnit.skip('evaluate at midpoint', assert => {
        // let bcrv = new BSplineCurve(1,
          // new NDArray([[0,0], [10,10]]), new NDArray([0,0,1,1]));
        // assert.ok(bcrv.evaluate(0.5).isEqual(new Vector2(5,5)));
        assert.ok(false);
      });
    });
  });
}