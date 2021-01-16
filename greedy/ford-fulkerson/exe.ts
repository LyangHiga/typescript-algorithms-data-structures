import Graph from "../../data-structures/graph/graph";

const test = (file: string) => {
  const g = Graph.createDirected(file, true, false);
  const rg = g.fordFulkerson("s", "t");
  if (rg) {
    rg.print();
  }
};

test("test.txt");
