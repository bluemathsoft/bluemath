

export default class Matrix {

  shape : Array<number>
  data : Int8Array|Int16Array|Int32Array|Float32Array|Float64Array
  datatype : string
  size : number

  /**
   * Supported datatype strings
   * ['int8','int16','int32','float32','float64']
   */
  constructor(
    shape:Array<number>,
    data : Int8Array|Int16Array|Int32Array|Float32Array|Float64Array|null,
    datatype='float32')
  {
    this.shape = shape;
    this._computeSize();

    this.datatype = datatype;

    if(data === null) {
      this._alloc();
    } else {
      this.data = data;
    }
  }

  private _computeSize() : void {
    let size = 1;
    for(let dimsize of this.shape) {
      size *= dimsize;
    }
    this.size = size;
  }

  private _alloc() : void {
    switch(this.datatype) {
      case 'int8':
        this.data = new Int8Array(this.size);
        break;
      case 'int16':
        this.data = new Int16Array(this.size);
        break;
      case 'int32':
        this.data = new Int32Array(this.size);
        break;
      case 'float32':
        this.data = new Float32Array(this.size);
        break;
      case 'float64':
        this.data = new Float64Array(this.size);
        break;
      default:
        throw new Error("Unknown datatype");
    }
  }

  /**
   * Assign value to all items in the matrix
   */
  fill(value:number) {
    this.data.fill(value);
  }

  _getAddress(indices:Array<number>) {
    console.assert(indices.length === this.shape.length);
    let addr = 0;
    for (let i = 0; i < this.shape.length; i++) {
      if (i < this.shape.length - 1) {
        addr += this.shape[i + 1] * indices[i];
      } else {
        addr += indices[i];
      }
    }
    return addr;
  }

  get(indices:Array<number>) : number {
    let address = this._getAddress(indices);
    return this.data[address];
  }

  set(indices:Array<number>, value:number) : void {
    let address = this._getAddress(indices);
    this.data[address] = value;
  }

}