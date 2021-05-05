// input: two arrays
// output: boolean; true if each element of the 1st array has square corresponding i the 2nd
// e.g. [1,1,2,3] [4,1,9,1]: true
function same(arr1,arr2){
    // they must be the same size
    if(arr1.length !== arr2.length){
        return false;
    }
    // Create an obj to each arr, counting how many times each value apperas
    let obj1={};
    let obj2={}
    for(let i=0;i<arr1.length;i++){
        obj1[arr1[i]] = (obj1[arr1[i]] || 0) + 1;
        obj2[arr2[i]] = (obj2[arr2[i]] || 0) + 1;
    }
    // check if each elementof obj1 has the same number of squares corresponding elements in obj2
    for(let key in obj1){
        // check if this corresponding element exists in obj2
        if( !(key **2 in obj2)){
            return false;
        }
        // check they have the same number 
        if(obj1[key] !== obj2[key**2]){
            return false;
        }
    }
    return true;
}
console.log(same([1,1,2,3],[4,1,9,1]));

console.log(same([1,2,3], [4,1,9]));
console.log(same([1,2,3], [1,9]));
console.log(same([1,2,1], [4,4,1]));

 // true
 // false
 // false (must be same frequency)