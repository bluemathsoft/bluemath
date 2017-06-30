

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

import {linalg} from '../../src'

export default function testConstruction() {
  QUnit.module('Construction', () => {
    QUnit.module('eye', () => {
      QUnit.test('Square 2x2', assert => {
        let I = linalg.eye(2);
        assert.equal(I.get(0,0), 1);
        assert.equal(I.get(0,1), 0);
        assert.equal(I.get(1,0), 0);
        assert.equal(I.get(1,1), 1);
      });
      QUnit.test('Rectangular 2x3', assert => {
        let I = linalg.eye([2,3]);
        assert.equal(I.get(0,0), 1);
        assert.equal(I.get(0,1), 0);
        assert.equal(I.get(1,0), 0);
        assert.equal(I.get(1,1), 1);
        assert.equal(I.get(0,2), 0);
        assert.equal(I.get(1,2), 0);
      });
      QUnit.test('Rectangular 3x2', assert => {
        let I = linalg.eye([3,2]);
        assert.equal(I.get(0,0), 1);
        assert.equal(I.get(0,1), 0);
        assert.equal(I.get(1,0), 0);
        assert.equal(I.get(1,1), 1);
        assert.equal(I.get(2,0), 0);
        assert.equal(I.get(2,1), 0);
      });
    });
    QUnit.module('zeros', () => {
      QUnit.test('Rectangular 2x2', assert => {
        let Z = linalg.zeros(2);
        assert.equal(Z.get(0,0), 0);
        assert.equal(Z.get(0,1), 0);
        assert.equal(Z.get(1,0), 0);
        assert.equal(Z.get(1,1), 0);
      });
      QUnit.test('Rectangular 2x2 ui32', assert => {
        let Z = linalg.zeros([2,2], 'ui32');
        assert.equal(Z.datatype, 'ui32');
      });
    });
  });
}