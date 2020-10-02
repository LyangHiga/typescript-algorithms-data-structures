"use strict";
class AVLNode {
    constructor(val) {
        this.val = val;
        this.parent = null;
        this.right = null;
        this.left = null;
        this.height = 1;
    }
}
module.exports = AVLNode;
