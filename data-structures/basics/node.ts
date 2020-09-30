class Node {
  next: null | Node;

  constructor(public key: string | number) {
    this.next = null;
  }
}

export = Node;
