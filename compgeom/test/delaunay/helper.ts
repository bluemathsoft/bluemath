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

import * as helper from '../../src/delaunay/helper'

export default function testDelaunayHelper() {

  QUnit.module('Helper', () => {
    QUnit.test('Point line orientation', assert => {
      // One direction
      assert.equal(helper.pointLineOrientation([50,50],[150,50],[100,25]),-1);
      assert.equal(helper.pointLineOrientation([50,50],[150,50],[100,75]),1);
      assert.equal(helper.pointLineOrientation([50,50],[150,50],[100,50]),0);

      assert.equal(helper.pointLineOrientation([100,25],[100,75],[150,50]),-1);
      assert.equal(helper.pointLineOrientation([100,25],[100,75],[50,50]),1);
      assert.equal(helper.pointLineOrientation([100,25],[100,75],[100,50]),0);

      assert.equal(helper.pointLineOrientation([50,75],[150,25],[150,75]),1);
      assert.equal(helper.pointLineOrientation([50,75],[150,25],[50,25]),-1);
      assert.equal(helper.pointLineOrientation([50,75],[150,25],[100,50]),0);

      // Reverse direction
      assert.equal(helper.pointLineOrientation([150,50],[50,50],[100,25]),1);
      assert.equal(helper.pointLineOrientation([150,50],[50,50],[100,75]),-1);
      assert.equal(helper.pointLineOrientation([150,50],[50,50],[100,50]),0);

      assert.equal(helper.pointLineOrientation([100,75],[100,25],[150,50]),1);
      assert.equal(helper.pointLineOrientation([100,75],[100,25],[50,50]),-1);
      assert.equal(helper.pointLineOrientation([100,75],[100,25],[100,50]),0);

      assert.equal(helper.pointLineOrientation([150,25],[50,75],[150,75]),-1);
      assert.equal(helper.pointLineOrientation([150,25],[50,75],[50,25]),1);
      assert.equal(helper.pointLineOrientation([150,25],[50,75],[100,50]),0);
    });

    QUnit.test('Point in circle', assert => {
      assert.equal(helper.pointInCircle(
        [100,100],[150,125],[200,100], [150,75]
      ), 1);
      assert.equal(helper.pointInCircle(
        [100,100],[150,125],[200,100], [150,25]
      ), -1);
      assert.equal(helper.pointInCircle(
        [100,100],[150,150],[200,100], [150,50]
      ), 0);

    });

  });
}