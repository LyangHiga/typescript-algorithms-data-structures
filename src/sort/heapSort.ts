import MinHeap from "../data-structures/heaps/minHeap";

// TODO: use Heap interface so it's possible to use any heap implementation
//      EG, Fibonacci heap
const heapSort = (arr: number[]) => {
  const minHeap = new MinHeap();
  const result = [];
  minHeap.buildHeap(arr, [...arr.keys()]);
  while (!minHeap.isEmpty()) {
    result.push(minHeap.dequeue()!.val);
  }
  return result;
};

export default heapSort;
