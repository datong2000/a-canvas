import { XYZ } from './utils/fn'

let { sin, cos, sqrt, acos, PI } = Math

export default class Vector {
    x: number
    y: number
    z: number
    constructor(v: XYZ) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
    }

    length(): number {
        return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(v: XYZ): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: XYZ): Vector {
        let x = this.y * v.z - this.z * v.y,
            y = this.z * v.x - this.x * v.z,
            z = this.x * v.y - this.y * v.x;
        return new Vector({ x, y, z });
    }

    angle(v: Vector): number {
        let dot = this.dot(v), ac: number;
        if (dot == 0)
            return PI / 2.0;
        ac = dot / (this.length() * v.length());
        if (ac >= 1)
            return 0;
        if (ac <= -1)
            return PI;
        return acos(ac);
    }

    unit(): Vector {
        var l = this.length();
        return new Vector({ x: this.x / l, y: this.y / l, z: this.z / l });
    }
}

export function MakeVector(lg: number, lt: number): Vector {
    lt = lt * PI / 180;
    lg = lg * PI / 180;
    let x = sin(lg) * cos(lt), y = -sin(lt), z = -cos(lg) * cos(lt);
    return new Vector({ x, y, z });
}