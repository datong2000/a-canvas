
import { TimeNow } from './utils/fn'
import A from './a'

interface Update<T> {
    x: T
    y: T
    w: T
    h: T
    sc: T
    z: T
    xo: T
    yo: T
}

export default class Outline {
    ts: number | null;
    ac: {
        textHeight?: number
    };
    x: number;
    y: number;
    w: number;
    h: number;
    sc: number;
    z: number;
    tag: A

    constructor(ac: object) {
        this.ac = ac;
        this.ts = null;
        this.tag = undefined
        this.x = this.y = this.w = this.h = this.sc = 1;
        this.z = 0;
    }

    Update(v: Update<number>) {
        let o2 = this.ac.textHeight, o = o2 / 2;
        this.x = v.sc * v.x + v.xo - o;
        this.y = v.sc * v.y + v.yo - o;
        this.w = v.sc * v.w + o2;
        this.h = v.sc * v.h + o2;
        this.sc = v.sc;
        this.z = v.z;
    }

    Active(x: number, y: number): boolean {
        let a: boolean = (x >= this.x && y >= this.y &&
            x <= this.x + this.w && y <= this.y + this.h);
        if (a) {
            this.ts = this.ts || TimeNow();
        } else {
            this.ts = null;
        }
        return a;
    }
}