"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
// Returns an array of jobs from test file
const readTest = (file) => {
    const data = fs_1.default.readFileSync(file, { encoding: "utf8", flag: "r" });
    let line = "";
    let split = [];
    const arr = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            split = line.split(" ");
            arr.push({ w: parseInt(split[0]), l: parseInt(split[1]) });
            line = "";
        }
    }
    return arr;
};
module.exports = readTest;
