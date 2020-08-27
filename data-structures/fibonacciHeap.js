class Node {
  constructor(key, val) {
    this.parent = null;
    this.child = null;
    // siblings
    this.left = null;
    this.right = null;
    // number of children
    this.degree = 0;
    this.mark = false;
    this.key = key;
    this.val = val;
  }
}

class FibonacciHeap {
  constructor() {
    this.size = 0;
    this.min = null;
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // Returns true if this heap is empty
  // Otherwise returns false
  isEmpty() {
    return this.size === 0;
  }

  // Adds a new node to the root list
  // [...] <-> t <-> min <-> [...]   adds  node
  // [...] <-> t <- node -> <- min <-> [...]
  // If this FH is empty node become min and points to itself
  //    An only child points to itself in left and right
  addToRootList(node) {
    if (this.isEmpty()) {
      this.min = node;
      this.min.left = node;
      this.min.right = node;
    } else {
      const t = this.min.left;
      this.min.left = node;
      node.left = t;
      t.right = node;
      node.right = this.min;
    }
  }

  //   **********************************************************
  //                            ACCESSING
  //   **********************************************************

  // Returns the min node
  // Returns null if this Heap is empty
  findMin() {
    if (this.isEmpty()) return null;
    return this.min;
  }

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  enqueue(key, val) {
    const node = new Node(key, val);
    this.addToRootList(node);
    if (node.val < this.min.val) {
      this.min = node;
    }
    this.size++;
    return this;
  }
}
