"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArr = void 0;
const fs_1 = __importDefault(require("fs"));
// Returns a random number between [min,max)
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
// create a test set for the scheduling problem
// input: n is the number of Intervals (start,finish,value)
//        s: the max val of any start time an Interval can have, s in [0,w]
//        f: the max val of any finsish time an Interval can have, f in [0,w]
//        v: the max val of any value an Interval can have, v in [0,w]
const create = (n, s, f, v, fileName) => {
    let data = "";
    for (let i = 0; i < n; i++) {
        const st = random(0, s);
        let ft = random(st, f);
        if (ft === st)
            ft = ft + 1;
        data += `${st} ${ft} ${random(1, v)}\n`;
    }
    fs_1.default.writeFileSync(fileName, data);
};
exports.createArr = (file) => {
    const data = fs_1.default.readFileSync(file, {
        encoding: "utf8",
        flag: "r",
    });
    let line = "";
    let split = [];
    const arr = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            split = line.trim().split(" ");
            const inter = {
                s: parseInt(split[0]),
                f: parseInt(split[1]),
                v: parseInt(split[2]),
                p: 0,
            };
            arr.push(inter);
            line = "";
        }
    }
    if (line.trim() !== "") {
        split = line.trim().split(" ");
        const inter = {
            s: parseInt(split[0]),
            f: parseInt(split[1]),
            v: parseInt(split[2]),
            p: 0,
        };
        arr.push(inter);
    }
    return arr;
};
create(100000, 23, 24, 100, "test2.txt");
