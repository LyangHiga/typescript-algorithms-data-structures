// returns the first element as pivot
const choosePivot = (arr) => {
  return arr[0];
};

// Returns: the order statistic of a given pivot (its correct position if the arr was ordered)
// also make a partition around the pivot
const partition = (arr) => {
  const p = choosePivot(arr);
  // keep track of how many elements are smaller than the pivot
  // this will be its 'right' position if arr is sorted
  let i = 1;
  // elements with idx < j : partitioned
  // elements with idx > j unpartitioned
  for (let j = 1; j < arr.length; j++) {
    // check if the next element is smaller than the pivot
    if (arr[j] < p) {
      // swap and move i
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  // put p in its right position and return this idx
  [arr[0], arr[i - 1]] = [arr[i - 1], arr[0]];
  return i - 1;
};

// Returns the ith smallest element of arr
const selection = (arr, i) => {
  // out of bounds
  if (i > arr.length - 1) return false;
  if (arr.length === 1) return arr[0];
  // j is the index of p
  const j = partition(arr);
  if (j === i) return arr[j];
  if (j > i) {
    const left = arr.slice(0, j);
    return selection(left, i);
  }
  // i < j
  const right = arr.slice(j + 1);
  return selection(right, i - j - 1);
};

const arr = [];
for (let i = 99; i > -1; i--) {
  arr.push(i);
}

console.log(selection(arr, 10));
