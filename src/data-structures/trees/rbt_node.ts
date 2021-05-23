class RBNode {
  left: null | RBNode;
  right: null | RBNode;
  parent: null | RBNode;
  constructor(public val: number, public color: string) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = color;
  }
}

export default RBNode;
