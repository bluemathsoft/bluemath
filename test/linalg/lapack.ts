
import {linalg} from '../../src'

export default function testLAPACK() {

  QUnit.module('LAPACK', () => {
    QUnit.test('asum', assert => {
      linalg.lapack.asum();
      assert.ok(true);
    });
    QUnit.test('dot', assert => {
      assert.equal(linalg.lapack.dot(), 40);
    });
  });
}