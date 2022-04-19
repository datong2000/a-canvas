export interface XYZ {
    x: number,
    y: number,
    z: number
    w?: number
}

let { min, max } = Math


export function Defined(d: any): boolean {
    return typeof d != 'undefined';
}

export function IsObject(o: any): boolean {
    return typeof o == 'object' && o != null;
}

export function Clamp(v: number, mn: number, mx: number): number {
    return isNaN(v) ? mx : min(mx, max(mn, v));
}

export function Nop(): boolean {
    return false;
}

export function TimeNow(): number {
    return new Date().valueOf();
}

type SortFn<T> = (a: T, b: T) => T

export function SortList(l: any, f: SortFn<number>): any {
    let nl: any[] = [], tl: number = l.length, i: number;
    for (i = 0; i < tl; ++i)
        nl.push(l[i]);
    nl.sort(f);
    return nl;
}

export function AbsPos(id: string): { x: number, y: number } {
    let e = document.getElementById(id), r = e.getBoundingClientRect(),
        dd = document.documentElement, b = document.body, w = window,
        xs = w.pageXOffset || dd.scrollLeft,
        ys = w.pageYOffset || dd.scrollTop,
        xo = dd.clientLeft || b.clientLeft,
        yo = dd.clientTop || b.clientTop;
    return { x: r.left + xs - xo, y: r.top + ys - yo };
}
