// Returns the day to buy, to sell and the sum
export const bruteForce = (arr: number[]): [number, number, number] => {
  let sum, buy: number, sell: number;
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
  return [buy!, sell!, max];
};

// Return an new arr, where arr[i] = arr[i] - arr[i-1]
export const transformArr = (arr: number[]) => {
  const ret = arr.map((e, i) => {
    return e - arr[i - 1];
  });
  return ret.slice(1);
};

// Returns the indeces and the sum of vals of one max sub arr
const findMaxSubarr = (
  arr: number[],
  low = 0,
  high = arr.length - 1
): [number, number, number] => {
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
  if (leftSum >= rightSum && leftSum >= crossSum!) {
    return [leftLow, leftHigh, leftSum];
  } else if (rightSum >= leftSum && rightSum >= crossSum!) {
    return [rightLow, rightHigh, rightSum];
  }
  return [crossLow!, crossHigh!, crossSum!];
};

// Returns max sum crossing mid
// where this subarr starts (buy) and where it ends
const findMaxCrossSubarr = (
  arr: number[],
  low: number,
  mid: number,
  high: number
): [number, number, number] => {
  let leftSum = Number.NEGATIVE_INFINITY;
  let rightSum = Number.NEGATIVE_INFINITY;
  let sum = 0;
  let buy: number, sell: number;
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
  return [buy!, sell!, leftSum + rightSum];
};

// Returns a random number between [0,max)
export const random = (max: number) => {
  return Math.floor(Math.random() * max);
};

export default findMaxSubarr;
