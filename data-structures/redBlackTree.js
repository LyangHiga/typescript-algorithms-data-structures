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

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Inserts a node in the right (correct) position and rearrange
  // Returns this RBT
  // Returns false whether this val is already in this RBT
  insert(val) {
    // new node has color red
    let node = new Node(val, 'red');
    if (this.isEmpty()) {
      this.size++;
      this.root = node;
      this.insertFixup();
      return this;
    }
    let current = this.root;
    while (current !== null) {
      // duplicate val
      if (current.val === node.val) return false;
      // check left
      if (current.val > node.val) {
        if (!current.left) {
          node.parent = current;
          current.left = node;
          this.size++;
          this.insertFixup();
          return this;
        }
        // update current to left
        current = current.left;
        // check right
      } else {
        if (!current.right) {
          node.parent = current;
          current.right = node;
          this.size++;
          this.insertFixup();
          return this;
        }
        // update current
        current = current.right;
      }
    }
  }

  // To fix the RBT if any property is violated
  //      Two reds in a row
  //      Root is not black
  // CASE 1: the uncle of z (new node) y is also red (z's grandpa MUST be black)
  //      Color both z's parent and uncle black
  //      And z's grandpa red
  // CASE 2/3 : z's uncle y is black and z is right/ left child
  //      Left rotation in case 2 and changing z pointer -> CASE 3
  //      Right rotation and color changing between z's parent and grandpa
  insertFixup(z) {
    // two reds in a row
    while (z.parent.color === 'red') {
      // the parent of z is a left child
      if (z.parent === z.parent.parent.left) {
        // y (z's uncle) is a right child
        const y = z.parent.parent.right;
        // CASE 1
        if (y.color === red) {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          // to update (propagate) z
          z = z.parent.parent;
        } else {
          // CASE 2
          if (z === z.parent.right) {
            // to update (propagate) z
            z = z.parent;
            this.leftRotate(z);
          }
          // CASE 3
          z.parent.color = 'black';
          z.parent.parent.color = 'red';
          this.rightRotate(z.parent.parent);
        }
      }
      // the parent of z is a right child
      else {
        // y (z's uncle) is a left child
        const y = z.parent.parent.left;
        // CASE 1
        if (y.color === red) {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          // to update (propagate) z
          z = z.parent.parent;
        } else {
          // CASE 2
          if (z === z.parent.left) {
            // to update (propagate) z
            z = z.parent;
            this.rightRotate(z);
          }
          // CASE 3
          z.parent.color = 'black';
          z.parent.parent.color = 'red';
          this.left(z.parent.parent);
        }
      }
    }
    // Root must be black
    this.root.color = 'black';
  }
}
