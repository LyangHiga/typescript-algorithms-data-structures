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

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // Returns true if this RBT is empty
  // Otherwise returns false
  isEmpty() {
    return this.size === 0;
  }

  //   **********************************************************
  //                    DYNAMIC-SET OPERATIONS
  //   **********************************************************

  // Returns true if this RBT contains this val,
  // Otherwise returns false
  contains(val) {
    if (this.isEmpty()) return false;
    let current = this.root;
    while (current !== null) {
      // if we find return true
      if (current.val === val) return true;
      // check left
      if (current.val > val) {
        current = current.left;
      } else {
        // check right
        current = current.right;
      }
    }
    // if we didnt find return flase
    return false;
  }

  // Returns the min node from the subtree who has x as root
  min(x = this.root) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    while (x.left !== null) {
      x = x.left;
    }
    return x;
  }

  // Returns the max node from the subtree who has x as root
  max(x = this.root) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    while (x.right !== null) {
      x = x.right;
    }
    return x;
  }

  // Returns the successor node y (node who has the next val in crescent order)
  //    of a given node x
  sucessor(x) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    // check if there is a right subtree
    if (x.right !== null) {
      // sucessor is the leftmost node in this subtree
      return this.min(x.right);
    }
    // go up until we find a node who is the left child
    // its parent is the sucessor
    let y = x.parent;
    // while x is the right child (its parent y is smaller than x) we update
    while (y !== null && x === y.right) {
      x = y;
      y = y.parent;
    }
    return y;
  }

  // Returns the predecessor node y (node who has the previous val in crescent order)
  //    of a given node x
  predecessor(x) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    // check if there is a left subtree
    if (x.left !== null) {
      // predecessor is the rightmost node in this subtree
      return this.max(x.left);
    }
    // go up until we find a node who is the right child
    // its parent is the predecessor
    let y = x.parent;
    // while x is the left child (its parent y is greater than x) we update
    while (y !== null && x === y.left) {
      x = y;
      y = y.parent;
    }
    return y;
  }
}
