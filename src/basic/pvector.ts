
import {NumberType} from '..'
import Vector from './vector'
import Matrix from './matrix'

/**
 * @hidden
 */
export default class PermutationVector extends Vector {

  constructor(arg0:number[]|number, datatype?:NumberType) {
    super(arg0, datatype||'i16');
    if(typeof arg0 === 'number') {
      // Initialize the Permutation vector to [0,1,2,...,n-1]
      // This corresponds to Identity matrix
      for(let i=0; i<arg0; i++) {
        this._data[i] = i;
      }
    }
  }

  toMatrix() : Matrix {
    let n = this._data.length;
    let d = new Int32Array(n*n);
    for(let i=0; i<n; i++) {
      let j = this.get(i);
      d[i*n+j] = 1;
    }
    return new Matrix({
      rows:this._data.length,
      cols:this._data.length,
      data:d
    });
  }

}