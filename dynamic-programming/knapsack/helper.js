"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArr = void 0;
const fs_1 = __importDefault(require("fs"));
exports.createArr = (file) => {
    const data = fs_1.default.readFileSync(file, {
        encoding: "utf8",
        flag: "r",
    });
    let l = true;
    let c = -Infinity;
    let line = "";
    let split = [];
    const arr = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            if (l) {
                split = line.trim().split(" ");
                c = parseInt(split[0]);
                l = false;
                line = "";
            }
            else {
                split = line.trim().split(" ");
                const item = {
                    value: parseInt(split[0]),
                    weight: parseInt(split[1]),
                };
                arr.push(item);
                line = "";
            }
        }
    }
    if (line.trim() !== "") {
        split = line.trim().split(" ");
        const item = {
            value: parseInt(split[0]),
            weight: parseInt(split[1]),
        };
        arr.push(item);
    }
    return [arr, c];
};
