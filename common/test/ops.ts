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

import {NDArray} from '../src/ndarray'
import {Complex} from '../src/complex'
import {
  arr,eye,zeros,add,sub,mul,div,range,count,empty,dot,length,isequal,dir,cross
} from '../src/ops'

export default function testOps() {

  QUnit.module('Ops', () => {
    QUnit.module('eye', () => {
      QUnit.test('Square 2x2', assert => {
        let I = eye(2);
        assert.equal(I.get(0,0), 1);
        assert.equal(I.get(0,1), 0);
        assert.equal(I.get(1,0), 0);
        assert.equal(I.get(1,1), 1);
      });
      QUnit.test('Rectangular 2x3', assert => {
        let I = eye([2,3]);
        assert.equal(I.get(0,0), 1);
        assert.equal(I.get(0,1), 0);
        assert.equal(I.get(1,0), 0);
        assert.equal(I.get(1,1), 1);
        assert.equal(I.get(0,2), 0);
        assert.equal(I.get(1,2), 0);
      });
      QUnit.test('Rectangular 3x2', assert => {
        let I = eye([3,2]);
        assert.equal(I.get(0,0), 1);
        assert.equal(I.get(0,1), 0);
        assert.equal(I.get(1,0), 0);
        assert.equal(I.get(1,1), 1);
        assert.equal(I.get(2,0), 0);
        assert.equal(I.get(2,1), 0);
      });
    });

    QUnit.module('empty', () => {
      QUnit.test('_', assert => {
        let E = empty(2);
        assert.deepEqual(E.shape,[2]);
        E = empty([4,5]);
        assert.equal(E.size, 20);
        assert.deepEqual(E.shape,[4,5]);
      });
    });

    QUnit.module('arr', () => {
      QUnit.test('_', assert => {
        let A = arr([[4,5],[8,9]]);
        assert.deepEqual(A.shape,[2,2]);
      });
    });
    QUnit.module('dot', () => {
      QUnit.test('_', assert => {
        let A = arr([4,5,6]);
        let B = arr([2,2,2]);
        assert.equal(dot(A,B), 30);
      });
    });
    QUnit.module('cross', () => {
      QUnit.test('_', assert => {
        let A = arr([2,3,4]);
        let B = arr([5,6,7]);
        assert.ok(cross(A,B).isEqual(arr([-3,6,-3])));
      });
    })
    QUnit.module('length', () => {
      QUnit.test('_', assert => {
        let B = arr([2,2,2]);
        assert.ok(isequal(length(B),Math.sqrt(12)));
      });
    });
    QUnit.module('dir', () => {
      QUnit.test('_', assert => {
        let B = arr([2,0,0]);
        assert.ok(dir(B).isEqual(arr([1,0,0])));
      });
    });

    QUnit.module('zeros', () => {
      QUnit.test('Rectangular 2x2', assert => {
        let Z = zeros(2);
        assert.equal(Z.length, 2);
        assert.equal(Z.get(0), 0);
        assert.equal(Z.get(1), 0);
      });
      QUnit.test('Rectangular 2x2 ui32', assert => {
        let Z = zeros([2,2], 'ui32');
        assert.equal(Z.datatype, 'ui32');
      });
    });

    QUnit.module('count', () => {
      QUnit.test('exact', assert => {
        assert.equal(count(new NDArray([
          4,5,6,8,8,8,9
        ]),8,0),3);
        assert.equal(count(new NDArray([
          [4,5,6],[8,8,8]
        ]),8,0),3);
      });
      QUnit.test('approximate', assert => {
        assert.equal(count(new NDArray([
          3.4,5.7,9,0,8
        ]),5.7),1);
      });
    });

    QUnit.module('range', () => {
      QUnit.test('range(4)', assert => {
        assert.ok(new NDArray([0,1,2,3]).isEqual(range(4)));
      });
      QUnit.test('range(0,4)', assert => {
        assert.ok(new NDArray([0,1,2,3]).isEqual(range(0,4)));
      });
      QUnit.test('range(2,4)', assert => {
        assert.ok(new NDArray([2,3]).isEqual(range(2,4)));
      });
    });

    QUnit.module('add', () => {
      QUnit.test('Real numbers', assert => {
        assert.equal(add(4,5), 9);
        assert.equal(add(4,5,10), 19);
      });
      QUnit.test('Real and Complex numbers', assert => {
        assert.ok(new Complex(9,5).isEqual(
          <Complex>add(4,new Complex(5,5))));
        assert.ok(new Complex(9,5).isEqual(
          <Complex>add(new Complex(5,5),4)));
        assert.ok(new Complex(19,5).isEqual(
          <Complex>add(4,new Complex(5,5),10)));
        assert.ok(new Complex(9,15).isEqual(
          <Complex>add(4,new Complex(5,5),new Complex(0,10))));
      });
      QUnit.test('Real numbers and NDArray', assert => {
        assert.ok(new NDArray([4,4,4]).isEqual(
          <NDArray>add(new NDArray([1,1,1]),3)));
        assert.ok(new NDArray([4,4,4]).isEqual(
          <NDArray>add(3,new NDArray([1,1,1]))));
        assert.ok(new NDArray([4,4,4]).isEqual(
          <NDArray>add(1,2,new NDArray([1,1,1]))));
        assert.ok(new NDArray([4,4,4]).isEqual(
          <NDArray>add(1,new NDArray([1,1,1]),2)));

        assert.ok(new NDArray([[4,4],[4,4]]).isEqual(
          <NDArray>add(new NDArray([[1,1],[1,1]]),3)));
      });
      QUnit.test('Complex numbers and NDArray', assert => {
        let sarr = new NDArray({shape:[3]});
        sarr.set(0,new Complex(1,1));
        sarr.set(1,new Complex(1,2));
        sarr.set(2,new Complex(2,1));
        let tarr = sarr.clone();
        tarr.set(0,new Complex(2,2));
        tarr.set(1,new Complex(2,3));
        tarr.set(2,new Complex(3,2));
        assert.ok(tarr.isEqual(
          <NDArray>add(sarr, new Complex(1,1))));
        assert.ok(tarr.isEqual(
          <NDArray>add(new Complex(1,1), sarr)));
        assert.ok(tarr.isEqual(
          <NDArray>add(new Complex(0,1), sarr, new Complex(1,0))));

        sarr = new NDArray({shape:[2,2]});
        sarr.set(0,0,new Complex(3,3));
        sarr.set(0,1,new Complex(3,3));
        sarr.set(1,0,new Complex(5,5));
        sarr.set(1,1,new Complex(5,5));
        tarr = sarr.clone();
        tarr.set(0,0,new Complex(4,4));
        tarr.set(0,1,new Complex(4,4));
        tarr.set(1,0,new Complex(6,6));
        tarr.set(1,1,new Complex(6,6));
        assert.ok(tarr.isEqual(
          <NDArray>add(sarr, new Complex(1,1))));
        assert.ok(tarr.isEqual(
          <NDArray>add(1,sarr, new Complex(0,1))));

        sarr = new NDArray({shape:[2,2]});
        sarr.set(0,0,new Complex(3,3));
        sarr.set(0,1,3);
        sarr.set(1,0,new Complex(5,5));
        sarr.set(1,1,5);
        tarr = sarr.clone();
        tarr.set(0,0,new Complex(4,4));
        tarr.set(0,1,new Complex(3,1));
        tarr.set(1,0,new Complex(6,6));
        tarr.set(1,1,new Complex(6,1));
        assert.ok(tarr.isEqual(
          <NDArray>add(sarr, new Complex(1,1))));
      });
      QUnit.test('NDArrays', assert => {
        let arrA = new NDArray([1,1,1]);
        let arrB = new NDArray([1,1,1]);
        assert.ok(new NDArray([2,2,2]).isEqual(
          <NDArray>add(arrA,arrB)));
        assert.ok(new NDArray([3,3,3]).isEqual(
          <NDArray>add(arrA,arrB,arrA)));
        assert.ok(new NDArray([4,4,4]).isEqual(
          <NDArray>add(arrA,arrB,1,arrA)));

        assert.throws(() => {
          add(arrA,new NDArray([[1,2],[4,4]]));
        });
        assert.throws(() => {
          add(arrA,new NDArray([1,1]));
        });

        let sarr1 = new NDArray({shape:[2]});
        sarr1.set(0,new Complex(1,1));
        sarr1.set(1,new Complex(2,0));
        let sarr2 = new NDArray({shape:[2]});
        sarr2.set(0,1);
        sarr2.set(1,new Complex(0,1));
        let tarr = new NDArray({shape:[2]});
        tarr.set(0,new Complex(2,1));
        tarr.set(1,new Complex(2,1));
        assert.ok(tarr.isEqual(<NDArray>add(sarr1,sarr2)));
      });
    });

    QUnit.module('mul', () => {
      QUnit.test("Real and Complex numbers", assert => {
        assert.equal(mul(2,5), 10);
        assert.equal(mul(2,5,3), 30);
        assert.ok(new Complex(4,6).isEqual(
          <Complex>mul(2,new Complex(2,3))));
        assert.ok(new Complex(4,6).isEqual(
          <Complex>mul(new Complex(2,3),2)));
        assert.ok(new Complex(12,18).isEqual(
          <Complex>mul(new Complex(2,3),2,3)));
        assert.ok(new Complex(-6,10).isEqual(
          <Complex>mul(new Complex(1,4),new Complex(2,2))));
        assert.ok(new Complex(-28,24).isEqual(
          <Complex>mul(new Complex(1,4),new Complex(2,2),new Complex(3,1))));
      });

      QUnit.test('Numbers and NDArray', assert => {
        assert.ok(new NDArray([4,4]).isEqual(
          <NDArray>mul(2,new NDArray([2,2]))));
        assert.ok(new NDArray([4,4]).isEqual(
          <NDArray>mul(new NDArray([2,2]),2)));
        assert.ok(new NDArray([8,8]).isEqual(
          <NDArray>mul(new NDArray([2,2]),2,2)));

        let sarr = new NDArray({shape:[2]});
        sarr.set(0, new Complex(2,2));
        sarr.set(1, 2);
        let tarr = sarr.clone();
        tarr.set(0, new Complex(6,6));
        tarr.set(1, 6);
        assert.ok(tarr.isEqual(<NDArray>mul(sarr, 3)));
      });

      QUnit.test('NDArrays', assert => {
        let A = new NDArray([[2,2,2],[2,2,2],[2,2,2]], {datatype:'i16'});
        let B = new NDArray([[5,5,5],[5,5,5],[5,5,5]], {datatype:'i16'});
        assert.throws(() => { // The error suggests use of linalg.matmul
          <NDArray>mul(A,B);
        })
      });
    });

    QUnit.module('sub', () => {
      QUnit.test('Real and complex numbers', assert => {
        assert.equal(sub(3,4),-1);
        assert.ok(new Complex(0,-3).isEqual(
          <Complex>sub(3,new Complex(3,3))));
        assert.ok(new Complex(2,3).isEqual(
          <Complex>sub(new Complex(3,3),1)));
        assert.ok(new Complex(2,2).isEqual(
          <Complex>sub(new Complex(3,3),new Complex(1,1))));
      });

      QUnit.test('Numbers and NDArrays', assert => {
        let A = new NDArray([
          [4,5],
          [2,7]
        ]);
        assert.ok(new NDArray([
          [3,4],
          [1,6]
        ]).isEqual(<NDArray>sub(A,1)));
        assert.ok(new NDArray([
          [-3,-4],
          [-1,-6]
        ]).isEqual(<NDArray>sub(1,A)));

        let sarr = new NDArray({shape:[2]});
        sarr.set(0,3);
        sarr.set(1,new Complex(4,5));

        let tarr = sarr.clone();
        tarr.set(0,2);
        tarr.set(1,new Complex(3,5));
        assert.ok(tarr.isEqual(<NDArray>sub(sarr,1)));

        tarr = sarr.clone();
        tarr.set(0,-2);
        tarr.set(1,new Complex(-3,-5));
        assert.ok(tarr.isEqual(<NDArray>sub(1,sarr)));

        tarr = sarr.clone();
        tarr.set(0,new Complex(-2,1));
        tarr.set(1,new Complex(-3,-4));
        assert.ok(tarr.isEqual(<NDArray>sub(new Complex(1,1),sarr)));

        tarr = sarr.clone();
        tarr.set(0,new Complex(2,-1));
        tarr.set(1,new Complex(3,4));
        assert.ok(tarr.isEqual(<NDArray>sub(sarr,new Complex(1,1))));
      });

      QUnit.test('NDArrays', assert => {
        let A = new NDArray([
          [4,5],
          [2,7]
        ]);
        let B = new NDArray([
          [1,4],
          [5,2]
        ]);
        assert.ok(new NDArray([
          [3,1],
          [-3,5]
        ]).isEqual(<NDArray>sub(A,B)));

        let sarr1 = new NDArray({shape:[2]});
        sarr1.set(0,3);
        sarr1.set(1,new Complex(4,5));
        let sarr2 = new NDArray([3,3]);
        let tarr = sarr1.clone();
        tarr.set(0, 0)
        tarr.set(1, new Complex(1,5));
        assert.ok(tarr.isEqual(<NDArray>sub(sarr1,sarr2)));
      });
    });

    QUnit.module('div', () => {
      QUnit.test('Real and complex numbers', assert => {
        assert.equal(div(10,5), 2);
        assert.ok(new Complex(6,8).isEqual(
          <Complex>div(new Complex(12,16),2)));
        assert.ok(new Complex(0.8,-1.6).isEqual(
          <Complex>div(4,new Complex(1,2))));
      });
      QUnit.test('Numbers and NDArray', assert => {
        let A = new NDArray([4,6,8]);
        assert.ok(new NDArray([2,3,4]).isEqual(<NDArray>div(A,2)));
        let sarr = new NDArray({shape:[2]});
        sarr.set(0, 4);
        sarr.set(1, new Complex(4,4));
        let tarr = new NDArray({shape:[2]});
        tarr.set(0, 2);
        tarr.set(1, new Complex(2,2));
        assert.ok(tarr.isEqual(<NDArray>div(sarr,2)));
      });
    });
  });
}