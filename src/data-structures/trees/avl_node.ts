class AVLNode {
  parent: null | AVLNode;
  right: null | AVLNode;
  left: null | AVLNode;
  height: number;
  constructor(public val: number) {
    this.parent = null;
    this.right = null;
    this.left = null;
    this.height = 1;
  }
}

export default AVLNode;
