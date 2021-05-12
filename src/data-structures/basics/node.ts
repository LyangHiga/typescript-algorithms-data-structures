class Node {
  next: null | Node;

  constructor(public key: any) {
    this.next = null;
  }
}

export default Node;
