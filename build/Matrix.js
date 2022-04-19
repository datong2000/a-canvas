let { sin, pow, cos } = Math;
export function Identity() {
    return new Matrix([1, 0, 0, 0, 1, 0, 0, 0, 1]);
}
export function Rotation(angle, v) {
    let sina = sin(angle), cosa = cos(angle), mcos = 1 - cosa;
    return new Matrix([
        cosa + pow(v.x, 2) * mcos, v.x * v.y * mcos - v.z * sina, v.x * v.z * mcos + v.y * sina,
        v.y * v.x * mcos + v.z * sina, cosa + pow(v.y, 2) * mcos, v.y * v.z * mcos - v.x * sina,
        v.z * v.x * mcos - v.y * sina, v.z * v.y * mcos + v.x * sina, cosa + pow(v.z, 2) * mcos
    ]);
}
export default class Matrix {
    constructor(v) {
        this[1] = { 1: v[0], 2: v[1], 3: v[2] };
        this[2] = { 1: v[3], 2: v[4], 3: v[5] };
        this[3] = { 1: v[6], 2: v[7], 3: v[8] };
    }
    mul(m) {
        let v = [], i, j;
        for (i = 1; i <= 3; ++i)
            for (j = 1; j <= 3; ++j) {
                v.push(this[i][1] * m[1][j] +
                    this[i][2] * m[2][j] +
                    this[i][3] * m[3][j]);
            }
        return new Matrix(v);
    }
    xform(v) {
        let value = { x: null, y: null, z: null }, x = v.x, y = v.y, z = v.z;
        value.x = x * this[1][1] + y * this[2][1] + z * this[3][1];
        value.y = x * this[1][2] + y * this[2][2] + z * this[3][2];
        value.z = x * this[1][3] + y * this[2][3] + z * this[3][3];
        return value;
    }
}
