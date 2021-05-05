// Returns a random number between [min,max)
const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Returns  the median of a list with 3 values
const medianOf3 = (arr: number[]) => {
  arr.sort(function (a, b) {
    return a - b;
  });
  return arr[1];
};

// Returns the pivot, and if it's not the first element of the arr, it swaps
// chooseP:
//      0: the First Element
//      1: the last Element
//      2: the median of 3 (first, middle, last) elements
//      3: Random Element
//      4: the median of 3 random elements in range [start,end)
// we also could create a obj with chooseP as keys and each strategy(function) as property
// eg:
//      chooseP ={0: firstElement, 2: lastElement, ... , 4: medianOfRandom}
//      chooseP[0] returns a function that implements first element as pivot
//      chooseP[3] returns a function that implements Random as pivot
// both are equally fast with 5 cases => similar to switch vs pointer function in c++
const choosePivot = (
  arr: number[],
  start = 0,
  end = arr.length,
  chooseP = 3
) => {
  switch (chooseP) {
    case 0:
      return arr[start];
    case 1:
      const last = end - 1;
      // swap pivot to the first position
      [arr[start], arr[last]] = [arr[last], arr[start]];
      return arr[start];
    case 2:
      const l = [];
      const first = arr[start];
      l.push(first);
      const lastIdx = end - 1;
      const lastEle = arr[lastIdx];
      l.push(lastEle);
      const middleIdx = Math.floor((lastIdx - start) / 2) + start;
      const middle = arr[middleIdx];
      l.push(middle);
      const median = medianOf3(l);
      if (median === lastEle) {
        // swap pivot (last Element) to the first position
        [arr[start], arr[lastIdx]] = [arr[lastIdx], arr[start]];
      }
      if (median === middle) {
        // swap pivot (middle Element) to the first position
        [arr[start], arr[middleIdx]] = [arr[middleIdx], arr[start]];
      }
      return median;
    case 3:
    default:
      const idx = random(start, end);
      [arr[start], arr[idx]] = [arr[idx], arr[start]];
      return arr[start];
    case 4:
      const idx1 = random(start, end);
      const idx2 = random(start, end);
      const idx3 = random(start, end);
      const list = [];
      list.push(arr[idx1], arr[idx2], arr[idx3]);
      const m = medianOf3(list);
      if (m === arr[idx1]) {
        // swap pivot to the first position
        [arr[start], arr[idx1]] = [arr[idx1], arr[start]];
      }
      if (m === arr[idx2]) {
        // swap pivot to the first position
        [arr[start], arr[idx2]] = [arr[idx2], arr[start]];
      }
      if (m === arr[idx3]) {
        // swap pivot to the first position
        [arr[start], arr[idx3]] = [arr[idx3], arr[start]];
      }
      return m;
  }
};

// Returns: the order statistic of a given pivot (its correct position if the arr was ordered)
// also make a partition around the pivot
// puts the pivot in its right position
// and all elements that are smaller than pivot in the left side
// and all elements that are greater than pivot in the right side
const partition = (arr: number[], start = 0, end = arr.length, chooseP = 3) => {
  const p = choosePivot(arr, start, end, chooseP);
  // keep track of how many elements are smaller than the pivot
  // this will be its 'right' position if arr is sorted
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
};

// Returns a sorted array and the number of comparisons
// Inputs:
//  arr: unsorted array
//  left: index of first element to sort
//  right: index of the last element
const quickSort = (
  arr: number[],
  left = 0,
  right = arr.length,
  chooseP = 3
): [number[], number] => {
  if (right - left < 1) return [arr, 0];
  // to count the number of comparisons
  const comp = right - left - 1;
  let cl, cr;
  // find the right position of a given pivot
  const p = partition(arr, left, right, chooseP);
  // recurssive through p
  [arr, cl] = quickSort(arr, left, p, chooseP);
  [arr, cr] = quickSort(arr, p + 1, right, chooseP);
  return [arr, comp + cl + cr];
};

export default quickSort;
