import quickSort from "./quickSort";

describe("Test for Quick Sort", () => {
  const nTimes = 100;
  const SIZE = 100;

  test("testing if QS sort random array using random pivot", () => {
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = quickSort(arr);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr[0]).toEqual(jsSortedArr);
    }
  });

  test("testing if QS sort random array using first element as pivot", () => {
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = quickSort(arr, 0, arr.length, 0);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr[0]).toEqual(jsSortedArr);
    }
  });

  test("testing if QS sort random array using last element as pivot", () => {
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = quickSort(arr, 0, arr.length, 1);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr[0]).toEqual(jsSortedArr);
    }
  });

  test("testing if QS sort random array using 'median of 3' element as pivot", () => {
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = quickSort(arr, 0, arr.length, 2);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr[0]).toEqual(jsSortedArr);
    }
  });

  test("testing if QS sort random array using 'median of 3 random elements' as pivot", () => {
    for (let i = 0; i < nTimes; i++) {
      const arr = Array.from({ length: SIZE }, () =>
        Math.floor(Math.random() * 1000)
      );
      const sortedArr = quickSort(arr, 0, arr.length, 2);
      const jsSortedArr = arr.slice().sort((a, b) => a - b);
      expect(sortedArr[0]).toEqual(jsSortedArr);
    }
  });
});
