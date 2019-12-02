class Node{
    constructor(val,priority){
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue{
    constructor(){
        this.values = [];
    }

    // return if the element from index i is greater than k idx element
    greaterThan(i,k){
        // out of bounds
        if(i < 0||k <0 ) return false;
        if(i > this.values.length - 1 || k > this.values.length - 1) return false;
        let val = this.values[i].priority;
        let parent = this.values[k].priority;
        if(val > parent) return true;
        return false;
    }

    // insert an element in the next free spot and then sort the Heap if it's needed
    enqueue(val,priority){
        let node = new Node(val,priority);
        this.values.push(node);
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
    dequeue(){
        // if is empty return undefined
        if(this.values.length === 0 ) return undefined;
        if(this.values.length === 1  ) return {element:this.values.pop(),heap:this};
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

let pq = new PriorityQueue();
console.log(pq.enqueue("first",1));
console.log(pq.enqueue("second",2));
console.log(pq.enqueue("third",3));
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

