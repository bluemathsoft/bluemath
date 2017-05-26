import { TypedArray } from '..';
declare type DataType = 'i8' | 'ui8' | 'i16' | 'ui16' | 'i32' | 'ui32' | 'f32' | 'f64';
export { DataType };
export interface NDArrayOptions {
    shape?: number[];
    datatype?: DataType;
    fill?: number;
}
export default class NDArray {
    shape: number[];
    size: number;
    datatype: DataType;
    private _data;
    constructor(arg0: TypedArray | Array<any> | NDArrayOptions, arg1?: NDArrayOptions);
    reshape(shape: number[]): void;
    private _calcSize();
    private _alloc(size, data?, datatype?);
    private _getAddress(...indices);
    get(...indices: number[]): number;
    set(...args: number[]): void;
}
