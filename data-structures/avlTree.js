class Node {
  constructor(val) {
    this.val = val;
    this.parent = null;
    this.right = null;
    this.left = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }
}
