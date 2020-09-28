"use strict";
const MinHeap = require("../data-structures/minHeap");
const heapSort = (arr) => {
    const minHeap = new MinHeap();
    const result = [];
    minHeap.buildHeap(arr);
    while (!minHeap.isEmpty()) {
        result.push(minHeap.dequeue().val);
    }
    return result;
};
module.exports = heapSort;
