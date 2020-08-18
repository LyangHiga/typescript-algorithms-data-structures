// Returns the day to buy, to say and the sum
const bruteForce = (arr) => {
  let sum, buy, sell;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      // buy in day i and sell in day j
      sum = arr[j] - arr[i];
      if (sum > max) {
        buy = i;
        sell = j;
        max = sum;
      }
    }
  }
  return [buy, sell, max];
};

// Return an new arr, where arr[i] = arr[i] - arr[i-1]
const transformArr = (arr) => {
  const ret = arr.map((e, i) => {
    return e - arr[i - 1];
  });
  return ret.slice(1);
};

// Returns the indeces and the sum of vals of one max sub arr
const findMaxSubarr = (arr, low = 0, high = arr.length - 1) => {
  // one element
  if (low === high) {
    return [low, high, arr[low]];
  }
  const mid = Math.floor((high + low) / 2);
  const [leftLow, leftHigh, leftSum] = findMaxSubarr(arr, low, mid);
  const [rightLow, rightHigh, rightSum] = findMaxSubarr(arr, mid + 1, high);
  const [crossLow, crossHigh, crossSum] = findMaxCrossSubarr(
    arr,
    low,
    mid,
    high
  );
  if (leftSum >= rightSum && leftSum >= crossSum) {
    return [leftLow, leftHigh, leftSum];
  } else if (rightSum >= leftSum && rightSum >= crossSum) {
    return [rightLow, rightHigh, rightSum];
  }
  return [crossLow, crossHigh, crossSum];
};

// Returns max sum crossing mid
// where this subarr starts (buy) and where it ends
const findMaxCrossSubarr = (arr, low, mid, high) => {
  let leftSum = Number.NEGATIVE_INFINITY;
  let rightSum = Number.NEGATIVE_INFINITY;
  let sum = 0;
  let buy, sell;
  // we need to start in mid because this subarr MUST contain mid
  for (let i = mid; i > low - 1; i--) {
    sum += arr[i];
    if (sum > leftSum) {
      leftSum = sum;
      buy = i;
    }
  }
  sum = 0;
  for (let j = mid + 1; j < high + 1; j++) {
    sum += arr[j];
    if (sum > rightSum) {
      rightSum = sum;
      sell = j;
    }
  }
  return [buy, sell, leftSum + rightSum];
};

// Returns a random number between [0,max)
const random = (max) => {
  return Math.floor(Math.random() * max);
};

// Prints false if any test fails
// size: len of arr
// max: val max allowed
// n: numer of times to test
const test = (size, max, n) => {
  for (let i = 0; i < n; i++) {
    // create arr with len=size and random values in range [0,max)
    const arr = Array.from({ length: size }, () => random(max));
    const [buy, sell, sum] = bruteForce(arr);
    const [low, high, val] = findMaxSubarr(transformArr(arr));
    console.assert(sum === val);
  }
};

test(10, 100, 10000);
