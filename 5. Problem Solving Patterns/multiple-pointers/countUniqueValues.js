// count how many unique values exists in the input array
// input: sorted array
// output: number of unique values
function countUniqueValues(arr){
    // keep track of unique values
    let i=0;
    if(arr.length ===0){
        return 0;
    }
    for(let j=1;j<arr.length;j++){
        // check if is the 1st time that we see arr[j]
        if(arr[i] !== arr[j]){
            // move i
            i++;
            // console.log(arr[i], arr[j]);
            // update the last unique value
            arr[i] = arr[j];
        }
    }
    i++
    return i;
}

console.log(countUniqueValues([1,1,1,1,1,2]));  // 2
console.log(countUniqueValues([1,2,3,4,4,4,7,7,12,12,13]));  // 7
console.log(countUniqueValues([]));  // 0
console.log(countUniqueValues([-2,-1,-1,0,1]));  // 4