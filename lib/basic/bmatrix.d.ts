import Matrix from './matrix';
import { TypedArray } from '..';
interface BandMatrixDef {
    rows: number;
    cols: number;
    lowerbandwidth: number;
    upperbandwidth: number;
    data: TypedArray;
}
export { BandMatrixDef };
export default class BandMatrix extends Matrix {
    private _def;
    constructor(def: BandMatrixDef);
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
    toRectangularMatrix(): Matrix;
}
