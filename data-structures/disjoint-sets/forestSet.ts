import ForestNode from "./forestNode";

class ForestSet<T> {
  // node key to node
  pointers: Map<T, ForestNode<T>>;
  constructor() {
    this.pointers = new Map();
  }

  makeSet = (x: T) => {
    const node = new ForestNode<T>(x);
    this.pointers.set(x, node);
  };

  findSet = (x: T) => {
    if (!this.pointers.get(x)) return null;
    let node = this.pointers.get(x)!;

    if (node.parent.key !== node.key) {
      // Path Compression
      node.parent = this.findSet(node.parent.key)!;
    }
    return node.parent;
  };

  link = (x: ForestNode<T>, y: ForestNode<T>) => {
    // Union by Rank
    if (x.rank > y.rank) {
      y.parent = x;
    } else {
      x.parent = y;
      if (x.rank === y.rank) y.rank++;
    }
  };

  union = (x: T, y: T) => {
    this.link(this.findSet(x)!, this.findSet(y)!);
  };
}

export = ForestSet;
