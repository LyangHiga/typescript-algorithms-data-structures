"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeighted = void 0;
exports.isWeighted = (v) => {
    if (v.weight)
        return true;
    return false;
};
