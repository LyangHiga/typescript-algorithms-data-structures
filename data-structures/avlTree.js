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

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // Returns true if this AVL Tree is empty
  // Otherwise returns false
  isEmpty() {
    return this.size === 0;
  }

  // update the height of a given node x
  updateHeight(x) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    // if x does not have a child the height of this 'sides is zero
    const leftHeight = x.left !== null ? x.left.height : 0;
    const rightHeight = x.right !== null ? x.right.height : 0;
    x.height = 1 + Math.max(leftHeight, rightHeight);
  }

  // Returns the balance factor of a given node x
  getBalanceFactor(x) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    // if x does not have a child the height of this 'sides is zero
    const leftHeight = x.left !== null ? x.left.height : 0;
    const rightHeight = x.right !== null ? x.right.height : 0;
    return leftHeight - rightHeight;
  }

  // Operate a left rotation:
  //    y is the right child of x (NOT NULL)
  //    y's left subtree becomes x's right subtree
  //    x becomes left child of y
  leftRotate(x) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    // y can't be null
    if (x.right === null) return false;
    const y = x.right;
    // left subtree of y is now the right subtree of x (can be null)
    x.right = y.left;
    if (y.left !== null) {
      // if left child of y is not null update its parent to x
      y.left.parent = x;
    }
    // update the parent of y
    y.parent = x.parent;
    if (x.parent === null) {
      // if x is the root, update y to be the root
      this.root = y;
    } else if (x === x.parent.left) {
      // x is a left child
      // update the parent of x to point to y
      x.parent.left = y;
    } else {
      // x is a right child
      // update the parent of x to point to y
      x.parent.right = y;
    }
    // update y as parent of x
    y.left = x;
    x.parent = y;
    // update heights
    this.updateHeight(x);
    this.updateHeight(y);
  }

  // Operate a right rotation:
  //    y is the left child of x (NOT NULL)
  //    y's right subtree becomes x's left subtree
  //    x becomes right child of y
  rightRotate(x) {
    // Returns false if x is not a valid node
    if (!(x instanceof Node)) return false;
    if (this.isEmpty()) return false;
    // y can't be null
    if (x.left === null) return false;
    const y = x.left;
    // right subtree of y is now the right subtree of x (can be null)
    x.left = y.right;
    if (y.right !== null) {
      // if right child of y is not null update its parent to x
      y.right.parent = x;
    }
    // update the parent of y
    y.parent = x.parent;
    if (x.parent === null) {
      // if x is the root, update y to be the root
      this.root = y;
    } else if (x === x.parent.left) {
      // x is a left child
      // update the parent of x to point to y
      x.parent.left = y;
    } else {
      // x is a right child
      // update the parent of x to point to y
      x.parent.right = y;
    }
    // update y as parent of x
    y.right = x;
    x.parent = y;
    // update heights
    this.updateHeight(x);
    this.updateHeight(y);
  }

  //   **********************************************************
  //                    DYNAMIC-SET OPERATIONS
  //   **********************************************************

  // Returns the node of this val, or null
  find(val) {
    if (this.isEmpty()) return false;
    let current = this.root;
    while (current !== null && current.val !== val) {
      if (current.val > val) {
        // check left
        current = current.left;
      } else {
        // check right
        current = current.right;
      }
    }
    return current;
  }

  // Returns true if this AVL Tree contains this val,
  // Otherwise returns false
  contains(val) {
    return this.find(val) !== null;
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

module.exports = AVLTree;
