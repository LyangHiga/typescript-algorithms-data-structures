"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = __importDefault(require("../../data-structures/graph/graph"));
const test = (file) => {
    const g = graph_1.default.createDirected(file, true, false);
    const rg = g.fordFulkerson("s", "t");
    if (rg) {
        rg.print();
    }
};
test("test.txt");
