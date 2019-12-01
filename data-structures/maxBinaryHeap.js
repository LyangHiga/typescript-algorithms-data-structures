class MaxBinaryHeap{
    constructor(){
        this.values = [];
    }

    // return if the element from index i is greater than k idx element
    greaterThan(i,k){
        // out of bounds
        if(i < 0||k <0 ) return false;
        if(i > this.length - 1 || k > this.length - 1) return false;
        let val = this.values[i];
        let parent = this.values[k];
        if(val > parent) return true;
        return false;
    }

    // insert an element in the next free spot and then sort the Heap if it's needed
    insert(val){
        this.values.push(val);
        let idx = this.values.length - 1;
        let parentIdx = Math.floor( (idx-1)/2);
        // sort
        while(this.greaterThan(idx,parentIdx)){
            //swap
            [this.values[idx],this.values[parentIdx]] = [this.values[parentIdx],this.values[idx]];
            idx = parentIdx;
            parentIdx = Math.floor((idx-1)/2);
        }
        return this;
    }

    // Remove the root (max), put the last element in the top and then rearrange
    // return the root and the new arrangement
    remove(){
        // if is empty return undefined
        if(this.values.length === 0 ) return undefined;
        const max = this.values[0];
        // replace the root with the last element
        this.values[0] = this.values.pop();
        let idx = 0;
        let lChild = (2 * idx) + 1;
        let rChild = (2 * idx) + 2;
        let greatIdx;
        while(this.greaterThan(lChild,idx) || this.greaterThan(rChild,idx)){
            if(this.greaterThan(lChild,rChild)){
                greatIdx = lChild;
            } else {
                greatIdx = rChild;
            }
            // swap element from idx with greater
            [this.values[idx],this.values[greatIdx]] = [this.values[greatIdx],this.values[idx]];
            // update idx and its children
            idx = greatIdx;
            lChild = (2 * idx) + 1;
            rChild = (2 * idx) + 2;
        }
        return {element:max,heap:this};
    }
}

let heap = new MaxBinaryHeap();
console.log(heap.insert(41));
console.log(heap.insert(39));
console.log(heap.insert(18));
console.log(heap.insert(27));
console.log(heap.insert(12));
console.log(heap.insert(55));
console.log(heap.insert(33));
console.log(heap.insert(1));
console.log(heap.insert(45));
console.log(heap.insert(200));
console.log(heap.remove());
console.log(heap.remove());


//              55
//        45          41
//    39     12    18   33
// 1     27

