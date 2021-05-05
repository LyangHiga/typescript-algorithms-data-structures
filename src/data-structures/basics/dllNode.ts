class DLLNode {
  next: null | DLLNode;
  prev: null | DLLNode;
  constructor(public val: any) {
    this.next = null;
    this.prev = null;
  }
}

export = DLLNode;
