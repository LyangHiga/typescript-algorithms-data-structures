import BHNode from "./bHNode";

class MaxBinaryHeap<T> {
  values: BHNode<T>[];
  idxs: Map<T, number>;
  size: number;
  constructor() {
    this.values = [];
    // map: key to array idx => you say the key it returns the idx
    this.idxs = new Map();
    this.size = 0;
  }

  //   **********************************************************
  //                            HELPERS
  //   **********************************************************

  // return if the element from index i is greater than k idx element
  greaterThan = (i: number, k: number) => {
    // out of bounds
    if (i < 0 || k < 0) return false;
    if (i > this.size - 1 || k > this.size - 1) return false;
    if (this.values[i].val > this.values[k].val) return true;
    return false;
  };

  // Returns the parent's index of the ith node
  myParentIdx = (i: number) => {
    return Math.floor((i - 1) / 2);
  };

  // Returns the children's index of the ith node
  myChildrenIdx = (i: number) => {
    // left 2 * i + 1 , right 2 * idx + 2
    return [2 * i + 1, 2 * i + 2];
  };

  // swap idxs elements in map key to idx
  swapIdxs = (a: T, b: T) => {
    const temp = this.idxs.get(a)!;
    this.idxs.set(a, this.idxs.get(b)!);
    this.idxs.set(b, temp);
  };

  // Rearrange values and map
  bubbleUp = (i: number, j: number) => {
    //swap i and j
    [this.values[i], this.values[j]] = [this.values[j], this.values[i]];

    // swap idxs elements in map key to idx
    const a = this.values[i].key;
    const b = this.values[j].key;
    this.swapIdxs(a, b);
  };

  // Returns the greater child idx
  // Rearrange values and map
  bubbleDown = (idx: number, l: number, r: number) => {
    // to keep track of the greater child
    let greatIdx;
    if (this.greaterThan(l, r)) {
      greatIdx = l;
    } else if (this.greaterThan(r, l)) {
      greatIdx = r;
      // if they have the same val we take the left child as the greater one
    } else {
      greatIdx = l;
    }
    // swap element from idx with greater
    [this.values[idx], this.values[greatIdx]] = [
      this.values[greatIdx],
      this.values[idx],
    ];

    const a = this.values[idx].key;
    const b = this.values[greatIdx].key;
    this.swapIdxs(a, b);

    return greatIdx;
  };

  // Returns true if this heap constains this key
  // Otherwise returns false
  contains = (key: T) => {
    if (this.idxs.get(key) === undefined) return false;
    return true;
  };

  // Returns true if this heap is empty
  // Otherwise returns false
  isEmpty = () => {
    return this.size === 0;
  };

  //   **********************************************************
  //                            CREATING
  //   **********************************************************

  // arr: array or Map
  // keys: array
  // If arr is an array
  //    Each node of this Heap will be the (keys[i], arr[i]) where i is the index,
  //    arr and keys MUST have the same size
  //    Duplicate keys are not allowed. Returns false
  // If arr is a Map:
  //    each node of this Heap will be the (key, val) of each element of arr
  //    In this case second param <keys> is not used
  // In any case the Heap is build in linear time
  // Returns: this Heap
  buildHeap = (arr: number[] | Map<T, number>, keys: T[]) => {
    // Returns false if this heap is not empty
    if (!this.isEmpty()) return false;
    // arr is an array
    if (Array.isArray(arr)) {
      // arr is array AND keys is also an array
      if (Array.isArray(keys)) {
        // if arr and keys dont have the same size returns false
        if (arr.length !== keys.length) return false;
        // set size of this heap to the size of arr
        this.size = arr.length;
        // inject arr and keys in this.value (keys[i],arr[i])
        for (let i = 0; i < this.size; i++) {
          // Avoiding duplicate keys
          if (this.contains(keys[i])) return false;
          this.values.push(new BHNode(keys[i], arr[i]));
          this.idxs.set(keys[i], i);
        }
      }
    } else if (arr instanceof Map) {
      let i = 0;
      arr.forEach((value, key) => {
        this.values.push(new BHNode(key, value));
        this.idxs.set(key, i);
        i++;
        this.size++;
      });
    }
    // to heapify all sub heaps with root in index i
    // all leaves are already heaps
    let lChild, rChild, idx;
    for (let i = Math.floor(this.size / 2); i >= 0; i--) {
      [lChild, rChild] = this.myChildrenIdx(i);
      idx = i;
      // bubble-down (while any child is greater than the parent)
      while (this.greaterThan(lChild, idx) || this.greaterThan(rChild, idx)) {
        // update idx and its children
        idx = this.bubbleDown(idx, lChild, rChild);
        [lChild, rChild] = this.myChildrenIdx(idx);
      }
    }
    return this;
  };

  //   **********************************************************
  //                            ACCESSING
  //   **********************************************************

  // Returns the root node
  // Returns null if this Heap is empty
  findMax = () => {
    if (this.isEmpty()) return null;
    return this.values[0];
  };

  // Returns the value of this key
  // Returns null whether this key does not belong to this heap
  valueOf = (key: T) => {
    if (!this.contains(key)) return null;
    const idx = this.idxs.get(key)!;
    return this.values[idx];
  };

  //   **********************************************************
  //                            INSERT
  //   **********************************************************

  // Inserts a node (key,val) in the last position and rearrange
  // Returns Heap
  // Returns false whether this key is already in this heap
  enqueue = (key: T, val: number) => {
    // to avoid duplicate keys
    if (this.contains(key)) return false;
    let node = new BHNode(key, val);
    this.values.push(node);
    // insert in the last position
    let idx = this.values.length - 1;
    // add the idx of this key on the map
    this.idxs.set(key, idx);
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
  };

  //   **********************************************************
  //                            UPDATE
  //   **********************************************************

  // Update the val of this key
  // Returns true if works
  // Returns false if there is not any node with this key in this heap
  // Returns undefined if newVal is equal to the actual val of key
  // Returns -1 if newVal is greater than the actual val of key
  decreaseKey = (key: T, newVal: number) => {
    // check whether this key belongs to this heap
    if (!this.contains(key)) return false;
    let idx = this.idxs.get(key)!;
    // to ensure newVal < val
    if (newVal > this.values[idx].val) return -1;
    // if they are the same return this
    if (newVal === this.values[idx].val) return;
    // update node with new val
    this.values[idx].val = newVal;
    let [lChild, rChild] = this.myChildrenIdx(idx);
    // bubble-down (while any child is greater than the parent)
    while (this.greaterThan(lChild, idx) || this.greaterThan(rChild, idx)) {
      // update idx and its children
      idx = this.bubbleDown(idx, lChild, rChild);
      [lChild, rChild] = this.myChildrenIdx(idx);
    }
    return true;
  };

  // Update the val of this key
  // Returns true if works
  // Returns false if there is not any node with this key in this heap
  // Returns undefined if newVal is equal to the actual val
  // Returns -1 if newVal is smaller than the actual val
  increaseKey = (key: T, newVal: number) => {
    // check whether this key belongs to this heap
    if (!this.contains(key)) return false;
    let idx = this.idxs.get(key)!;
    // to ensure newVal > val
    if (newVal < this.values[idx].val) return -1;
    // if they are the same just return this
    if (newVal === this.values[idx].val) return;
    // update node with new val
    this.values[idx].val = newVal;
    let parentIdx = this.myParentIdx(idx);
    // bubble-up (while this new node is grater than its parent)
    while (this.greaterThan(idx, parentIdx)) {
      this.bubbleUp(idx, parentIdx);
      // recalculate node idx, parent idx position
      idx = parentIdx;
      parentIdx = this.myParentIdx(idx);
    }
    return this;
  };

  // Returns false if there is not any node with this key in this heap
  // Returns undefined if newVal equals to the actual val
  // if newVal is greater than the actual val calls increaseKey
  // if newVal is smaller than the actual val calls decreaseKey
  updateKey = (key: T, newVal: number) => {
    // check whether this key belongs to this heap
    if (!this.contains(key)) return false;
    //   get idx of this key
    let idx = this.idxs.get(key)!;
    if (newVal === this.values[idx].val) return;
    if (newVal > this.values[idx].val) return this.increaseKey(key, newVal);
    if (newVal < this.values[idx].val) return this.decreaseKey(key, newVal);
  };

  //   **********************************************************
  //                            DELETE
  //   **********************************************************

  // Removes the root (max),
  // Returns the root and the new arrangement
  // Returns null if this heap is empty
  dequeue = () => {
    if (this.isEmpty()) return null;
    if (this.values.length === 1) {
      this.size--;
      return this.values.pop();
    }
    const max = this.values[0];
    // replace the root with the last element
    this.values[0] = this.values.pop()!;
    this.size--;
    // delete the last root node from map
    this.idxs.delete(max.key);
    // update idx of the 'new root' in the map
    this.idxs.set(this.values[0].key, 0);
    // index of this node we have to rearrange and the idx of its children
    let idx = 0;
    let [lChild, rChild] = this.myChildrenIdx(idx);
    // bubble-down (while any child is greater than the parent)
    while (this.greaterThan(lChild, idx) || this.greaterThan(rChild, idx)) {
      // update idx and its children
      idx = this.bubbleDown(idx, lChild, rChild);
      [lChild, rChild] = this.myChildrenIdx(idx);
    }
    return max;
  };

  // Removes the node from this respect key
  // Returns this HEAP
  // Returns false whether this key does not belong to this heap
  deleteKey = (key: T) => {
    if (!this.contains(key)) return false;
    // if it is the last element of values: we dont need to rearrange
    if (this.idxs.get(key) === this.size - 1) {
      this.values.pop();
      this.idxs.delete(key);
      this.size--;
      return this;
    }
    let idx = this.idxs.get(key)!;
    // replace this node with the last one
    this.values[idx] = this.values.pop()!;
    this.size--;
    // delete from map
    this.idxs.delete(key);
    // update idx of the 'new node in idx position' in the map
    // we need to rearrange from idx to bellow
    this.idxs.set(this.values[idx].key, idx);
    // get the children of idx
    let [lChild, rChild] = this.myChildrenIdx(idx);
    // bubble-down (while any child is greater than the parent)
    while (this.greaterThan(lChild, idx) || this.greaterThan(rChild, idx)) {
      // update idx and its children
      idx = this.bubbleDown(idx, lChild, rChild);
      [lChild, rChild] = this.myChildrenIdx(idx);
    }
    return this;
  };

  // to clear the heap instance and frees memory
  clear() {
    this.size = 0;
    while (!this.isEmpty()) this.values.pop();
    for (let k of this.idxs) this.idxs.delete(k[0]);
  }
}

export = MaxBinaryHeap;
