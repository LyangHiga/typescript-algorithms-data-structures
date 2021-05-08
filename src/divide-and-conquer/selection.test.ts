import selection from "./selection";

describe("Selection Test", () => {
  const nTimes = 100;
  const SIZE = 100;
  // ith element to be returned
  const i = Math.floor(Math.random() * SIZE);
  test("Compare return from Random Select with ith number from sorted arr", () => {
    for (let j = 0; j < nTimes; j++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const ans = selection(arr, i);
      const sortedArr = arr.slice().sort((a, b) => a - b);
      expect(ans).toBe(sortedArr[i]);
    }
  });
  test("Compare return from Deterministic Select with ith number from sorted arr", () => {
    for (let j = 0; j < nTimes; j++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const ans = selection(arr, i, 1);
      const sortedArr = arr.slice().sort((a, b) => a - b);
      expect(ans).toBe(sortedArr[i]);
    }
  });
});
