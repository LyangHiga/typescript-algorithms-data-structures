class Node {
  constructor(val, key) {
    this.val = val;
    this.key = key;
  }
}

class MinHeap {
  constructor() {
    this.values = [];
    // dict: val to array idx => you say the val it returns the idx
    this.idxs = {};
  }

  // return true if the element from index i is smaller than k idx element
  lessThan(i, k) {
    // out of bounds
    if (i < 0 || k < 0) return false;
    if (i > this.values.length - 1 || k > this.values.length - 1) return false;
    let key = this.values[i].key;
    let parent = this.values[k].key;
    if (key < parent) return true;
    return false;
  }

  // insert an element in the next free spot and then sort the Heap if it's needed
  //   return Heap sorted
  enqueue(val, key) {
    let node = new Node(val, key);
    this.values.push(node);
    // last position to insert this new node
    let idx = this.values.length - 1;
    // add idx of this val
    this.idxs[val] = idx;
    // parent of this new node
    let parentIdx = Math.floor((idx - 1) / 2);
    // sort (while this new node is smaller than its parent)
    while (this.lessThan(idx, parentIdx)) {
      //swap
      [this.values[idx], this.values[parentIdx]] = [
        this.values[parentIdx],
        this.values[idx],
      ];

      // swap idxs elements in dict val to idx
      [
        this.idxs[this.values[idx].val],
        this.idxs[this.values[parentIdx].val],
      ] = [
        this.idxs[this.values[parentIdx].val],
        this.idxs[this.values[idx].val],
      ];
      //   recalculate node, parent idx position
      idx = parentIdx;
      parentIdx = Math.floor((idx - 1) / 2);
    }
    return this;
  }

  //   update node and return this or
  //   return false if there is not a node with this val in this heap
  decrease(val, newKey) {
    // check whether this val belongs to this heap
    if (this.values[this.idxs[val]] === undefined) return false;
    //   get idx of this val
    let idx = this.idxs[val];
    //   update node with new val
    this.values[idx].val = newKey;
    let parentIdx = Math.floor((idx - 1) / 2);
    if (parentIdx < 0) return this;
    while (this.lessThan(idx, parentIdx)) {
      //swap
      [this.values[idx], this.values[parentIdx]] = [
        this.values[parentIdx],
        this.values[idx],
      ];

      // swap idxs elements in dict val to idx
      [
        this.idxs[this.values[idx].val],
        this.idxs[this.values[parentIdx].val],
      ] = [
        this.idxs[this.values[parentIdx].val],
        this.idxs[this.values[idx].val],
      ];
      //   recalculate node, parent idx position
      idx = parentIdx;
      parentIdx = Math.floor((idx - 1) / 2);
    }
    return this;
  }

  // Remove the root (min),
  //   put the last element in the top and then rearrange
  // return the root and the new arrangement
  dequeue() {
    // if is empty return undefined
    if (this.values.length === 0) return undefined;
    if (this.values.length === 1)
      return { element: this.values.pop(), heap: this };
    const min = this.values[0];
    // replace the root with the last element
    this.values[0] = this.values.pop();
    // index of this node we have to sort and the idx of its children
    let idx = 0;
    let lChild = 2 * idx + 1;
    let rChild = 2 * idx + 2;
    // to keep the smaller
    let smallIdx;
    // sort (while some child is smaller than the parent)
    while (this.lessThan(lChild, idx) || this.lessThan(rChild, idx)) {
      if (this.lessThan(lChild, rChild)) {
        smallIdx = lChild;
      } else if (this.lessThan(rChild, lChild)) {
        smallIdx = rChild;
      } else {
        smallIdx = lChild;
      }
      // swap element from idx with greater
      [this.values[idx], this.values[smallIdx]] = [
        this.values[smallIdx],
        this.values[idx],
      ];

      // swap idxs elements in dict val to idx
      [
        this.idxs[this.values[idx].val],
        this.idxs[this.values[smallIdx].val],
      ] = [
        this.idxs[this.values[smallIdx].val],
        this.idxs[this.values[idx].val],
      ];

      // update idx and its children
      idx = smallIdx;
      lChild = 2 * idx + 1;
      rChild = 2 * idx + 2;
    }
    return { element: min, heap: this };
  }
}

module.exports = MinHeap;

let pq = new MinHeap();
console.log(pq.enqueue('first', 1));
console.log(pq.enqueue('second', 2));
console.log(pq.enqueue('second', 2));
console.log(pq.enqueue('second', 2));
console.log(pq.enqueue('third', 3));
console.log(pq.enqueue('third', 3));
console.log(pq.dequeue());
console.log(pq.dequeue());
console.log(pq.dequeue());
console.log(pq.dequeue());
console.log(pq.dequeue());
console.log(pq.dequeue());
console.log(pq.dequeue());

//              55
//        45          41
//    39     12    18   33
// 1     27
