import { NumberType } from '..';
import Vector from './vector';
import Matrix from './matrix';
export default class PermutationVector extends Vector {
    constructor(arg0: number[] | number, datatype?: NumberType);
    toMatrix(): Matrix;
}
