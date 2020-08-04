class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
  }
}

class MinHeap {
  constructor() {
    this.values = [];
    // dict: key to array idx => you say the key it returns the idx
    this.idxs = {};
  }

  //   return true if this heap constains this key
  //   otherwise returns false
  contains(key) {
    if (this.values[this.idxs[key]] === undefined) return false;
    return true;
  }

  // return true if the element from index i is smaller than k idx element
  lessThan(i, k) {
    // out of bounds
    if (i < 0 || k < 0) return false;
    if (i > this.values.length - 1 || k > this.values.length - 1) return false;
    let val = this.values[i].val;
    let parent = this.values[k].val;
    if (val < parent) return true;
    return false;
  }

  //   return the parent's index of the ith node
  myParentIdx(i) {
    return Math.floor((i - 1) / 2);
  }

  //   return the children's index of the ith node
  myChildrenIdx(i) {
    // left 2 * i + 1 , right 2 * idx + 2
    return [2 * i + 1, 2 * i + 2];
  }

  bubbleUp(i, j) {
    //swap i and j
    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];

    // swap idxs elements in dict key to idx
    [this.idxs[this.values[i].key], this.idxs[this.values[j].key]] = [
      this.idxs[this.values[j].key],
      this.idxs[this.values[i].key],
    ];
  }

  // insert an element in the next free spot and rearrange
  //   return Heap
  enqueue(key, val) {
    // check whether this val belongs to this heap
    // to avoid duplicate keys
    if (this.contains(key)) return false;
    let node = new Node(key, val);
    this.values.push(node);
    // last position to insert this new node
    let idx = this.values.length - 1;
    // add the idx of this key on the dict
    this.idxs[key] = idx;
    let parentIdx = this.myParentIdx(idx);
    // bubble-up (while this new node is smaller than its parent)
    while (this.lessThan(idx, parentIdx)) {
      this.bubbleUp(idx, parentIdx);
      //   recalculate node idx, parent idx position
      idx = parentIdx;
      parentIdx = this.myParentIdx(idx);
    }
    return this;
  }

  //   update val of this key and return this heap
  //   if there is not any node with this key in this heap return false
  decreaseKey(key, newVal) {
    // check whether this key belongs to this heap
    if (!this.contains(key)) return false;
    //   get idx of this key
    let idx = this.idxs[key];
    //   update node with new val
    this.values[idx].val = newVal;
    let parentIdx = this.myParentIdx(idx);
    if (parentIdx < 0) return this;
    // bubble-up (while this new node is smaller than its parent)
    while (this.lessThan(idx, parentIdx)) {
      this.bubbleUp(idx, parentIdx);
      //   recalculate node idx, parent idx position
      idx = parentIdx;
      parentIdx = this.myParentIdx(idx);
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
    // delete from dict
    delete this.idxs[min.key];
    // update idx of the 'new root' in the dict
    this.idxs[this.values[0].key] = 0;
    // index of this node we have to rearrange and the idx of its children
    let idx = 0;
    let [lChild, rChild] = this.myChildrenIdx(idx);
    // to keep the smaller
    let smallIdx;
    // bubble-down (while any child is smaller than the parent)
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

      // swap idxs elements in dict key to idx
      [
        this.idxs[this.values[idx].key],
        this.idxs[this.values[smallIdx].key],
      ] = [
        this.idxs[this.values[smallIdx].key],
        this.idxs[this.values[idx].key],
      ];

      // update idx and its children
      idx = smallIdx;
      [lChild, rChild] = this.myChildrenIdx(idx);
    }
    return { element: min, heap: this };
  }

  // Remove the node from this respect key
  //   Return this HEAP
  deleteKey(key) {
    // check whether this key belongs to this heap
    if (this.values[this.idxs[key]] === undefined) return false;
    // if it is the last element of values: we dont need to rearrange
    if (this.idxs[key] === this.values.length - 1) {
      this.values.pop();
      delete this.idxs[key];
      return this;
    }
    //   get idx of this key
    let idx = this.idxs[key];
    // replace this node with the last one
    this.values[idx] = this.values.pop();
    // delete from dict
    delete this.idxs[key];
    // update idx of the 'new node in idx position' in the dict
    // we need to rearrange from idx to bellow
    this.idxs[this.values[idx].key] = idx;
    // get the children of idx
    let [lChild, rChild] = this.myChildrenIdx(idx);
    // to keep the smaller
    let smallIdx;
    // bubble-down (while any child is smaller than the parent)
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

      // swap idxs elements in dict key to idx
      [
        this.idxs[this.values[idx].key],
        this.idxs[this.values[smallIdx].key],
      ] = [
        this.idxs[this.values[smallIdx].key],
        this.idxs[this.values[idx].key],
      ];

      // update idx and its children
      idx = smallIdx;
      [lChild, rChild] = this.myChildrenIdx(idx);
    }
    return this;
  }
}

module.exports = MinHeap;
