export interface RingType {
    n: number;
    o?: number;
    xr: number;
    yr: number;
    zr: number;
}
export declare function PointsOnSphere({ n, xr, yr, zr }: RingType): Array<number[]>;
export declare function PointsOnCylinderV({ n, xr, yr, zr }: RingType): Array<number[]>;
export declare function PointsOnCylinderH({ n, xr, yr, zr }: RingType): Array<number[]>;
export declare function PointsOnRingV({ n, xr, yr, zr }: RingType): Array<number[]>;
export declare function PointsOnRingH({ n, xr, yr, zr }: RingType): Array<number[]>;
