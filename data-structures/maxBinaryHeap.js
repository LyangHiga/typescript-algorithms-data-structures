class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
  }
}

class MaxBinaryHeap {
  constructor() {
    this.values = [];
    // dict: key to array idx => you say the key it returns the idx
    this.idxs = {};
    this.size = 0;
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // return if the element from index i is greater than k idx element
  greaterThan(i, k) {
    // out of bounds
    if (i < 0 || k < 0) return false;
    if (i > this.size - 1 || k > this.size - 1) return false;
    if (this.values[i].val > this.values[k].val) return true;
    return false;
  }

  // Returns the parent's index of the ith node
  myParentIdx(i) {
    return Math.floor((i - 1) / 2);
  }

  // Returns the children's index of the ith node
  myChildrenIdx(i) {
    // left 2 * i + 1 , right 2 * idx + 2
    return [2 * i + 1, 2 * i + 2];
  }

  // Rearrange values and dict
  bubbleUp(i, j) {
    //swap i and j
    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];

    // swap idxs elements in dict key to idx
    [this.idxs[this.values[i].key], this.idxs[this.values[j].key]] = [
      this.idxs[this.values[j].key],
      this.idxs[this.values[i].key],
    ];
  }

  // Returns true if this heap constains this key
  // Otherwise returns false
  contains(key) {
    if (this.values[this.idxs[key]] === undefined) return false;
    return true;
  }

  // Returns true if this heap is empty
  // Otherwise returns false
  isEmpty() {
    return this.size === 0;
  }

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Inserts a node (key,val) in the last position and rearrange
  // Returns Heap
  // Returns false whether this key is already in this heap
  enqueue(key, val) {
    // to avoid duplicate keys
    if (this.contains(key)) return false;
    let node = new Node(key, val);
    this.values.push(node);
    // insert in the last position
    let idx = this.values.length - 1;
    // add the idx of this key on the dict
    this.idxs[key] = idx;
    this.size++;
    let parentIdx = this.myParentIdx(idx);
    // bubble-up (while this new node is greater than its parent)
    while (this.greaterThan(idx, parentIdx)) {
      this.bubbleUp(idx, parentIdx);
      // recalculate node idx, parent idx position
      idx = parentIdx;
      parentIdx = this.myParentIdx(idx);
    }
    return this;
  }

  // Removes the root (max),
  // Returns the root and the new arrangement
  // Returns null if this heap is empty
  dequeue() {
    // if is empty return undefined
    if (this.isEmpty()) return null;
    if (this.values.length === 1) {
      this.size--;
      return { element: this.values.pop(), heap: this };
    }
    const max = this.values[0];
    // replace the root with the last element
    this.values[0] = this.values.pop();
    this.size--;
    let idx = 0;
    let [lChild, rChild] = this.myChildrenIdx(idx);
    let greatIdx;
    while (this.greaterThan(lChild, idx) || this.greaterThan(rChild, idx)) {
      if (this.greaterThan(lChild, rChild)) {
        greatIdx = lChild;
      } else {
        greatIdx = rChild;
      }
      // swap element from idx with greater
      [this.values[idx], this.values[greatIdx]] = [
        this.values[greatIdx],
        this.values[idx],
      ];

      // swap idxs elements in dict key to idx
      [
        this.idxs[this.values[idx].key],
        this.idxs[this.values[greatIdx].key],
      ] = [
        this.idxs[this.values[greatIdx].key],
        this.idxs[this.values[idx].key],
      ];

      // update idx and its children
      idx = greatIdx;
      [lChild, rChild] = this.myChildrenIdx(idx);
    }
    return { element: max, heap: this };
  }
}
