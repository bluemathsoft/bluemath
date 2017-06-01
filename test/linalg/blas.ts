

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
import {utils} from '../../src'
import * as blas from '../../src/linalg/blas'

export default function testBLAS() {

  QUnit.module('blas', () => {
    function numberArrayEqual(X:Float32Array,Y:Float32Array) {
      if(X.length !== Y.length) { return false; }
      for(let i=0; i<X.length; i++) {
        if(!utils.isEqualFloat(X[i], Y[i])) {
          return false;
        }
      }
      return true;
    }
    QUnit.test('asum', assert => {
      let X = new Float32Array([3.404,5.66,2,0,-3]);
      let r = blas.asum(X);
      assert.ok(utils.isEqualFloat(r, 14.064, 1e-4));
    });
    QUnit.test('axpy', assert => {
      let X = new Float32Array([3.404,5.66,2,0,-3]);
      let Y = new Float32Array(5);
      let answer = new Float32Array([6.808,11.32,4,0,-6]);
      blas.axpy(X,2,Y);
      assert.ok(numberArrayEqual(Y,answer));
    });
  });
}