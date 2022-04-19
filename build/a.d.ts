import Vector from './vector';
import Outline from './outline';
import ACanvas from './a-canvas';
import Matrix from './Matrix';
import { XYZ } from './utils/fn';
interface AType {
    ac: ACanvas;
    text: string[];
    a: HTMLAnchorElement;
    v: number[];
    w: number;
    h: number;
    col: string;
    font: string;
}
interface DrawText {
    c: CanvasRenderingContext2D;
    xoff: number;
    yoff: number;
}
export default class A {
    v: AType;
    line_widths: number[];
    position: Vector;
    x: number;
    y: number;
    z: number;
    colour: string;
    textFont: string;
    sc: number;
    alpha: number;
    outline: Outline;
    textHeight: number;
    Draw: (v: DrawText) => void | null;
    xformed: XYZ | null;
    constructor(v: AType);
    Init(): void;
    Measure(c: CanvasRenderingContext2D): void;
    MeasureText(c: CanvasRenderingContext2D): number;
    SetDraw(): void;
    DrawText(v: DrawText): void;
    SetFont(f: string, c: string): void;
    Calc(m: Matrix, a: number): XYZ;
    project(ac: ACanvas, p1: XYZ, sx: number, sy: number): XYZ;
    UpdateActive(xoff: number, yoff: number): Outline;
    CheckActive(xoff: number, yoff: number): Outline | null;
    Clicked(): void;
}
export {};
