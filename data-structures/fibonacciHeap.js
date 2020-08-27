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
}
