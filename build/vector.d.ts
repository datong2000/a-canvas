import { XYZ } from './utils/fn';
export default class Vector {
    x: number;
    y: number;
    z: number;
    constructor(v: XYZ);
    length(): number;
    dot(v: XYZ): number;
    cross(v: XYZ): Vector;
    angle(v: Vector): number;
    unit(): Vector;
}
export declare function MakeVector(lg: number, lt: number): Vector;
