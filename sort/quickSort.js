const { performance } = require("perf_hooks");
// returns start <= random < end
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// output: the index of the pivot
function partition(arr, start = 0, end = arr.length) {
  // lets take the first element as pivot
  // const p = arr[start];
  // random pivot
  const index = random(start, end);
  const p = arr[index];
  // swap pivot to the first position
  [arr[start], arr[index]] = [arr[index], arr[start]];

  // keep track of how many elements are smaller than the pivot, to mark its right position
  let i = start + 1;
  // elements with idx < j : partitioned
  // elements with idx > j unpartitioned
  for (let j = start + 1; j < end; j++) {
    // check if the next element is smaller than the pivot
    if (arr[j] < p) {
      // swap and move i
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  // put p in its right position and return this idx
  [arr[start], arr[i - 1]] = [arr[i - 1], arr[start]];
  return i - 1;
}

function quickSort(arr, left = 0, right = arr.length) {
  if (right - left < 1) return;
  // find the right position of a random pivot
  const p = partition(arr, left, right);
  // recurssive through p
  quickSort(arr, left, p);
  quickSort(arr, p + 1, right);
  return arr;
}

// console.log(quickSort([10, -9, 44, 56, 49, 400, -94, 34, 56, 0]));

let data = Array.apply(null, { length: 120000 }).map(
  Function.call,
  Math.random
);

let t1 = performance.now();
for (let i = 0; i < 10; i++) {
  quickSort(data);
}

let t2 = performance.now();
console.log("Average time: " + (t2 - t1) / 10000 + " seconds");
