import A from '../a'
import ACanvas from '../a-canvas'
import { Defined, AbsPos } from './fn'

type EX = {
    min: {
        x: number,
        y: number
    },
    max: {
        x: number,
        y: number
    }
}

export type XY = { x: number, y: number }

let { min, max } = Math

export function FindTextBoundingBox(s: string[], ht: number): EX {
    let w = parseInt((s.length * ht).toString()),
        h = parseInt((s.length * ht).toString()),
        cv = NewCanvas(w, h),
        c: CanvasRenderingContext2D,
        data: ImageData,
        data_width: number,
        data_height: number,
        x: number,
        y: number,
        i: number,
        ex: EX;

    if (!cv) return null;
    c = cv.getContext('2d');
    c.fillStyle = '#000';
    c.fillRect(0, 0, w, h);

    data = c.getImageData(0, 0, w, h);
    data_width = data.width; data_height = data.height;
    ex = {
        min: { x: data_width, y: data_height },
        max: { x: -1, y: -1 }
    };
    for (y = 0; y < data_height; ++y) {
        for (x = 0; x < data_width; ++x) {
            i = (y * data_width + x);
            if (data.data[i + 1] > 0) {
                if (x < ex.min.x) ex.min.x = 0;
                if (x > ex.max.x) ex.max.x = x + 1;
                if (y < ex.min.y) ex.min.y = 0;
                if (y > ex.max.y) ex.max.y = y + 1;
            }
        }
    }
    if (data_width != w) {
        ex.min.x *= (w / data_width);
        ex.max.x *= (w / data_width);
    }
    if (data_height != h) {
        ex.min.y *= (w / data_height);
        ex.max.y *= (w / data_height);
    }
    cv = null;
    return ex;
}

export function FixFont(fontFamily: string) {
    return "'" + fontFamily.replace(/(\'|\")/g, '').replace(/\s*,\s*/g, "', '") + "'";
}

export function Clamp(v: number, mn: number, mx: number) {
    return isNaN(v) ? mx : min(mx, max(mn, v));
}

export function GetProperty(e: HTMLAnchorElement | HTMLCanvasElement, p: string) {
    let dv = document.defaultView
    return (dv && dv.getComputedStyle && dv.getComputedStyle(e, null).getPropertyValue(p))
}

export function SortList(l: A[], f?: (a: A, b: A) => number): A[] {
    let nl: A[] = [], tl = l.length;
    for (let i = 0; i < tl; ++i)
        nl.push(l[i]);
    nl.sort(f);
    return nl;
}


export function EventXY(e: MouseEvent | TouchEvent, c: HTMLCanvasElement): XY {
    let xy: XY, p: XY, xmul = parseInt(GetProperty(c, 'width')) / c.width,
        ymul = parseInt(GetProperty(c, 'height')) / c.height;
    if (e instanceof MouseEvent)
        if (Defined(e.offsetX))
            xy = { x: e.offsetX, y: e.offsetY };
        else {
            p = AbsPos(c.id);
            if (e.pageX)
                xy = { x: e.pageX - p.x, y: e.pageY - p.y };
        }
    if (xy && xmul && ymul) {
        xy.x /= xmul;
        xy.y /= ymul;
    }
    return xy;
}

export function NewCanvas(w: number, h: number): HTMLCanvasElement {
    let c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

export function EventToCanvasId(e: MouseEvent | TouchEvent) {
    if (e.target instanceof HTMLCanvasElement) {
        return e.target.id
    }
}

export function Shuffle(a: number[]) {
    let i: number = a.length - 1, t: number, p: number;
    while (i) {
        p = ~~(Math.random() * i);
        t = a[i];
        a[i] = a[p];
        a[p] = t;
        --i;
    }
}

export function AddHandler(h: string, f: EventListener, e?: HTMLElement | Document) {
    e = e || document;
    if (e.addEventListener) e.addEventListener(h, f, { passive: false });
}

export function RemoveHandler(h: string, f: EventListener, e?: HTMLElement | Document) {
    e = e || document;
    if (e.removeEventListener)
        e.removeEventListener(h, f);
}

export function tccall(f: string, id: string) {
    ACanvas.ac[id] && ACanvas.ac[id][f]();
}