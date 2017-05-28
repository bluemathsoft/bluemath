
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

import {utils, basic, geom, linalg} from '../src'
import * as blas from '../src/linalg/blas'

let {NDArray, Vector, Matrix, Vector2, PermutationVector, BandMatrix} = basic;
let {BSplineCurve2D} = geom.nurbs;

/// <reference path="qunit/index.d.ts" />

window.onload = () => {

  let qunitDiv = document.createElement('div');
  qunitDiv.setAttribute('id', 'qunit');
  document.body.appendChild(qunitDiv);

  let qunitFixtureDiv = document.createElement('div');
  qunitFixtureDiv.setAttribute('id', 'qunit-fixture');
  document.body.appendChild(qunitFixtureDiv);

  QUnit.module('NDArray', () => {

    QUnit.module('construction', () => {
      QUnit.module('From Array', () => {
        QUnit.module('deduceShape and size', () => {
          QUnit.test('3x3', assert => {
            let A = new NDArray([
              [2,4,6],
              [3,5,2],
              [1,6,5]
            ]);
            assert.deepEqual(A.shape, [3,3]);
            assert.equal(A.size, 9);
          });
          QUnit.test('1x3', assert => {
            let A = new NDArray([
              [2,4,6]
            ]);
            assert.deepEqual(A.shape, [1,3]);
            assert.equal(A.size, 3);
          });
          QUnit.test('3x1', assert => {
            let A = new NDArray([
              [2],[4],[6]
            ]);
            assert.deepEqual(A.shape, [3,1]);
            assert.equal(A.size, 3);
          });
          QUnit.test('1x1', assert => {
            let A = new NDArray([
              [2]
            ]);
            assert.deepEqual(A.shape, [1,1]);
            assert.equal(A.size, 1);
          });
          QUnit.test('5', assert => {
            let A = new NDArray([
              2,3,4,5,6
            ]);
            assert.deepEqual(A.shape, [5]);
            assert.equal(A.size, 5);
          });
        });
        QUnit.test('to float32 default', assert => {
          let A = new NDArray([
            2,3,4,5,6
          ]);
          assert.equal(A.datatype, 'f32');
          assert.equal(A.get(0), 2);
        });
        QUnit.test('to float64 default', assert => {
          let A = new NDArray([
            2,3,4,5,6
          ],{datatype:'f64'});
          assert.equal(A.datatype, 'f64');
          assert.equal(A.get(1), 3);
        });
        QUnit.test('to int16 default', assert => {
          let A = new NDArray([
            2,3,-4,5,6
          ],{datatype:'i16'});
          assert.equal(A.datatype, 'i16');
          assert.equal(A.get(2), -4);
        });
        QUnit.test('to uint16 default', assert => {
          let A = new NDArray([
            2,3,-4,5,6
          ],{datatype:'ui16'});
          assert.equal(A.datatype, 'ui16');
          assert.notEqual(A.get(2), -4);
        });
      });

      QUnit.module('From Raw Data', () => {
        QUnit.module('shape', () => {
          QUnit.test('default flat', assert => {
            let A = new NDArray(new Float32Array([3,7,5,6]));
            assert.deepEqual(A.shape, [4]);
          });
          QUnit.test('2x2', assert => {
            let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[2,2]});
            assert.deepEqual(A.shape, [2,2]);
            assert.equal(A.get(0,1),7);
            assert.equal(A.get(1,1),6);
          });
          QUnit.test('1x4', assert => {
            let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[1,4]});
            assert.deepEqual(A.shape, [1,4]);
            assert.equal(A.get(0,1),7);
            assert.equal(A.get(0,3),6);
          });
          QUnit.test('4x1', assert => {
            let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[4,1]});
            assert.deepEqual(A.shape, [4,1]);
            assert.equal(A.get(1,0),7);
            assert.equal(A.get(3,0),6);
          });
        });
      });

      QUnit.module('No Data', () => {
        QUnit.test('fill with 0', assert => {
          let A = new NDArray({shape:[2,2],fill:0})
          assert.equal(A.size, 4);
          assert.equal(A.get(0,0),0);
          assert.equal(A.get(0,1),0);
          assert.equal(A.get(1,0),0);
          assert.equal(A.get(1,1),0);
        });
        QUnit.test('fill with 5', assert => {
          let A = new NDArray({shape:[2,2],fill:5})
          assert.equal(A.size, 4);
          assert.equal(A.get(0,0),5);
          assert.equal(A.get(0,1),5);
          assert.equal(A.get(1,0),5);
          assert.equal(A.get(1,1),5);
        });
      });
    });


    QUnit.module('Equality', () => {

      QUnit.test('2x2 equal', assert => {
        let A = new NDArray([[4,7],[3,4]]);
        let B = new NDArray([[4,7],[3,4]]);
        assert.ok(A.isEqual(B));
      });
      QUnit.test('2x2 not equal', assert => {
        let A = new NDArray([[4,7],[3,4]]);
        let B = new NDArray([[4,9],[3,4]]);
        assert.notOk(A.isEqual(B));
      });
      QUnit.test('2x2 and 3x3', assert => {
        let A = new NDArray([[4,7],[3,4]]);
        let B = new NDArray([[4,7,3],[3,4,3],[3,2,2]]);
        assert.notOk(A.isEqual(B));
      });
      QUnit.test('2x2 and 1', assert => {
        let A = new NDArray([[4,7],[3,4]]);
        let B = new NDArray([34]);
        assert.notOk(A.isEqual(B));
      });
      QUnit.test('2x2 int32 vs float32 equal', assert => {
        let A = new NDArray([[4,7],[3,4]], {datatype:'i32'});
        let B = new NDArray([[4,9],[3,4]], {datatype:'f32'});
        assert.notOk(A.isEqual(B));
      });
    });

    QUnit.module('Indexing', () => {
      QUnit.module('Invalid Access', () => {
        QUnit.test('Wrong num of dim', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]));
          assert.throws(() => {
            A.get(0,0);
          });
        });
        QUnit.test('Invalid dim-0', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]));
          assert.throws(() => {
            A.get(5);
          });
        });
        QUnit.test('Invalid dim-1', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[2,2]});
          assert.throws(() => {
            A.get(0,3);
          });
        });
        QUnit.test('Negative dim-1', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[2,2]});
          assert.throws(() => {
            A.get(0,-1);
          });
        });
      });
      QUnit.module('Set', () => {
        QUnit.test('flat', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[4]});
          assert.equal(A.get(1),7);
          A.set(1,589);
          assert.equal(A.get(1),589);
        });
        QUnit.test('2x2', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[2,2]});
          assert.equal(A.get(1,1),6);
          A.set(1,1,589);
          assert.equal(A.get(1,1),589);
        });
        QUnit.test('4x1', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[4,1]});
          assert.equal(A.get(2,0),5);
          A.set(2,0,589);
          assert.equal(A.get(2,0),589);
        });
        QUnit.test('1x4', assert => {
          let A = new NDArray(new Float32Array([3,7,5,6]),{shape:[1,4]});
          assert.equal(A.get(0,2),5);
          A.set(0,2,589);
          assert.equal(A.get(0,2),589);
        });
      });
    });



    QUnit.module('Reshape', () => {
      QUnit.test('6 to 2x3', assert => {
        let A = new NDArray([3,5,7,4,5,6]);
        assert.equal(A.get(2),7);
        assert.throws(() => {
          A.get(0,2);
        });
        assert.equal(A.size, 6);

        A.reshape([2,3]);

        assert.equal(A.get(0,2),7);
        assert.throws(() => {
          A.get(2);
        });
        assert.equal(A.size, 6);
      });
      QUnit.test('2x3 to 6', assert => {
        let A = new NDArray([
          [3,5,7],
          [4,5,6]
        ]);
        assert.equal(A.get(0,2),7);
        assert.throws(() => {
          A.get(2);
        });
        assert.equal(A.size, 6);

        A.reshape([6]);

        assert.equal(A.get(2),7);
        assert.throws(() => {
          A.get(0,2);
        });
        assert.equal(A.size, 6);
      });
      QUnit.test('6 to 4x2', assert => {
        let A = new NDArray([3,5,7,4,5,6]);
        assert.equal(A.size, 6);
        assert.equal(A.get(2),7);
        A.reshape([4,2]);
        assert.equal(A.size, 8);
        assert.equal(A.get(1,0),7);
        assert.equal(A.get(2,1),6);
        assert.equal(A.get(3,0),0);
        assert.equal(A.get(3,1),0);
      });
    });

    QUnit.module('clone', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [2,4,6],
          [1,0,9],
          [0,2,3]
        ], {datatype:'f64'});
        assert.equal(A.get(1,2),9)

        let B = A.clone();
        assert.equal(B.get(1,2),9)

        assert.deepEqual(A.shape, B.shape);
        assert.equal(A.datatype, B.datatype);

        B.set(1,2,45);
        assert.equal(B.get(1,2),45)
        assert.equal(A.get(1,2),9)

        A.set(1,2,186);
        assert.equal(A.get(1,2),186)
        assert.equal(B.get(1,2),45)
      });
    });
  });

  QUnit.module('Vector2', () => {
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
    QUnit.test('swap', assert => {
      let v = new Vector([3,7,5,32,9,78]);
      v.swap(3,4);
      assert.ok(v.isEqual(new Vector([3,7,5,9,32,78])));
    });
    /*
    QUnit.test('permute', assert => {
      let v = new Vector([3,7,5,32,9,78]);
      let p = new Vector([1,4,2,0,3,5]);
      v.permute(p);
      assert.ok(v.isEqual(new Vector([7,9,5,3,32,78])));
    });
    QUnit.test('permuteInverse', assert => {
      let v = new Vector([3,7,5,32,9,78]);
      let p = new Vector([1,4,2,0,3,5]);
      v.permuteInverse(p);
      assert.ok(v.isEqual(new Vector([32,3,5,9,7,78])));
    });
    */
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
  });

  QUnit.module('Matrix', () => {

    QUnit.module('construction', () => {
      QUnit.test('only dimensions', assert => {
        let m = new Matrix({rows:2,cols:2});
        assert.ok(m instanceof Matrix);
      });
      QUnit.test('Int32 Array 2D', assert => {
        let m = new Matrix([[4,5],[23,42]], "i32");
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
        ],'i32').isEqual(new Matrix([
          [3,7,4],
          [4,9,12]
        ],'i32')));
      });
      QUnit.test('Float',assert => {
        assert.ok(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'f64').isEqual(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'f64')));
      });
      QUnit.test('Failure',assert => {
        assert.notOk(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.032,4,5]
        ],'f64').isEqual(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'f64')));
      });
      QUnit.test('Failure dimension mismatch',assert => {
        assert.notOk(new Matrix([
          [3,7,4.08],
          [4,9,12]
        ],'f64').isEqual(new Matrix([
          [3,7,4.08],
          [4,9,12],
          [0.03,4,5]
        ],'f64')));
      });
    });

    QUnit.module('Transpose', () => {
      QUnit.test('Square 3x3', assert => {
        let A = new Matrix([
          [2,3,7],
          [5,3,7],
          [-9,0,1]
        ]);
        assert.ok(A.transpose().isEqual(new Matrix([
          [2,5,-9],
          [3,3,0],
          [7,7,1]
        ])));
      });
      QUnit.test('Non square 2x3', assert => {
        let A = new Matrix([
          [2,3,7],
          [5,3,7]
        ]);
        assert.ok(A.transpose().isEqual(new Matrix([
          [2,5],
          [3,3],
          [7,7]
        ])));
      });
    });

    QUnit.module("Multiplication", () => {
      QUnit.test("Square 3x3", assert => {
        let A = new Matrix([[2,2,2],[2,2,2],[2,2,2]], 'i16');
        let B = new Matrix([[5,5,5],[5,5,5],[5,5,5]], 'i16');
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
        let A = new Matrix([[1,0],[2,1],[6,9]], 'i16');
        let B = new Matrix([[1,2,3],[1,2,9]], 'i16');
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
        let A = new Matrix([[1,0],[2,1],[6,9]], 'i16');
        let B = new Matrix([[1,2,3],[1,2,9],[4,5,3]], 'i16');
        assert.throws(() => {
          A.mul(B);
        });
      });
      QUnit.test("mul by Vector", assert => {
        let A = new Matrix([[1,0,2]], 'i16');
        let V = new Vector([4,4,9]);
        assert.equal(A.mul(V), 22);
      });
      QUnit.test("mul by Vector, error", assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'i16');
        let V = new Vector([4,4,9]);
        assert.throws(() => A.mul(V));
      });
    });

    QUnit.test("swaprows", assert => {
      let A = new Matrix([[1,0],[2,1],[6,9]], 'i16');
      let B = new Matrix([[2,1],[1,0],[6,9]], 'i16');
      A.swaprows(0,1);
      assert.ok(A.isEqual(B));
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
        let A = new Matrix([[1,0,2],[3,5,6]], 'i16');
        assert.ok(A.row(0).isEqual(new Vector([1,0,2])));
        assert.ok(A.row(1).isEqual(new Vector([3,5,6])));
      });
      QUnit.test('Row-wise 1x4', assert => {
        let A = new Matrix([[1,0,2,29]], 'i16');
        assert.ok(A.row(0).isEqual(new Vector([1,0,2,29])));
      });
      QUnit.test('Row-wise 4x1', assert => {
        let A = new Matrix([[1],[0],[2],[29]], 'i16');
        assert.ok(A.row(2).isEqual(new Vector([2])));
      });
      QUnit.test('Row-wise. Check deep copy', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'i16');
        let row = A.row(0);
        row.set(1, 243);
        assert.ok(row.isEqual(new Vector([1,243,2])));
        assert.ok(A.isEqual(new Matrix([[1,0,2],[3,5,6]], 'i16')));
      });
      QUnit.test('Column-wise 2x3', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'i16');
        assert.ok(A.col(0).isEqual(new Vector([1,3])));
        assert.ok(A.col(2).isEqual(new Vector([2,6])));
      });
      QUnit.test('Column-wise 1x4', assert => {
        let A = new Matrix([[1,0,2,29]], 'i16');
        assert.ok(A.col(0).isEqual(new Vector([1])));
      });
      QUnit.test('Column-wise 4x1', assert => {
        let A = new Matrix([[1],[0],[2],[29]], 'i16');
        assert.ok(A.row(0).isEqual(new Vector([1,0,2,29])));
      });
      QUnit.test('Column-wise. Check deep copy', assert => {
        let A = new Matrix([[1,0,2],[3,5,6]], 'i16');
        let col = A.col(0);
        col.set(1, 243);
        assert.ok(col.isEqual(new Vector([1,243])));
        assert.ok(A.isEqual(new Matrix([[1,0,2],[3,5,6]], 'i16')));
      });
    });

    QUnit.module('LUDecompose', () => {
      QUnit.test('test 1', assert => {
        let m = new Matrix([
          [1,4,7],
          [2,5,8],
          [3,6,10]
        ]);
        m.LUDecompose();
        assert.ok(m.isEqual(new Matrix([
          [1,4,7],
          [2,-3,-6],
          [3,2,1]
        ])));
      });
    });

    /*
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
          let answer = A.solve(new Vector([30,5,-25])) as basic.Vector;
          assert.ok(answer.isEqual(new Vector([3,1,-8])));
        });
        QUnit.test("From numpy tests", assert => {
          let A = new Matrix([
            [3,1],
            [1,2]
          ]);
          let answer = A.solve(new Vector([9,8])) as basic.Vector;
          assert.ok(answer.isEqual(new Vector([2,3])));
        });
        QUnit.test("From GSL tests", assert => {
          let A = new Matrix([
            [0.18, 0.60, 0.57, 0.96],
            [0.41, 0.24, 0.99, 0.58],
            [0.14, 0.30, 0.97, 0.66],
            [0.51, 0.13, 0.19, 0.85]
          ],'float64');
          let answer = A.solve(new Vector([1,2,3,4])) as basic.Vector;
          assert.ok(answer.isEqual(new Vector(
            [-4.05205, -12.6056, 1.66091, 8.69377],'float64'),1e-4));
        });
        QUnit.test("Random tests 1 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 7, 5, 12], [4, 3, 2, 1], [6, 2, 9, 3], [4, 1, 8, 8]])
          let answer = A.solve(new Vector([13, 15, 2, 90])) as basic.Vector;
          assert.ok(answer.isEqual(
              new Vector([40.50877193, -39.30526316, -25.02807018, 20.93684211])));
        });
        QUnit.test("Random tests 2 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 7, 5, 0.5], [4, 3, 2, 1], [6, 2, 99, 3], [4, 1, 8, 8]])
          assert.ok(
            (A.solve(new Vector([13, 15, 2, 90])) as basic.Vector).isEqual(
              new Vector(
                [0.19644227, 1.19044879, -0.36008822, 11.36306099])));
        });
        QUnit.test("Random tests 3 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 0.0007, 5, 0.5], [4, 3, 2, 1], [6, 2, 9999, 3], [4, 1, 8, 8]])
          assert.ok(
            (A.solve(new Vector([13, 15, 2, 90])) as basic.Vector).isEqual(
              new Vector(
                [1.95364698e+00, -1.07265497e+00, -3.88138726e-03,
                1.04111398e+01])));
        });
        QUnit.test("Random tests 4 (match with numpy)", assert => {
          let A = new Matrix([
            [4, 0.0007, 5, 0.5], [4, 3, 2, 1], [6, 2, 9999, 3], [4, 1, 8, 8]])
          assert.ok(
            (A.solve(new Vector([13, 0.15, 2986, 90])) as basic.Vector).isEqual(
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
          ])) as basic.Matrix;
          assert.ok(answer.isEqual(new Matrix([
                [40.50877193, 31.61561404, -1.66667],
                [-39.30526316, -8.06736842, 2.4],
                [-25.02807018, -21.58596491, 1.933333],
                [20.93684211, 6.91157895, -1.4]
              ]),1e-5));
        });
      });
    });
    */

    QUnit.module('Permutation', () => {
      QUnit.test('construction init', assert => {
        let pv = new PermutationVector(4);
        assert.ok(pv.isEqual(new Vector([0,1,2,3])));
      });
      QUnit.test('construction other value', assert => {
        let pv = new PermutationVector([3,2,0,1]);
        assert.ok(pv.isEqual(new Vector([3,2,0,1])));
      });
      QUnit.test('Identity matrix', assert => {
        let pv = new PermutationVector(4);
        assert.ok(pv.toMatrix().isEqual(Matrix.identity(4)));
      });
      QUnit.test('Permuted matrix', assert => {
        let pv = new PermutationVector([3,2,0,1]);
        assert.ok(pv.toMatrix().isEqual(new Matrix([
          [0,0,0,1],
          [0,0,1,0],
          [1,0,0,0],
          [0,1,0,0]
        ])));
      });
    });

    QUnit.module('BandMatrix', () => {
      QUnit.test('4x4, upper=1, lower=0', assert => {
        let bm = new BandMatrix({
          rows : 4, cols : 4,
          lowerbandwidth : 0,
          upperbandwidth : 1,
          data : new Float32Array([
            NaN,2,2,2,
            1,1,1,1
          ])
        });
        let rm = new Matrix([
          [1,2,0,0],
          [0,1,2,0],
          [0,0,1,2],
          [0,0,0,1]
        ]);
        assert.ok(bm.toRectangularMatrix().isEqual(rm));
      });
      QUnit.test('4x4, upper=1, lower=2', assert => {
        let bm = new BandMatrix({
          rows : 4, cols : 4,
          lowerbandwidth : 1,
          upperbandwidth : 2,
          data : new Float32Array([
            NaN,NaN,3,3,
            NaN,2,2,2,
            1,1,1,1,
            -1,-1,-1,NaN
          ])
        });
        let rm = new Matrix([
          [1,2,3,0],
          [-1,1,2,3],
          [0,-1,1,2],
          [0,0,-1,1]
        ]);
        assert.ok(bm.toRectangularMatrix().isEqual(rm));
      });
    });
  });

  QUnit.module('BSplineCurve2D', () => {
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
  });

  QUnit.module('linalg', () => {
    QUnit.module('blas', () => {
      function numberArrayEqual(X:Float32Array,Y:Float32Array) {
        if(X.length !== Y.length) { return false; }
        for(let i=0; i<X.length; i++) {
          if(!utils.isEqualFloat(X[i], Y[i])) {
            return false;
          }
        }
        return true;
      }
      QUnit.test('asum', assert => {
        let X = new Float32Array([3.404,5.66,2,0,-3]);
        let r = blas.asum(X);
        assert.ok(utils.isEqualFloat(r, 14.064, 1e-4));
      });
      QUnit.test('axpy', assert => {
        let X = new Float32Array([3.404,5.66,2,0,-3]);
        let Y = new Float32Array(5);
        let answer = new Float32Array([6.808,11.32,4,0,-6]);
        blas.axpy(X,2,Y);
        assert.ok(numberArrayEqual(Y,answer));
      });
    });
    
    QUnit.module('Construction', () => {
      QUnit.module('eye', () => {
        QUnit.test('Square 2x2', assert => {
          let I = linalg.eye(2);
          assert.equal(I.get(0,0), 1);
          assert.equal(I.get(0,1), 0);
          assert.equal(I.get(1,0), 0);
          assert.equal(I.get(1,1), 1);
        });
        QUnit.test('Rectangular 2x3', assert => {
          let I = linalg.eye([2,3]);
          assert.equal(I.get(0,0), 1);
          assert.equal(I.get(0,1), 0);
          assert.equal(I.get(1,0), 0);
          assert.equal(I.get(1,1), 1);
          assert.equal(I.get(0,2), 0);
          assert.equal(I.get(1,2), 0);
        });
        QUnit.test('Rectangular 3x2', assert => {
          let I = linalg.eye([3,2]);
          assert.equal(I.get(0,0), 1);
          assert.equal(I.get(0,1), 0);
          assert.equal(I.get(1,0), 0);
          assert.equal(I.get(1,1), 1);
          assert.equal(I.get(2,0), 0);
          assert.equal(I.get(2,1), 0);
        });
      });
      QUnit.module('zeros', () => {
        QUnit.test('Rectangular 2x2', assert => {
          let Z = linalg.zeros(2);
          assert.equal(Z.get(0,0), 0);
          assert.equal(Z.get(0,1), 0);
          assert.equal(Z.get(1,0), 0);
          assert.equal(Z.get(1,1), 0);
        });
        QUnit.test('Rectangular 2x2 ui32', assert => {
          let Z = linalg.zeros([2,2], 'ui32');
          assert.equal(Z.datatype, 'ui32');
        });
      });
    });
    QUnit.module('Operations', () => {
      QUnit.module('mmultiply', () => {
        QUnit.test("Square 3x3", assert => {
          let A = new NDArray([[2,2,2],[2,2,2],[2,2,2]], {datatype:'i16'});
          let B = new NDArray([[5,5,5],[5,5,5],[5,5,5]], {datatype:'i16'});
          let M = linalg.mmultiply(A,B);
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
          let M = linalg.mmultiply(A,B);
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
            linalg.mmultiply(A,B);
          });
        });
        QUnit.test("mul by Vector (inner product)", assert => {
          let A = new NDArray([[1,0,2]], {datatype:'i16'});
          let B = new NDArray([[4,4,9]], {datatype:'i16'});
          B.reshape([3,1]);
          let M = linalg.mmultiply(A, B);
          assert.deepEqual(M.shape, [1,1]);
          assert.equal(M.get(0,0), 22);
        });
        QUnit.test("mul by Vector, error", assert => {
          let A = new NDArray([[1,0,2],[3,5,6]], {datatype:'i16'});
          let B = new NDArray([[4,4,9]], {datatype:'i16'});
          assert.throws(() => linalg.mmultiply(A,B));
        });
        QUnit.test("mul by Vector (outer product)", assert => {
          let A = new NDArray([[3,3]], {datatype:'i16'});
          A.reshape([2,1]);
          let B = new NDArray([[2,2]], {datatype:'i16'});
          let M = linalg.mmultiply(A,B);
          assert.deepEqual(M.shape, [2,2]);
          assert.equal(M.get(0,0), 6);
          assert.equal(M.get(0,1), 6);
          assert.equal(M.get(1,0), 6);
          assert.equal(M.get(1,1), 6);
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
            assert.ok(utils.isEqualFloat(linalg.norm(A,2), 7.34847));
          });
          QUnit.test('3-norm', assert => {
            let A = new NDArray([2,3,4,5]);
            assert.ok(utils.isEqualFloat(linalg.norm(A,3), 6.07318, 1e-4));
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
            assert.ok(utils.isEqualFloat(linalg.norm(A, 'fro'),
              11.832159566199232, 1e-6));
          });
        });
      });
    });
  });
}