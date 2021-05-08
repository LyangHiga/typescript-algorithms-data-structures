// Returns the digit in num at the given place value, only positve numbers
const getDigit = (num: number, place: number) => {
  return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
};

// Returns the number of digits in num
const digitCount = (num: number) => {
  // log 0
  if (num === 0) return 1;
  return Math.floor(Math.log10(Math.abs(num))) + 1;
};

// returns the number of digits in the largest number of the list arr
const maximumDigits = (arr: number[]) => {
  let max = 0;
  for (let n of arr) {
    max = Math.max(max, digitCount(n));
  }

  return max;
};

const radixSort = (arr: number[]) => {
  let maxDigits = maximumDigits(arr);
  // put each digit from each num in the right bucket
  for (let i = 0; i < maxDigits; i++) {
    // an array of 10 empty arrays, a bucket to each possible number
    let digitBuckets: number[][] = Array.from({ length: 10 }, () => []);
    for (let j = 0; j < arr.length; j++) {
      // take the digit of arr[j]
      let digit = getDigit(arr[j], i);
      // add this arr[j] in the bucket of the right digit
      digitBuckets[digit].push(arr[j]);
    }
    // to concate each element from each bucket, using spread
    arr = Array.prototype.concat(...digitBuckets);
  }
  return arr;
};

export default radixSort;
