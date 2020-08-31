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
  // Also update the parent of node to null
  //    Can be a new one or any node which is already in FH but not in the root list
  // [...] <-> t <-> min <-> [...]   adds  node
  // [...] <-> t <- node -> <- min <-> [...]
  // If this FH is empty: Create the root list containing just node
  //    node becomes min and points to itself
  //    An only child points to itself in left and right
  addToRootList(node) {
    if (this.isEmpty() || this.min === null) {
      this.min = node;
      this.min.left = node;
      this.min.right = node;
    } else {
      // pointing to siblings in root list
      const t = this.min.left;
      this.min.left = node;
      node.left = t;
      t.right = node;
      node.right = this.min;
    }
    // node does not have a parent any more
    node.parent = null;
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
  // Removing node from root list does not change any attribute in node
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

  // Removes x from the child list of y, and decremente y degree
  // Removing x from child list of y does not change any attribute in x
  removeXFromParentY(x, y) {
    // check if x was only child
    if (y.degree === 1) {
      y.child = null;
    } else {
      // check if y.child points to x
      if (y.child === x) {
        // point to any other child
        y.child = x.right;
      } else {
        // we need to find x in this child list and remove pointers
        const t = y.child;
        while (t !== x) {
          // we find x
          if (t.right === x) {
            // [...] <-> t <-> x <-> x.right <-> [...]
            t.right = x.right;
            x.right.left = t;
          }
          // moving to the next sibling
          t = t.right;
        }
      }
    }
    y.degree--;
  }

  cut(x, y) {
    // Remove x from child list of y and decrease degree of y
    this.removeXFromParentY(x, y);
    // add to root and update x.parent to null
    this.addToRootList(x);
    // clear x mark
    x.mark = false;
  }

  // Links two roots, which have same degree, into a single one
  // x will be the parent, so x MUST to be smaller than y
  // Returns false if x is greater than y
  link(x, y) {
    // check if x.val < y.val
    if (y.val < x.val) return false;
    this.removeFromRootList(y);
    this.makeYchildOfX(x, y);
    x.degree += 1;
    y.mark = false;
  }

  // Ensures that every root has distinct degree
  //    Search roots with same degree and link
  //    until there is at most one root with each degree
  // O(maxDegree) = O(log n)
  consolidate() {
    //   max degree := log(n)
    let maxDegree = Math.log2(this.size);
    if (Number.isInteger(maxDegree)) {
      // increase 1 because maxDegree is inclusive [0,maxDregree]
      maxDegree++;
    } else {
      // increase 2 because of floor and maxDegree is inclusive
      maxDegree = Math.floor(maxDegree) + 2;
    }
    // to keep track the root's degree
    const a = new Array(maxDegree).fill(null);
    // for each node w in the root list
    let w = this.min;
    // removing pointer from left sibling of min to min
    // left <-> min <-> [...]
    // left <- min <-> [...]
    this.min.left.right = null;
    while (w !== null) {
      let x = w;
      let d = x.degree;
      const next = x.right;
      // in each step we remove the pointer to the right sibling
      w.right = null;
      // check if there is any other root with the same degree d
      while (a[d] !== null) {
        // another root (besides x) with the same degree d
        let y = a[d];
        if (y.val < x.val) {
          // exhange pointers, x MUST be the smaller
          [x, y] = [y, x];
        }
        this.link(x, y);
        // after link x and y, y is child of x, and x has degree d + 1
        a[d] = null;
        d += 1;
      }
      // a[d] points to x
      a[d] = x;
      // update w
      w = next;
    }
    // Reconstructing Root list
    this.min = null;
    for (let i = 0; i < maxDegree; i++) {
      if (a[i] !== null) {
        // add node a[i] to the root list
        this.addToRootList(a[i]);
        // update min
        if (this.min === null) {
          this.min = a[i];
        } else {
          if (a[i].val < this.min.val) {
            this.min = a[i];
          }
        }
      }
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
  //                            DELETE
  //   **********************************************************

  // Removes the root (min),
  // Returns the root and the new arrangement
  //    It's where the delayed work of consolidating trees
  //    in root list finally occurs
  // Returns null if this heap is empty
  dequeue() {
    if (this.isEmpty()) return null;
    // saving pointer to min and its right sibling
    const z = this.min;
    // for each child x of z
    if (z.child !== null) {
      let x = z.child;
      // removing pointer from left sibling of x to x
      // left <-> x <-> [...]
      // left <- x <-> [...]
      x.left.right = null;
      while (x !== null) {
        const next = x.right;
        // in each step we remove the pointer to the right sibling
        x.right = null;
        this.addToRootList(x);
        // z is no longer parent of x
        x.parent = null;
        // update x
        x = next;
      }
    }
    this.removeFromRootList(z);
    // check if z was the last element in this FH
    if (this.size === 1) {
      this.min = null;
    } else {
      // set a new(any) min and consolidate
      this.min = z.right;
      this.consolidate();
    }
    // decrease size
    this.size -= 1;
    return { element: z, heap: this };
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

module.exports = FibonacciHeap;
