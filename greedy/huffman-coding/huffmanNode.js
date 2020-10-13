"use strict";
class HuffmanNode {
    constructor(key, f) {
        this.key = key;
        this.f = f;
        this.right = null;
        this.left = null;
        this.height = 0;
        this.min = 0;
    }
}
module.exports = HuffmanNode;
