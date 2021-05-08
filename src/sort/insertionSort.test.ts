import insertionSort from "./insertionSort";

describe("Insertion Sort Test", () => {
  test("Testing if IS sort a random array", () => {
    const nTimes = 100;
    const SIZE = 100;
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      insertionSort(arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(arr).toEqual(jsSortedArr);
    }
  });
});
