class HuffmanNode {
    right: null | HuffmanNode;
    left: null | HuffmanNode;
    height: number;
    min: number;
    constructor(public key:string, public f: number ) {
      this.right = null;
      this.left = null;
      this.height = 0;
      this.min = 0;
    }
  }
  
export = HuffmanNode;
  