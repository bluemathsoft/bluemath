
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
        A.swapOrder();
        let U = new NDArray({shape:[3,3]});
        let VT = new NDArray({shape:[3,3]});
        let S = new NDArray({shape:[3]});
        linalg.lapack.gesdd(A.data, 3, 3,U.data,S.data,VT.data,'A');
        U.swapOrder();
        VT.swapOrder();
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
      QUnit.test('sgesdd', assert => {
        let A = new NDArray([
          [-3,6,-1],
          [11,-3,0],
          [0,-1,3]
        ], {datatype:'f32'});
        A.swapOrder();
        let U = new NDArray({shape:[3,3]});
        let VT = new NDArray({shape:[3,3]});
        let S = new NDArray({shape:[3]});
        linalg.lapack.gesdd(A.data, 3, 3,U.data,S.data,VT.data,'A');
        U.swapOrder();
        VT.swapOrder();
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
    });
    QUnit.module('gelsd', () => {
      QUnit.test('dgelsd', assert => {
        let Y = new NDArray([-1,0.2,0.9,2.1]);
        let A = new NDArray([
          [0,1], [1,1], [2,1], [3,1]
        ]);
        let S = new NDArray({shape:[2]});
        linalg.lapack.gelsd(A.data,4,2,1,-1,Y.data,S.data);
        /*
        Test output computed from numpy.linalg.lapack_lite.dgelsd execution
        with same input data
        In [20]: A = np.array([[0,1],[1,1],[2,1],[3,1]],np.double)
        In [21]: B = np.array([-1,0.2,0.9,2.1],np.double)
        In [22]: np.linalg.lapack_lite.dgelsd(4,2,1,A,4,B,4,np.zeros(2),-1,0,work,802,np.zeros(20,np.int32),0)
        */
        assert.ok(A.isEqual(new NDArray([
          [-1.73205081, 0.],
          [0.57735027, 0.57735027],
          [-2.88675135, 2.5819889],
          [-0.04056742, 0.41363159]
        ])));
        assert.ok(Y.isEqual(new NDArray([
          1.65, -0.35, 0.4356074, 1.35655674
        ])));
      });
    });

    QUnit.module('getrf', () => {
      QUnit.test('dgetrf', assert => { // TODO
        let A = new NDArray([
          [3,6,2],
          [1,7,6],
          [9,3,2]
        ],{datatype:'f64'});
        let ipiv = new NDArray({shape:[3],datatype:'i32'});
        A.swapOrder();
        linalg.lapack.getrf(A.data,3,3,ipiv.data);
        A.swapOrder();

        let customLU = new NDArray([
          [3,6,2],
          [1,7,6],
          [9,3,2]
        ],{datatype:'f64'});
        linalg.lu_custom(customLU);

        assert.ok(A.isEqual(customLU,1e-4));
      });
    });

    QUnit.module('geev', () => {
      QUnit.test('dgeev 3x3', assert => {
        /*
        let A = new NDArray([
          [3,6,2],
          [1,7,6],
          [9,3,2]
        ],{datatype:'f64'});
        */
        let A = new NDArray([
          [1,0,0],
          [0,2,0],
          [0,0,3]
        ],{datatype:'f64'});
        A.swapOrder();
        let [WR,WI,VL,VR] = linalg.lapack.geev(A.data,3,true,true);
        assert.ok(WR[0] === 1 && WR[1] === 2 && WR[2] === 3);
        assert.ok(WI[0] === 0 && WI[1] === 0 && WI[2] === 0);
        let vl = new NDArray(VL,{shape:[3,3]})
        let vr = new NDArray(VR,{shape:[3,3]})
        vl.swapOrder();
        vr.swapOrder();
        assert.ok(vl.isEqual(new NDArray([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ])));
        assert.ok(vr.isEqual(new NDArray([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ])));
      });

      QUnit.test('dgeev 2x2', assert => {
        let A = new NDArray([
          [3,1],
          [0,2],
        ],{datatype:'f64'});
        A.swapOrder();
        let [WR,WI,VL,VR] = linalg.lapack.geev(A.data,2,true,true);
        let vl = new NDArray(VL,{shape:[2,2]})
        let vr = new NDArray(VR,{shape:[2,2]})
        vl.swapOrder();
        vr.swapOrder();
        assert.equal(WR[0],3);
        assert.equal(WR[1],2);
        assert.equal(WI[0],0);
        assert.equal(WI[1],0);

        //assert.ok(vl.isEqual(new NDArray([[0.7071,0.0000],[0.7071,1.0000]]),1e-4))
        // As returned by numpy (it only returns right eigen vectors)
        assert.ok(vr.isEqual(new NDArray([[1.0000,-0.7071,],[0.0000,0.7071]]),1e-4))

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