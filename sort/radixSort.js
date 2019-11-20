// Returns the digit in num at the given place value, only positve numbers
function getDigit(num,place){
    return Math.floor(Math.abs(num) / Math.pow(10,place)) % 10 ;
}

// Returns the number of digits in num
function digitCount(num){
    // log 0 
    if(num ===0 ) return 1;
    return Math.floor(Math.log10(num)) + 1;
}

// returns the number of digits in the largest number of the list nums
function mostDigits(nums){
    let max = 0;
    for(let i=0; i < nums.length ; i++){
        max = Math.max(max,nums[i]);
    }
    return max;
}


function radixSort(nums){
    let maxDigits = mostDigits(nums);
    // put each digit from each num in the right bucket
    for(let i=0;i< maxDigits; i++){
        // an array of 10 empty arrays, a bucket to each possible number
        let digitBuckets = Array.from({length: 10}, () => []);
        for(let j = 0; j<nums.length; j++){
            // take the digit of nums[j]
            let digit = getDigit(nums[j],i);
            // add this nums[j] in the bucket of the right digit
            digitBuckets[digit].push(nums[j]);
        }
        // to concate each element from each bucket, using spread
        nums = [].concat(...digitBuckets);
    }
    return nums;
}

console.log(radixSort([3,4,123,567,0,87,65,432]));