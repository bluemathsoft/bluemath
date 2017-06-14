

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
import {utils, basic, linalg} from '../../src'

let {NDArray} = basic;

(<any>window).bluemath = {
  NDArray
};

export default function testOperations() {

  QUnit.module('Operations', () => {
    QUnit.module('matmul', () => {
      QUnit.test("Square 3x3", assert => {
        let A = new NDArray([[2,2,2],[2,2,2],[2,2,2]], {datatype:'i16'});
        let B = new NDArray([[5,5,5],[5,5,5],[5,5,5]], {datatype:'i16'});
        let M = linalg.matmul(A,B);
        if(M instanceof NDArray) {
          assert.deepEqual(M.shape, [3,3]);
          for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
              assert.equal(M.get(i,j), 30);
            }
          }
        } else {
          assert.notOk(true);
        }
      });
      QUnit.test("3x2 mul 2x3", assert => {
        let A = new NDArray([[1,0],[2,1],[6,9]], {datatype:'i16'});
        let B = new NDArray([[1,2,3],[1,2,9]], {datatype:'i16'});
        let M = linalg.matmul(A,B);
        if(M instanceof NDArray) {
          assert.deepEqual(M.shape, [3,3]);
          assert.equal(M.get(1,0), 3);
          assert.equal(M.get(1,2), 15);
          assert.equal(M.get(2,1), 30);
          assert.equal(M.get(2,2), 99);
        } else {
          assert.notOk(true);
        }
      });
      QUnit.test("3x2 mul 3x3, error", assert => {
        let A = new NDArray([[1,0],[2,1],[6,9]], {datatype:'i16'});
        let B = new NDArray([[1,2,3],[1,2,9],[4,5,3]], {datatype:'i16'});
        assert.throws(() => {
          linalg.matmul(A,B);
        });
      });
      QUnit.test("mul by Vector (inner product)", assert => {
        let A = new NDArray([[1,0,2]], {datatype:'i16'});
        let B = new NDArray([[4,4,9]], {datatype:'i16'});
        B.reshape([3,1]);
        let M = linalg.matmul(A, B);
        assert.deepEqual(M.shape, [1,1]);
        assert.equal(M.get(0,0), 22);
      });
      QUnit.test("mul by Vector, error", assert => {
        let A = new NDArray([[1,0,2],[3,5,6]], {datatype:'i16'});
        let B = new NDArray([[4,4,9]], {datatype:'i16'});
        assert.throws(() => linalg.matmul(A,B));
      });
      QUnit.test("mul by Vector (outer product)", assert => {
        let A = new NDArray([[3,3]], {datatype:'i16'});
        A.reshape([2,1]);
        let B = new NDArray([[2,2]], {datatype:'i16'});
        let M = linalg.matmul(A,B);
        assert.deepEqual(M.shape, [2,2]);
        assert.equal(M.get(0,0), 6);
        assert.equal(M.get(0,1), 6);
        assert.equal(M.get(1,0), 6);
        assert.equal(M.get(1,1), 6);
      });
    });

    QUnit.module('inner', () => {
      QUnit.test('A(3), B(3)', assert => {
        let A = new NDArray([3,4,5]);
        let B = new NDArray([1,2,5]);
        assert.equal(linalg.inner(A,B), 36);
      });
      QUnit.test('A(3), B(4)', assert => {
        let A = new NDArray([3,4,5]);
        let B = new NDArray([1,2,5,7]);
        assert.equal(linalg.inner(A,B), 36);
      });
      QUnit.test('A(4), B(3)', assert => {
        let A = new NDArray([3,4,5,6]);
        let B = new NDArray([1,2,5]);
        assert.throws(() => linalg.inner(A,B));
      });
    });

    QUnit.module('outer', () => {
      QUnit.test('A(3), B(3)', assert => {
        let A = new NDArray([1,1,1]);
        let B = new NDArray([1,1,1]);
        assert.deepEqual(linalg.outer(A,B).toArray(),[
          [1,1,1],[1,1,1],[1,1,1]
        ]);
      });

      QUnit.test('A(3x1), B(1x3)', assert => {
        let A = new NDArray([[1],[1],[1]]);
        let B = new NDArray([1,1,1]);
        assert.deepEqual(linalg.outer(A,B).toArray(),[
          [1,1,1],[1,1,1],[1,1,1]
        ]);
      });

      QUnit.test('A(1x3), B(3x1)', assert => {
        let A = new NDArray([1,1,1]);
        let B = new NDArray([[1],[1],[1]]);
        assert.throws(() => linalg.outer(A,B));
      });
    });

    QUnit.module('norm', () => {
      QUnit.module('Vector', () => {
        QUnit.test('1-norm', assert => {
          let A = new NDArray([2,3,4,5]);
          assert.equal(linalg.norm(A,1), 14);
        });
        QUnit.test('2-norm', assert => {
          let A = new NDArray([2,3,4,5]);
          assert.ok(utils.isequal(linalg.norm(A,2), 7.34847));
        });
        QUnit.test('3-norm', assert => {
          let A = new NDArray([2,3,4,5]);
          assert.ok(utils.isequal(linalg.norm(A,3), 6.07318, 1e-4));
        });
        QUnit.test('Infinity-norm', assert => {
          let A = new NDArray([2,3,4,5]);
          assert.equal(linalg.norm(A,Infinity), 5);
          A = new NDArray([2,3,-48,5]);
          assert.equal(linalg.norm(A,Infinity), 48);
        });
        QUnit.test('-Infinity-norm', assert => {
          let A = new NDArray([2,3,4,5]);
          assert.equal(linalg.norm(A,-Infinity), 2);
          A = new NDArray([2,3,-48,5]);
          assert.equal(linalg.norm(A,-Infinity), 2);
        });
      });
      QUnit.module('Matrix', () => {
        QUnit.test('Frobenius norm', assert => {
          let A = new NDArray([
            [2,3,4],
            [4,2,-9],
            [0,3,1]
          ]);
          assert.ok(utils.isequal(linalg.norm(A, 'fro'),
            11.832159566199232, 1e-6));
        });
      });
    });

    QUnit.module('SVD', () => {

      QUnit.test('svd 1', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ], {datatype:'f32'});

        let [U,S,VT] = linalg.svd(A,true,false);

        // Results generated from numpy
        assert.ok(U.isEqual(new NDArray([
          [-0.42847299, -0.81649658, 0.386968],
          [0.90241006, -0.40824829, 0.1378021],
          [0.04546408, 0.40824829, 0.91173809]
        ])));
        assert.ok(VT.isEqual(new NDArray([
          [0.90241006, -0.42847299, 0.04546408],
          [-0.40824829, -0.81649658, 0.40824829],
          [0.1378021, 0.386968, 0.91173809]
        ])));

      });

    });

    /*
    QUnit.module("Permutation", () => {
      QUnit.test("Vector", assert => {
        let V = new NDArray([34,65,23,90]);
        let p = new NDArray([0,2,3,1]);
        linalg.permuteVector(V,p);
        assert.ok(V.isEqual(new NDArray([34,23,90,65])));
      });
      QUnit.test("Vector inverse", assert => {
        // Same permutation vector, but used on original
        let V = new NDArray([34,65,23,90]);
        let p = new NDArray([0,2,3,1]);
        linalg.ipermuteVector(V,p);
        assert.ok(V.isEqual(new NDArray([34,90,65,23])));

        // Same permutation vector, but used on result of first test
        V = new NDArray([34,23,90,65]);
        p = new NDArray([0,2,3,1]);
        linalg.ipermuteVector(V,p);
        assert.ok(V.isEqual(new NDArray([34,65,23,90])));
      });

    });
    */

    /*
    QUnit.module('LU Decomposition', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [3,17,10],
          [2,4,-2],
          [6,18,-12]
        ]);
        let P = linalg.lu(A);
        assert.ok(P.isEqual(new NDArray([2,0,1])));
        assert.ok(A.isEqual(new NDArray([
          [6,18,-12],
          [0.5,8,16],
          [0.3333333,-0.25,6]
        ])));
      });
    });
    */
    QUnit.module('Solve', () => {
      QUnit.test('Upper tri', assert => {
        let A = new NDArray([
          [4,9],
          [0,5]
        ]);
        let x = new NDArray([32,10]);
        linalg.solve(A,x);
        assert.ok(x.isEqual(new NDArray([3.5,2])));
      });
      QUnit.test('Lower tri', assert => {
        let A = new NDArray([
          [3,0],
          [11,5]
        ]);
        let x = new NDArray([21,99]);
        linalg.solve(A,x);
        assert.ok(x.isEqual(new NDArray([7,4.4])));
      });
      QUnit.module('LU Solve', () => {
        QUnit.test("Circuit matrix", assert => {
          let A = new NDArray([
            [11,-3,0],
            [-3,6,-1],
            [0,-1,3]
          ]);
          let x = new NDArray([30,5,-25]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray([3,1,-8])));
        });
        QUnit.test("From numpy tests", assert => {
          let A = new NDArray([
            [3,1],
            [1,2]
          ]);
          let x = new NDArray([9,8]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray([2,3])));
        });
        QUnit.test("From GSL tests", assert => {
          let A = new NDArray([
            [0.18, 0.60, 0.57, 0.96],
            [0.41, 0.24, 0.99, 0.58],
            [0.14, 0.30, 0.97, 0.66],
            [0.51, 0.13, 0.19, 0.85]
          ],{datatype:'f64'});
          let x = new NDArray([1,2,3,4])
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray(
            [-4.05205, -12.6056, 1.66091, 8.69377],{datatype:'f64'}),1e-4));
        });
        QUnit.test("Random tests 1 (match with numpy)", assert => {
          let A = new NDArray([
            [4, 7, 5, 12], [4, 3, 2, 1], [6, 2, 9, 3], [4, 1, 8, 8]])
          let x = new NDArray([13, 15, 2, 90]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(
              new NDArray([40.50877193, -39.30526316, -25.02807018, 20.93684211]),1e-4));
        });
        QUnit.test("Random tests 2 (match with numpy)", assert => {
          let A = new NDArray([
            [4, 7, 5, 0.5], [4, 3, 2, 1], [6, 2, 99, 3], [4, 1, 8, 8]])
          let x = new NDArray([13, 15, 2, 90]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray(
                [0.19644227, 1.19044879, -0.36008822, 11.36306099])));
        });
        QUnit.test("Random tests 3 (match with numpy)", assert => {
          let A = new NDArray([
            [4, 0.0007, 5, 0.5], [4, 3, 2, 1], [6, 2, 9999, 3], [4, 1, 8, 8]])
          let x = new NDArray([13, 15, 2, 90]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray(
                [1.95364698e+00, -1.07265497e+00, -3.88138726e-03,
                1.04111398e+01])));
        });
        QUnit.test("Random tests 4 (match with numpy)", assert => {
          let A = new NDArray([
            [4, 0.0007, 5, 0.5], [4, 3, 2, 1], [6, 2, 9999, 3], [4, 1, 8, 8]])
          let x = new NDArray([13, 0.15, 2986, 90]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray(
                [1.51620015, -5.80949758, 0.295605, 10.92248213]),1e-5));
        });

        QUnit.skip("Solve multiple", assert => {
          let A = new NDArray([
            [4, 7, 5, 12], [4, 3, 2, 1], [6, 2, 9, 3], [4, 1, 8, 8]])
          let x = new NDArray([
            [13,45,3],
            [15,66,3],
            [2,0.02,8],
            [90,1,0]
          ]);
          linalg.solve(A,x);
          assert.ok(x.isEqual(new NDArray([
                [40.50877193, 31.61561404, -1.66667],
                [-39.30526316, -8.06736842, 2.4],
                [-25.02807018, -21.58596491, 1.933333],
                [20.93684211, 6.91157895, -1.4]
              ]),1e-5));
        });
      });
    });
    QUnit.module('Cholesky', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [4,12,-16],
          [12,37,-43],
          [-16,-43,98]
        ]);
        linalg.cholesky(A);
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