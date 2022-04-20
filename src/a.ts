import Vector from './vector'
import Outline from './outline'
import ACanvas from './a-canvas'
import Matrix from './Matrix'
import { XYZ, Clamp } from './utils/fn'
import { FindTextBoundingBox } from './utils/utils'
let { max, sqrt } = Math

interface AType {
    ac: ACanvas
    text: string[]
    a: HTMLAnchorElement
    v: number[]
    w: number
    h: number
    col: string
    font: string
}

interface DrawText {
    c: CanvasRenderingContext2D
    xoff: number
    yoff: number
}

export default class A {
    v: AType
    line_widths: number[];
    position: Vector;
    x: number;
    y: number;
    z: number;
    colour: string;
    sc: number;
    alpha: number;
    outline: Outline;
    textHeight: number;
    Draw: (v: DrawText) => void | null
    xformed: XYZ | null
    constructor(v: AType) {
        this.v = v
        this.colour = v.col || v.ac.textColour;
        this.line_widths = [];
        this.position = new Vector({ x: v.v[0], y: v.v[1], z: v.v[2] });
        this.x = this.y = this.z = 0;
        this.sc = this.alpha = 1;
        this.outline = new Outline(v.ac);
        this.textHeight = v.h
        this.Draw = null
        this.xformed = null
    }

    Init() {
        this.Measure(this.v.ac.ctxt);
        this.SetDraw();
    }

    Measure(c: CanvasRenderingContext2D) {
        let extents = FindTextBoundingBox(this.v.text, this.textHeight),
            twidth: number, theight: number;
        theight = extents ? extents.max.y + extents.min.y : this.textHeight;
        c.font = this.v.font;
        twidth = this.MeasureText(c);
        this.v.h = theight;
        this.v.w = twidth;
    }

    MeasureText(c: CanvasRenderingContext2D): number {
        let i: number, l = this.v.text.length, w: number = 0, wl: number;
        for (i = 0; i < l; ++i) {
            this.line_widths[i] = wl = c.measureText(this.v.text[i]).width;
            w = max(w, wl);
        }
        return w;
    }

    SetDraw() {
        this.Draw = this.DrawText;
    }

    DrawText(v: DrawText) {
        let x = this.x, y = this.y, s = this.sc, i: number, xl: number;
        v.c.globalAlpha = this.alpha;
        v.c.fillStyle = this.colour;
        v.c.font = this.v.font;
        x += v.xoff / s;
        y += (v.yoff / s) + sqrt(this.textHeight);
        for (i = 0; i < this.v.text.length; ++i) {
            xl = x;
            xl -= this.line_widths[i] / 2;
            v.c.setTransform(s, 0, 0, s, s * xl, s * y);
            v.c.fillText(this.v.text[i], 0, 0);
            y += this.textHeight;
        }
    }

    Calc(m: Matrix, a: number): XYZ {
        let pp: XYZ, t = this.v.ac, mnb = t.minBrightness,
            mxb = t.maxBrightness, r = t.max_radius;
        pp = m.xform(this.position);
        this.xformed = pp;
        pp = this.project(t, pp, t.stretchX, t.stretchY)
        this.x = pp.x;
        this.y = pp.y;
        this.z = pp.z;
        this.sc = pp.w;
        this.alpha = a * Clamp(mnb + (mxb - mnb) * (r - this.z) / (2 * r), 0, 1);
        return this.xformed;
    }

    project(ac: ACanvas, p1: XYZ, sx: number, sy: number): XYZ {
        let m = ac.radius * ac.z1 / (ac.z1 + ac.z2 + p1.z);
        return {
            x: p1.x * m * sx,
            y: p1.y * m * sy,
            z: p1.z,
            w: (ac.z1 - p1.z) / ac.z2
        };
    }

    UpdateActive(xoff: number, yoff: number): Outline {
        let o = this.outline, w = this.v.w, h = this.v.h,
            x = this.x - w / 2, y = this.y - h / 2;
        o.Update({ x, y, w, h, sc: this.sc, z: this.z, xo: xoff, yo: yoff });
        return o;
    }

    CheckActive(xoff: number, yoff: number): Outline | null {
        let t = this.v.ac, o = this.UpdateActive(xoff, yoff);
        return o.Active(t.mx, t.my) ? o : null;
    }

    Clicked() {
        let a = this.v.a, t = a.target, h = a.href, evt: Event;
        if (t != '' && t != '_self') {
            if (window.frames[t]) window.frames[t].document.location = h;
            else window.open(h, t);
            return;
        }
        evt = new Event('click')
        a.addEventListener('click', null, { once: true });
        if (!a.dispatchEvent(evt)) return;
        document.location = h;
    }
}