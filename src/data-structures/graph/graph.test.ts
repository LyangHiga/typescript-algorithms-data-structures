import { getTestAnswer } from "../../helperTests";
import Graph from "./graph";

describe("Graph class test", () => {
  //TODO: Add tests for helpers

  test("Kargen Min Cut Test", () => {
    const TEST_28 = "random_28_125.txt";
    const TEST_32 = "random_32_150.txt";
    const TEST_36 = "random_36_175.txt";
    const TEST_40 = "random_40_200.txt";

    const test = (n: number, file: string) => {
      let min = Infinity;
      for (let i = 0; i < n; i++) {
        const g = Graph.createListAdj(
          `${__dirname}/test-datasets/kargen-min-cut/input_${file}`
        );
        min = Math.min(min, g.kargerMinCut());
      }
      const ans = getTestAnswer(
        `${__dirname}/test-datasets/kargen-min-cut/output_${file}`
      );
      expect(min).toBe(ans);
    };

    test(600, TEST_28);
    test(600, TEST_32);
    test(700, TEST_36);
    test(700, TEST_40);
  });
});
