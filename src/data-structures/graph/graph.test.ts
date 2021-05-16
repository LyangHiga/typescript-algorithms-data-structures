import { getTestAnswer, getTestAnswerArr } from "../../helperTests";
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

  test("Kosaraju's Algorithm, using test cases from stanford-algs repo", () => {
    const TEST48 = `mostlyCycles_48_12800.txt`;
    const TEST52 = `mostlyCycles_52_20000.txt`;
    const TEST56 = `mostlyCycles_56_40000.txt`;
    const TEST60 = `mostlyCycles_60_80000.txt`;
    const TEST64 = `mostlyCycles_64_160000.txt`;

    const largest5 = (m: Map<string, number> | boolean) => {
      if (typeof m === "boolean") return false;
      let arr = Array.from(m.values());
      arr = arr.sort((a, b) => b - a);
      return arr.slice(0, 5);
    };
    const test = (file: string) => {
      const g = Graph.createDirected(
        `${__dirname}/test-datasets/kosaraju/input_${file}`
      );
      const ans = getTestAnswerArr(
        `${__dirname}/test-datasets/kosaraju/output_${file}`
      );
      const m = g.kosaraju();
      expect(m).not.toBeFalsy();
      // if m is false, this test already failed
      const arr = largest5(m) as number[];
      arr.forEach((n, i) => {
        expect(n).toBe(ans[i]);
      });
    };

    test(TEST48);
    test(TEST52);
    test(TEST56);
    test(TEST60);
    test(TEST64);
  });

  test("Test for Dijkstra, using test cases from stanford-algs repo", () => {
    // WARNING: https://github.com/beaunus/stanford-algs/issues/53

    const TEST_1 = "random_1_4.txt";
    const TEST_4 = "random_4_4.txt";
    const TEST_5 = "random_5_8.txt";
    const test = (file: string) => {
      const g = Graph.createListAdjWeighted(
        `${__dirname}/test-datasets/SSSP/input_${file}`
      );
      const ans = getTestAnswerArr(
        `${__dirname}/test-datasets/SSSP/output_${file}`
      );
      const { distances, dequeues } = g.dijkstra("1");
      const dist: number[] = new Array();
      dist.push(distances.get("7")!);
      dist.push(distances.get("37")!);
      dist.push(distances.get("59")!);
      dist.push(distances.get("82")!);
      dist.push(distances.get("99")!);
      dist.push(distances.get("115")!);
      dist.push(distances.get("133")!);
      dist.push(distances.get("165")!);
      dist.push(distances.get("188")!);
      dist.push(distances.get("197")!);
      dist.forEach((d, i) => {
        expect(d).toBe(ans[i]);
      });
      // only work if G is all connected (i.e., only one Component)
      expect(dequeues).toBe(g.size);
    };
    test(TEST_1);
    test(TEST_4);
    test(TEST_5);
  });
});
