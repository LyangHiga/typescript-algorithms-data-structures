import mergeSort from "./mergeSort";

describe("Test for Merge Sort", () => {
  test("testing if MS sort random array", () => {
    const nTimes = 100;
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = mergeSort(arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr).toEqual(jsSortedArr);
    }
  });
});
