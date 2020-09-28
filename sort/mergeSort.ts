const mergeShift = (left: number[], right: number[]) => {
  let result = [];
  // while booth arrays have elements we compare, the smallest of each one,
  // take the smaller , push it to result and shift from the original arr
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      result.push(left[0]);
      left.shift();
    } else {
      result.push(right[0]);
      right.shift();
    }
  }
  // one of them still has elemenst, already sorted, so we just need concat it with the result array
  while (left.length > 0) {
    result.push(left[0]);
    left.shift();
  }
  while (right.length > 0) {
    result.push(right[0]);
    right.shift();
  }
  return result;
};

const mergeIdx = (left: number[], right: number[]) => {
  let result = [],
    leftIndex = 0,
    rightIndex = 0;
  // while booth arrays have elements to compare, the smallest of each one,
  // take the smaller , push it to result and move idx
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  // one of them still has elemenst, already sorted, so we just need concat it with the result array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  // spread
  // result = [...result, ...left,...right];
  return result;
};

const mergeSort = (arr: number[]): number[] => {
  if (arr.length < 2) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  //   return mergeShift(mergeSort(left), mergeSort(right));
  return mergeIdx(mergeSort(left), mergeSort(right));
};

let data = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 40));

let t1 = performance.now();
for (let i = 0; i < 10; i++) {
  mergeSort(data);
}

let t2 = performance.now();
console.log("Average time: " + (t2 - t1) / 10000 + " seconds");

export = mergeSort;
