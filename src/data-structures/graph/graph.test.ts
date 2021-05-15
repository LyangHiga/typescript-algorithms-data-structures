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

  test("BFS easy Example", () => {
    const easy = `${__dirname}/test-datasets/generic-search/classEg.txt`;
    const g = Graph.createListAdj(easy);
    const { dist } = g.bfs("s");
    expect(dist.get("s")).toBe(0);
    expect(dist.get("a")).toBe(1);
    expect(dist.get("b")).toBe(1);
    expect(dist.get("c")).toBe(2);
    expect(dist.get("d")).toBe(2);
    expect(dist.get("e")).toBe(3);
  });

  test("Undirect Components easy Example", () => {
    const easy = `${__dirname}/test-datasets/generic-search/undirectComponents.txt`;
    const g = Graph.createListAdj(easy);
    const components = g.undirectConnectivity();
    expect(components[0]).toEqual(["s", "b", "a"]);
    expect(components[1]).toEqual(["c", "e", "d"]);
  });

  test("Topological Sort easy example", () => {
    const easy = `${__dirname}/test-datasets/generic-search/topologicalSort.txt`;
    const g = Graph.createDirected(easy);
    const { labeledOrder, finish } = g.topologicalSort();
    expect(labeledOrder.get("t")).toBe(4);
    expect(labeledOrder.get("s")).toBe(1);
    expect(labeledOrder.get("v")).toBeGreaterThan(1);
    expect(labeledOrder.get("v")).toBeLessThan(4);
    expect(labeledOrder.get("w")).toBeGreaterThan(1);
    expect(labeledOrder.get("w")).toBeLessThan(4);
  });
});
