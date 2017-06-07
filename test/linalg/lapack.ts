
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

    QUnit.module('gesv', () => {
      QUnit.test('sgesv - no permutation', assert => {
        let A = new NDArray([
          [11,-3,0],
          [-3,6,-1],
          [0,-1,3]
        ]);
        let x = new NDArray([30,5,-25]);
        let ipiv = linalg.lapack.gesv(A.data,x.data,A.shape[0],1);
        assert.deepEqual(x.toArray(), [3,1,-8]);
        assert.deepEqual(Array.prototype.slice.call(ipiv), [1,2,3]);
      });
      QUnit.test('sgesv - permutation', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ]);
        let x = new NDArray([30,5,-25]); // TODO: why this doesn't have to change?
        let ipiv = linalg.lapack.gesv(A.data,x.data,A.shape[0],1);
        assert.deepEqual(x.toArray(), [1,3,-8]);
        assert.deepEqual(Array.prototype.slice.call(ipiv), [2,2,3]);
      });
      QUnit.test('dgesv - no permutation', assert => {
        let A = new NDArray([
          [11,-3,0],
          [-3,6,-1],
          [0,-1,3]
        ], {datatype:'f64'});
        let x = new NDArray([30,5,-25], {datatype:'f64'});
        let ipiv = linalg.lapack.gesv(A.data,x.data,A.shape[0],1);
        assert.deepEqual(x.toArray(), [3,1,-8]);
        assert.deepEqual(Array.prototype.slice.call(ipiv), [1,2,3]);
      });
      QUnit.test('dgesv - permutation', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ], {datatype:'f64'});
        let x = new NDArray([30,5,-25], {datatype:'f64'}); // TODO: why this doesn't have to change?
        let ipiv = linalg.lapack.gesv(A.data,x.data,A.shape[0],1);
        assert.deepEqual(x.toArray(), [1,3,-8]);
        assert.deepEqual(Array.prototype.slice.call(ipiv), [2,2,3]);
      });
    });

    // TODO
    QUnit.module('gesdd', () => {
      QUnit.test('dgesdd', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ], {datatype:'f64'});
        linalg.lapack.gesdd(A.data, 3, 3);
        console.log(A.toString());
        assert.ok(true);
      });
    });

    QUnit.module('potrf', () => {
      QUnit.test('dpotrf', assert => {
        // From wikipedia
        let A = new NDArray([
          [4,12,-16],
          [12,37,-43],
          [-16,-43,98]
        ]);
        linalg.lapack.potrf(A.data, 3);
        //TODO: this only passes if internally 'L' is specified for UPLO
        assert.equal(A.get(0,0), 2);
        assert.equal(A.get(0,1), 6);
        assert.equal(A.get(0,2), -8);
        assert.equal(A.get(1,1), 1);
        assert.equal(A.get(1,2), 5);
        assert.equal(A.get(2,2), 3);
      });
    });

  });
}