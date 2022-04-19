import { FixFont, Clamp, GetProperty, SortList, EventXY, XY, AddHandler, RemoveHandler, Shuffle, tccall } from './utils/utils'
import { Defined, TimeNow, Nop, IsObject } from './utils/fn'
import { MouseOut, MouseMove, MouseDown, MouseUp, TouchDown, TouchUp, TouchMove, MouseWheel, WheelEvent } from './utils/event'
import { RingType, PointsOnSphere, PointsOnCylinderV, PointsOnCylinderH, PointsOnRingV, PointsOnRingH } from './utils/direction'
import { option } from './utils/init'
import Matrix, { Identity, Rotation } from './Matrix'
import TextSplitter from './text-splitter'
import Tag from './a'
import Vector, { MakeVector } from './vector'
import Outline from './outline'

interface TagCanvasType {
    id: string
    tagId: string
    opt: object
}

interface RotateTagType {
    active: boolean
    callback: (ACanvas?: ACanvas, Tag?: Tag) => void
    id?: string
    tag?: Tag
    lat?: number
    lng?: number
    time: number
}

interface fixedAnimType {
    tag: Tag
    t?: number
    cb?: (ACanvas?: ACanvas, Tag?: Tag) => void
    active?: boolean
    angle?: number
    axis?: Vector
    t0?: number
    transform?: Matrix | undefined
    type?: number
}

interface NewableFunction extends Function {
    sphere?: ({ n, xr, yr, zr, m }: RingType) => number[][]
    vcylinder?: ({ n, xr, yr, zr, m }: RingType) => number[][]
    hcylinder?: ({ n, xr, yr, zr, m }: RingType) => number[][]
    vring?: ({ n, xr, yr, zr, j }: RingType) => number[][]
    hring?: ({ n, xr, yr, zr, j }: RingType) => number[][]
}

type HandleMouseEvent = (e: MouseEvent) => void
type HandleTouchEvent = (e: TouchEvent) => void
type HandleWheelEvent = (e: WheelEvent) => void

let { min, max, cos, sqrt, sin, ceil, abs, pow } = Math

export default class ACanvas {

    offsetX: number
    offsetY: number
    zoomMin: number
    zoomMax: number
    frontSelect: string
    zoomStep: number
    wheelZoom: boolean
    dragThreshold: number
    textColour: string
    textFont: string
    textHeight: number
    minBrightness: number
    maxBrightness: number
    stretchX: number
    stretchY: number
    z1: number
    z2: number
    z0: number
    lock: string
    dragControl: boolean
    hideTags: boolean
    interval: number
    reverse: boolean
    maxSpeed: number
    minSpeed: number
    radiusX: number
    radiusY: number
    radiusZ: number
    zoom: number
    initial: number[]
    shape: string | NewableFunction
    depth: number

    ctxt: CanvasRenderingContext2D
    max_radius: number
    radius: number
    mx: number
    my: number
    canvas: HTMLCanvasElement
    lx: number
    ly: number
    frozen: number
    dx: number
    dy: number
    fixedAnim: fixedAnimType
    touchState: number
    fixedAlpha: number
    source: string
    transform: Matrix
    Animate: (w: number, h: number, t: number) => void
    animTiming: (t: number, t0: number) => number
    started: number
    yaw: number
    pitch: number
    shapeArgs: RingType
    taglist: Tag[]
    listLength: number
    freezeDecel: boolean
    freezeActive: boolean
    activeCursor: string
    decel: number
    fixedCallbackTag: Tag
    fixedCallback: (ACanvas?: ACanvas, Tag?: Tag) => void | null
    preFreeze: number[]
    drawn: number | boolean
    active: Outline | null
    time: number
    down: XY
    dragging: number | null
    pinched: number[]

    static ac: {
        [key: string]: ACanvas
    } = {}

    static handlers: {
        [key: string]: Array<[string, HandleMouseEvent | HandleTouchEvent | HandleWheelEvent]>
    } = {}

    static options = option
    static interval: number

    static nextFrame: (interval: number) => void = null

    static start(id: TagCanvasType['id'], tagId: TagCanvasType['tagId'], opt: TagCanvasType['opt']) {
        ACanvas.delete(id);
        ACanvas.ac[id] = new ACanvas({ id, tagId, opt });
        console.log(ACanvas.handlers);

    }

    static delete(id: string) {
        if (ACanvas.handlers[id] != undefined) {
            let c = document.getElementById(id);
            if (c) {
                for (let i = 0; i < ACanvas.handlers[id].length; ++i)
                    RemoveHandler(ACanvas.handlers[id][i][0], ACanvas.handlers[id][i][1], c);
            }
            delete ACanvas.handlers[id];
            delete ACanvas.ac[id];
        }
    }

    static reload(id: string) { tccall('Load', id); };
    static update(id: string) { tccall('Update', id); };

    static setSpeed(id: string, speed: number[]): boolean {
        if (IsObject(speed) && ACanvas.ac[id] &&
            !isNaN(speed[0]) && !isNaN(speed[1])) {
            ACanvas.ac[id].SetSpeed(speed);
            return true;
        }
        return false;
    }

    static tagToFront(id: string, options: RotateTagType) {
        if (!IsObject(options)) return false;
        options.lat = options.lng = 0;
        return ACanvas.rotateTag(id, options);
    }

    static rotateTag(id: string, options: RotateTagType): boolean {
        if (IsObject(options) && ACanvas.ac[id]) {
            if (isNaN(options.time)) options.time = 500;
            let tag = ACanvas.ac[id].FindTag(options);
            let { lat, lng, time, callback, active } = options
            if (tag) {
                ACanvas.ac[id].RotateTag({ tag, lat, lng, time, callback, active });
                return true;
            }
        }
        return false
    }

    static drawCanvasRAF(time: number) {
        let ac = ACanvas.ac;
        ACanvas.nextFrame(ACanvas.interval);
        for (let i in ac) ac[i].Draw(time || TimeNow());
    }

    NextFrameRAF() {
        requestAnimationFrame(ACanvas.drawCanvasRAF);
    }

    constructor(v: TagCanvasType) {
        for (let i in ACanvas.options) {
            this[i] = (v.opt && Defined(v.opt[i]) ? v.opt[i] :
                (Defined(ACanvas[i]) ? ACanvas[i] : ACanvas.options[i]))
        }
        let c = <HTMLCanvasElement>document.getElementById(v.id)
        if (!c || !c.getContext || !c.getContext('2d').fillText) throw '请使用正确的canvas元素';
        this.shapeArgs = { n: 0, xr: 0, yr: 0, zr: 0 }
        this.started = 0
        this.canvas = c
        this.ctxt = (document.getElementById(v.id) as HTMLCanvasElement).getContext('2d')
        this.z1 = min(c.height, c.width) / max(this.depth, 0.001);
        this.z2 = this.z1 / this.zoom;
        this.radius = min(c.clientHeight, c.clientWidth) * 0.0075
        this.max_radius = 100;
        this.textFont = this.textFont && FixFont(this.textFont);
        this.mx = this.my = -1;
        this.minBrightness = Clamp(this.minBrightness, 0, 1);
        this.maxBrightness = Clamp(this.maxBrightness, this.minBrightness, 1);
        this.lx = (this.lock + '').indexOf('x') + 1;
        this.ly = (this.lock + '').indexOf('y') + 1;
        this.fixedAnim = { tag: null }
        this.frozen = this.dx = this.dy = this.fixedAnim.type = this.touchState = 0;
        this.fixedAlpha = 1;
        this.source = v.tagId || v.id;
        this.transform = Identity();
        this.mx = this.my = -1;
        this.Animate = this.dragControl ? this.AnimateDrag : this.AnimatePosition;
        this.animTiming = this.Smooth
        this.Load();

        if (v.tagId && this.hideTags) {
            this.HideTags();
        }

        this.yaw = this.initial ? this.initial[0] * this.maxSpeed : 0;
        this.pitch = this.initial ? this.initial[1] * this.maxSpeed : 0;

        if (!ACanvas.handlers[v.id]) {
            ACanvas.handlers[v.id] = [
                ['mousemove', MouseMove],
                ['mouseout', MouseOut],
                ['mouseup', MouseUp],
                ['touchstart', TouchDown],
                ['touchend', TouchUp],
                ['touchcancel', TouchUp],
                ['touchmove', TouchMove]
            ];
            if (this.dragControl) {
                ACanvas.handlers[v.id].push(['mousedown', MouseDown]);
                ACanvas.handlers[v.id].push(['selectstart', Nop]);
            }
            if (this.wheelZoom) {
                ACanvas.handlers[v.id].push(['mousewheel', MouseWheel]);
                ACanvas.handlers[v.id].push(['DOMMouseScroll', MouseWheel]);
            }
            for (let i = 0; i < ACanvas.handlers[v.id].length; ++i) {
                let p = ACanvas.handlers[v.id][i];
                AddHandler(p[0], p[1], c);
            }
        }

        if (!this.started) {
            ACanvas.nextFrame = this.NextFrameRAF
            ACanvas.interval = this.interval;
            ACanvas.nextFrame(ACanvas.interval);
            this.started = 1;
        }
    }

    HideTags() {
        let el: NodeListOf<HTMLElement> = document.querySelectorAll(this.source);
        for (let i = 0; i < el.length; ++i) el[i].style.display = 'none';
    }

    GetTags(): Element[] {
        let el: NodeListOf<HTMLElement> = document.querySelectorAll(this.source), etl: HTMLCollection, tl: Element[] = [];
        for (let i = 0; i < el.length; ++i) {
            etl = el[i].getElementsByTagName('a');
            for (let j = 0; j < etl.length; ++j) {
                tl.push(etl[j]);
            }
        }
        return tl;
    }

    CreateTag(a: HTMLAnchorElement): Tag {
        let t: Tag, text: string[], ts: TextSplitter, font: string, p = [0, 0, 0];
        ts = new TextSplitter(a);
        text = ts.Lines(a);
        if (!ts.Empty()) {
            font = this.textFont || FixFont(GetProperty(a, 'font-family'));
        } else {
            ts = null;
        }
        if (ts) {
            t = new Tag({
                ac: this, text, a, v: p, w: 2, h: this.textHeight,
                col: this.textColour || GetProperty(a, 'color'), font
            });
            t.Init();
            return t;
        }
    }

    Draw(t?: number) {
        let cv = this.canvas, cw = cv.width, ch = cv.height, max_sc = 0,
            tdelta = (t - this.time) * ACanvas.interval / 1000,
            x = cw / 2 + this.offsetX, y = ch / 2 + this.offsetY, c = this.ctxt,
            active: Outline, a: boolean | Outline, i: number,
            tl = this.taglist, l = tl.length, cursor = '', frontsel = this.frontSelect, fixed: boolean;
        this.time = t;
        if (this.frozen && this.drawn)
            return this.Animate(cw, ch, tdelta);
        fixed = this.AnimateFixed();
        c.setTransform(1, 0, 0, 1, 0, 0);
        for (i = 0; i < l; ++i) {
            tl[i].Calc(this.transform, this.fixedAlpha);
        }
        tl = SortList(tl, function (a, b) { return b.z - a.z });
        if (fixed && this.fixedAnim.active) {
            active = this.fixedAnim.tag.UpdateActive(x, y);
        } else {
            this.active = null;
            for (i = 0; i < l; ++i) {
                a = this.mx >= 0 && this.my >= 0 && this.taglist[i].CheckActive(x, y);
                if (a && a.sc > max_sc && (!frontsel || a.z <= 0)) {
                    active = a;
                    active.tag = this.taglist[i];
                    max_sc = a.sc;
                }
            }
            this.active = active;
        }
        c.clearRect(0, 0, cw, ch);
        for (i = 0; i < l; ++i) {
            if (!(false)) {
                tl[i].Draw({ c, xoff: x, yoff: y });
            }
            active && active.tag == tl[i] && false;
        }
        if (this.freezeActive && active) {
            this.Freeze();
        } else {
            this.UnFreeze();
            this.drawn = (l == this.listLength);
        }
        if (this.fixedCallback != null) {
            this.fixedCallback(this, this.fixedCallbackTag);
            this.fixedCallback = null;
        }
        fixed || this.Animate(cw, ch, tdelta);
        if (active) {
            cursor = this.activeCursor;
        }
        cv.style.cursor = cursor;
    }

    Transform(p: number, y: number) {
        if (p || y) {
            let sp = sin(p), cp = cos(p), sy = sin(y), cy = cos(y),
                ym = new Matrix([cy, 0, sy, 0, 1, 0, -sy, 0, cy]),
                pm = new Matrix([1, 0, 0, 0, cp, -sp, 0, sp, cp]);
            this.transform = this.transform.mul(ym.mul(pm));
        }
    }

    AnimateFixed(): boolean {
        if (this.fixedAnim.type) {
            let t1: number, angle = this.fixedAnim.angle;
            if (!this.fixedAnim.transform) this.fixedAnim.transform = this.transform;
            t1 = TimeNow() - this.fixedAnim.t0;
            this.transform = this.fixedAnim.transform;
            if (t1 >= this.fixedAnim.t) {
                this.fixedCallbackTag = this.fixedAnim.tag;
                this.fixedCallback = this.fixedAnim.cb;
                this.fixedAnim.type = this.yaw = this.pitch = 0;
            } else {
                this.fixedAnim.type = 1
                angle *= this.animTiming(this.fixedAnim.t, t1);
            }
            this.transform = this.transform.mul(Rotation(angle, this.fixedAnim.axis));
            return (this.fixedAnim.type != 0);
        }
        return false
    }

    AnimatePosition(w: number, h: number, t: number) {
        let ac = this, x = ac.mx, y = ac.my, s: number, r: number;
        if (!ac.frozen && x >= 0 && y >= 0 && x < w && y < h) {
            s = ac.maxSpeed, r = ac.reverse ? -1 : 1;
            ac.lx || (ac.yaw = ((x * 2 * s / w) - s) * r * t);
            ac.ly || (ac.pitch = ((y * 2 * s / h) - s) * -r * t);
            ac.initial = null;
        } else if (!ac.initial) {
            if (ac.frozen && !ac.freezeDecel)
                ac.yaw = ac.pitch = 0;
            else
                ac.Decel(ac);
        }
        this.Transform(ac.pitch, ac.yaw);
    }

    AnimateDrag(_w: number, _h: number, t: number) {
        let ac = this, rs = 100 * t * ac.maxSpeed / ac.max_radius / ac.zoom;
        if (ac.dx || ac.dy) {
            ac.lx || (ac.yaw = ac.dx * rs / ac.stretchX);
            ac.ly || (ac.pitch = ac.dy * -rs / ac.stretchY);
            ac.dx = ac.dy = 0;
            ac.initial = null;
        } else if (!ac.initial) {
            ac.Decel(ac);
        }
        this.Transform(ac.pitch, ac.yaw);
    }

    Freeze() {
        if (!this.frozen) {
            this.preFreeze = [this.yaw, this.pitch];
            this.frozen = 1;
            this.drawn = 0;
        }
    }

    UnFreeze() {
        if (this.frozen) {
            this.yaw = this.preFreeze[0];
            this.pitch = this.preFreeze[1];
            this.frozen = 0;
        }
    }

    Decel(ac: ACanvas) {
        let s = ac.minSpeed, ay = abs(ac.yaw), ap = abs(ac.pitch);
        if (!ac.lx && ay > s)
            ac.yaw = ay > ac.z0 ? ac.yaw * ac.decel : 0;
        if (!ac.ly && ap > s)
            ac.pitch = ap > ac.z0 ? ac.pitch * ac.decel : 0;
    }

    Zoom(r: number) {
        this.z2 = this.z1 * (1 / r);
        this.drawn = 0;
    }

    Clicked() {
        if (this.active && this.active.tag)
            this.active.tag.Clicked();
    }

    Wheel(i: boolean) {
        let z = this.zoom + this.zoomStep * (i ? 1 : -1);
        this.zoom = min(this.zoomMax, max(this.zoomMin, z));
        this.Zoom(this.zoom);
    }

    BeginDrag(e: MouseEvent | TouchEvent) {
        this.down = EventXY(e, this.canvas);
        e.cancelBubble = true;
        e.preventDefault && e.preventDefault();
    }

    Drag(p: XY): number {
        if (this.dragControl && this.down) {
            let t2 = this.dragThreshold * this.dragThreshold,
                dx = p.x - this.down.x, dy = p.y - this.down.y;
            if (this.dragging || dx * dx + dy * dy > t2) {
                this.dx = dx;
                this.dy = dy;
                this.dragging = 1;
                this.down = p;
            }
        }
        return this.dragging;
    }

    EndDrag(): number {
        let res = this.dragging;
        this.dragging = this.down = null;
        return res;
    }

    PinchDistance(e: TouchEvent): number {
        let t1 = e.targetTouches[0], t2 = e.targetTouches[1];
        return sqrt(pow(t2.pageX - t1.pageX, 2) + pow(t2.pageY - t1.pageY, 2));
    }

    BeginPinch(e: TouchEvent) {
        this.pinched = [this.PinchDistance(e), this.zoom];
        e.preventDefault && e.preventDefault();
    }

    Pinch(e: TouchEvent) {
        let z: number, d: number, p = this.pinched;
        if (!p)
            return;
        d = this.PinchDistance(e);
        z = p[1] * d / p[0];
        this.zoom = min(this.zoomMax, max(this.zoomMin, z));
        this.Zoom(this.zoom);
    }

    EndPinch() {
        this.pinched = null;
    }

    SetSpeed(i: number[]) {
        this.initial = i;
        this.yaw = i[0] * this.maxSpeed;
        this.pitch = i[1] * this.maxSpeed;
    }

    FindTag(t: RotateTagType): Tag {
        if (!Defined(t))
            return null;
        let srch: string, tid: string, i: number;
        if (Defined(t.id))
            srch = 'id', tid = t.id;
        for (i = 0; i < this.taglist.length; ++i)
            if (this.taglist[i].v.a[srch] == tid)
                return this.taglist[i];
    }

    RotateTag({ tag, lat, lng, time, callback, active }: RotateTagType) {
        let t = tag.Calc(this.transform, 1), v1 = new Vector({ x: t.x, y: t.y, z: t.z }),
            v2 = MakeVector(lng, lat), angle = v1.angle(v2), u = v1.cross(v2).unit();
        if (angle == 0) {
            this.fixedCallbackTag = tag;
            this.fixedCallback = callback;
        } else {
            this.fixedAnim = {
                angle: -angle,
                axis: u,
                t: time,
                t0: TimeNow(),
                cb: callback,
                tag: tag,
                active: active,
                type: 1
            };
        }
    }

    Load() {
        let tl = this.GetTags(), taglist: Tag[] = [], shape: string, t: Tag,
            shapeArgs: string[], xr: number, yr: number, zr: number, vl: Array<number[]>, i: number, tagmap: number[] = [],
            pfuncs = {
                sphere: PointsOnSphere,
                vcylinder: PointsOnCylinderV,
                hcylinder: PointsOnCylinderH,
                vring: PointsOnRingV,
                hring: PointsOnRingH
            };
        if (tl.length) {
            tagmap.length = tl.length;
            for (i = 0; i < tl.length; ++i)
                tagmap[i] = i;
            Shuffle(tagmap);
            xr = 100 * this.radiusX;
            yr = 100 * this.radiusY;
            zr = 100 * this.radiusZ;
            this.max_radius = max(xr, max(yr, zr));
            for (i = 0; i < tl.length; ++i) {
                t = this.CreateTag(tl[tagmap[i]] as HTMLAnchorElement);
                if (t) taglist.push(t);
            }
            if (this.shapeArgs.n) {
                this.shapeArgs.n = taglist.length;
            } else {
                shapeArgs = this.shape.toString().split(/[(),]/);
                shape = shapeArgs.shift();
                this.shape = pfuncs[shape] || pfuncs.sphere;
                this.shapeArgs = {
                    n: taglist.length,
                    xr,
                    yr,
                    zr,
                    m: shape
                }
            }
            if (typeof this.shape != 'string')
                vl = this.shape({ ...this.shapeArgs });
            this.listLength = taglist.length;
            for (i = 0; i < taglist.length; ++i)
                taglist[i].position = new Vector({ x: vl[i][0], y: vl[i][1], z: vl[i][2] });
        }
        this.taglist = taglist;
    }

    Update() {
        let tl = this.GetTags(), newlist: Tag[] = [],
            taglist = this.taglist,
            added: string[] = [], removed: number[] = [], vl: Array<number[]>, ol: number, nl: number, i: number, j: number;
        if (!this.shapeArgs) return this.Load();
        if (tl.length) {
            nl = this.listLength = tl.length;
            ol = taglist.length;
            for (i = 0; i < ol; ++i) {
                newlist.push(taglist[i]);
                removed.push(i);
            }
            for (i = 0, j = 0; i < ol; ++i) {
                if (removed[j] == -1)
                    removed.splice(j, 1);
                else
                    ++j;
            }
            j = newlist.length / (added.length + 1);
            i = 0;
            while (added.length) {
                newlist.splice(ceil(++i * j), 0, this.CreateTag(tl[added.shift()] as HTMLAnchorElement));
            }
            this.shapeArgs[0] = nl = newlist.length;
            if (typeof this.shape != 'string')
                vl = this.shape.apply(this, this.shapeArgs);

            for (i = 0; i < nl; ++i)
                newlist[i].position = new Vector({ x: vl[i][0], y: vl[i][1], z: vl[i][2] });
        }
        this.taglist = newlist;
    }

    Smooth(t: number, t0: number): number { return 0.5 - cos(t0 * Math.PI / t) / 2; }

}