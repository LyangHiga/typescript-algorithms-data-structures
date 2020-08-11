class Point {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
  }
}

// Returns the euclidean distance between two points
const dist = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const printDist = (a, b) => {
  console.log(`Distance between ${a.name} and ${b.name} is ${dist(a, b)}`);
};

const compare = (a, b, c) => {
  if (c) return a.x < b.x;
  return a.y < b.y;
};

const merge = (left, right, c) => {
  let result = [],
    leftIndex = 0,
    rightIndex = 0;
  // while booth arrays have elements to compare, the smallest of each one,
  // take the smaller , push it to result and move idx
  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex], c)) {
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
  return result;
};

// if c is true compares by the x coordinate
// else compares by y coordinate
const mergeSort = (arr, c = true) => {
  if (arr.length < 2) {
    return arr;
  }
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left, c), mergeSort(right, c), c);
};

// Returns the pair and its distance
const closestPairBruteForce = (l) => {
  let min = Infinity;
  let pair = [];
  let d;
  for (let i = 0; i < l.length; i++) {
    for (let j = i + 1; j < l.length; j++) {
      d = dist(l[i], l[j]);
      if (d < min) {
        min = d;
        pair = [l[i], l[j]];
      }
    }
  }
  return [pair, d];
};
