

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

import {basic, utils} from '../../src'
let {Vector2, Vector, PermutationVector, Matrix} = basic;

/// <reference path="qunit/index.d.ts" />

export default function testVector() {
  QUnit.module('Vector2', () => {
    QUnit.test('construction', assert => {
      let v = new Vector2(20, 30);
      assert.equal(v.x, 20);
    });
    QUnit.test('add', assert => {
      let v1 = new Vector2(20, 30);
      let v2 = new Vector2(20, 30);
      assert.equal(v1.add(v2).get(0), 40);
    });
    QUnit.test('sub', assert => {
      let v1 = new Vector2(20, 30);
      let v2 = new Vector2(14, 22);
      assert.equal(v1.sub(v2).get(1), 8);
    });
    QUnit.test('mul', assert => {
      let v = new Vector2(20, 30);
      assert.equal(v.mul(0.1).get(1), 3);
    });
    QUnit.test('lenSq', assert => {
      let v = new Vector2(12, 12);
      assert.equal(v.lenSq(), 2 * 144);
    });
    QUnit.test('len', assert => {
      let v = new Vector2(12, 12);
      assert.ok(utils.isEqualFloat(v.len(), 12 * Math.sqrt(2)));
    });
    QUnit.test('unit', assert => {
      let v = new Vector2(12, 12);
      assert.ok(utils.isEqualFloat(v.unit().len(), 1));
    });
    QUnit.test('isNonZero', assert => {
      let v = new Vector2(20, 30);
      assert.equal(v.isNonZero(), true);
    });
    QUnit.test('isZero', assert => {
      let v = new Vector2(0, 0);
      assert.equal(v.isZero(), true);
    });
    QUnit.test('distSq', assert => {
      let v = new Vector2(0,0);
      assert.equal(v.distSq(new Vector2(12,12)), 2*144);
    });
    QUnit.test('dist', assert => {
      let v = new Vector2(0,0);
      assert.ok(utils.isEqualFloat(v.dist(new Vector2(12,12)), 12*Math.sqrt(2)));
    });
    QUnit.test('dot', assert => {
      let v = new Vector2(5,4);
      assert.equal(v.dot(new Vector2(2,3)), 22);
    });
    QUnit.test('cross', assert => {
      let v = new Vector2(5,4);
      assert.equal(v.cross(new Vector2(2,3)), 7);
    });
    QUnit.test('round', assert => {
      let v = new Vector2(5.4533,4.8766);
      assert.ok(v.round().isEqual(new Vector2(5,5)));
    });
    QUnit.test('swap', assert => {
      let v = new Vector([3,7,5,32,9,78]);
      v.swap(3,4);
      assert.ok(v.isEqual(new Vector([3,7,5,9,32,78])));
    });
    /*
    QUnit.test('permute', assert => {
      let v = new Vector([3,7,5,32,9,78]);
      let p = new Vector([1,4,2,0,3,5]);
      v.permute(p);
      assert.ok(v.isEqual(new Vector([7,9,5,3,32,78])));
    });
    QUnit.test('permuteInverse', assert => {
      let v = new Vector([3,7,5,32,9,78]);
      let p = new Vector([1,4,2,0,3,5]);
      v.permuteInverse(p);
      assert.ok(v.isEqual(new Vector([32,3,5,9,7,78])));
    });
    */
    QUnit.test('low', assert => {
      let varr = [
        new Vector2(2,4),
        new Vector2(12,0),
        new Vector2(3,-4),
        new Vector2(21,35),
      ];
      assert.ok(Vector2.low(varr).isEqual(new Vector2(2,-4)));
    });
    QUnit.test('high', assert => {
      let varr = [
        new Vector2(2,4),
        new Vector2(12,0),
        new Vector2(3,-4),
        new Vector2(21,35),
      ];
      assert.ok(Vector2.high(varr).isEqual(new Vector2(21,35)));
    });
    QUnit.test('toString', assert => {
      assert.equal(new Vector2(3.5466,-6.0988).toString(), '[3.55,-6.10]');
      assert.equal(new Vector2(3.5466,-6.0988).toString(3), '[3.547,-6.099]');
    });
  });

  QUnit.module('Permutation', () => {
    QUnit.test('construction init', assert => {
      let pv = new PermutationVector(4);
      assert.ok(pv.isEqual(new Vector([0,1,2,3])));
    });
    QUnit.test('construction other value', assert => {
      let pv = new PermutationVector([3,2,0,1]);
      assert.ok(pv.isEqual(new Vector([3,2,0,1])));
    });
    QUnit.test('Identity matrix', assert => {
      let pv = new PermutationVector(4);
      assert.ok(pv.toMatrix().isEqual(Matrix.identity(4)));
    });
    QUnit.test('Permuted matrix', assert => {
      let pv = new PermutationVector([3,2,0,1]);
      assert.ok(pv.toMatrix().isEqual(new Matrix([
        [0,0,0,1],
        [0,0,1,0],
        [1,0,0,0],
        [0,1,0,0]
      ])));
    });
  });
}