class ForestNode {
  rank: number;
  parent: ForestNode;
  constructor(public key: string) {
    this.rank = 0;
    this.parent = this;
  }
}

export = ForestNode;
