"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const node_1 = __importDefault(require("./node"));
// simple implementation using SLL, shift and unshift, here called as push and pop
// First in Last Out
class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    // add a node at the beginning and return the size of this stack
    push(key) {
        let node = new node_1.default(key);
        if (this.size === 0) {
            this.first = node;
            this.last = node;
        }
        else {
            node.next = this.first;
            this.first = node;
        }
        this.size++;
        return this.size;
    }
    // remove the first node and return it
    pop() {
        // empty stack
        if (this.size === 0)
            return null;
        let removed = this.first;
        if (this.size === 1) {
            this.first = null;
            this.last = null;
        }
        else {
            this.first = removed.next;
            removed.next = null;
        }
        this.size--;
        return removed;
    }
}
module.exports = Stack;
