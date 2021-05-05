class FHNode {
  parent: null | FHNode;
  child: null | FHNode;
  left: null | FHNode;
  right: null | FHNode;
  degree: number;
  mark: boolean;

  constructor(public key: string, public val: number) {
    // LCRS representation
    this.parent = null;
    this.child = null;
    // siblings
    this.left = null;
    this.right = null;
    // number of children
    this.degree = 0;
    // to control child lost
    this.mark = false;
  }
}

export = FHNode;
