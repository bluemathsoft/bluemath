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

import {NumberType, NumberArray2D, TypedArray} from '..'
import Vector from './vector'
import {utils} from '..'
import {EPSILON} from '../constants'

export default class Matrix {

  private _data : TypedArray
  private datatype : NumberType
  private _rows : number;
  private _cols : number;
  private _LU : Matrix;
  private _luindx : Array<number>;

  /**
   * If arg0 is 2D array, all its rows should be the same length.
   * Let length of first row is assumed to be the number of columns.
   * `data` is assigned to the internal _data variable by reference,
   * i.e. it's not deep copied
   */
  constructor(
    arg0 : NumberArray2D | {rows:number,cols:number,data?:TypedArray},
    datatype? : NumberType)
  {
    this.datatype = datatype || 'float32';

    if(Array.isArray(arg0)) {
      this._rows = arg0.length;
      console.assert(Array.isArray(arg0[0]));
      this._cols = arg0[0].length;
      this._alloc(arg0);
    } else {
      this._rows = arg0.rows;
      this._cols = arg0.cols;
      this._alloc(arg0.data);
    }
  }

  get rows() : number {
    return this._rows;
  }

  get cols() : number {
    return this._cols;
  }

  get size() : number {
    return this._data.length;
  }

  get data() : TypedArray {
    return this._data;
  }

  static identity(size:number, datatype?:NumberType) : Matrix {
    let m = new Matrix({rows:size,cols:size}, datatype);
    m.fill(0);
    for(let i=0; i<size; i++) {
      m.set(i,i, 1);
    }
    return m;
  }

  private _alloc(data?:NumberArray2D|TypedArray) : void {
    let size = this._rows*this._cols;
    switch(this.datatype) {
      case 'int8':
        this._data = new Int8Array(size);
        break;
      case 'uint8':
        this._data = new Uint8Array(size);
        break;
      case 'int16':
        this._data = new Int16Array(size);
        break;
      case 'uint16':
        this._data = new Uint16Array(size);
        break;
      case 'int32':
        this._data = new Int32Array(size);
        break;
      case 'uint32':
        this._data = new Uint32Array(size);
        break;
      case 'float32':
        this._data = new Float32Array(size);
        break;
      case 'float64':
        this._data = new Float64Array(size);
        break;
      default:
        throw new Error("Unknown datatype");
    }
    if(data) {
      if(Array.isArray(data)) {
        for(let i=0; i<this._rows; i++) {
          for(let j=0; j<this._cols; j++) {
            this._data[this._getAddress(i,j)] = data[i][j];
          }
        }
      } else if(ArrayBuffer.isView(data)) { // it's typed array
        if(size !== data.length) {
          throw new Error("Mismatch between data size and input dimensions");
        }
        this._data = data;
      } else {
        throw new Error("Unexpected data format");
      }
    }
  }

  clone() {
    let datacopy:TypedArray;
    switch(this.datatype) {
      case 'int8':
        datacopy = Int8Array.from(this._data);
        break;
      case 'uint8':
        datacopy = Uint8Array.from(this._data);
        break;
      case 'int16':
        datacopy = Int16Array.from(this._data);
        break;
      case 'uint16':
        datacopy = Uint16Array.from(this._data);
        break;
      case 'int32':
        datacopy = Int32Array.from(this._data);
        break;
      case 'uint32':
        datacopy = Uint32Array.from(this._data);
        break;
      case 'float32':
        datacopy = Float32Array.from(this._data);
        break;
      case 'float64':
        datacopy = Float64Array.from(this._data);
        break;
      default:
        throw new Error("Unknown datatype");
    }
    return new Matrix({rows:this._rows,cols:this._cols,data:datacopy})
  }

  /**
   * Assign value to all items in the matrix
   */
  fill(value:number) {
    this._data.fill(value);
  }

  private _getAddress(row:number, col:number) {
    return row * this._cols + col;
  }

  get(row:number,col:number) : number {
    let address = this._getAddress(row,col);
    return this._data[address];
  }

  row(idx:number) : Vector {
    if(idx >= this.rows || idx < 0) {
      throw new Error('Row index out of range');
    }
    return new Vector(
      this._data.slice(idx*this.cols,(idx+1)*this.cols));
  }

  col(idx:number) : Vector {
    if(idx >= this.cols || idx < 0) {
      throw new Error('Column index out of range');
    }
    let col = new Vector(this.rows);
    for(let i=0; i<this.rows; i++) {
      col.set(i, this.get(i, idx));
    }
    return col;
  }

  set(row:number, col:number, value:number) : void {
    let address = this._getAddress(row,col);
    this._data[address] = value;
  }

  scale(k:number) : void {
    for(let i=0; i<this._data.length; i++) {
      this._data[i] *= k;
    }
  }

  mul(other:Matrix|Vector):Matrix|number {
    if(other instanceof Matrix) {
      let A = this;
      let B = other;
      if(A._cols !== B._rows) {
        throw new Error("Incompatible dimensions for multiplication");
      }
      let result = new Matrix({rows:A._rows,cols:B._cols},A.datatype);
      for(let i=0; i<A._rows; i++) {
        for(let j=0; j<B._cols; j++) {
          let value = 0.0;
          for(let k=0; k<A._cols; k++) {
            value += A.get(i,k)*B.get(k,j);
          }
          result.set(i,j,value);
        }
      }
      return result;
    } else {
      // A vector is nx1 matrix
      // Therefore for multiplication to be possible, this matrix should
      // be 1xn matrix
      if(this.rows !== 1 || this.cols !== other.size()) {
        throw new Error("Incompatible dimensions for multiplication");
      }
      let result = 0.0;
      for(let i=0; i<this.cols; i++) {
        result += this.get(0,i) * other.get(i);
      }
      return result;
    }
  }

  /**
   * This matrix remains unchanged
   */
  transpose() : Matrix {
    let xpose = new Matrix({rows:this.cols, cols:this.rows});
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.cols; j++) {
        xpose.set(j,i,this.get(i,j));
      }
    }
    return xpose;
  }

  isEqual(other:Matrix, tolerance=EPSILON) : boolean {
    if(this.rows !== other.rows) { return false; }
    if(this.cols !== other.cols) { return false; }
    for(let i=0; i<this.rows; i++) {
      for(let j=0; j<this.cols; j++) {
        if(!utils.isEqualFloat(this.get(i,j), other.get(i,j), tolerance)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Ref: Numerical Recipies 2.3.1
   */
  private LUDecompose() {
    if(this.rows !== this.cols) {
      throw new Error("Non-square matrices can't be LU decomposed");
    }
    let LU = this.clone();
    let n = this.rows;
    let vv = new Float32Array(n);
    this._luindx = new Array(n);
    let d = 1;
    let big;
    let temp;
    let imax=0;
    // Loop over rows to get implicit scaling information
    for(let i=0; i<n; i++) {
      big = 0.0;
      for(let j=0; j<n; j++) {
        big = Math.max(big, Math.abs(LU.get(i,j)));
      }
      if(utils.isZero(big)) {
        throw new Error("Singular matrix. Can't perform LU decomposition");
      }
      vv[i] = 1.0/big;
    }

    for(let k=0; k<n; k++) {
      big = 0.0;
      for(let i=k; i<n; i++) {
        temp = vv[i] * Math.abs(LU.get(i,k));
        if(temp > big) {
          big = temp;
          imax = i;
        }
      }
      if(k !== imax) {
        for(let j=0; j<n; j++) {
          temp = LU.get(imax, j);
          LU.set(imax, j, LU.get(k, j));
          LU.set(k, j, temp);
        }
        d = -d;
        vv[imax] = vv[k];
      }
      this._luindx[k] = imax;
      if(LU.get(k,k) == 0) { // TODO: reconsider
        LU.set(k, k, EPSILON);
      }
      for(let i=k+1; i<n; i++) {
        temp = LU.get(i,k)/LU.get(k,k);
        LU.set(i, k, temp);
        for(let j=k+1; j<n; j++) {
          let val = LU.get(i,j) - temp*LU.get(k,j);
          LU.set(i,j, val);
        }
      }
    }
    this._LU = LU;
  }

  /**
   * Ref: Numerical Recipies 2.3.1
   */
  private solve_single(b:Vector) : Vector {
    if(!this._LU) {
      this.LUDecompose();
    }
    let n = this.rows;
    if(b.size() !== n) {
      throw new Error("RHS vector b has incorrect size");
    }
    let x = b.clone(); // Solution vector;
    let ii=0;
    let sum;
    for(let i=0; i<n; i++) {
      let ip = this._luindx[i];
      sum = x.get(ip);
      x.set(ip, x.get(i));
      if(ii !== 0) {
        for(let j=ii-1; j<i; j++) {
          sum -= this._LU.get(i,j) * x.get(j);
        }
      } else if(!utils.isZero(sum)) {
        ii = i+1;
      }
      x.set(i, sum);
    }

    for(let i=n-1; i>=0; i--) {
      sum = x.get(i);
      for(let j=i+1; j<n; j++) {
        sum -= this._LU.get(i,j) * x.get(j);
      }
      x.set(i, sum/this._LU.get(i,i));
    }
    return x;
  }

  private solve_multiple(b:Matrix) : Matrix {
    if(!this._LU) {
      this.LUDecompose();
    }
    let n = this.rows;
    if(b.rows !== n) {
      throw new Error("RHS matrix b has incorrect size");
    }
    let answer = b.clone();
    for(let i=0; i<b.cols; i++) {
      let bcol = b.col(i);
      let x = this.solve_single(bcol);
      for(let j=0; j<n; j++) {
        answer.set(j, i, x.get(j));
      }
    }
    return answer;
  }

  solve(b:Vector|Matrix) : Vector|Matrix {
    if(b instanceof Vector) {
      return this.solve_single(b);
    } else {
      return this.solve_multiple(b);
    }
  }

  inverse() : Matrix {
    let inv = Matrix.identity(this.rows);
    return this.solve(inv) as Matrix;
  }

  determinant() : number {
    if(!this._LU) { // TODO: investigate if direct computation is cheaper
      this.LUDecompose();
    }
    let answer = 1;
    for(let i=0; i<this.rows; i++) {
      answer *= this._LU.get(i,i);
    }
    return answer;
  }

}