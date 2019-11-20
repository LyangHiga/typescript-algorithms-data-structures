// a value and a ponter to the next element
class Node {
    constructor(val){
        this.val = val;
        this.next = null;
    }
}

// head: first element
// tail: last one
// length: number of elements
class singlyLinkedList{
    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    // add an element at the last position
    push(val){
        const node = new Node(val);
        if(!this.head){
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.length++ ;
        return this;
    }

    // removes the last element and return it
    pop(){
        // return undefined if it's an empty list 
        if(!this.head) return ;
        const last = this.tail;
        // if there is only an element, head and tail will be null;
        if(this.length === 1){
            this.head = null;
            this.tail = null;
            this.length = 0;
            return last;
        }
        // we need to assign a the element that points to tail as the new tail
        let node = this.head;
        while(node !== this.tail){
            if(node.next === this.tail){
                this.tail = node;
                this.tail.next = null;
                this.length-- ;
                return last;
            }
            node = node.next;
        }
    }

    // removes the first element and return it
    shift(){
        if(!this.head) return;
        
        const first = this.head;
        if(this.length === 1 ){
            this.head = null;
            this.tail = null;
            this.length = 0;
            return first;
        }

        this.head = this.head.next;
        this.length--;
        return first;
    }

    // add an element in the beginning of the list
    unshift(val){
        let node = new Node(val);

        if(!this.head){
            this.head = node;
            this.tail = node;
            this.length = 1;
            return this;
        }
        
        node.next = this.head;
        this.head = node;
        this.length++;
        return this;
    }

    // returns the kth element 
    get(k){
        // negative index or empty list or out of range
        if(k<0 || this.length === 0 || k >= this.length) return null;
        let count = 0;
        let node = this.head;
        while(count !== k){
            node = node.next;
            count++
        }
        return node;
    }

    // set the kth element with val
    set(k,val){
        let node = this.get(k);
        if(!node) return false;
        node.val = val;
        return true;
    }

    // insert a new node in the kth position
    insert(k,val){
        if(k<0 || k > this.length) return false;
        if(k===0){
            this.unshift(val);
            return true;
        }
        if(k===this.length){
            this.push(val);
            return true;
        }
        let node = this.get(k-1);
        let newNode = new Node(val);
        newNode.next = node.next;
        node.next = newNode;
        this.length++ ;
        return true;
    }

    // remove the node from kth position, and return its value
    remove(k){
        if(k<0 || k > this.length-1) return;
        if(k === 0 ) return this.shift();
        if(k === this.length-1) return this.pop();
        let node = this.get(k-1);
        let removed = node.next;
        node.next = removed.next;
        removed.next = null;
        this.length-- ;
        return removed.val;
    }

    reverse(){
        let node = this.head;
        [[this.head],[this.tail]] = [[this.tail],[this.head]];
        let next;
        let prev = null;
        for(let i = 0; i < this.length; i++){
        // prev -> node -> next
        // node -> prev
          next = node.next;
          node.next = prev;
          prev = node;
          node = next;
        }
        return this;
      }

    print(){
        var arr = [];
        var current = this.head
        while(current){
            arr.push(current.val)
            current = current.next
        }
        console.log(arr);
    }

}

var list = new singlyLinkedList()
var list2 = new singlyLinkedList()

list.push(0);
list.push(1);
list.push(2);
list.push(3);
list.push(4);
// console.log(list);
// console.log(list.shift());
// console.log(list);
// console.log(list.unshift("2"));
// console.log(list.unshift("HI"));
// console.log(list.unshift("kkkkkk"));
// console.log(list2.pop());

console.log(list.print());
list.reverse();
// console.log(list.reverse);
console.log(list.print());
// console.log(list.get(0));
// console.log(list.get(1));
// console.log(list.get(2));
// console.log(list.get(3));
// console.log(list.get(4));