import findMaxSubarr, { bruteForce, random, transformArr } from "./maxSubarr";

describe("Max Sub Arr test", () => {
  const SIZE = 1000;
  const MAX = 100;
  const N = 100;
  test("using random arr to check if D&C and BF obtain the same result", () => {
    for (let i = 0; i < N; i++) {
      // create arr with len=SIZE and random values in range [0,MAX)
      const arr = Array.from({ length: SIZE }, () => random(MAX));
      const [buy, sell, sum] = bruteForce(arr);
      const [low, high, val] = findMaxSubarr(transformArr(arr));
      expect(val).toBe(sum);
    }
  });
});
