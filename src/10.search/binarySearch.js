function binarySearch(arr,elem){
    let start = 0, end =  arr.length - 1;
    let middle =Math.floor((start+end)/2);
    while(arr[middle] !== elem && start<= end){
        if(elem > arr[middle]){
            start = middle + 1;
        } else {
            end = middle - 1;
        }
        middle = Math.floor((start+end)/2);
    }
    if(arr[middle] === elem) return middle;
    return -1;
}

console.log(binarySearch([1,3,4,6,7,8,9,12,13,14,17],8));