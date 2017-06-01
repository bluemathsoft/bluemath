
import {linalg} from '../../src'

export default function testLAPACK() {

  QUnit.module('LAPACK', () => {
    QUnit.test('asum', assert => {
      linalg.lapack.asum();
      assert.ok(true);
    });
    QUnit.test('dot', assert => {
      let vx = new Float32Array([1,2,3,4]);
      let vy = new Float32Array([2,3,4,5]);
      assert.equal(linalg.lapack.dot(vx,vy), 40);
    });
  });
}