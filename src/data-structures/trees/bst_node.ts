class BSTNode {
  left: null | BSTNode;
  right: null | BSTNode;
  parent: null | BSTNode;
  constructor(public val: number) {
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

export default BSTNode;
