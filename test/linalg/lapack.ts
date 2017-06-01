
import {linalg, basic} from '../../src'
let {NDArray} = basic;

export default function testLAPACK() {

  QUnit.module('LAPACK', () => {
    QUnit.test('asum', assert => {
      let sx = new NDArray([1,2,3,4]);
      assert.equal(linalg.lapack.asum(sx.data), 10);
      let dx = new NDArray([1,2,3,4],{datatype:'f64'});
      assert.equal(linalg.lapack.asum(dx.data), 10);
    });
    QUnit.test('dot', assert => {
      let sx = new NDArray([1,2,3,4]);
      let sy = new NDArray([2,3,4,5]);
      assert.equal(linalg.lapack.dot(sx.data,sy.data), 40);

      let dx = new NDArray([1,2,3,4],{datatype:'f64'});
      let dy = new NDArray([2,3,4,5],{datatype:'f64'});
      assert.equal(linalg.lapack.dot(dx.data,dy.data), 40);
    });
  });
}