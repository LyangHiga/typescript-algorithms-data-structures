import DoublyLinkedList from "../basics/doublyList";
import HTNode from "./htNode";

class HashTable {
  keyMap: DoublyLinkedList[];
  n: number;
  constructor(public m: number) {
    //   m:
    // number of slots available: the capacity of this HT
    // must be a Prime number not too close an exact power of 2
    this.keyMap = new Array(m);
    // number of elements already in this HT
    this.n = 0;
    // @TODO add alpha= n/m
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  _hash = (key: number) => {
    return key % this.m;
  };

  _normalize = (hash: number) => {
    return (hash & 0x7fffffff) % this.m;
  };

  bucketSearch = (i: number, key: number) => {
    if (!this.keyMap[i]) return null;
    let x = this.keyMap[i].head;
    while (x !== null) {
      if (x.val.key === key) return x.val;
      x = x.next;
    }
    return null;
  };

  //   **********************************************************
  //                          HT OPERATIONS
  //   **********************************************************

  // add a new key, val
  set = (key: number, val: any) => {
    // hash the index
    const hash = this._hash(key);
    const node = new HTNode(key, val, hash);
    const i = this._normalize(hash);
    // separate chaining
    if (!this.keyMap[i]) {
      this.keyMap[i] = new DoublyLinkedList();
    }
    if (this.bucketSearch(i, key)) return null;
    this.keyMap[i].push(node);
    this.n++;
    // @TODO Resize()
    // @TODO Calculate new m and ALPHA
    return node;
  };

  // return val
  get = (key: number) => {
    const hash = this._hash(key);
    const i = this._normalize(hash);
    return this.bucketSearch(i, key);
  };

  // Returns true if this HT contains this k
  // otherwise Retuns false
  has = (key: number) => {
    const hash = this._hash(key);
    const i = this._normalize(hash);
    const node = this.bucketSearch(i, key);
    if (node) return true;
    return false;
  };

  // return all unique values
  values = () => {
    let arr = [];
    let x;
    for (let i = 0; i < this.keyMap.length; i++) {
      if (this.keyMap[i]) {
        x = this.keyMap[i].head;
        while (x !== null) {
          arr.push(x.val.val);
          x = x.next;
        }
      }
    }
    return arr;
  };

  // return all unique keys
  keys = () => {
    let arr = [];
    let x;
    for (let i = 0; i < this.keyMap.length; i++) {
      if (this.keyMap[i]) {
        x = this.keyMap[i].head;
        while (x !== null) {
          arr.push(x.val.key);
          x = x.next;
        }
      }
    }
    return arr;
  };
}

export = HashTable;
