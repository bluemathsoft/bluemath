
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

  });
}