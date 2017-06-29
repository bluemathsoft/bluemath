

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
        QUnit.test('0-norm', assert => {
          let A = new NDArray([0,3,0,5]);
          assert.equal(linalg.norm(A,0), 2);
        });
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
    QUnit.module('lstsq', () => {
      QUnit.test('Line fitting 1', assert => {
        let Y = new NDArray([-1,0.2,0.9,2.1]);
        let A = new NDArray([
          [0,1], [1,1], [2,1], [3,1]
        ]);
        let {x,residuals,rank,singulars} = linalg.lstsq(A,Y);
        assert.ok(utils.isequal(<number>x.get(0,0),1));
        assert.ok(utils.isequal(<number>x.get(1,0),-0.95));
        assert.equal(rank, 2);
        assert.ok(residuals.isEqual(new NDArray([0.05])));
        assert.ok(singulars.isEqual(new NDArray([4.10003045, 1.09075677])));
      });

      QUnit.test('Line fitting 2', assert => {
        let Y = new NDArray([3.9, 2.3, 2, -1.4, -1, -0.1]);
        let A = new NDArray([
          [-3, 1], [-0.9, 1], [-1.8, 1],
          [3.2, 1], [1, 1], [3.3, 1]
        ]);
        let {x,residuals,rank,singulars} = linalg.lstsq(A,Y);
        assert.ok(utils.isequal(<number>x.get(0, 0), -0.71853349));
        assert.ok(utils.isequal(<number>x.get(1, 0), 1.16556005));
        assert.equal(rank, 2);
        assert.ok(residuals.isEqual(new NDArray([4.1707015])));
        assert.ok(singulars.isEqual(new NDArray([5.94059051, 2.42680538])));
      });
    });

    QUnit.module('slogdet', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [4,5,6],
          [1,5,3],
          [8,4,5]
        ]);
        let [sign,logdet] = linalg.slogdet(A);
        assert.equal(sign,-1);
        assert.ok(utils.isequal(logdet, Math.log(69)));
      });

      QUnit.test('2x2', assert => {
        let A = new NDArray([
          [4,5],
          [1,5],
        ]);
        let [sign,logdet] = linalg.slogdet(A);
        assert.equal(sign,1);
        assert.equal(logdet, Math.log(15));
      });
    });

    QUnit.module('det', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [4,5,6],
          [1,5,3],
          [8,4,5]
        ]);
        let det = linalg.det(A);
        assert.ok(utils.isequal(det, -69, 1e-5));
      });

      QUnit.test('2x2', assert => {
        let A = new NDArray([
          [4,5],
          [1,5],
        ]);
        let det = linalg.det(A);
        assert.equal(det, 15);
      });
    });

    QUnit.module('inv', () => {
      QUnit.test('2x2', assert => {
        let A = new NDArray([
          [4,5],
          [1,3]
        ]);
        let invA = linalg.inv(A);
        assert.ok(invA.isEqual(new NDArray([
          [ 0.42857143, -0.71428571],
          [-0.14285714,  0.57142857]
        ])));
      });
      QUnit.test('3x3 test1', assert => {
        let A = new NDArray([
          [4,5,6],
          [1,5,3],
          [8,4,5]
        ]);
        let invA = linalg.inv(A);
        assert.ok(invA.isEqual(new NDArray([
          [-0.1884058 ,  0.01449275,  0.2173913 ],
          [-0.27536232,  0.4057971 ,  0.08695652],
          [ 0.52173913, -0.34782609, -0.2173913 ]
        ])));
      });
      QUnit.test('3x3 test2', assert => {
        let A = new NDArray([
          [4,-5,6],
          [1,0,3],
          [-8,4,5]
        ]);
        let invA = linalg.inv(A);
        assert.ok(invA.isEqual(new NDArray([
          [-0.09917355,  0.40495868, -0.12396694],
          [-0.23966942,  0.56198347, -0.04958678],
          [ 0.03305785,  0.19834711,  0.04132231]
        ])));
      });
    });

    QUnit.module('rank', () => {
      QUnit.test('Full rank 3x3', assert => {
        let A = new NDArray([
          [3,5,6],[3,2,1],[7,8,16]
        ]);
        assert.equal(linalg.rank(A), 3);
      });
      QUnit.test('Rank 2 for 3x3', assert => {
        let A = new NDArray([
          [3,5,6],[3,2,6],[6,8,12]
        ]);
        assert.equal(linalg.rank(A), 2);
      });
      QUnit.test('Rank 1 for 3x3', assert => {
        let A = new NDArray([
          [3,5,6],[3,5,6],[6,10,12]
        ]);
        assert.equal(linalg.rank(A), 1);
      });
    });

    QUnit.module('SVD', () => {

      QUnit.test(
        'svd 3x3 - full_matrices=true, complete_uv=true', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ], {datatype:'f32'});

        let [U,S,VT] = linalg.svd(A,true,true);

        // Results generated from numpy
        assert.ok(U.isEqual(new NDArray([
          [-0.42847299, -0.81649658, 0.386968],
          [0.90241006, -0.40824829, 0.1378021],
          [0.04546408, 0.40824829, 0.91173809]
        ])));
        assert.ok(S.isEqual(new NDArray([
          12.4244289, 5.0, 2.5755711
        ])));
        assert.ok(VT.isEqual(new NDArray([
          [0.90241006, -0.42847299, 0.04546408],
          [-0.40824829, -0.81649658, 0.40824829],
          [0.1378021, 0.386968, 0.91173809]
        ])));
      });

      QUnit.test(
        'svd 3x3 - full_matrices=false, complete_uv=false', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ], {datatype:'f32'});

        let [S] = linalg.svd(A,true,false);
        assert.ok(S.isEqual(new NDArray([
          12.4244289, 5.0, 2.5755711
        ])));
      });

      QUnit.test(
        'svd 4x3 - full_matrices=false, complete_uv=false', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3],
          [4,4,4]
        ], {datatype:'f32'});
        let [S] = linalg.svd(A,true,false);
        assert.ok(S.isEqual(new NDArray([
          12.66786356, 7.40286577, 4.32698638
        ])));
      });

      QUnit.skip(
        'svd 4x3 - full_matrices=true, complete_uv=false', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3],
          [4,4,4]
        ], {datatype:'f32'});
        let [U,S,VT] = linalg.svd(A,true,true);
        assert.ok(U.isEqual(new NDArray([
          [-0.38547869, -0.56023949, 0.51437432, -0.52245282],
          [0.89197997, -0.02652779, 0.34920785, -0.28587041],
          [0.05307408, -0.03691955, -0.71131891, -0.69988963],
          [0.2301327, -0.82708218, -0.3278694, 0.39430402]
        ])));
        assert.ok(S.isEqual(new NDArray([
          12.66786356, 7.40286577, 4.32698638
        ])));
        assert.ok(VT.isEqual(new NDArray([
          [0.93849657, -0.32533941, 0.11566526],
          [-0.25928012, -0.88523323, -0.38618124],
          [0.22803071, 0.33244007, -0.91514239]
        ])));
      });

      QUnit.test(
        'svd 4x3 - full_matrices=false, complete_uv=false', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3],
          [4,4,4]
        ], {datatype:'f32'});
        let [U,S,VT] = linalg.svd(A,false,true);
        assert.ok(U.isEqual(new NDArray([
          [-0.38547869, -0.56023949, 0.51437432],
          [0.89197997, -0.02652779, 0.34920785],
          [0.05307408, -0.03691955, -0.71131891],
          [0.2301327, -0.82708218, -0.3278694]
        ])));
        assert.ok(S.isEqual(new NDArray([
          12.66786356, 7.40286577, 4.32698638
        ])));
        assert.ok(VT.isEqual(new NDArray([
          [0.93849657, -0.32533941, 0.11566526],
          [-0.25928012, -0.88523323, -0.38618124],
          [0.22803071, 0.33244007, -0.91514239]
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

        QUnit.test("Solve multiple", assert => {
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

    QUnit.module('tri', () => {

      QUnit.module('tril', () => {
        QUnit.test('4x4', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let trilA = linalg.tril(A);
          assert.ok(trilA.isEqual(new NDArray([
            [5,0,0,0],
            [5,5,0,0],
            [5,5,5,0],
            [5,5,5,5]
          ])));
        });
        QUnit.test('4x4 diag -1', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let trilA = linalg.tril(A,-1);
          assert.ok(trilA.isEqual(new NDArray([
            [0,0,0,0],
            [5,0,0,0],
            [5,5,0,0],
            [5,5,5,0]
          ])));
        });
        QUnit.test('4x4 diag 1', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let trilA = linalg.tril(A,1);
          assert.ok(trilA.isEqual(new NDArray([
            [5,5,0,0],
            [5,5,5,0],
            [5,5,5,5],
            [5,5,5,5]
          ])));
        });
        QUnit.test('6x4', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let trilA = linalg.tril(A);
          assert.ok(trilA.isEqual(new NDArray([
            [5,0,0,0],
            [5,5,0,0],
            [5,5,5,0],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ])));
        });
        QUnit.test('4x6', assert => {
          let A = new NDArray([
            [5,5,5,5,5,5],
            [5,5,5,5,5,5],
            [5,5,5,5,5,5],
            [5,5,5,5,5,5]
          ]);
          let trilA = linalg.tril(A);
          assert.ok(trilA.isEqual(new NDArray([
            [5,0,0,0,0,0],
            [5,5,0,0,0,0],
            [5,5,5,0,0,0],
            [5,5,5,5,0,0]
          ])));
        });
      });

      QUnit.module('triu', () => {
        QUnit.test('4x4', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let triuA = linalg.triu(A);
          assert.ok(triuA.isEqual(new NDArray([
            [5,5,5,5],
            [0,5,5,5],
            [0,0,5,5],
            [0,0,0,5]
          ])));
        });
        QUnit.test('4x4 diag -1', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let triuA = linalg.triu(A,-1);
          assert.ok(triuA.isEqual(new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [0,5,5,5],
            [0,0,5,5]
          ])));
        });
        QUnit.test('4x4 diag +1', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let triuA = linalg.triu(A,1);
          assert.ok(triuA.isEqual(new NDArray([
            [0,5,5,5],
            [0,0,5,5],
            [0,0,0,5],
            [0,0,0,0]
          ])));
        });
        QUnit.test('6x4', assert => {
          let A = new NDArray([
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5],
            [5,5,5,5]
          ]);
          let triuA = linalg.triu(A);
          assert.ok(triuA.isEqual(new NDArray([
            [5,5,5,5],
            [0,5,5,5],
            [0,0,5,5],
            [0,0,0,5],
            [0,0,0,0],
            [0,0,0,0]
          ])));
        });
        QUnit.test('4x6', assert => {
          let A = new NDArray([
            [5,5,5,5,5,5],
            [5,5,5,5,5,5],
            [5,5,5,5,5,5],
            [5,5,5,5,5,5]
          ]);
          let triuA = linalg.triu(A);
          assert.ok(triuA.isEqual(new NDArray([
            [5,5,5,5,5,5],
            [0,5,5,5,5,5],
            [0,0,5,5,5,5],
            [0,0,0,5,5,5]
          ])));
        });
      });
    });

    QUnit.module('QR', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [3, 6, 2],
          [1, 7, 6],
          [9, 3, 2]
        ]);
        let [q,r] = linalg.qr(A);
        assert.ok(q.isEqual(new NDArray([
          [-0.31448545, -0.53452248, -0.78446454],
          [-0.10482848, -0.80178373, 0.58834841],
          [-0.94345635, 0.26726124, 0.19611614]
        ])));
        assert.ok(r.isEqual(new NDArray([
          [-9.53939201, -5.45108115, -3.14485451],
          [0., -8.01783726, -5.34522484],
          [0., 0., 2.35339362]
        ])));
      });
      QUnit.test('2x2', assert => {
        let A = new NDArray([
          [3,6],
          [9,2]
        ]);
        let [q,r] = linalg.qr(A);
        assert.ok(q.isEqual(new NDArray([
          [-0.31622777, -0.9486833],
          [-0.9486833, 0.31622777]
        ])));
        assert.ok(r.isEqual(new NDArray([
          [-9.48683298, -3.79473319],
          [0., -5.05964426]
        ])));
      });
      QUnit.skip('3x2', assert => {
        let A = new NDArray([
          [3,6],
          [9,2],
          [6,7]
        ]);
        let [q,r] = linalg.qr(A);
        assert.ok(q.isEqual(new NDArray([
          [-0.26726124, 0.64927181],
          [-0.80178373, -0.55971708],
          [-0.53452248, 0.51493971]
        ])));
        console.log(r.toString());
        assert.ok(r.isEqual(new NDArray([
          [-11.22497216, -6.94879229],
          [0., 6.3807747]
        ])));
      });
      QUnit.skip('2x4', assert => {
        let A = new NDArray([
          [3,6,7,8],
          [9,2,5,5]
        ]);
        let [q,r] = linalg.qr(A);
        assert.ok(q.isEqual(new NDArray([
          [-0.31622777, -0.9486833],
          [-0.9486833, 0.31622777]
        ])));
        assert.ok(r.isEqual(new NDArray([
          [-9.48683298, -3.79473319, -6.95701085, -7.27323862],
          [0., -5.05964426, -5.05964426, -6.00832755]
        ])));
      });
    });
    QUnit.module('Eigen', () => {
      QUnit.test('eig', assert => {
        let A = new NDArray([
          [3,6,2,1],
          [1,7,6,1],
          [9,3,2,1],
          [9,3,7,1]
        ]);
        let [w,vl,vr] = linalg.eig(A);
        console.log('w',w.toString());
        console.log('vl',vl.toString());
        console.log('vr',vr.toString());
        assert.ok(true);
      });
    });

    QUnit.module('Cholesky', () => {
      QUnit.test('3x3 1', assert => {
        let A = new NDArray([
          [4,12,-16],
          [12,37,-43],
          [-16,-43,98]
        ]);
        let chA = linalg.cholesky(A);
        assert.ok(chA.isEqual(new NDArray([
          [2,0,0],
          [6,1,0],
          [-8,5,3]
        ])))
      });
      QUnit.test('3x3 2', assert => {
        let A = new NDArray([[2, -1, 0], [-1, 2, -1], [0, -1, 2]])
        let chA = linalg.cholesky(A);
        assert.ok(chA.isEqual(new NDArray([
          [1.41421356, 0., 0.],
          [-0.70710678, 1.22474487, 0.],
          [0., -0.81649658, 1.15470054]
        ])))
      });
      QUnit.test('not positive definite', assert => {
        let A = new NDArray([
          [4, 12, -16], [12, 0, -43], [-16, -43, 98]
        ]);
        assert.throws(() => {
          linalg.cholesky(A);
        })
      });
    });
  });
}