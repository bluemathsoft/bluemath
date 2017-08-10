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


import {AABB} from '../src/aabb'

/// <reference path="qunit/index.d.ts" />

export default function testAABB() {
  QUnit.module('AABB', () => {
    QUnit.test('construction default', assert => {
      let aabb = new AABB(2);
      let aabb1 = new AABB([0,0],[10,10]);
      aabb.merge(aabb1);
      assert.equal(aabb.min.get(0), 0);
      assert.equal(aabb.min.get(1), 0);
      assert.equal(aabb.max.get(0), 10);
      assert.equal(aabb.max.get(1), 10);
    });
    QUnit.test('construction', assert => {
      let aabb = new AABB([0,0],[10,10]);
      assert.equal(aabb.min.get(0), 0);
      assert.equal(aabb.min.get(1), 0);
      assert.equal(aabb.max.get(0), 10);
      assert.equal(aabb.max.get(1), 10);
    });
    QUnit.test('merge', assert => {
      let aabb1 = new AABB([0,0],[10,10]);
      let aabb2 = new AABB([5,5],[15,15]);
      aabb1.merge(aabb2);
      assert.equal(aabb1.min.get(0), 0);
      assert.equal(aabb1.min.get(1), 0);
      assert.equal(aabb1.max.get(0), 15);
      assert.equal(aabb1.max.get(1), 15);

      aabb1 = new AABB([0,0],[10,10]);
      aabb2 = new AABB([-5,-5],[1,1]);
      aabb1.merge(aabb2);
      assert.equal(aabb1.min.get(0), -5);
      assert.equal(aabb1.min.get(1), -5);
      assert.equal(aabb1.max.get(0), 10);
      assert.equal(aabb1.max.get(1), 10);
    });
  });
}