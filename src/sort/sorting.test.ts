import { performance } from "perf_hooks";

import radixSort from "./radixSort";

import mergeSort from "./mergeSort";
import quickSort from "./quickSort";
import bstSort from "./bstSort";
import heapSort from "./heapSort";
import bubbleSort from "./bubbleSort";
import insertionSort from "./insertionSort";
import selectionSort from "./selectionSort";

import BST from "../data-structures/trees/bst";
import AVL from "../data-structures/trees/avl";
import RBT from "../data-structures/trees/rbt";

interface MethodTime {
  method: string;
  time: number;
}

describe("Test of Running Time for Sorting Methods", () => {
  let t1: number, t2: number;
  let method: string;
  const nTimes = 10;
  const SIZE = 30000;
  const times: MethodTime[] = new Array();

  beforeEach(() => {
    t1 = performance.now();
  });

  afterEach(() => {
    let t2 = performance.now();
    const rT = (t2 - t1) / (1000 * nTimes);
    // times.set(method, rT);
    const mT = { method: method, time: rT };
    times.push(mT);
    console.log(`${method}: running time ${rT}`);
  });

  afterAll(() => {
    const sortedMethodTimes = times.sort(
      (a: MethodTime, b: MethodTime) => a.time - b.time
    );
    console.log("*** All Methods and Running Times:");
    console.log(sortedMethodTimes);
    // for (let mt of sortedMethodTimes) {
    //   console.log(`${mt.method}: ${mt.time}`);
    // }
  });

  test("Radix Sort", () => {
    method = "Radix Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      radixSort(arr);
    }
  });

  test("Merge Sort", () => {
    method = "Merge Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      mergeSort(arr);
    }
  });

  test("Quick Sort (Random Pivot)", () => {
    method = "Quick Sort - Random Pivot";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      quickSort(arr);
    }
  });

  test("Quick Sort (First Element Pivot)", () => {
    method = "Quick Sort - First Element Pivot";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      quickSort(arr, 0, arr.length, 0);
    }
  });

  test("Quick Sort (Last Element Pivot)", () => {
    method = "Quick Sort - Last Element Pivot";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      quickSort(arr, 0, arr.length, 1);
    }
  });

  test("Quick Sort (Median of 3)", () => {
    method = "Quick Sort - Median of 3";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      quickSort(arr, 0, arr.length, 2);
    }
  });

  test("Quick Sort (Median of 3 Random)", () => {
    method = "Quick Sort - Median of 3 Random";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      quickSort(arr, 0, arr.length, 4);
    }
  });

  // test("Red Black Tree Sort", () => {
  //   method = "Red Black Tree Sort";
  //   for (let i = 0; i < nTimes; i++) {
  //     const arr = Array.from({ length: SIZE }, () =>
  //       Math.floor(Math.random() * 1000)
  //     );
  //     const rbt = new RBT();
  //     bstSort(rbt, arr);
  //   }
  // });

  test("AVL Tree Sort", () => {
    method = "AVL Tree Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const avl = new AVL();
      bstSort(avl, arr);
    }
  });

  test("BST Sort", () => {
    method = "BST Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const bst = new BST();
      bstSort(bst, arr);
    }
  });

  test("Heap Sort", () => {
    method = "Heap Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      heapSort(arr);
    }
  });

  test("Bubble Sort", () => {
    method = "Bubble Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      bubbleSort(arr);
    }
  });

  test("Insertion Sort", () => {
    method = "Insertion Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      insertionSort(arr);
    }
  });

  test("Selection Sort", () => {
    method = "Selection Sort";
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      selectionSort(arr);
    }
  });
});
