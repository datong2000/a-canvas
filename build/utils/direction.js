let { cos, sqrt, sin } = Math;
function Cylinder({ n, o, xr, yr, zr, m }) {
    let pts = [], off = 2 / n, inc, j, k, l;
    inc = Math.PI * (3 - sqrt(5) + (parseFloat(m) ? parseFloat(m) : 0));
    for (let i = 0; i < n; ++i) {
        j = i * off - 1 + (off / 2);
        k = cos(i * inc);
        l = sin(i * inc);
        pts.push(o ? [j * xr, k * yr, l * zr] : [k * xr, j * yr, l * zr]);
    }
    return pts;
}
function Ring({ n, o, xr, yr, zr, j }) {
    let pts = [], inc = Math.PI * 2 / n, k, l;
    for (let i = 0; i < n; ++i) {
        k = cos(i * inc);
        l = sin(i * inc);
        pts.push(o ? [j * xr, k * yr, l * zr] : [k * xr, j * yr, l * zr]);
    }
    return pts;
}
export function PointsOnSphere({ n, xr, yr, zr, m }) {
    let y, r, phi, pts = [], off = 2 / n, inc;
    inc = Math.PI * (3 - sqrt(5) + (parseFloat(m) ? parseFloat(m) : 0));
    for (let i = 0; i < n; ++i) {
        y = i * off - 1 + (off / 2);
        r = sqrt(1 - y * y);
        phi = i * inc;
        pts.push([cos(phi) * r * xr, y * yr, sin(phi) * r * zr]);
    }
    return pts;
}
export function PointsOnCylinderV({ n, xr, yr, zr, m }) { return Cylinder({ n, o: 0, xr, yr, zr, m }); }
export function PointsOnCylinderH({ n, xr, yr, zr, m }) { return Cylinder({ n, o: 1, xr, yr, zr, m }); }
export function PointsOnRingV({ n, xr, yr, zr, m }) {
    let j = Number(m);
    return Ring({ n, o: 0, xr, yr, zr, j });
}
export function PointsOnRingH({ n, xr, yr, zr, m }) {
    let j = Number(m);
    return Ring({ n, o: 1, xr, yr, zr, j });
}
