import A from './a';
interface Update<T> {
    x: T;
    y: T;
    w: T;
    h: T;
    sc: T;
    z: T;
    xo: T;
    yo: T;
}
export default class Outline {
    ts: number | null;
    ac: {
        textHeight?: number;
    };
    x: number;
    y: number;
    w: number;
    h: number;
    sc: number;
    z: number;
    tag: A;
    constructor(ac: object);
    Update(v: Update<number>): void;
    Active(x: number, y: number): boolean;
}
export {};
