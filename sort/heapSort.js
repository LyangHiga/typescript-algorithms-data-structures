const { performance } = require('perf_hooks');
const MinHeap = require('../data-structures/minHeap');

const heapSort = (arr) => {
  const minHeap = new MinHeap();
  const result = [];
  minHeap.buildHeap(arr);
  while (!minHeap.isEmpty()) {
    result.push(minHeap.dequeue().element.val);
  }
  return result;
};

// console.log(heapSort([0, 1, 7, 3, 4, 6, 5, 2]));
// console.log(heapSort([64, 543, 21, -34, 5, 6, 876, 5, 4, 3, 4, 34, 19]));

let data = Array.apply(null, { length: 1200000 }).map(
  Function.call,
  Math.random
);

let t1 = performance.now();
for (let i = 0; i < 10; i++) {
  heapSort(data);
}

let t2 = performance.now();
console.log('Average time: ' + (t2 - t1) / 10000 + ' seconds');
