
import Matrix from './matrix'
import {TypedArray} from '..'

interface BandMatrixDef {
  rows : number,
  cols : number,
  lowerbandwidth : number,
  upperbandwidth : number,
  data : TypedArray
};

export {BandMatrixDef};

export default class BandMatrix extends Matrix {

  private _def : BandMatrixDef;

  constructor(def:BandMatrixDef) {
    let nrows = def.lowerbandwidth+def.upperbandwidth+1;
    let ncols = Math.min(def.rows, def.cols);
    console.assert(def.data.length === nrows*ncols);
    super({rows:nrows, cols:ncols, data:def.data});
    this._def = def;
  }

  /**
   * 
   * @example
   * For the rectangular matrix
   *    -                         -
   *    | a11 a12 a13   0   0   0 |
   *    | a21 a22 a23 a24   0   0 |
   *    |   0 a32 a33 a34 a35   0 |
   *    |   0   0 a43 a44 a45   0 |
   *    |   0   0   0 a54 a55 a56 |
   *    |   0   0   0   0 a65 a66 |
   *    -                         -
   * 
   * Band matrix is given by
   *    lower bandwidth p = 1
   *    upper bandwidth q = 2
   *    -                         -
   *    |   *   * a13 a24 a35 a46 |
   *    |   * a12 a23 a34 a45 a56 |
   *    | a11 a22 a33 a44 a55 a66 |
   *    | a21 a32 a43 a54 a65   * |
   *    -                         -
   */

  toRectangularMatrix() : Matrix {
    let m = new Matrix({
      rows:this._def.rows,
      cols:this._def.cols
    }, 'f32');
    let q = this._def.upperbandwidth;
    for(let i=0; i<m.rows; i++) {
      for(let j=0; j<m.cols; j++) {
        let brow = i-j+q;
        let bcol = j;
        if(brow < 0 || brow >= this.rows ||
          bcol < 0 || bcol >= this.cols)
        {
          m.set(i,j,0);
        } else {
          m.set(i,j,this.get(brow,bcol));
        }
      }
    }
    return m;
  }
}