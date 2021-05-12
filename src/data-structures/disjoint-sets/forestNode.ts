class ForestNode<T> {
  rank: number;
  parent: ForestNode<T>;
  constructor(public key: T) {
    this.rank = 0;
    this.parent = this;
  }
}

export default ForestNode;
