// seach for the min in each iteration
// swap min to right position
function selectionSort(arr){
    let min;
    for(let i =0; i<arr.length; i++){
        min = i;
        for(let j = i; j<arr.length ; j++ ){
            if(arr[min] > arr[j]){
                min = j;
            }
        }
        if(i !== min){
            [arr[i],arr[min]] = [arr[min],arr[i]];
        }
    }
    return arr;
}

console.log(selectionSort([4,3,2,1]));