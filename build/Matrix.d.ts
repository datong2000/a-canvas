import { XYZ } from './utils/fn';
export declare function Identity(): Matrix;
export declare function Rotation(angle: number, v: XYZ): Matrix;
export default class Matrix {
    constructor(v: number[]);
    mul(m: Matrix): Matrix;
    xform(v: XYZ): XYZ;
}
