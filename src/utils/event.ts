import ACanvas from "../a-canvas";
import { EventXY, XY, EventToCanvasId } from './utils'

export interface WheelEvent extends MouseEvent {
    wheelDelta: number
}

export function MouseOut(e: MouseEvent) {
    if (e.target instanceof HTMLCanvasElement) {
        let ac: ACanvas = ACanvas.ac[e.target.id];
        if (ac) {
            ac.mx = ac.my = -1;
            ac.UnFreeze();
            ac.EndDrag();
        }
    }
}

export function MouseMove(e: MouseEvent) {
    let t = ACanvas, ac: ACanvas, p: XY, tg = EventToCanvasId(e);
    for (let i in t.ac) {
        ac = t.ac[i];
    }
    if (tg && t.ac[tg]) {
        ac = t.ac[tg];
        if (p = EventXY(e, ac.canvas)) {
            ac.mx = p.x;
            ac.my = p.y;
            ac.Drag(p);
        }
        ac.drawn = 0;
    }
}

export function MouseDown(e: MouseEvent) {
    let t = ACanvas, cb = document.addEventListener ? 0 : 1,
        tg = EventToCanvasId(e);
    if (tg && e.button == cb && t.ac[tg]) {
        t.ac[tg].BeginDrag(e);
    }
}

export function MouseUp(e: MouseEvent) {
    let t = ACanvas, cb = document.addEventListener ? 0 : 1,
        tg = EventToCanvasId(e), ac: ACanvas;
    if (tg && e.button == cb && t.ac[tg]) {
        ac = t.ac[tg];
        MouseMove(e);
        if (!ac.EndDrag() && !ac.touchState)
            ac.Clicked();
    }
}

export function TouchDown(e: TouchEvent) {
    let tg = EventToCanvasId(e), ac = (tg && ACanvas.ac[tg]), p: XY;
    if (ac && e.changedTouches) {
        if (e.touches.length == 1 && ac.touchState == 0) {
            ac.touchState = 1;
            ac.BeginDrag(e);
            if (p = EventXY(e, ac.canvas)) {
                ac.mx = p.x;
                ac.my = p.y;
                ac.drawn = 0;
            }
        } else if (e.targetTouches.length == 2) {
            ac.touchState = 3;
            ac.EndDrag();
            ac.BeginPinch(e);
        } else {
            ac.EndDrag();
            ac.EndPinch();
            ac.touchState = 0;
        }
    }
}

export function TouchUp(e: TouchEvent) {
    let tg = EventToCanvasId(e), ac: ACanvas = (tg && ACanvas.ac[tg]);
    if (ac && e.changedTouches) {
        switch (ac.touchState) {
            case 1:
                ac.Draw();
                ac.Clicked();
                break;
            case 2:
                ac.EndDrag();
                break;
            case 3:
                ac.EndPinch();
        }
        ac.touchState = 0;
    }
}

export function TouchMove(e: TouchEvent) {
    let t = ACanvas, ac: ACanvas, p: XY, tg = EventToCanvasId(e);
    for (let i in t.ac) {
        ac = t.ac[i];
    }
    ac = (tg && t.ac[tg]);
    if (ac && e.changedTouches && ac.touchState) {
        switch (ac.touchState) {
            case 1:
            case 2:
                if (p = EventXY(e, ac.canvas)) {
                    ac.mx = p.x;
                    ac.my = p.y;
                    if (ac.Drag(p))
                        ac.touchState = 2;
                }
                break;
            case 3:
                ac.Pinch(e);
        }
        ac.drawn = 0;
    }
}

export function MouseWheel(e: WheelEvent) {
    let t = ACanvas, tg = EventToCanvasId(e);
    if (tg && t.ac[tg]) {
        e.cancelBubble = true;
        e.preventDefault && e.preventDefault();
        t.ac[tg].Wheel((e.wheelDelta || e.detail) > 0);
    }
}
