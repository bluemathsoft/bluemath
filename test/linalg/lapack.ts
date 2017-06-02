
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
import {linalg, basic} from '../../src'
let {NDArray} = basic;

export default function testLAPACK() {

  QUnit.module('LAPACK', () => {

    QUnit.module('BLAS Level 1', () => {

      QUnit.module('asum', () => {
        QUnit.test('sasum', assert => {
          let sx = new NDArray([1,2,3,4]);
          assert.equal(linalg.lapack.asum(sx.data), 10);
        });
        QUnit.test('dasum', assert => {
          let dx = new NDArray([1,2,3,4],{datatype:'f64'});
          assert.equal(linalg.lapack.asum(dx.data), 10);
        });
      });

      QUnit.module('dot', () => {
        QUnit.test('sdot', assert => {
          let sx = new NDArray([1,2,3,4]);
          let sy = new NDArray([2,3,4,5]);
          assert.equal(linalg.lapack.dot(sx.data,sy.data), 40);
        });
        QUnit.test('ddot', assert => {
          let dx = new NDArray([1,2,3,4],{datatype:'f64'});
          let dy = new NDArray([2,3,4,5],{datatype:'f64'});
          assert.equal(linalg.lapack.dot(dx.data,dy.data), 40);
        });
      });

    });

    QUnit.module('BLAS Level 2', () => {
      QUnit.module('gemv', () => {
        QUnit.test('sgemv', assert => {
          let A = new NDArray([
            [2,3,4,5],
            [1,0,7,5]
          ])
          let x = new NDArray([2,2,2,2]);
          let y = new NDArray([3,3]);
          linalg.lapack.gemv(2,A.data,A.shape[0],A.shape[1],x.data,y.data,5);
          assert.deepEqual(y.toArray(), [71,67]);
        });
        QUnit.test('dgemv', assert => {
          let A = new NDArray([
            [2,3,4,5],
            [1,0,7,5]
          ], {datatype:'f64'})
          let x = new NDArray([2,2,2,2], {datatype:'f64'});
          let y = new NDArray([1,1], {datatype:'f64'});
          linalg.lapack.gemv(2,A.data,A.shape[0],A.shape[1],x.data,y.data,5);
          assert.deepEqual(y.toArray(), [61,57]);
        });
      });
    });

    QUnit.module('BLAS Level 3', () => {
      QUnit.module('gemm', () => {
        QUnit.test('sgemm', assert => {
          let A = new NDArray([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
          ]);
          let B = new NDArray([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
          ]);
          let C = new NDArray([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
          ]);
          linalg.lapack.gemm(A.data,B.data,C.data,4,4,4,1.5,2.5);
          assert.deepEqual(C.toArray(), [
            [8.5,8.5,8.5,8.5],
            [8.5,8.5,8.5,8.5],
            [8.5,8.5,8.5,8.5],
            [8.5,8.5,8.5,8.5]
          ]);
        });
        QUnit.test('dgemm', assert => {
          let A = new NDArray([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
          ], {datatype:'f64'});
          let B = new NDArray([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
          ], {datatype:'f64'});
          let C = new NDArray([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
          ], {datatype:'f64'});
          linalg.lapack.gemm(A.data,B.data,C.data,4,4,4,1.5,3.5);
          assert.deepEqual(C.toArray(), [
            [9.5,9.5,9.5,9.5],
            [9.5,9.5,9.5,9.5],
            [9.5,9.5,9.5,9.5],
            [9.5,9.5,9.5,9.5]
          ]);
        });
      });
    });

  });
}