const MinHeap = require("../data-structures/minHeap");

const heapSort = (arr: number[]) => {
  const minHeap = new MinHeap();
  const result = [];
  minHeap.buildHeap(arr);
  while (!minHeap.isEmpty()) {
    result.push(minHeap.dequeue().val);
  }
  return result;
};

export = heapSort;
