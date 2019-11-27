class Node {
    constructor(val){
        this.val = val;
        this.left = null;
        this.right = null;
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
}

let tree = new BST();
console.log(tree.insert(7));
console.log(tree.insert(3));
console.log(tree.insert(10));
console.log(tree.insert(10));
console.log(tree.insert(13));
console.log(tree.insert(1));
console.log(tree.insert(17));
console.log(tree.find(7));
console.log(tree.find(60));
console.log(tree.find(17));
console.log(tree.find(1));