class MaxBinaryHeap{
    constructor(){
        this.values = [];
    }

    // return if element from index i is greater than its parent
    checkParent(i,k){
        if(i < 0||k <0 ) return false;
        let val = this.values[i];
        let parent = this.values[k];
        if(val > parent) return true;
        return false;
    }

    insert(val){
        this.values.push(val);
        let idx = this.values.length - 1;
        let parentIdx = Math.floor( (idx-1)/2);
        // sort
        while(this.checkParent(idx,parentIdx)){
            //swap
            [this.values[idx],this.values[parentIdx]] = [this.values[parentIdx],this.values[idx]];
            idx = parentIdx;
            parentIdx = Math.floor((idx-1)/2);
        }
        return this;
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
