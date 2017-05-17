
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

import { utils } from '../src'

import Vector from '../src/basic/vector';
import Vector2 from '../src/basic/vector2';
import Matrix from '../src/basic/matrix';
import {BSplineCurve2D} from '../src/geom/nurbs/bcurve';

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
          new Matrix({rows:3,cols:2,data:farr});
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
          A.mul(B);
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

    QUnit.test('Identity', assert => {
      assert.ok(Matrix.identity(5).isEqual(new Matrix([
        [1,0,0,0,0],
        [0,1,0,0,0],
        [0,0,1,0,0],
        [0,0,0,1,0],
        [0,0,0,0,1]
      ])));
    });
    QUnit.module('Slicing', () => {
      QUnit.test('Row-wise 2x3', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'int16');
        assert.ok(A.row(0).isEqual(new Vector([1,0,2])));
        assert.ok(A.row(1).isEqual(new Vector([3,5,6])));
      });
      QUnit.test('Row-wise 1x4', assert => {
        let A = new Matrix([[1,0,2,29]], 'int16');
        assert.ok(A.row(0).isEqual(new Vector([1,0,2,29])));
      });
      QUnit.test('Row-wise 4x1', assert => {
        let A = new Matrix([[1],[0],[2],[29]], 'int16');
        assert.ok(A.row(2).isEqual(new Vector([2])));
      });
      QUnit.test('Row-wise. Check deep copy', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'int16');
        let row = A.row(0);
        row.set(1, 243);
        assert.ok(row.isEqual(new Vector([1,243,2])));
        assert.ok(A.isEqual(new Matrix([[1,0,2],[3,5,6]], 'int16')));
      });
      QUnit.test('Column-wise 2x3', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'int16');
        assert.ok(A.col(0).isEqual(new Vector([1,3])));
        assert.ok(A.col(2).isEqual(new Vector([2,6])));
      });
      QUnit.test('Column-wise 1x4', assert => {
        let A = new Matrix([[1,0,2,29]], 'int16');
        assert.ok(A.col(0).isEqual(new Vector([1])));
      });
      QUnit.test('Column-wise 4x1', assert => {
        let A = new Matrix([[1],[0],[2],[29]], 'int16');
        assert.ok(A.row(0).isEqual(new Vector([1,0,2,29])));
      });
      QUnit.test('Column-wise. Check deep copy', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'int16');
        let col = A.col(0);
        col.set(1, 243);
        assert.ok(col.isEqual(new Vector([1,243])));
        assert.ok(A.isEqual(new Matrix([[1,0,2],[3,5,6]], 'int16')));
      });
    });

    QUnit.module('Inverse', () => {
      QUnit.test('3x3 (match with WolframAlpha)', assert => {
        let A = new Matrix([
          [1,5,3],
          [3,4,5],
          [0,9,0]
        ]);
        assert.ok(A.inverse().isEqual(new Matrix([
          [-5/4,3/4,13/36],
          [0,0,1/9],
          [3/4,-1/4,-11/36]
        ])));
      });
      QUnit.test('Identity 3x3', assert => {
        let A = new Matrix([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ]);
        assert.ok(A.inverse().isEqual(new Matrix([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ])));
      });
      QUnit.test('Non-square matrix error', assert => {
        let A = new Matrix([
          [1,0,0],
          [0,1,0]
        ]);
        assert.throws(() => { A.inverse(); });
      });
    });
    QUnit.module('Determinant', () => {
      QUnit.test('Identity', assert => {
        let A = new Matrix([
          [1,0,0],
          [0,1,0],
          [0,0,1]
        ]);
        assert.equal(A.determinant(), 1);
      });
      QUnit.test('3x3 (match with WolframAlpha)', assert => {
        let A = new Matrix([
          [1,5,3],
          [3,4,5],
          [0,9,0]
        ],'float32');
        assert.ok(utils.isEqualFloat(A.determinant(), 36, 1e-5));
      });
      QUnit.test('Non-square matrix error', assert => {
        let A = new Matrix([
          [1,0,0],
          [0,1,0]
        ]);
        assert.throws(() => { A.determinant(); });
      });
    });

    QUnit.module('Linear equations', () => {
      QUnit.module('LU Solve', () => {
        QUnit.test("Circuit matrix", assert => {
          let A = new Matrix([
            [11,-3,0],
            [-3,6,-1],
            [0,-1,3]
          ]);
          let answer = A.solve(new Vector([30,5,-25])) as Vector;
          assert.ok(answer.isEqual(new Vector([3,1,-8])));
        });
        QUnit.test("From numpy tests", assert => {
          let A = new Matrix([
            [3,1],
            [1,2]
          ]);
          let answer = A.solve(new Vector([9,8])) as Vector;
          assert.ok(answer.isEqual(new Vector([2,3])));
        });
        QUnit.test("From GSL tests", assert => {
          let A = new Matrix([
            [0.18, 0.60, 0.57, 0.96],
            [0.41, 0.24, 0.99, 0.58],
            [0.14, 0.30, 0.97, 0.66],
            [0.51, 0.13, 0.19, 0.85]
          ],'float64');
          let answer = A.solve(new Vector([1,2,3,4])) as Vector;
          assert.ok(answer.isEqual(new Vector(
            [-4.05205, -12.6056, 1.66091, 8.69377],'float64'),1e-4));
        });
        QUnit.test("Random tests 1 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 7, 5, 12], [4, 3, 2, 1], [6, 2, 9, 3], [4, 1, 8, 8]])
          let answer = A.solve(new Vector([13, 15, 2, 90])) as Vector;
          assert.ok(answer.isEqual(
              new Vector([40.50877193, -39.30526316, -25.02807018, 20.93684211])));
        });
        QUnit.test("Random tests 2 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 7, 5, 0.5], [4, 3, 2, 1], [6, 2, 99, 3], [4, 1, 8, 8]])
          assert.ok(
            (A.solve(new Vector([13, 15, 2, 90])) as Vector).isEqual(
              new Vector(
                [0.19644227, 1.19044879, -0.36008822, 11.36306099])));
        });
        QUnit.test("Random tests 3 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 0.0007, 5, 0.5], [4, 3, 2, 1], [6, 2, 9999, 3], [4, 1, 8, 8]])
          assert.ok(
            (A.solve(new Vector([13, 15, 2, 90])) as Vector).isEqual(
              new Vector(
                [1.95364698e+00, -1.07265497e+00, -3.88138726e-03,
                1.04111398e+01])));
        });
        QUnit.test("Random tests 4 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 0.0007, 5, 0.5], [4, 3, 2, 1], [6, 2, 9999, 3], [4, 1, 8, 8]])
          assert.ok(
            (A.solve(new Vector([13, 0.15, 2986, 90])) as Vector).isEqual(
              new Vector(
                [1.51620015, -5.80949758, 0.295605, 10.92248213])));
        });
        QUnit.test("Solve multiple", assert => {
          let A = new Matrix([
            [4, 7, 5, 12], [4, 3, 2, 1], [6, 2, 9, 3], [4, 1, 8, 8]])
          let answer = A.solve(new Matrix([
            [13,45,3],
            [15,66,3],
            [2,0.02,8],
            [90,1,0]
          ])) as Matrix;
          assert.ok(answer.isEqual(new Matrix([
                [40.50877193, 31.61561404, -1.66667],
                [-39.30526316, -8.06736842, 2.4],
                [-25.02807018, -21.58596491, 1.933333],
                [20.93684211, 6.91157895, -1.4]
              ]),1e-5));
        });
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