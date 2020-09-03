const Queue = require('./queue');
const Stack = require('./stack');

class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Inserts a node in the right position and rearrange
  // Returns this BST
  // Returns false whether this val is already in this BST
  insert(val) {
    let node = new Node(val);
    // check if this BST is empty
    if (!this.root) {
      this.root = node;
      return this;
    }
    let current = this.root;
    while (current !== null) {
      // duplicate val
      if (current.val === node.val) return false;
      // check left
      if (current.val > node.val) {
        if (!current.left) {
          current.left = node;
          return this;
        }
        // update current to left
        current = current.left;
        // check right
      } else {
        if (!current.right) {
          current.right = node;
          return this;
        }
        // update current
        current = current.right;
      }
    }
  }

  //   **********************************************************
  //                            SEARCH
  //   **********************************************************

  // Returns true if this BST contains this val,
  // Otherwise returns false
  contains(val) {
    if (!this.root) return false;
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

  //   **********************************************************
  //                        TRANSVERSING
  //   **********************************************************

  bfs() {
    if (!this.root) return undefined;
    let q = new Queue();
    let visited = [];
    let current;
    q.enQueue(this.root);
    while (q.size !== 0) {
      current = q.deQueue();
      visited.push(current.val);
      if (current.left) q.enQueue(current.left);
      if (current.right) q.enQueue(current.right);
    }
    return visited;
  }

  dfsPreOrder() {
    if (!this.root) return undefined;
    let stack = new Stack();
    let visited = [];
    let current;
    stack.push(this.root);
    while (stack.size !== 0) {
      current = stack.pop();
      visited.push(current.val);
      if (current.right) stack.push(current.right);
      if (current.left) stack.push(current.left);
    }
    return visited;
  }
}

module.exports = BST;
