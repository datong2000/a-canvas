import A from '../a';
declare type EX = {
    min: {
        x: number;
        y: number;
    };
    max: {
        x: number;
        y: number;
    };
};
export declare type XY = {
    x: number;
    y: number;
};
export declare function FindTextBoundingBox(s: string[], ht: number): EX;
export declare function FixFont(fontFamily: string): string;
export declare function Clamp(v: number, mn: number, mx: number): number;
export declare function GetProperty(e: HTMLAnchorElement | HTMLCanvasElement, p: string): string;
export declare function SortList(l: A[], f?: (a: A, b: A) => number): A[];
export declare function EventXY(e: MouseEvent | TouchEvent, c: HTMLCanvasElement): XY;
export declare function NewCanvas(w: number, h: number): HTMLCanvasElement;
export declare function EventToCanvasId(e: MouseEvent | TouchEvent): string;
export declare function Shuffle(a: number[]): void;
export declare function AddHandler(h: string, f: EventListener, e?: HTMLElement | Document): void;
export declare function RemoveHandler(h: string, f: EventListener, e?: HTMLElement | Document): void;
export declare function tccall(f: string, id: string): void;
export {};
