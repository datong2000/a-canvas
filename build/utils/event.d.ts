export interface WheelEvent extends MouseEvent {
    wheelDelta: number;
}
export declare function MouseOut(e: MouseEvent): void;
export declare function MouseMove(e: MouseEvent): void;
export declare function MouseDown(e: MouseEvent): void;
export declare function MouseUp(e: MouseEvent): void;
export declare function TouchDown(e: TouchEvent): void;
export declare function TouchUp(e: TouchEvent): void;
export declare function TouchMove(e: TouchEvent): void;
export declare function MouseWheel(e: WheelEvent): void;
