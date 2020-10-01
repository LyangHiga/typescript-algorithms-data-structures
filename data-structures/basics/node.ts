class Node {
  next: null | Node;

  constructor(public key: string) {
    this.next = null;
  }
}

export = Node;
