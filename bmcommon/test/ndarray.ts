

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
import {NDArray} from '../src/ndarray'
import {Complex} from '../src/complex'
import {range,empty} from '../src/ops'

/// <reference path="qunit/index.d.ts" />

export default function testNDArray() {

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
          QUnit.test("2x2x2", assert => {
            let A = new NDArray([
              [
                [1,0],
                [2,1]
              ],
              [
                [2,3],
                [5,4]
              ]
            ], {datatype:'i16'});
            assert.deepEqual(A.shape,[2,2,2]);
            assert.equal(A.size, 8);
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

    QUnit.test("swaprows", assert => {
      let A = new NDArray([[1,0],[2,1],[6,9]], {datatype:'i16'});
      let B = new NDArray([[2,1],[1,0],[6,9]], {datatype:'i16'});
      A.swaprows(0,1);
      assert.ok(A.isEqual(B));
    });

    QUnit.module('max', () => {
      QUnit.test("No axis", assert => {
        assert.equal(<number>(new NDArray([3,4,5,8]).max()), 8);
        assert.equal(<number>(new NDArray([[3,4],[5,8]]).max()), 8);
        assert.equal(<number>(new NDArray([[3,4],[23,-99],[5,8]]).max()), 23);
      });
      QUnit.test("1 Axis of 2x2", assert => {
        let A = new NDArray([[1,2],[3,4]],{datatype:'i32'});
        assert.ok(new NDArray([3,4]).isEqual(<NDArray>A.max(0)));
        assert.ok(new NDArray([2,4]).isEqual(<NDArray>A.max(1)));
      });
      QUnit.test("1 Axis of 3x3", assert => {
        let A = new NDArray([[1,2,3],[4,5,6],[7,8,9]],{datatype:'i32'});
        assert.ok(new NDArray([7,8,9]).isEqual(<NDArray>A.max(0)));
        assert.ok(new NDArray([3,6,9]).isEqual(<NDArray>A.max(1)));
      });
      QUnit.skip("1 Axis of 3x3x3", assert => {
        let A = range(27);
        A.reshape([3,3,3]);
        console.log(A.toString());
        console.log(A.max(2).toString());
        assert.ok(new NDArray([
          [2,5,8],
          [11,14,17],
          [20,23,26]
        ]).isEqual(<NDArray>A.max(2)));
      });
    });

    QUnit.module("toArray", () => {

      QUnit.test("4", assert => {
        let arr = [5,6,7,8];
        let A = new NDArray(arr, {datatype:'i16'});
        assert.deepEqual(arr, A.toArray());
      });
      QUnit.test("3x2", assert => {
        let arr = [[1,0],[2,1],[6,9]];
        let A = new NDArray(arr, {datatype:'i16'});
        assert.deepEqual(arr, A.toArray());
      });

      QUnit.test("2x2x2", assert => {
        let arr =[
          [
            [1,0],
            [2,1]
          ],
          [
            [2,3],
            [5,4]
          ]
        ];
        let A = new NDArray(arr, {datatype:'i16'});
        assert.deepEqual(arr, A.toArray());
      });
      QUnit.test("2x3x1", assert => {
        let arr = [
          [
            [3],
            [6],
            [89]
          ],
          [
            [2],
            [-8],
            [10]
          ]
        ];
        let A = new NDArray(arr, {datatype:'i16'});
        assert.deepEqual(arr, A.toArray());
      });
      QUnit.test("1x4x3x2", assert => {
        let arr = [
          [
            [
              [3,5],[2,1],[3,5]
            ],
            [
              [4,1],[9,8],[3,5]
            ],
            [
              [2,7],[3,5],[6,1]
            ],
            [
              [10,8],[6,2],[2,5]
            ]
          ]
        ];
        let A = new NDArray(arr, {datatype:'i16'});
        assert.deepEqual(arr, A.toArray());
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

      QUnit.module('Data index to index', () => {
        QUnit.test('3x3x3 addressToIndex', assert => {
          let A = new NDArray({shape:[3,3,3]});
          assert.deepEqual(A._addressToIndex(10), [1,0,1]);
          assert.deepEqual(A._addressToIndex(11), [1,0,2]);
          assert.deepEqual(A._addressToIndex(13), [1,1,1]);
          assert.deepEqual(A._addressToIndex(14), [1,1,2]);
        });
        QUnit.test('3x3x3 indexToAddress', assert => {
          let A = new NDArray({shape:[3,3,3]});
          assert.equal(A._indexToAddress(1,0,1),10);
          assert.equal(A._indexToAddress(1,0,2),11);
          assert.equal(A._indexToAddress(1,1,1),13);
          assert.equal(A._indexToAddress(1,1,2),14);
        });
        QUnit.test('1x6', assert => {
          let A = new NDArray({shape:[1,6]});
          assert.deepEqual(A._addressToIndex(3), [0,3]);
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
        QUnit.test('Slice Assignment', assert => {
          let A = range(9);
          A.reshape([3,3]);

          A.set(0,new NDArray([-1,-1,-1]));
          assert.ok(A.isEqual(new NDArray([
            [-1,-1,-1],
            [3,4,5],
            [6,7,8]
          ])));

          A.set(0,':',new NDArray([-2,-2,-2]));
          assert.ok(A.isEqual(new NDArray([
            [-2,-2,-2],
            [3,4,5],
            [6,7,8]
          ])));

          A.set(':',0,new NDArray([-3,-3,-3]));
          assert.ok(A.isEqual(new NDArray([
            [-3,-2,-2],
            [-3,4,5],
            [-3,7,8]
          ])));

          A.set(':1',1,new NDArray([-4]));
          assert.ok(A.isEqual(new NDArray([
            [-3,-4,-2],
            [-3,4,5],
            [-3,7,8]
          ])));

          A.set(':2',':2',new NDArray([[-5,-5],[-5,-5]]));
          assert.ok(A.isEqual(new NDArray([
            [-5,-5,-2],
            [-5,-5,5],
            [-3,7,8]
          ])));

          A.set(2,':',new NDArray([0,0,0]));
          assert.ok(A.isEqual(new NDArray([
            [-5,-5,-2],
            [-5,-5,5],
            [0,0,0]
          ])));
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
        assert.equal(A.size, 6);
      });
      QUnit.test('2x3 to 6', assert => {
        let A = new NDArray([
          [3,5,7],
          [4,5,6]
        ]);
        assert.equal(A.get(0,2),7);
        assert.equal(A.size, 6);

        A.reshape([6]);

        assert.equal(A.get(2),7);
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

    QUnit.module('flatten', () => {
      QUnit.test('2x2', assert => {
        let A = new NDArray([[2,7],[9,5]]);
        assert.ok(new NDArray([2,7,9,5]).isEqual(A.flatten()));
      });
      QUnit.test('3x3', assert => {
        let A = new NDArray([[2,7,8],[9,5,8],[0,3,4]]);
        assert.ok(new NDArray([2,7,8,9,5,8,0,3,4]).isEqual(A.flatten()));
      });
      QUnit.test('5', assert => {
        let A = new NDArray([2,7,8,9,5]);
        assert.ok(new NDArray([2,7,8,9,5]).isEqual(A.flatten()));
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

      QUnit.test('complex', assert => {
        let A = new NDArray({shape:[2]});
        A.set(0, new Complex(3,5));
        A.set(1, 32);
        let copyA = A.clone();
        assert.ok(new Complex(3,5).isEqual(<Complex>copyA.get(0)));
        assert.equal(32, copyA.get(1));
      });
    });

    QUnit.module('copy', () => {
      QUnit.test('from', assert => {
        let A = range(9);
        A.reshape([3,3]);
        let B = empty([3,3]);
        assert.ok(!B.isEqual(A));
        B.copyfrom(A);
        assert.ok(B.isEqual(A));
      });
      QUnit.test('to', assert => {
        let A = range(9);
        A.reshape([3,3]);
        let B = empty([3,3]);
        assert.ok(!B.isEqual(A));
        A.copyto(B);
        assert.ok(B.isEqual(A));
      });
    });

    QUnit.module('slice', () => {
      QUnit.test('3x3', assert => {
        let A = new NDArray([
          [2,4,6],
          [1,0,9],
          [0,2,3]
        ], {datatype:'f64'});

        // 1
        assert.ok((<NDArray>A.get(':1',':2')).isEqual(new NDArray([
          [2,4],
        ])));
        // 2
        assert.ok((<NDArray>A.get(0,':2')).isEqual(new NDArray([
          2,4
        ])));
        // 3
        assert.ok((<NDArray>A.get(null)).isEqual(new NDArray([
          [2,4,6],
          [1,0,9],
          [0,2,3]
        ])));
        // 4
        assert.ok((<NDArray>A.get(1,null)).isEqual(new NDArray([
          1,0,9
        ])));
        // 5
        assert.ok((<NDArray>A.get(0)).isEqual(new NDArray([
          2,4,6
        ])));
        // 6
        assert.ok((<NDArray>A.get(1)).isEqual(new NDArray([
          1,0,9
        ])));
        // 7
        assert.ok((<NDArray>A.get('1:2')).isEqual(new NDArray([
          [1,0,9]
        ])));
        // 8
        assert.ok((<NDArray>A.get('1:2',2)).isEqual(new NDArray([
          9
        ])));
        // 9
        assert.ok((<NDArray>A.get(':1',':3')).isEqual(new NDArray([
          [2,4,6],
        ])));
        // 10
        assert.ok((<NDArray>A.get(':1',':4')).isEqual(new NDArray([
          [2,4,6],
        ])));
        // 11
        assert.ok((<NDArray>A.get(':1',':')).isEqual(new NDArray([
          [2,4,6],
        ])));
        // 12
        assert.ok((<NDArray>A.get(':1')).isEqual(new NDArray([
          [2,4,6],
        ])));
        // 13
        assert.ok((<NDArray>A.get(':',':1')).isEqual(new NDArray([
          [2],
          [1],
          [0]
        ])));
        // 14
        assert.ok((<NDArray>A.get(':',0)).isEqual(new NDArray([
          2,1,0
        ])));
        // 15
        assert.ok((<NDArray>A.get(':',2)).isEqual(new NDArray([
          6,9,3
        ])));
        // 16
        assert.ok((<NDArray>A.get(':2',':3')).isEqual(new NDArray([
          [2,4,6],
          [1,0,9],
        ])));
        // 17
        assert.ok((<NDArray>A.get(':',':')).isEqual(new NDArray([
          [2,4,6],
          [1,0,9],
          [0,2,3]
        ])));
        // 18
        assert.ok((<NDArray>A.get(':')).isEqual(new NDArray([
          [2,4,6],
          [1,0,9],
          [0,2,3]
        ])));
        // 19
        assert.ok((<NDArray>A.get()).isEqual(new NDArray([
          [2,4,6],
          [1,0,9],
          [0,2,3]
        ])));
      });

      QUnit.test('3x3x3', assert => {
        let A = range(27);
        A.reshape([3,3,3]);

        assert.equal(A.get(0,0,0),0);
        assert.equal(A.get(0,1,0),3);
        assert.equal(A.get(1,1,0),12);

        assert.ok((<NDArray>A.get(0,0,':')).isEqual(new NDArray([
          0,1,2
        ])));

        assert.ok((<NDArray>A.get(0,':1',':')).isEqual(new NDArray([
          [0,1,2]
        ])));

        assert.ok((<NDArray>A.get(0,':2',':')).isEqual(new NDArray([
          [0,1,2],
          [3,4,5]
        ])));

        assert.ok((<NDArray>A.get(0)).isEqual(new NDArray([
          [0,1,2],
          [3,4,5],
          [6,7,8]
        ])));
        assert.ok((<NDArray>A.get(0,null,2)).isEqual(new NDArray([
          2,5,8
        ])));

        assert.ok((<NDArray>A.get(0,1)).isEqual(new NDArray([
          3,4,5
        ])));
        assert.ok((<NDArray>A.get()).isEqual(A));
        assert.ok((<NDArray>A.get(null,null)).isEqual(A));
      });
    });

  });
}
