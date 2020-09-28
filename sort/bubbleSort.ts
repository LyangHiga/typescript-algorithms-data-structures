// check consective elements (arr[j],arr[j+1]) , if the arr[j] > arr[j+1] swap!
// in each iterations we sort from the end
const bubbleSort = (arr: number[]) => {
  let noSwaps;
  for (let i = arr.length; i > 0; i--) {
    noSwaps = true;
    for (let j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        noSwaps = false;
      }
    }
    if (noSwaps) break;
  }
  return arr;
};

export = bubbleSort;
