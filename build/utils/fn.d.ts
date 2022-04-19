export interface XYZ {
    x: number;
    y: number;
    z: number;
    w?: number;
}
export declare function Defined(d: any): boolean;
export declare function IsObject(o: any): boolean;
export declare function Clamp(v: number, mn: number, mx: number): number;
export declare function Nop(): boolean;
export declare function TimeNow(): number;
declare type SortFn<T> = (a: T, b: T) => T;
export declare function SortList(l: any, f: SortFn<number>): any;
export declare function AbsPos(id: string): {
    x: number;
    y: number;
};
export {};
