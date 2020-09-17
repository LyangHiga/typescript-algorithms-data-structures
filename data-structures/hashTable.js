const DoublyLinkedList = require('./doublyList');

class Node {
  constructor(key, val, hash) {
    this.key = key;
    this.val = val;
    this.hash = hash;
  }
}

class HashTable {
  constructor(m) {
    // number of slots available: the capacity of this HT
    // must be a Prime number not too close an exact power of 2
    this.m = m;
    this.keyMap = new Array(m);
    // number of elements already in this HT
    this.n = 0;
    // @TODO add alpha= n/m
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  _hash = (key) => {
    return key % this.m;
  };

  _normalize = (hash) => {
    return (hash & 0x7fffffff) % this.m;
  };

  bucketSearch = (i, key) => {
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
  set(key, val) {
    // hash the index
    const hash = this._hash(key);
    const node = new Node(key, val, hash);
    const i = this._normalize(hash);
    // separate chaining
    if (!this.keyMap[i]) {
      this.keyMap[i] = new DoublyLinkedList();
    }
    if (this.bucketSearch(i, key)) return null;
    this.keyMap[i].push(node);
    this.size++;
    // @TODO Resize()
    // @TODO Calculate new m and ALPHA
    return node;
  }

  // return val
  get(key) {
    const hash = this._hash(key);
    const i = this._normalize(hash);
    return this.bucketSearch(i, key);
  }

  // Returns true if this HT contains this k
  // otherwise Retuns false
  has(key) {
    const hash = this._hash(key);
    const i = this._normalize(hash);
    const node = this.bucketSearch(i, key);
    if (node) return true;
    return false;
  }

  // return all unique values
  values() {
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
  }

  // return all unique keys
  keys() {
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
  }
}

module.exports = HashTable;
