const {performance} = require('perf_hooks');
function mergeShift(left,right){
    let result = [];
    // while booth arrays have elements we compare, the smallest of each one,  
    // take the smaller , push it to result and shift from the original arr
    while(left.length > 0 && right.length > 0){
        if(left[0]<right[0]){
            result.push(left[0]);
            left.shift();
        }else {
            result.push(right[0]);
            right.shift();
        }
    }
    // one of them still has elemenst, already sorted, so we just need concat it with the result array
    while(left.length > 0){
        result.push(left[0]);
        left.shift();
    }
    while( right.length > 0){
        result.push(right[0]);
        right.shift();
    }
    return result;
}

function mergeIdx(left,right){
    let result = [], leftIndex =0 ,rightIndex = 0;
    // while booth arrays have elements to compare, the smallest of each one,  
    // take the smaller , push it to result and move idx
    while(leftIndex < left.length && rightIndex < right.length){
        if(left[leftIndex]<right[rightIndex]){
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }
    // one of them still has elemenst, already sorted, so we just need concat it with the result array
    while(leftIndex < left.length){
        result.push(left[leftIndex]);
        leftIndex++
    }
    while(rightIndex < right.length){
        result.push(right[rightIndex]);
        rightIndex++;
    }
    // spread
    // result = [...result, ...left,...right];
    return result;
}

function mergeSort(arr){
    if(arr.length < 2){
        return arr;
    }
    const mid = Math.floor( arr.length/2);
    const left = arr.slice(0,mid);
    const right = arr.slice(mid);

    return mergeShift(mergeSort(left),mergeSort(right));
    // return mergeIdx(mergeSort(left),mergeSort(right));

}

let data = Array.apply(null,{length:120000}).map(Function.call,Math.random)

let t1 = performance.now();
mergeSort(data);
let t2 = performance.now();
console.log("time elapsed: "+  (t2-t1)/ 1000 +" seconds");

// console.log(mergeSort([64,543,21,-34,5,6,876,5,4,3,4,34,19]));