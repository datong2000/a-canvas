import { TimeNow } from './utils/fn';
export default class Outline {
    ts;
    ac;
    x;
    y;
    w;
    h;
    sc;
    z;
    tag;
    constructor(ac) {
        this.ac = ac;
        this.ts = null;
        this.tag = undefined;
        this.x = this.y = this.w = this.h = this.sc = 1;
        this.z = 0;
    }
    Update(v) {
        let o2 = this.ac.textHeight, o = o2 / 2;
        this.x = v.sc * v.x + v.xo - o;
        this.y = v.sc * v.y + v.yo - o;
        this.w = v.sc * v.w + o2;
        this.h = v.sc * v.h + o2;
        this.sc = v.sc;
        this.z = v.z;
    }
    Active(x, y) {
        let a = (x >= this.x && y >= this.y &&
            x <= this.x + this.w && y <= this.y + this.h);
        if (a) {
            this.ts = this.ts || TimeNow();
        }
        else {
            this.ts = null;
        }
        return a;
    }
}
