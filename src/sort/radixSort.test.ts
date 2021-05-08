import radixSort from "./radixSort";

describe("Radix Sort Test", () => {
  test("Testing if RS sort a random array", () => {
    const nTimes = 100;
    const SIZE = 100;
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = radixSort(arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr).toEqual(jsSortedArr);
    }
  });
});
