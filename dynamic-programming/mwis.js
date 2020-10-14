"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optS = exports.mwis = void 0;
exports.mwis = (w) => {
    const arr = {};
    arr[-1] = 0;
    arr[0] = 0;
    arr[1] = w[0];
    for (let i = 2; i < w.length; i++) {
        arr[i] = Math.max(arr[i - 1], arr[i - 2] + w[i - 1]);
    }
    return arr;
};
exports.optS = (w, arr) => {
    const s = Array.from({ length: w.length }, () => 0);
    let i = s.length;
    while (i >= 1) {
        if (arr[i - 1] >= arr[i - 2] + w[i - 1]) {
            //CASE 1: vn is not in S
            i = i - 1;
        }
        else {
            //CASE 2: vn is in S
            s[i] = 1;
            i = i - 2;
        }
    }
    return s;
};
