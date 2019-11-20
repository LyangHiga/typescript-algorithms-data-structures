// input: sorted array, integer number X
// output:any pair that its sum is equal to X
function sumX(arr,x){
    // use two pointers, one the begginning of arr and the other one to the end
    let left=0, right=arr.length-1;
    // we should move each one depending of the sum, until we conver all elements of the arr
    while(left<right){
        let sum = arr[left] + arr[right];
        // if x === sum return
        if(sum === x){
            return [arr[left], arr[right]];
        }
        // check if sum is greater than x, so move right back
        if(sum > x){
            right--;
        } else {
            // if sum is smaller than x, we should move left forward
            left++;
        }
    }
}

console.log(sumX([-3,-2,-1,0,1,2,3],0));  // [-3,3] 
console.log(sumX([-2,0,1,3],0))  // undefined
console.log(sumX([1,2,3],0));  // undefined