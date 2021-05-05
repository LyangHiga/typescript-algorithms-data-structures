import {
  getPoints,
  closestPairList,
  closestPairBruteForce,
} from "./closestPair";

describe("Closest Pair Probelm Test (Divide and Conquer)", () => {
  test("Randonized test, comparing with brute force", () => {
    // how many times to execute
    const nTimes = 300;
    // size of list of points, in random order,to test
    const lSize = 500;
    // range of possible values of x and y
    // x:(-r,+r) and y:(-r,+r)
    const range = 999;
    let list = getPoints(lSize, range);
    let [p0, q0, d0] = closestPairList(list);
    // console.log(`(${p0!.name}, ${q0!.name}): ${d0}`);
    let [p1, q1, d1] = closestPairBruteForce(list);
    // console.log(`(${p1.name}, ${q1.name}): ${d1}`);
    expect(d0).toBe(d1);
    for (let i = 0; i < nTimes; i++) {
      let list = getPoints(lSize, range);
      [p0, q0, d0] = closestPairList(list);
      [p1, q1, d1] = closestPairBruteForce(list);
      // check if both found the same min dist
      expect(d0).toBe(d1);
    }
  });
});
