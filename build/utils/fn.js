let { min, max } = Math;
export function Defined(d) {
    return typeof d != 'undefined';
}
export function IsObject(o) {
    return typeof o == 'object' && o != null;
}
export function Clamp(v, mn, mx) {
    return isNaN(v) ? mx : min(mx, max(mn, v));
}
export function Nop() {
    return false;
}
export function TimeNow() {
    return new Date().valueOf();
}
export function SortList(l, f) {
    let nl = [], tl = l.length, i;
    for (i = 0; i < tl; ++i)
        nl.push(l[i]);
    nl.sort(f);
    return nl;
}
export function AbsPos(id) {
    let e = document.getElementById(id), r = e.getBoundingClientRect(), dd = document.documentElement, b = document.body, w = window, xs = w.pageXOffset || dd.scrollLeft, ys = w.pageYOffset || dd.scrollTop, xo = dd.clientLeft || b.clientLeft, yo = dd.clientTop || b.clientTop;
    return { x: r.left + xs - xo, y: r.top + ys - yo };
}
