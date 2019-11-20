// returns the the macimum sum of n consecutives number of an array
// input: array, number n of consecutive numbers

function maxSubarraySum(arr,n){
    // check if exist n numbers in this array 
    if(arr.length < n ) return null;
    let maxSum = 0,tSum=0;
    for(let i=0;i<n;i++){
        // sum of the 1st n numbers
        tSum+=arr[i];
    }
    maxSum = tSum;
    // move window and check for the max
    for(let i=n;i<arr.length;i++){
        tSum = tSum - arr[i-n] + arr[i] ;
        maxSum = Math.max(tSum,maxSum);
    }
    return maxSum;

}

console.log(maxSubarraySum([1,2,5,2,8,1,5],2));  // 10
console.log(maxSubarraySum([1,2,5,2,8,1,5],4)); // 17
console.log(maxSubarraySum([4,2,1,6],1));  // 6
console.log(maxSubarraySum([4,2,1,6,2],4));  // 13
console.log(maxSubarraySum([],4));  // null