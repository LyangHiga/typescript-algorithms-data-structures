import ForestNode from "./forestNode";

class ForestSet {
  // node key to node
  pointers: Map<string, ForestNode>;
  constructor() {
    this.pointers = new Map();
  }

  makeSet = (x: string) => {
    const node = new ForestNode(x);
    this.pointers.set(x, node);
  };

  findSet = (x: string) => {
    if (!this.pointers.get(x)) return null;
    let node = this.pointers.get(x)!;

    if (node.parent.key !== node.key) {
      // Path Compression
      node.parent = this.findSet(node.parent.key)!;
    }
    return node.parent;
  };

  link = (x: ForestNode, y: ForestNode) => {
    // Union by Rank
    if (x.rank > y.rank) {
      y.parent = x;
    } else {
      x.parent = y;
      if (x.rank === y.rank) y.rank++;
    }
  };

  union = (x: string, y: string) => {
    this.link(this.findSet(x)!, this.findSet(y)!);
  };
}

export = ForestSet;
