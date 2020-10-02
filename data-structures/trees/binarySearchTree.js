"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const bSTNode_1 = __importDefault(require("./bSTNode"));
const queue_1 = __importDefault(require("../basics/queue"));
const stack_1 = __importDefault(require("../basics/stack"));
class BST {
    constructor() {
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // Returns true if this BST is empty
        // Otherwise returns false
        this.isEmpty = () => {
            return this.size === 0;
        };
        // Replaces one subtree as a child of its parent with another subtree
        //    replaces the subtree rooted at node u with
        //    the subtree rooted at node v
        //    make the parent of u change its pointer to v
        //    v takes u position and parent
        this.transplant = (u, v) => {
            // check if u is the root of this BST
            if (u.parent === null) {
                this.root = v;
            }
            // check if u is a left child
            else if (u === u.parent.left) {
                u.parent.left = v;
            }
            else {
                // right child
                u.parent.right = v;
            }
            // if v is null DON'T update
            if (v !== null)
                v.parent = u.parent;
        };
        //   **********************************************************
        //                            INSERT
        //   **********************************************************
        // Inserts a node in the right position and rearrange
        // Returns this BST
        // Returns false whether this val is already in this BST
        this.insert = (val) => {
            let node = new bSTNode_1.default(val);
            if (this.isEmpty()) {
                this.size++;
                this.root = node;
                return this;
            }
            let current = this.root;
            while (current !== null) {
                // duplicate val
                if (current.val === node.val)
                    return false;
                // check left
                if (current.val > node.val) {
                    if (!current.left) {
                        node.parent = current;
                        current.left = node;
                        this.size++;
                        return this;
                    }
                    // update current to left
                    current = current.left;
                    // check right
                }
                else {
                    if (!current.right) {
                        node.parent = current;
                        current.right = node;
                        this.size++;
                        return this;
                    }
                    // update current
                    current = current.right;
                }
            }
        };
        //   **********************************************************
        //                            SEARCH
        //   **********************************************************
        // Returns true if this BST contains this val,
        // Otherwise returns false
        this.contains = (val) => {
            if (this.isEmpty())
                return false;
            let current = this.root;
            while (current !== null) {
                // if we find return true
                if (current.val === val)
                    return true;
                // check left
                if (current.val > val) {
                    current = current.left;
                }
                else {
                    // check right
                    current = current.right;
                }
            }
            // if we didnt find return flase
            return false;
        };
        // Returns the min node from the subtree who has x as root
        this.min = (x = this.root) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            while (x.left !== null) {
                x = x.left;
            }
            return x;
        };
        // Returns the max node from the subtree who has x as root
        this.max = (x = this.root) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            while (x.right !== null) {
                x = x.right;
            }
            return x;
        };
        // Returns the successor node y (node who has the next val in crescent order)
        //    of a given node x
        this.sucessor = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // check if there is a right subtree
            if (x.right !== null) {
                // sucessor is the leftmost node in this subtree
                return this.min(x.right);
            }
            // go up until we find a node who is the left child
            // its parent is the sucessor
            let y = x.parent;
            // while x is the right child (its parent y is smaller than x) we update
            while (y !== null && x === y.right) {
                x = y;
                y = y.parent;
            }
            return y;
        };
        // Returns the predecessor node y (node who has the previous val in crescent order)
        //    of a given node x
        this.predecessor = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // check if there is a left subtree
            if (x.left !== null) {
                // predecessor is the rightmost node in this subtree
                return this.max(x.left);
            }
            // go up until we find a node who is the right child
            // its parent is the predecessor
            let y = x.parent;
            // while x is the left child (its parent y is greater than x) we update
            while (y !== null && x === y.left) {
                x = y;
                y = y.parent;
            }
            return y;
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Deletes node z from this BST
        // 4 cases:
        //    no child: just change the pointer of z's parent to null
        //    one child: child takes z place
        //    two children: sucessor of z takes it place
        this.delete = (z) => {
            // Returns false if z is not a valid node
            if (!(z instanceof bSTNode_1.default))
                return false;
            if (this.isEmpty())
                return false;
            // no left child
            if (z.left === null) {
                // if z is also null just update the pointer of z's parent (to null)
                this.transplant(z, z.right);
            }
            else if (z.right === null) {
                // z has left child but not a right child
                this.transplant(z, z.left);
            }
            else {
                // two childrens
                // sucessor is the node with smallest val in the right subtree
                const sucessor = this.min(z.right);
                if (!sucessor)
                    return false;
                if (z !== sucessor.parent) {
                    // If sucessor is not the right child of z
                    // Remember: sucessor has no left child
                    //      otherwise sucessor.left would be the sucessor
                    // change the sucessor place with sucessor child
                    //      (we will change sucessor with z in the next step)
                    this.transplant(sucessor, sucessor.right);
                    sucessor.right = z.right;
                    sucessor.right.parent = sucessor;
                }
                // OR the sucessor is the right child of z
                // OR the sucessor was prepared in the last if
                //    Anyway we just transplant and update pointers to left subtree
                this.transplant(z, sucessor);
                // uodate sucessor left (from null) to left subtree
                sucessor.left = z.left;
                // update left subtree parent (from z) to sucessor
                sucessor.left.parent = sucessor;
            }
            this.size--;
        };
        //   **********************************************************
        //                        TRANSVERSING
        //   **********************************************************
        this.bfs = () => {
            if (!this.root)
                return undefined;
            let q = new queue_1.default();
            let visited = [];
            let current;
            q.enQueue(this.root);
            while (q.size !== 0) {
                current = q.deQueue().key;
                visited.push(current.val);
                if (current.left)
                    q.enQueue(current.left);
                if (current.right)
                    q.enQueue(current.right);
            }
            return visited;
        };
        this.dfsPreOrder = () => {
            if (!this.root)
                return undefined;
            let stack = new stack_1.default();
            let visited = [];
            let current;
            stack.push(this.root);
            while (stack.size !== 0) {
                current = stack.pop().key;
                visited.push(current.val);
                if (current.right)
                    stack.push(current.right);
                if (current.left)
                    stack.push(current.left);
            }
            return visited;
        };
        this.root = null;
        this.size = 0;
    }
}
module.exports = BST;
