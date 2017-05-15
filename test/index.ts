
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

import { utils, basic, geom } from '../src'

let { Matrix, Vector2, Vector } = basic;
let { BSplineCurve2D } = geom.nurbs;

/// <reference path="qunit/index.d.ts" />

window.onload = () => {

  let qunitDiv = document.createElement('div');
  qunitDiv.setAttribute('id', 'qunit');
  document.body.appendChild(qunitDiv);

  let qunitFixtureDiv = document.createElement('div');
  qunitFixtureDiv.setAttribute('id', 'qunit-fixture');
  document.body.appendChild(qunitFixtureDiv);

  QUnit.module('Vector2');

  QUnit.test('construction', assert => {
    let v = new Vector2(20, 30);
    assert.equal(v.x, 20);
  });
  QUnit.test('add', assert => {
    let v1 = new Vector2(20, 30);
    let v2 = new Vector2(20, 30);
    assert.equal(v1.add(v2).get(0), 40);
  });
  QUnit.test('sub', assert => {
    let v1 = new Vector2(20, 30);
    let v2 = new Vector2(14, 22);
    assert.equal(v1.sub(v2).get(1), 8);
  });
  QUnit.test('mul', assert => {
    let v = new Vector2(20, 30);
    assert.equal(v.mul(0.1).get(1), 3);
  });
  QUnit.test('lenSq', assert => {
    let v = new Vector2(12, 12);
    assert.equal(v.lenSq(), 2 * 144);
  });
  QUnit.test('len', assert => {
    let v = new Vector2(12, 12);
    assert.ok(utils.isEqualFloat(v.len(), 12 * Math.sqrt(2)));
  });
  QUnit.test('unit', assert => {
    let v = new Vector2(12, 12);
    assert.ok(utils.isEqualFloat(v.unit().len(), 1));
  });
  QUnit.test('isNonZero', assert => {
    let v = new Vector2(20, 30);
    assert.equal(v.isNonZero(), true);
  });
  QUnit.test('isZero', assert => {
    let v = new Vector2(0, 0);
    assert.equal(v.isZero(), true);
  });
  QUnit.test('distSq', assert => {
    let v = new Vector2(0,0);
    assert.equal(v.distSq(new Vector2(12,12)), 2*144);
  });
  QUnit.test('dist', assert => {
    let v = new Vector2(0,0);
    assert.ok(utils.isEqualFloat(v.dist(new Vector2(12,12)), 12*Math.sqrt(2)));
  });
  QUnit.test('dot', assert => {
    let v = new Vector2(5,4);
    assert.equal(v.dot(new Vector2(2,3)), 22);
  });
  QUnit.test('cross', assert => {
    let v = new Vector2(5,4);
    assert.equal(v.cross(new Vector2(2,3)), 7);
  });
  QUnit.test('round', assert => {
    let v = new Vector2(5.4533,4.8766);
    assert.ok(v.round().isEqual(new Vector2(5,5)));
  });
  QUnit.test('low', assert => {
    let varr = [
      new Vector2(2,4),
      new Vector2(12,0),
      new Vector2(3,-4),
      new Vector2(21,35),
    ];
    assert.ok(Vector2.low(varr).isEqual(new Vector2(2,-4)));
  });
  QUnit.test('high', assert => {
    let varr = [
      new Vector2(2,4),
      new Vector2(12,0),
      new Vector2(3,-4),
      new Vector2(21,35),
    ];
    assert.ok(Vector2.high(varr).isEqual(new Vector2(21,35)));
  });
  QUnit.test('toString', assert => {
    assert.equal(new Vector2(3.5466,-6.0988).toString(), '[3.55,-6.10]');
    assert.equal(new Vector2(3.5466,-6.0988).toString(3), '[3.547,-6.099]');
  });

  QUnit.module('Matrix', () => {

    QUnit.module('construction', () => {
      QUnit.test('only dimensions', assert => {
        let m = new Matrix({rows:2,cols:2});
        assert.ok(m instanceof Matrix);
      });
      QUnit.test('Int32 Array 2D', assert => {
        let m = new Matrix([[4,5],[23,42]], "int32");
        assert.ok(m instanceof Matrix);
        assert.equal(m.get(0,1), 5);
      });
      QUnit.test('Float32Array wrong dimensions', assert => {
        let farr = new Float32Array([0.034,1.203,5.08,999.7]);
        assert.throws(() => {
          let m = new Matrix({rows:3,cols:2,data:farr});
        })
      });
      QUnit.test('Float32Array', assert => {
        let farr = new Float32Array([0.034,1.203,5.08,999.7]);
        let m = new Matrix({rows:2,cols:2,data:farr});
        assert.ok(m instanceof Matrix);
        assert.ok(utils.isEqualFloat(m.get(0,1), 1.203, 0.0001));
      });
    });
    QUnit.test('Fill', assert => {
      let m = new Matrix({rows:2,cols:2});
      m.fill(29);
      assert.equal(m.get(1,1), 29);
    });
    QUnit.test('Set value', assert => {
      let m = new Matrix({rows:2,cols:2});
      m.set(0,1,43.66);
      assert.ok(utils.isEqualFloat(m.get(0,1), 43.66));
    });
    QUnit.test('Clone', assert => {
      let m = new Matrix([[3.35,6.09],[4.55,9]]);
      assert.ok(utils.isEqualFloat(m.get(0,0), 3.35));
      let mcopy = m.clone();
      mcopy.set(0,0,98.078);
      assert.ok(utils.isEqualFloat(mcopy.get(0,0), 98.078,0.0001));
      assert.ok(utils.isEqualFloat(m.get(0,0), 3.35));
    });
    QUnit.test('Scale', assert => {
      let farr = new Float32Array([0.034,1.203,5.08,999.7]);
      let m = new Matrix({rows:2,cols:2,data:farr});
      m.scale(100);
      assert.ok(utils.isEqualFloat(m.get(0,1), 120.3, 0.01));
    });
    QUnit.module('Equality', () => {
      QUnit.test('Int',assert => {
        assert.ok(new Matrix([
          [3,7,4],
          [4,9,12]
        ],'int32').isEqual(new Matrix([
          [3,7,4],
          [4,9,12]
        ],'int32')));
      });
      QUnit.test('Float',assert => {
        assert.ok(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'float64').isEqual(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'float64')));
      });
      QUnit.test('Failure',assert => {
        assert.notOk(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.032,4,5]
        ],'float64').isEqual(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'float64')));
      });
      QUnit.test('Failure dimension mismatch',assert => {
        assert.notOk(new Matrix([
          [3,7,4.08],
          [4,9,12]
        ],'float64').isEqual(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'float64')));
      });
    });

    QUnit.module('Transpose', () => {
      QUnit.test('Simple 3x3', assert => {
        let A = new Matrix([
          [2,3,7],
          [5,3,7],
          [-9,0,1]
        ]);
        A.transpose();
        assert.ok(A.isEqual(new Matrix([
          [2,5,-9],
          [3,3,0],
          [7,7,1]
        ])));
      });
      QUnit.test('Negative 2x3', assert => {
        let A = new Matrix([
          [2,3,7],
          [5,3,7]
        ]);
        assert.throws(() => {
          A.transpose();
        });
      });
    });

    QUnit.module("Multiplication", () => {
      QUnit.test("Square 3x3", assert => {
        let A = new Matrix([[2,2,2],[2,2,2],[2,2,2]], 'int16');
        let B = new Matrix([[5,5,5],[5,5,5],[5,5,5]], 'int16');
        let M = A.mul(B);
        if(M instanceof Matrix) {
          assert.equal(M.rows,3);
          assert.equal(M.cols,3);
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
        let A = new Matrix([[1,0],[2,1],[6,9]], 'int16');
        let B = new Matrix([[1,2,3],[1,2,9]], 'int16');
        let M = A.mul(B);
        if(M instanceof Matrix) {
          assert.equal(M.rows,3);
          assert.equal(M.cols,3);
          assert.equal(M.get(1,0), 3);
          assert.equal(M.get(1,2), 15);
          assert.equal(M.get(2,1), 30);
          assert.equal(M.get(2,2), 99);
        } else {
          assert.notOk(true);
        }
      });
      QUnit.test("3x2 mul 3x3, error", assert => {
        let A = new Matrix([[1,0],[2,1],[6,9]], 'int16');
        let B = new Matrix([[1,2,3],[1,2,9],[4,5,3]], 'int16');
        assert.throws(() => {
          let M = A.mul(B);
        });
      });
      QUnit.test("by Vector", assert => {
        let A = new Matrix([[1,0,2]], 'int16');
        let V = new Vector([4,4,9]);
        assert.equal(A.mul(V), 22);
      });
      QUnit.test("by Vector, error", assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'int16');
        let V = new Vector([4,4,9]);
        assert.throws(() => A.mul(V));
      });
    });

  });

  QUnit.module('BSplineCurve2D');
  QUnit.test('construction', assert => {
    let bcrv = new BSplineCurve2D(1, [new Vector2(0,0), new Vector2(10,10)], [0,0,1,1]);
    assert.ok(!!bcrv);
    assert.equal(bcrv.degree, 1);
    assert.equal(bcrv.cpoints.length, 2);
    assert.equal(bcrv.knots.length, 4);
  });
  QUnit.test('evaluate at midpoint', assert => {
    let bcrv = new BSplineCurve2D(1, [new Vector2(0,0), new Vector2(10,10)], [0,0,1,1]);
    assert.ok(bcrv.evaluate(0.5).isEqual(new Vector2(5,5)));
  });
}