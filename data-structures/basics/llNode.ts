import LinkedList from "./linkedList";
class LLNode {
  next: null | LLNode;
  constructor(public key: string, public list: LinkedList) {
    this.next = null;
  }
}

export = LLNode;
