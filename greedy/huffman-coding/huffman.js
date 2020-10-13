"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const huffmanNode_1 = __importDefault(require("./huffmanNode"));
const minHeap_1 = __importDefault(require("../../data-structures/heaps/minHeap"));
const huffman = (arr) => {
    let heap = new minHeap_1.default();
    const p = new Map();
    for (let i = 0; i < arr.length; i++) {
        const z = new huffmanNode_1.default(i.toString(), arr[i]);
        p.set(i.toString(), z);
        heap.enqueue(i.toString(), arr[i]);
    }
    let max = 0;
    let min = Infinity;
    for (let i = 0; i < arr.length - 1; i++) {
        const node = new huffmanNode_1.default((i + arr.length).toString(), arr[i]);
        const x = heap.dequeue();
        node.left = p.get(x.key);
        const y = heap.dequeue();
        node.right = p.get(y.key);
        max = Math.max(node.left.height, node.right.height);
        min = Math.min(node.left.min, node.right.min);
        node.f = node.left.f + node.right.f;
        node.height = max + 1;
        node.min = min + 1;
        p.set(node.key, node);
        heap.enqueue(node.key, node.f);
    }
    return p.get(heap.dequeue().key);
};
module.exports = huffman;
