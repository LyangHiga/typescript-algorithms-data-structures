"use strict";
const sortAndCount = (arr) => {
    // base case : one element is already sort
    if (arr.length < 2) {
        return [arr, 0];
    }
    //if there are more than 1 element in this array we should divide it in half
    const middle = Math.floor(arr.length / 2);
    // slicing this array
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
    const [sortedLeft, counterLeft] = sortAndCount(left);
    const [sortedRight, counterRight] = sortAndCount(right);
    const [sortedArr, counterMerge] = merge(sortedLeft, sortedRight);
    return [sortedArr, counterLeft + counterRight + counterMerge];
};
// Merge the two arrays: left and right
const merge = (left, right) => {
    let arr = [], leftIndex = 0, rightIndex = 0, counter = 0;
    // we need to compare each element from left and right arrays and take the smallest one
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            arr.push(left[leftIndex]);
            // move to next element
            leftIndex++;
        }
        else {
            arr.push(right[rightIndex]);
            // move to the next element
            rightIndex++;
            // This element was smaller than (left.length - leftIndex) elements = number of inversion
            counter += left.length - leftIndex;
        }
    }
    // one of them still has elemenst, already sorted, so we just need concat it with the result array
    // But any of them results in inversions
    while (leftIndex < left.length) {
        arr.push(left[leftIndex]);
        leftIndex++;
    }
    while (rightIndex < right.length) {
        arr.push(right[rightIndex]);
        rightIndex++;
    }
    return [arr, counter];
};
module.exports = sortAndCount;
