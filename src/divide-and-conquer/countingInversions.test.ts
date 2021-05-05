import countingInversions from "./countingInversions";

describe("Counting Inversions test", () => {
  test("Example test", () => {
    const A = [2, 4, 1, 3, 5];
    expect(countingInversions(A)[1]).toBe(3);
  });
});
