class Node {
    constructor(val){
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

// Queue implementation, FIFO, through linked list
class Queue{
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    // add to the end and return the size of this queue
    enQueue(node){
        if(this.size === 0 ){
            this.first = node;
            this.last = node;
        } else {
            this.last.next = node;
            this.last = node;
        }
        this.size++;
        return this.size;
    }

    // remove the first node and return it
    deQueue(){
        if(this.size === 0) return null
        let removed = this.first;
        if(this.size === 1){
            this.first = null;
            this.last = null;
        } else {
            this.first = removed.next;
            removed.next = null;
        }
        this.size--;
        return removed;
    }
}

// simple implementation using SLL, shift and unshift, here called as push and pop
// First in Last Out
class Stack {
    constructor(){
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    // add a node at the beginning and return the size of this stack
    push(node){
        if(this.size === 0){
            this.first = node;
            this.last = node;
        } else {
            node.next = this.first;
            this.first = node;
        }
        this.size++;
        return this.size;
    }
    // remove the first node and return it
    pop(){
        // empty stack 
        if(this.size === 0 ) return null;
        let removed = this.first;
        if(this.size === 1){
            this.first = null;
            this.last = null;
        } else {
            this.first = removed.next;
            removed.next = null;
        }  
        this.size--;
        return removed;
    }
}

class BST {
    constructor(){
        this.root = null;
    }

    // insert a new node and keep the bst sorted
    insert(val){
        let node = new Node(val);
        if(!this.root){
            this.root = node;
            return this;
        }
        let current = this.root;
        while(current !== null){
            if(current.val === node.val) return undefined;
            if(current.val > node.val){
                // check left
                if(!current.left){
                    current.left = node;
                    return this;
                }
                // update current to left
                current = current.left;
            } else if(current.val < node.val) {
                // check right
                if(!current.right){
                    current.right = node;
                    return this;
                }
                // update current
                current = current.right;
            }
        }
    }
    // return true if we find val in this tree, otherwise return false
    find(val) {
        if(!this.root) return false
        let current = this.root;
        while(current !== null){
            // if we find return true
            if(current.val === val) return true;
            // check left
            if(current.val > val){
                current = current.left;
            } else {
                // check right
                current = current.right;
            }
        }
        // if we didnt find return flase
        return false;
    }

    bfs(){
        if(!this.root) return undefined;
        let q = new Queue();
        let visited= [];
        let current;
        q.enQueue(this.root);
        while(q.size !== 0){
            current = q.deQueue();
            visited.push(current.val);
            if(current.left) q.enQueue(current.left);
            if(current.right) q.enQueue(current.right);
        }
        return visited;
    }
    
    dfsPreOrder(){
        if(!this.root) return undefined;
        let stack = new Stack();
        let visited = [];
        let current;
        stack.push(this.root);
        while(stack.size !== 0){
            current = stack.pop();
            visited.push(current.val);
            if(current.right) stack.push(current.right);
            if(current.left) stack.push(current.left);
        }
        return visited;
    }
}

let tree = new BST();
// console.log(tree.insert(7));
// console.log(tree.insert(3));
// console.log(tree.insert(10));
// console.log(tree.insert(10));
// console.log(tree.insert(13));
// console.log(tree.insert(1));
// console.log(tree.insert(17));
// console.log(tree.find(7));
// console.log(tree.find(60));
// console.log(tree.find(17));
// console.log(tree.find(1));
tree.insert(10);
tree.insert(6);
tree.insert(15);
tree.insert(3);
tree.insert(8);
tree.insert(20);
// console.log(tree.bfs());
console.log(tree.dfsPostOrder());
// console.log(tree.dfsPreOrder());