class Node {
  constructor(val, color) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = color;
  }
}

class RedBlackTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }
}
