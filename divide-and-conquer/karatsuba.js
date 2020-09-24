"use strict";
const karatsuba = (x, y) => {
    // base case: x or y lenght equals to one... just multiply
    // using decimal base
    let n = Math.min(x.toString().length, y.toString().length);
    if (n === 1) {
        return x * y;
    }
    // slipt in half each number
    let m = Math.floor(n / 2);
    let halve = Math.pow(10, m);
    // splitting
    // e.g. 42 = 4 * 10 + 2
    // x1: left part, high order part => for 42 would be 4
    // x2 right part... would be 2 in this example
    let x1 = Math.floor(x / halve);
    let x2 = x % halve;
    let y1 = Math.floor(y / halve);
    let y2 = y % halve;
    // x * y = x1y1 * 10 ^(2*m) + ( x1y2B^(m) + x2y1B^(m)) + x2y2
    // a = x1y1
    // c = x2y2
    let a = karatsuba(x1, y1);
    let c = karatsuba(x2, y2);
    // b = (x1+x2)(y1+y2) - a -c
    let b = karatsuba(x1 + x2, y1 + y2) - a - c;
    let res = a * Math.pow(10, 2 * m) + b * Math.pow(10, m) + c;
    return res;
};
module.exports = karatsuba;
