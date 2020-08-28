class Node {
  constructor(key, val) {
    this.parent = null;
    this.child = null;
    // siblings
    this.left = null;
    this.right = null;
    // number of children
    this.degree = 0;
    // to control child lost
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

  // Adds a node to the root list
  //    Can be a new one or any node which is already in FH but not in the root list
  // [...] <-> t <-> min <-> [...]   adds  node
  // [...] <-> t <- node -> <- min <-> [...]
  // If this FH is empty: Create the root list containing just node
  //    node becomes min and points to itself
  //    An only child points to itself in left and right
  addToRootList(node) {
    if (this.isEmpty()) {
      this.min = node;
      this.min.left = node;
      this.min.right = node;
    } else {
      // node does not have a parent any more
      node.parent = null;
      // pointing to siblings in root list
      const t = this.min.left;
      this.min.left = node;
      node.left = t;
      t.right = node;
      node.right = this.min;
    }
  }

  // Concatenates this min root list with root list of a given node( min of h2 = min2)
  // [...] <-> min1 <-> t1 <-> [...], [...] <-> t2 <-> min2 <-> [...]
  // [...] t2 <-> t1 <->[...] <-> min1 <-> min2 <-> [...]
  concatenate(node) {
    const t1 = this.min.right;
    const t2 = node.left;
    this.min.right = node;
    node.left = this.min;
    t1.left = t2;
    t2.right = t1;
  }

  // Removes node from this FH
  // [...] <-> t <-> node <-> t2 <-> [...]
  // [...] <-> t <-> t2 <-> [...]
  // Returns false if node is not in Root List
  removeFromRootList(node) {
    // check if node is in Root list
    if (node.parent !== null || node.left === null || node.right === null) {
      return false;
    }
    const t = node.left;
    const t2 = node.right;
    // pointing to the new siblings, no one points to node any more
    t.right = t2;
    t2.left = t;
    // node points to null
    node.left = null;
    node.right = null;
  }

  // Makes y node child of x node
  makeYchildOfX(x, y) {
    y.parent = x;
    // check if y is the first child
    if (x.degree === 0) {
      x.child = y;
      // y has no siblings, only child points to itself!
      y.left = y;
      y.right = y;
    } else {
      // y is not the first, connect y to its siblings!
      // child <-> t <-> [...], y
      // child <-> y <-> t <-> [...]
      const child = x.child;
      const t = child.right;
      // changing pointers
      child.right = y;
      y.left = child;
      y.right = t;
      t.left = y;
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

  //   **********************************************************
  //                            UNION
  //   **********************************************************

  // Returns a new FH h, which is the union between this FH and h2
  // Returns false if any FH is empty
  union(h2) {
    if (this.isEmpty() || h2.isEmpty()) return false;
    const h = new FibonacciHeap();
    h.min = this.min;
    h.concatenate(h2.min);
    if (h2.min.val < this.min.val) {
      h.min = h2.min;
    }
    h.size = this.size + h2.size;
    return h;
  }
}
