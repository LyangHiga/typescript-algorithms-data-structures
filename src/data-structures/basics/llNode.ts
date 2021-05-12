import LinkedList from "./linkedList";
class LLNode<T> {
  next: null | LLNode<T>;
  constructor(public key: T, public list: LinkedList<T>) {
    this.next = null;
  }
}

export default LLNode;
